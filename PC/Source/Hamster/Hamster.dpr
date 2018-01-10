program Hamster;

uses
  Vcl.Forms,
  Winapi.Windows,
  DcefB.Core.App,
  SysUtils,
  CnCommon,
  ShlObj,
  untTopMain in 'untTopMain.pas' {topMain},
  pubCon in 'Public\pubCon.pas',
  Common in 'Public\Common.pas',
  mapshare in 'Public\mapshare.pas',
  CometSkin in 'Components\CometSkin.pas',
  untMMLogin in 'untMMLogin.pas' {frmMMLogin},
  superobject in 'Public\superobject.pas',
  jsapp in 'Public\jsapp.pas';

{$R *.res}

begin
  LoadHookFlash;
  if ParamCount > 3 then
  begin
    if not DcefBApp.Init then  Exit;
  end
  else
  begin
//    writeDword(0, ExtractFileName(ParamStr(0)), 'SOFTWARE\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION', HKEY_CURRENT_USER);
    if not CheckForPrevInstance then  Exit;

    DcefBApp.CefSingleProcess := False;
    DcefBApp.CefUserAgent := 'Mozilla/5.0 (Windows; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Hamster/' + GetFileVersionStr(ParamStr(0));
    DcefBApp.CefCache := GetSpecialFolderLocation(CSIDL_COMMON_APPDATA) + '\Hamster\Cache';
    DcefBApp.CefLocale := 'zh-CN';
    if not DcefBApp.Init then  Exit;

    Application.Initialize;
    Application.MainFormOnTaskbar := True;
    Application.Title := '积米淘客助手';
    Application.CreateForm(TtopMain, topMain);
    Application.CreateForm(TfrmMMLogin, frmMMLogin);
    Application.Run;
    ClearUpCheckForPrevInstance;
  end;

end.


