unit untMMLogin;

interface

uses
  Winapi.Windows,
  Winapi.Messages,
  System.SysUtils,
  System.Variants,
  System.Classes,
  System.DateUtils,
  Vcl.Graphics,
  Vcl.Controls,
  Vcl.Forms,
  Vcl.Dialogs,
  Vcl.ExtCtrls,
  Vcl.OleCtrls,
  Vcl.StdCtrls ,
  DcefB.Core.App,
  DcefB.Core.DcefBrowser,
  DcefB.Cef3.Interfaces,
  DcefB.Cef3.Types,
  DcefB.Events,
  DcefB.Cef3.Classes,
  CnCommon,
  mapshare,
  pubCon,
  Common,
  CometSkin;

type
  TfrmMMLogin = class(TSkinForm)
    dcefLogin: TDcefBrowser;
    Button1: TButton;
    procedure FormCreate(Sender: TObject);
    procedure dcefLoginBeforeContextMenu(const browser: ICefBrowser; const frame: ICefFrame; const params: ICefContextMenuParams; const model: ICefMenuModel);
    procedure FormResize(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure dcefLoginBeforePopup(const browser: ICefBrowser; const frame: ICefFrame; const targetUrl, targetFrameName: ustring; targetDisposition: TCefWindowOpenDisposition; userGesture: Boolean; var popupFeatures: TCefPopupFeatures; var windowInfo: TCefWindowInfo; var client: ICefClient; var settings: TCefBrowserSettings; var noJavascriptAccess, Cancel, CancelDefaultEvent: Boolean);
    procedure dcefLoginLoadEnd(const browser: ICefBrowser; const frame: ICefFrame; httpStatusCode: Integer);
    procedure Button1Click(Sender: TObject);
  private
  public
  end;

var
  frmMMLogin: TfrmMMLogin;
  cookie, token: string;  // 全局COOKIE

implementation
{$IFDEF DEBUG}

uses
  CnDebug;
{$ENDIF}
{$R *.dfm}

function vis(const name, value, domain, path: ustring; secure, httponly, hasExpires: Boolean; const creation, lastAccess, expires: TDateTime; count, total: Integer; out deleteCookie: Boolean): Boolean;
begin
  cookie := cookie + '; ' + name + '=' + value;
  if LowerCase(name) = '_tb_token_' then
    token := value;

  if count = total - 1 then
  begin
    {$IFDEF DEBUG}
    CnDebugger.LogMsgWithTag(cookie, 'vis- 111');
    {$ENDIF}
    Delete(cookie, 1, 2); // 去掉“;”
    // 将cookie喝token写入注册表
    writeReg('cookie', cookie,regSoftPath,HKEY_CURRENT_USER);
    writeReg('token', token,regSoftPath,HKEY_CURRENT_USER);
    frmMMLogin.ModalResult := mrOk;
  end;

  if count < total then
    Result := True;
end;

procedure TfrmMMLogin.Button1Click(Sender: TObject);
begin
  dcefLogin.ShowDevTools(dcefLogin.ActiveBrowser);
end;

procedure TfrmMMLogin.dcefLoginBeforeContextMenu(const browser: ICefBrowser; const frame: ICefFrame; const params: ICefContextMenuParams; const model: ICefMenuModel);
begin
  // 去掉页面右键菜单
  model.clear;
end;

procedure TfrmMMLogin.dcefLoginBeforePopup(const browser: ICefBrowser; const frame: ICefFrame; const targetUrl, targetFrameName: ustring; targetDisposition: TCefWindowOpenDisposition; userGesture: Boolean; var popupFeatures: TCefPopupFeatures; var windowInfo: TCefWindowInfo; var client: ICefClient; var settings: TCefBrowserSettings; var noJavascriptAccess, Cancel, CancelDefaultEvent: Boolean);
begin
  // 弹出窗口模式
  CancelDefaultEvent := True;
end;

procedure TfrmMMLogin.dcefLoginLoadEnd(const browser: ICefBrowser; const frame: ICefFrame; httpStatusCode: Integer);
var
  CookieManager: ICefCookieManager;
begin
  // 判断页面登录是否完成
  {$IFDEF DEBUG}
  CnDebugger.LogMsgWithTag(frame.url, 'LEnd0');
  {$ENDIF}
  if (not InStr('login.taobao.com', browser.MainFrame.url)) and (not InStr('about:blank', browser.MainFrame.url)) then
  begin
    cookie := '';
    token := '';
    CookieManager := TCefCookieManagerRef.Global(nil);
    CookieManager.VisitUrlCookiesProc('http://www.alimama.com/', True, vis);
  end;
end;

procedure TfrmMMLogin.FormCreate(Sender: TObject);
begin
  // 载入登陆页面
  //SetBkColor(0);
  {$IFDEF DEBUG}
  Button1.Visible := True;
  dcefLogin.DcefBOptions.DevToolsEnable := True;
  {$ENDIF}
  SetBkImage(AppPath + 'skin\bk.png', 1000, 45, 10, 45);
  dcefLogin.AddPage();
end;

procedure TfrmMMLogin.FormResize(Sender: TObject);
begin
  // 窗口尺寸修改-》刷新控件相对位置
  with dcefLogin do
  begin
    Left := 1;
    Top := 41;
    Width := frmMMLogin.ClientWidth - 2;
    Height := frmMMLogin.ClientHeight - 42;
  end;
end;

procedure TfrmMMLogin.FormShow(Sender: TObject);
begin
  // 显示窗口时刷新页面
  dcefLogin.Load(D_TK_LOGIN);
end;

end.

