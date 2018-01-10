object frmGet: TfrmGet
  Left = 0
  Top = 0
  Caption = 'frmGet'
  ClientHeight = 303
  ClientWidth = 362
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 13
  object cefGet: TDcefBrowser
    Left = 8
    Top = 8
    Width = 346
    Height = 287
    TabOrder = 0
    DefaultURL = 'about:blank'
    DcefBOptions.DevToolsEnable = False
    DcefBOptions.CloseWPagesClosed = False
    DcefBOptions.DownLoadPath = 'C:\Program Files (x86)\Embarcadero\RAD Studio\9.0\bin\Download\'
    OnLoadEnd = cefGetLoadEnd
  end
end
