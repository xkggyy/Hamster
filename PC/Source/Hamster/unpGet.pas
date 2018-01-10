unit unpGet;

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
  Vcl.Dialogs,
  untTopMain,
  DcefB.Core.DcefBrowser,
  DcefB.Cef3.Interfaces,
  DcefB.Cef3.Types,
  DcefB.Events,
  DcefB.Cef3.Classes;

type
  TfrmGet = class(TForm)
    cefGet: TDcefBrowser;
    procedure FormCreate(Sender: TObject);
    procedure cefGetLoadEnd(const browser: ICefBrowser; const frame: ICefFrame; httpStatusCode: Integer);
  private
    { Private declarations }
  public
    function urlGet(url:string): string;
  end;

var
  frmGet: TfrmGet;

implementation

{$R *.dfm}


function TfrmGet.urlGet(url: string):string;
begin
  cefGet.Load(url);
end;

procedure TfrmGet.cefGetLoadEnd(const browser: ICefBrowser; const frame: ICefFrame; httpStatusCode: Integer);
begin
  browser.FocusedFrame.GetTextProc(callbackGet);
end;

procedure TfrmGet.FormCreate(Sender: TObject);
begin
  cefGet.AddPage();
end;

end.

