#Define Plugin_UnInst true
#Define Plugin_UnInst_Dir "Unins"
#include "AllMove.Ish"
#include "botva2.ish"
#include "ProgressBar.ish"
#include "Botva2_Visual.Ish"
#include "istask.ish"

#define APPID "{C2216201-4D92-4462-A884-BE113AAB8AAA}"
#define WPAppName "积米淘客助手"
#define WPpubVer "2.0.1.21"
#define WPCSetup "1"
#define WPCuninstall "0"
#define WPCID "3"
#define WPREG "Hamster"
#define WPDIR "Hamster"
#define UCPDIR "Hamster"

[Setup]
AppId={{#APPID}
AppName={#WPAppName}
AppVersion={#WPpubVer}
AppPublisher=几米科技
DefaultDirName={pf}\{#WPDIR}
DefaultGroupName={#WPAppName}
OutputDir=..\Output
OutputBaseFilename={#WPDIR}-{#WPpubVer}
VersionInfoVersion={#WPpubVer}
VersionInfoDescription={#WPAppName}
DisableWelcomePage=True
DisableReadyPage=True
DisableReadyMemo=True
DisableFinishedPage=True
PrivilegesRequired=none
ShowLanguageDialog=no
SignTool=sign2
SetupIconFile=setup.ico
UninstallDisplayIcon={app}\Hamster.exe
;SolidCompression=True
Compression=lzma/ultra
InternalCompressLevel=ultra
VersionInfoCompany=www.j1m1.com
VersionInfoCopyright=Copyright 2017 wuhan jimi Technology Co.,Ltd.

[Files]
Source: ..\..\bin\Hamster.exe; DestDir: {app}
Source: ..\..\bin\cnt.dll; DestDir: {app}
Source: ..\..\bin\cef.pak; DestDir: {app}
Source: ..\..\bin\cef_100_percent.pak; DestDir: {app}
Source: ..\..\bin\icudtl.dat; DestDir: {app}
Source: ..\..\bin\libcef.dll; DestDir: {app}
Source: ..\..\bin\natives_blob.bin; DestDir: {app}
Source: ..\..\bin\launcher.exe; DestDir: {app}
Source: ..\..\bin\EasyHook32.dll; DestDir: {app}
Source: ..\..\bin\HookFlash.dll; DestDir: {app}
Source: ..\..\bin\skin\*; DestDir: {app}\skin;Flags: recursesubdirs
Source: ..\..\bin\locales\*; DestDir: {app}\locales;Flags: recursesubdirsSource: ..\..\bin\PepperFlash\*; DestDir: {app}\PepperFlash;Flags: recursesubdirs
Source: skin\*;DestDir: {app}; Flags: dontcopy
Source: ..\..\bin\DandelionSetup.exe; DestDir: {app} ; Flags: dontcopy

[Icons]
Name: {group}\{#WPAppName}; Filename: "{app}\launcher.exe"; WorkingDir: "{app}"; IconIndex: 0
Name: {group}\{cm:UninstallProgram,{#WPAppName}}; Filename: {uninstallexe}
Name: {userdesktop}\{#WPAppName}; Filename: "{app}\launcher.exe"; Parameters: ""; WorkingDir: "{app}"; IconIndex: 0


[Run]
Filename: "{app}\launcher.exe"; Parameters: ""; WorkingDir: "{app}"; Flags: nowait runascurrentuser postinstall; Description: "{cm:LaunchProgram,{#WPAppName}}"

[UninstallDelete]
Type: filesandordirs; Name: "{commonappdata}\{#WPDIR}"

[CustomMessages]
Tasks=Hamster.exe%nlauncher.exe


[Code]
function SendCountSetup(t:Integer):Integer; external 'cin@files:cnt.dll stdcall setuponly';
function SendCountUninstall(t:Integer):Integer; external 'cin@{app}\cnt.dll stdcall uninstallonly';
type
  TPBProc = function(h: hWnd; Msg, wParam, lParam: Longint): Longint;

var
  NewPB          : TImgPB;
  PBOldProc      : Longint;

  BkgImg         : array of Longint;
  BtnClose,BtnInstall,BtnDir: TNewButton;
  hBtnInstall    : hwnd;
  ckDir,ckLin    : TCheckBox;
  ckPGY          : TCheckBox;
  hckDir,hckLin,hckPGY: hwnd;
  lblLin,lblpb   : TLabel;

  rcs            : string;

function SetWindowLong(hWnd: HWND; nIndex: Integer; dwNewLong: Longint): Longint; external 'SetWindowLong{#A}@user32.dll stdcall';
function CallBackProc(P: TPBProc; ParamCount: integer): LongWord; {# CallbackCtrl_External };
function CallWindowProc(lpPrevWndFunc: Longint; hWnd: HWND; Msg: UINT; wParam, lParam: Longint): Longint; external 'CallWindowProc{#A}@user32.dll stdcall';

// 字符串转成版本号，如 '1.2.0.0' --> $01020000，如果格式不正确，返回 $01000000
function StrToVersion(s: string): DWORD;
var
  Strs: TStrings;
  ss: string;
begin
  try
    Strs := TStringList.Create;
    try
      ss := s;
      StringChange(ss, '.', #13#10);
      Strs.Text := ss;
      if Strs.Count = 4 then
        Result := StrToInt(Strs[0]) * $1000000 + StrToInt(Strs[1]) * $10000 + StrToInt(Strs[2]) * $100 + StrToInt(Strs[3])
      else
        Result := $01000000;
    finally
      Strs.Free;
    end;
  except
    Result := $01000000;
  end;
end;

function rch(Param: string): string;
begin
  Result := rcs;
end;

// 在实际安装前先卸载老版本
procedure jmUninstallOld;
var
  ResultStr: string;
  ResultCode: Integer;
begin

  if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{#APPID}_is1', 'UninstallString', ResultStr) then
  begin
    ResultStr := RemoveQuotes(ResultStr);
    if ResultStr = '' then
      if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\{#APPID}_is1', 'UninstallString', ResultStr) then
        ResultStr := RemoveQuotes(ResultStr);
    Exec(ResultStr, '/VERYSILENT', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  end;
end;

// 在实际安装之后根据安装包的命名规则将渠道ID写入注册表
procedure setAppId;
var
  filename, nextstring, appID: string;
  extInt: integer;
  cid: string;
begin
  // 获取注册表里面储存的渠道ID
  if RegQueryStringValue(HKEY_CURRENT_USER, 'Software\{#WPREG}', 'cid', cid) then
    cid := RemoveQuotes(cid);
  if cid = '' then
    cid := '{#WPCID}';

  appID := cid;
  filename := ExtractFileName(paramstr(0));
  filename := copy(filename, 1, length(filename) - 4);
  extInt := pos('_', filename);
  if extInt <> 0 then
  begin
    nextstring := copy(filename, extInt + 1, length(filename) - extInt);
    extInt := pos('_', nextstring);
    if extInt <> 0 then
    begin
      appID := copy(nextstring, extInt + 1, length(nextstring) - extInt);
      if strtointdef(appID, 0) = 0 then
        appID := cid;
    end
    else
      appID := cid;
  end
  else
    appID := cid;

  if appID <> cid then
    rcs := ''
  else
    rcs := '';
  RegWriteStringValue(HKEY_CURRENT_USER, 'Software\{#WPREG}', 'cid', appID);
end;

// 关闭几米看图相关住程序
procedure closeApp;
begin
  if PDir('{#IsTask_DLL}') <> '' then
    if RunTasks(CustomMessage('Tasks'), False, False) then
      KillTasks(CustomMessage('Tasks'));
end;

// --- 界面开始 ---
procedure OnCloseClick(Sender: TObject);
begin
// 关闭程序事件
  WizardForm.close;
end;

procedure OnInstallClick(Sender: TObject);
var
  i:integer;
begin
  WizardForm.NextButton.OnClick(sender);
end;

procedure lblLinClick(Sender: TObject);
var
  ErrorCode: Integer;
begin
// 许可协议标签点击事件
  ShellExec('open', 'http://www.j1m1.com/license.html', '', '', SW_SHOWNORMAL, ewNoWait, ErrorCode);
end;

procedure ckDirClick(Sender: TObject);
begin
// 路径选择按钮事件
  if not ckDir.Checked then
  begin
    ImgSetVisibility(BkgImg[1], false);
    ImgSetVisibility(BkgImg[0], True);
    WizardForm.ClientHeight := 400;
  end
  else
  begin
    ImgSetVisibility(BkgImg[0], false);
    ImgSetVisibility(BkgImg[1], True);
    WizardForm.ClientHeight := 500;
  end;
  ImgApplyChanges(WizardForm.Handle);
end;

procedure cklinClick(Sender: TObject);
begin
// 软件许可协议同意与否按钮事件
// 如果不同意安装按钮不可用
  BtnSetEnabled(hBtnInstall, ckLin.Checked);
  BtnRefresh(hBtnInstall);
  ImgApplyChanges(WizardForm.Handle);
end;

procedure OnDirClick(Sender: TObject);
begin
  // 选择目录
  WizardForm.DirBrowseButton.OnClick(Sender);
end;

function PBProc(h: hWnd; Msg, wParam, lParam: Longint): Longint;
var
  pr, i1, i2: Extended;
begin
// 进度条回调时间
// 在界面上显示自定义进度条
  Result := CallWindowProc(PBOldProc, h, Msg, wParam, lParam);
  if (Msg = $402) and (WizardForm.ProgressGauge.Position > WizardForm.ProgressGauge.Min) then
  begin
    with WizardForm.ProgressGauge do
    begin
      i1 := Position - Min;
      i2 := Max - Min;
      pr := i1 * 100 / i2;
      ImgPBSetPosition(NewPB, pr);
      ImgApplyChanges(WizardForm.Handle);
    end;
  end;
end;

procedure AllCancel;
begin
  SetWindowLong(WizardForm.ProgressGauge.Handle, -4, PBOldProc);
  ImgPBDelete(NewPB);
  ImgApplyChanges(WizardForm.Handle);
end;

// --- 安装器事件开始 --
function InitializeSetup: boolean;
begin
// 初始化安装脚本
  {# AutoPDirs }
  Result := True;
end;

procedure InitializeWizard;
var
  h: HWND;
begin
// 初始化安装向导
// 从新布局安装界面
  with WizardForm do
  begin
    Position := poScreenCenter;
    BorderStyle := bsNone;
    InnerNotebook.Hide;
    OuterNotebook.Hide;
    Bevel.Hide;
    //DirBrowseButton.Parent := WizardForm;
    DirEdit.Parent := WizardForm;
    DirEdit.BorderStyle := bsNone;

    ClientWidth := 619;
    ClientHeight := 500;
    NextButton.width := 0;
    CancelButton.width := 0;
    BackButton.width := 0;
    DirBrowseButton.width := 0;
  end;

  BtnInstall := TNewButton.Create(WizardForm);
  with BtnInstall do
  begin
    Name := 'BtnInstall';
    Parent := WizardForm;
    Left := 203;
    Top := 300;
    Width := 212;
    Height := 62;
    Caption := '';
    OnClick := @OnInstallClick;
  end;

  BtnClose := TNewButton.Create(WizardForm);
  with BtnClose do
  begin
    Name := 'BtnClose';
    Parent := WizardForm;
    Left := 592;
    Top := 0;
    Width := 26;
    Height := 26;
    Caption := '';
    OnClick := @OnCloseClick;
  end;

  BtnDir := TNewButton.Create(WizardForm);
  with BtnDir do
  begin
    Name := 'BtnDir';
    Parent := WizardForm;
    Left := 505;
    Top := 430;
    Width := 64;
    Height := 24;
    Font.Color := clBlack;
    Caption := '选择';
    OnClick := @OnDirClick;
  end;

  ckDir := TCheckBox.Create(WizardForm);
  with ckDir do
  begin
    Name := 'ckDir';
    Parent := WizardForm;
    Left := (WizardForm.ClientWidth - 100);
    Top := 370;
    Width := 90;
    Height := 17;
    Checked := false;
    Font.Name := '宋体';
    Font.Size := 10;
    Caption := '自定义选项';
    OnClick := @ckDirClick;
  end;

  ckLin := TCheckBox.Create(WizardForm);
  with ckLin do
  begin
    Name := 'ckLin';
    Parent := WizardForm;
    Left := 10;
    Top := 370;
    Width := 90;
    Height := 17;
    Checked := true;
    Font.Name := '宋体';
    Font.Size := 10;
    Caption := '阅读并同意';
    OnClick := @cklinClick;
  end;

  lblLin := TLabel.Create(WizardForm);
  with lblLin do
  begin
    Name := 'lblLin';
    Parent := WizardForm;
    Left := 102;
    Top := 372;
    Font.Name := '宋体';
    Font.Size := 10;
    Font.Color := clBlue;
    Caption := '软件许可协议';
    AutoSize := True;
    Transparent := True;
    Cursor := crHandPoint;
    OnClick := @lblLinClick;
  end;

  ckPGY := TCheckBox.Create(WizardForm);
  with ckPGY do
  begin
    Name := 'ckPGY';
    Parent := WizardForm;
    Left := 200;
    Top := 370;
    Width := 90;
    Height := 17;
    Checked := true;
    Font.Name := '宋体';
    Font.Size := 10;
    Caption := '安装淘宝桌面图标';
  end;

  lblpb := TLabel.Create(WizardForm);
  with lblpb do
  begin
    Name := 'lblpb';
    Parent := WizardForm;
    Left := 5;
    Top := 348;
    Font.Name := '宋体';
    Font.Size := 10;
    Caption := '';
    AutoSize := True;
    Transparent := True;
    Visible := false;
  end;

  ExtractTemporaryFile('bkg1.png');
  ExtractTemporaryFile('Dir_bkg.png');
  ExtractTemporaryFile('btn_Inst2.png');
  ExtractTemporaryFile('Btn_Close.png');
  ExtractTemporaryFile('pbbkg.png');
  ExtractTemporaryFile('pb.png');
  ExtractTemporaryFile('Edit.png');
  ExtractTemporaryFile('Dlg_Btn.png');
  ExtractTemporaryFile('Chk_Custom.png');
  ExtractTemporaryFile('CheckBox.png');

  h := WizardForm.Handle;
  SetArrayLength(BkgImg, 2);
  BkgImg[0] := ImgLoad(h, PDir('bkg1.png'), 0, 0, WizardForm.ClientWidth, 400, True, True);
  BkgImg[1] := ImgLoad(h, PDir('Dir_bkg.png'), 0, 0, WizardForm.ClientWidth, 500, True, True);
  ImgSetVisibility(BkgImg[1], False);

  ImgLoad(h, PDir('Edit.png'), 50, 430, 450, 24, True, True);
  WizardForm.DirEdit.Left := 55;
  WizardForm.DirEdit.Top := 432;
  WizardForm.DirEdit.Width := 440;

  TransBtnImg(BtnClose, PDir('Btn_Close.png'), 0, @ImgBtnClick);
  hBtnInstall := TransBtnImg(BtnInstall, PDir('btn_Inst2.png'), 0, @ImgBtnClick);
  TransBtnImg(BtnDir, PDir('Dlg_Btn.png'), 0, @ImgBtnClick);

  //WizardForm.DirBrowseButton.Left := 505;
  //WizardForm.DirBrowseButton.Top := 430;
  //WizardForm.DirBrowseButton.Width := 64;
  //WizardForm.DirBrowseButton.Height := 24;
  //h := TransBtnImg(WizardForm.DirBrowseButton, PDir('Dlg_Btn.png'), 0, @ImgBtnClick);
  //BtnSetFontColor(h, $585858, $585858, $585858, $585858);

  hckDir := TransChkImg(ckDir, PDir('Chk_Custom.png'), 17, 17, 5, @ImgBtnClick);
  hckLin := TransChkImg(ckLin, PDir('CheckBox.png'), 17, 17, 5, @ImgBtnClick);
  hckPGY := TransChkImg(ckPGY, PDir('CheckBox.png'), 17, 17, 5, @ImgBtnClick);

  WizardForm.ClientHeight := 400;
  AllMouseMove();
  ImgApplyChanges(WizardForm.Handle);

  // 窗体布局完毕
end;

procedure DeinitializeSetup();
begin
  gdipShutdown;
end;

procedure CurPageChanged(CurPageID: Integer);
begin
  // 确保一键安装
  if (CurPageID < 10) then
    WizardForm.NextButton.OnClick(WizardForm);
end;

function ShouldSkipPage(PageID: Integer): Boolean;
begin
  result := true;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  i: integer;
  ResultCode: Integer;
  ResultStr: string;
begin
  case CurStep of
    ssInstall:
      begin
        if ckDir.Checked then
          ckDir.Checked := false;
        for i := 0 to WizardForm.ControlCount - 1 do
        begin
          if WizardForm.Controls[i].Name = 'Lbl_ckDir' then
            WizardForm.Controls[i].Visible := false;
          if WizardForm.Controls[i].Name = 'Lbl_ckLin' then
            WizardForm.Controls[i].Visible := false;
          if WizardForm.Controls[i].Name = 'Lbl_ckPGY' then
            WizardForm.Controls[i].Visible := false;
        end;
        lblLin.Visible := false;
        BtnSetVisibility(hckDir, False);
        BtnSetVisibility(hckLin, False);
        BtnSetVisibility(hckPGY, False);
        BtnSetVisibility(hBtnInstall, False);

        NewPB := ImgPBCreate(WizardForm.Handle, PDir('pbbkg.png'), PDir('pb.png'), 5, 330, 609, 14);
        lblpb.Caption := '正在安装....';
        lblpb.Visible := true;
        ImgApplyChanges(WizardForm.Handle);

        PBOldProc := SetWindowLong(WizardForm.ProgressGauge.Handle, -4, CallBackProc(@PBProc, 4));
        
        // 关闭相关程序
        closeApp;
        // 删除老版本
        jmUninstallOld;
        sleep(2000);
        setAppId;
      end;
    ssPostInstall:
      begin
        AllCancel;
        if ckPGY.checked then
        begin
          // 在实际安装之后运行阿里妈妈蒲公英
          ExtractTemporaryFile('DandelionSetup.exe');
          Exec(ExpandConstant(PDir('DandelionSetup.exe')), '/S', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

          if RegQueryStringValue(HKEY_CURRENT_USER, 'SOFTWARE\Dandelion', '', ResultStr) then
          begin
            ResultStr := RemoveQuotes(ResultStr);
            Exec(ResultStr + '\Dandelion.exe', '--pid=1200000070 --self-service', '', SW_HIDE, ewNoWait, ResultCode);
          end;
        end;
        // 在实际安装之后想服务器发送统计
        ResultCode := SendCountSetup(1);
        sleep(2000);
        
      end;
    ssDone:
      begin
      // 安装完毕
      end;
  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  ResultCode: Integer;
begin
  if CurUninstallStep = usUninstall then
  begin
    closeApp;
    // 判断是否是静默卸载，如果是静默卸载则不发送统计，避免程序升级使用静默卸载后发送统计信息
    if paramstr(paramcount) <> '/VERYSILENT' then
    begin
      try
        ResultCode := SendCountUninstall(4);
      finally
        UnloadDLL(ExpandConstant('{app}\cnt.dll'));
        sleep(2000);
      end;
    end;
  end;
end;

procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
  if CurPageID = wpInstalling then
  begin
    Confirm := False;
    Cancel := ExitSetupMsgBox;
    if Cancel then
      AllCancel;
  end;
end;

function InitializeUninstall(): Boolean;
begin
  Result := true; //安装程序继续
end;