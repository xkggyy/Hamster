unit cMain;

interface

uses
//Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms, Dialogs, pubCon, DcefB.Events, DcefB.Core.DcefBrowser, DcefB.Cef3.Interfaces, DcefB.Cef3.Types, CometSkin;
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms, Dialogs, ComCtrls, Menus, StdCtrls, ExtCtrls, ActnList, DcefB.Events, DcefB.Core.DcefBrowser, DcefB.Cef3.Interfaces, DcefB.Cef3.Types, pubCon, CometSkin;

type
  TfrmMain = class(TSkinForm)
    cefMain: TDcefBrowser;
    procedure FormCreate(Sender: TObject);
    procedure FormResize(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  frmMain: TfrmMain;

implementation

{$R *.dfm}

procedure TfrmMain.FormCreate(Sender: TObject);
begin
  SetBkImage('BK_PNG', 'skin', 150, 80, 180, 80);
  AddButton(IDM_BUTTON_6, '6_png', 'skin', 770, 44, 36, 36, SkinControlType(SCT_NULL_H));

  cefMain.ChromiumOptions.JavascriptOpenWindows := STATE_DISABLED;
  cefMain.DcefBOptions.AutoDown := False;
  cefMain.AddPage(dMainUrl);
end;

procedure TfrmMain.FormResize(Sender: TObject);
begin
  // 窗口尺寸修改-》刷新控件相对位置
  // 修改Tabs的位置

  with cefMain do
  begin
    if WindowState = wsNormal then
    begin
      Left := 1;
      Top := 41;
      Width := Self.ClientWidth - 2;
      Height := Self.ClientHeight - 44;
    end;
    if WindowState = wsMaximized then
    begin
      Left := 8;
      Top := 41;
      Width := Self.ClientWidth - 16;
      Height := Self.ClientHeight - 51;
    end;
  end;
end;

end.


