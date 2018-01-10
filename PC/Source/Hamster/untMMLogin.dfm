object frmMMLogin: TfrmMMLogin
  Left = 0
  Top = 0
  BorderIcons = [biSystemMenu]
  BorderStyle = bsSingle
  Caption = #28120#23453#24080#21495#30331#38470
  ClientHeight = 452
  ClientWidth = 491
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poMainFormCenter
  OnCreate = FormCreate
  OnResize = FormResize
  OnShow = FormShow
  PixelsPerInch = 96
  TextHeight = 13
  object dcefLogin: TDcefBrowser
    Left = 64
    Top = 48
    Width = 273
    Height = 226
    TabOrder = 0
    DefaultURL = 'about:blank'
    DcefBOptions.DevToolsEnable = False
    DcefBOptions.CloseWPagesClosed = False
    DcefBOptions.DownLoadPath = 'D:\Program Files (x86)\Embarcadero\RAD Studio\9.0\bin\Download\'
    OnLoadEnd = dcefLoginLoadEnd
    OnBeforeContextMenu = dcefLoginBeforeContextMenu
    OnBeforePopup = dcefLoginBeforePopup
  end
  object Button1: TButton
    Left = 8
    Top = 8
    Width = 25
    Height = 25
    Caption = 'T'
    TabOrder = 1
    Visible = False
    OnClick = Button1Click
  end
end
