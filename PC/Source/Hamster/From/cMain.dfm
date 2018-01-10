object frmMain: TfrmMain
  Left = 0
  Top = 0
  Caption = #20960#31859#30475#30475
  ClientHeight = 334
  ClientWidth = 443
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  OnCreate = FormCreate
  OnResize = FormResize
  PixelsPerInch = 96
  TextHeight = 13
  object cefMain: TDcefBrowser
    Left = 32
    Top = 72
    Width = 377
    Height = 233
    TabOrder = 0
    DefaultURL = 'about:blank'
    DcefBOptions.DevToolsEnable = False
    DcefBOptions.CloseWPagesClosed = False
    DcefBOptions.DownLoadPath = 'C:\Program Files (x86)\Embarcadero\RAD Studio\9.0\bin\Download\'
  end
end
