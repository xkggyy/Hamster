unit unt_l;

interface

uses
  Winapi.Windows,
  Winapi.Messages,
  System.SysUtils,
  System.Variants,
  System.Classes,
  Vcl.Graphics,
  Vcl.Controls,
  Vcl.Forms,
  CnCommon,
  ShlObj,
  mapshare,
  Vcl.Dialogs,
  Vcl.ExtCtrls;

type
  TfrmLauncher = class(TForm)
    Timer1: TTimer;
    procedure Timer1Timer(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    procedure onhExit(var MSG: TMessage); message WM_USER + 4300;
    procedure onIni(var MSG: TMessage); message WM_USER + 4301;
  public
    { Public declarations }
  end;

var
  frmLauncher: TfrmLauncher;
  hIsClose: Boolean = False;

implementation

{$R *.dfm}
procedure TfrmLauncher.onIni(var MSG: TMessage);
begin
  hIsClose := False;
  // 拉起主程序并等待结束
  if WinExecAndWait32(AppPath + 'Hamster.exe') > -1 then
  begin
    Timer1.Interval := 1000 * 3;
    Timer1.Enabled := True;
  end;
end;

procedure TfrmLauncher.FormCreate(Sender: TObject);
begin
  pShMem^.LHWND := Handle;
  PostMessage(Handle, WM_USER + 4301, 0, 0);
end;

procedure TfrmLauncher.onhExit(var MSG: TMessage);
begin
  // 接收到来自主程序的正常关闭消息
  hIsClose := True;
end;

procedure TfrmLauncher.Timer1Timer(Sender: TObject);
begin
  if hIsClose then
  begin
    // 正常退出
    Close;
  end
  else
  begin
    Timer1.Enabled := False;
    // 非正常退出
    if MessageBox(Handle, '程序出现意外崩溃！！' + #13#10#13#10 + '是否需要修复问题后重新启动“积米淘客助手”？', '积米淘客助手', MB_YESNO + MB_ICONINFORMATION) = IDYES then
    begin
      // 将缓存删除到回收站成功后发送拉起主程序的消息
      if DeleteToRecycleBin(GetSpecialFolderLocation(CSIDL_COMMON_APPDATA) + '\Hamster\Cache') then
        PostMessage(Handle, WM_USER + 4301, 0, 0);
    end
    else
      Close;

  end;
end;

end.

