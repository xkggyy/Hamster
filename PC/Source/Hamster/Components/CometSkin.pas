unit CometSkin;

interface

uses
  Windows,
  Messages,
  SysUtils,
  Variants,
  Classes,
  Graphics,
  Controls,
  Forms,
  Dialogs,
  ShellApi,
  AxCtrls,
  ActiveX,
  GDIPAPI,
  GDIPOBJ,
  JwaDwmapi,
  JwaUxTheme;

const
  SCM_NULL = 0;
  SCM_MINIMIZE = -1; { 标题栏_最小化按钮 }
  SCM_MAXIMIZE = -2; { 标题栏_最大化按钮 }
  SCM_RESTORE = -3; { 标题栏_还原按钮 }
  SCM_CLOSE = -4; { 标题栏_关闭按钮 }
  SCM_MAINMENU = -5; { 标题栏_主菜单按钮 }
  // 未公开消息
  WM_NCUAHDRAWCAPTION = $00AE;
  WM_NCUAHDRAWFRAME = $00AF;
  // 自定义消息
  WM_SkinControl_Click = WM_APP + 100; { 控件被点击 }
  WM_SkinControl_SYSClick = WM_APP + 101;
  WM_SHOWFORM = WM_USER + 1001;

  { 控件被点击 }
type                           {垂直定位}  {水平定位}
  SkinControlType = (SCT_NULL, SCT_NULL_V, SCT_NULL_H, SCT_SYSBUTTON, SCT_MODULEBUTTON, SCT_TEXT);

  PSkinControl = ^TSkinControl;

  TSkinControl = packed record
    SCType: SkinControlType;
    CtlID: Integer;
    x, y, xx, yy, Width, Height: Integer;
    Rect: TRect;
    Caption: string;
    WCaption: WideString;
    wstrLength: Integer;
    Image: TGPImage;
    bImage: Boolean;
    bHover, bPressed, bDisable, bCheck: Boolean;
  end;

  SkinControlArray = array of TSkinControl;

  TSkinForm = class(TForm)
  private
    procedure WMCreate(var Message: TWMCreate); message WM_CREATE;
    procedure WMNchist(var Msg: TMessage); message WM_NCHITTEST;
    procedure WMNCCalcSize(var Message: TWMNCCalcSize); message WM_NCCALCSIZE;
    procedure WMMouseMove(var Message: TWMMouse); message WM_MOUSEMOVE;
    procedure CMMouseLeave(var Message: TMessage); message CM_MOUSELEAVE;
    procedure WMLButtonDown(var Message: TWMMouse); message WM_LBUTTONDOWN;
    procedure WMLButtonUp(var Message: TWMMouse); message WM_LBUTTONUP;
    procedure WMControlClick(var Msg: TMessage); message WM_SkinControl_SYSClick;
    procedure WMPaint(var Message: TWMPaint); message WM_PAINT;
    procedure WMNCActivate(var Message: TWMNCActivate); message WM_NCACTIVATE;
    procedure WMNCUAHDrawCaption(var Msg: TMessage); message WM_NCUAHDRAWCAPTION;
    procedure WMNCUAHDrawFrame(var Msg: TMessage); message WM_NCUAHDRAWFRAME;
    procedure WMEraseBkgnd(var Message: TWMEraseBkgnd); message WM_ERASEBKGND;
    procedure WMSize(var Message: TWMSize); message WM_SIZE;
    procedure WMGetMinMaxInfo(var Msg: TWMGetMinMaxInfo); message WM_GETMINMAXINFO;
    procedure WMActivate(var Message: TWMActivate); message WM_ACTIVATE;
    function CopySkin(hWndDC: HDC): Boolean;
    function DrawWindow(): Boolean;
    function DrawBackground(): Boolean;
    function DrawControls(): Boolean;
    function DrawControl(const Graphics: TGPGraphics; nIndex: Integer): Boolean;
    procedure DrawControlEx(nIndex: Integer);
    function DrawControl_SysBtn(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
    function DrawControl_Module(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
    function DrawControl_Button(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
    function DrawControl_Text(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
    function CreateControl(SCType: SkinControlType; x, y, Width, Height: Integer; CtlID: Integer = 0): Integer;
    procedure MoveControl(nIndex, x, y: Integer; Width: Integer = -1; Height: Integer = -1);
    procedure SetControlImage(nIndex: Integer; ResName: string);
    procedure SetControlText(nIndex: Integer; strText: string);
    function GetSysButton(CtlID: Integer): Integer;
    procedure SetHoverControl(nIndex: Integer = -1);
    procedure SetPressedControl(nIndex: Integer = -1);
    function GetHoverIndex(pt: TPoint): Integer;
    procedure DisableSysTheme();
    procedure DrawNineRect(const Graphics: TGPGraphics); overload;
    procedure DrawNineRect(const Graphics: TGPGraphics; const Image: TGPImage; DestRect, SrcRect, NineRect: TRect); overload;
    procedure DrawNineRect(const Graphics: TGPGraphics; const Image: TGPImage; x, y, w, h, srcx, srcy, srcw, srch: Integer); overload;
    function CreateRoundPath(x, y, w, h, cornerRadius: Single): TGPGraphicsPath;
  protected
    { 私有成员变量 }
    m_hWnd: HWND;
    m_hCacheDC, m_hBackDC: HDC;
    m_hCacheBitmap, m_hOldCacheBitmap: HBITMAP;
    m_hBackBitmap, m_hOldBackBitmap: HBITMAP;
    m_nWidth, m_nHeight: Integer;
    m_bkColor, m_BorderColor1, m_BorderColor2: TGPColor;
    m_bkImage: TGPImage;
    m_bkNineRect: TGPRect;
    m_bkIsImage: Boolean;
    m_hIcon: HICON;
    m_hFont, m_hBoldFont: HFONT;
    m_bIsZoomed: Boolean;
    m_ControlArray: SkinControlArray;
    m_ControlCount: Integer;
    m_ControlSysCount: Integer;
    m_HoverIndex, m_PressedIndex: Integer;
    m_bTracking: Boolean;
    m_ModuleLeft: Integer;
    m_ModuleFont: TGPFont;
    m_ModuleFormat: TGPStringFormat;
    m_ModuleBrush: TGPSolidBrush;
    procedure CreateParams(var Params: TCreateParams); override;
  public
    // 设置窗口背景颜色
    procedure SetBkColor(bkColor: Tcolor; bReDraw: Boolean = True); overload;
    procedure SetBkColor(r, g, b: Byte; bReDraw: Boolean = True); overload;
    // 设置窗口背景图片
    procedure SetBkImage(ResName: string; NineX, NineY, NineWidth, NineHeight: Integer);
    // 重绘整个窗口
    procedure ReDrawWindow();
    // 添加模块按钮 (控件ID,按钮标题,资源图片名称,资源类型)
    procedure AddModuleButton(CtlID: Integer; Caption, ResName: string);
    procedure AddButton(CtlID: Integer; ResName: string; x, y, w, h: Integer; const st: SkinControlType = SCT_NULL);
    procedure AddText(sText: string; CtlID, x, y, w, h: Integer);
    // 选中某个模块
    procedure SetModuleCheck(CtlID: Integer);
  end;

  TSkinFormEx = class(TForm)
  private
    procedure WMCreate(var Message: TWMCreate); message WM_CREATE;
    procedure WMNCActivate(var Message: TWMNCActivate); message WM_NCACTIVATE;
    procedure WMNCPaint(var Message: TWMNCPaint); message WM_NCPAINT;
    procedure WMNchist(var Msg: TMessage); message WM_NCHITTEST;
    procedure WMNCCalcSize(var Message: TWMNCCalcSize); message WM_NCCALCSIZE;
    procedure WMNCUAHDrawCaption(var Msg: TMessage); message WM_NCUAHDRAWCAPTION;
    procedure WMNCUAHDrawFrame(var Msg: TMessage); message WM_NCUAHDRAWFRAME;
  protected
    procedure CreateParams(var Params: TCreateParams); override;
  end;

implementation
var
  tClick: DWORD = 0;
  tPt: TPoint;
procedure TSkinForm.CreateParams(var Params: TCreateParams);
begin
  inherited CreateParams(Params);
  Params.Style := Params.Style or WS_CLIPCHILDREN or WS_CLIPSIBLINGS;
  Params.Style := Params.Style and (not WS_CAPTION);
  Params.WindowClass.Style := CS_VREDRAW or CS_HREDRAW or CS_OWNDC;
  Params.WinClassName := 'JMUI_Frame';
end;

procedure TSkinForm.WMCreate(var Message: TWMCreate);
var
  buf: array[0..MAX_PATH] of Char;
  FileInfo: SHFILEINFO;
  lf: TLogFontW;
  plf: PLogFontW;
  dc: HDC;
begin
  inherited;
  m_hWnd := Handle;
  DisableSysTheme();

  m_bkColor := MakeColor(51, 51, 51);  // 默认窗口颜色
  m_bkIsImage := False;
  m_BorderColor1 := MakeColor(0, 0, 0, 0);   // 最外层边框颜色
  m_BorderColor2 := MakeColor(255, 180, 180, 180);  // 内层边框颜色
  m_hFont := GetStockObject(DEFAULT_GUI_FONT);
  GetObject(m_hFont, SizeOf(lf), @lf);
  lf.lfWeight := FW_BOLD;
  m_hBoldFont := CreateFontIndirectW(lf);
  m_hIcon := SendMessage(m_hWnd, WM_GETICON, ICON_SMALL, 0);
  if m_hIcon = 0 then
  begin
    GetModuleFileName(0, buf, Length(buf));
    SHGetFileInfo(buf, 0, FileInfo, SizeOf(FileInfo), SHGFI_SMALLICON or SHGFI_ICON);
    m_hIcon := FileInfo.HICON;
  end;
  // -----------------------
  dc := GetDC(0);
  plf := @lf;
  m_ModuleFont := TGPFont.Create(dc, plf);
  ReleaseDC(0, dc);
  m_ModuleFormat := TGPStringFormat.Create();
  m_ModuleFormat.SetAlignment(StringAlignmentCenter);
  m_ModuleFormat.SetLineAlignment(StringAlignmentCenter);
  m_ModuleBrush := TGPSolidBrush.Create(MakeColor(180, 180, 180));
  // -----------------------
  m_bTracking := False;
  m_HoverIndex := -1;
  m_PressedIndex := -1;
  m_ControlCount := 0;
  m_ModuleLeft := 7;

  if biHelp in BorderIcons then
    CreateControl(SCT_SYSBUTTON, 300, 5, 30, 19, SCM_MAINMENU);
  if biMinimize in BorderIcons then
    CreateControl(SCT_SYSBUTTON, 300, 5, 30, 19, SCM_MINIMIZE);
  if biMaximize in BorderIcons then
    CreateControl(SCT_SYSBUTTON, 350, 5, 30, 19, SCM_MAXIMIZE);

  CreateControl(SCT_SYSBUTTON, 400, 5, 39, 19, SCM_CLOSE);
  m_ControlSysCount := m_ControlCount;
  // -----------------------
  //SetWindowPos(m_hWnd, 0, 0, 0, 0, 0, SWP_FRAMECHANGED or SWP_NOOWNERZORDER or SWP_NOMOVE or SWP_NOSIZE);
end;

procedure TSkinForm.WMNchist(var Msg: TMessage);
const
  brd = 4;
var
  MouseX, MouseY: Integer;
begin
  inherited;
  if (BorderStyle = bsSizeable) or (BorderStyle = bsSizeToolWin)  then
  begin
    MouseX := LOWORD(Msg.LParam);
    MouseY := HIWORD(Msg.LParam);
    if (MouseX >= Left + Width - brd) and (MouseY >= Top + Height - brd) then
      Msg.Result := HTBOTTOMRIGHT
    else if (MouseX <= Left + brd) and (MouseY <= Top + brd) then
      Msg.Result := HTTOPLEFT
    else if (MouseX <= Left + brd) and (MouseY >= Top + Height - brd) then
      Msg.Result := HTBOTTOMLEFT
    else if MouseX >= Left + Width - brd then
      Msg.Result := HTRIGHT
    else if MouseX <= Left + brd then
      Msg.Result := HTLEFT
    else if MouseY >= Top + Height - brd then
      Msg.Result := HTBOTTOM
    else if MouseY <= Top + brd then
      Msg.Result := HTTOP;
  end;
end;

procedure TSkinForm.WMNCCalcSize(var Message: TWMNCCalcSize);
var
  xx: Integer;
begin
  // 修改非客户区(标题栏、窗口边框)尺寸
  if IsZoomed(m_hWnd) then
  begin
    with Message.CalcSize_Params^.rgrc[0] do
    begin
      xx := Abs(Left);
      inc(Left, xx);
      inc(Top, xx);
      Dec(Right, xx);
      Dec(Bottom, xx);
    end;
  end;
  if Message.CalcValidRects then
  begin
    Message.CalcSize_Params^.rgrc[2] := Message.CalcSize_Params^.rgrc[1];
    Message.CalcSize_Params^.rgrc[1] := Message.CalcSize_Params^.rgrc[0];
  end;
  Message.Result := 1;
end;

procedure TSkinForm.WMSize(var Message: TWMSize);
begin
  inherited;
  if m_hCacheDC <> 0 then
  begin
    SelectObject(m_hCacheDC, m_hOldCacheBitmap);
    SelectObject(m_hBackDC, m_hOldBackBitmap);
    DeleteDC(m_hCacheDC);
    DeleteDC(m_hBackDC);
    DeleteObject(m_hCacheBitmap);
    DeleteObject(m_hBackBitmap);
    m_hCacheDC := 0;
    m_hBackDC := 0;
    m_hCacheBitmap := 0;
    m_hBackBitmap := 0;
  end;
end;

procedure TSkinForm.WMGetMinMaxInfo(var Msg: TWMGetMinMaxInfo);
var
  MyScreen: TScreen;
  Monitor: TMonitor;
  rc: TRect;
begin
  if IsZoomed(m_hWnd) then
  begin
    inherited;
//    BorderStyle := bsSingle;
    MyScreen := TScreen.Create(nil);
    Monitor := MyScreen.MonitorFromWindow(m_hWnd);
    rc := Monitor.WorkareaRect;
    Msg.MinMaxInfo.ptMaxPosition.x := rc.Left;
    Msg.MinMaxInfo.ptMaxPosition.y := rc.Top;
    Msg.MinMaxInfo.ptMaxSize.x := rc.right - rc.Left;
    Msg.MinMaxInfo.ptMaxSize.y := rc.bottom - rc.Top;
    //SetWindowPos(m_hWnd,0,rc.Left,rc.Top,rc.right-rc.left,rc.bottom-rc.top,SWP_NOZORDER);
    Msg.Result := 0;
  end;
end;

procedure TSkinForm.WMActivate(var Message: TWMActivate);
//var
//  rc: TRect;
//  w, h: Integer;
begin
//  Windows.GetClientRect(m_hWnd, rc);
  inherited;
//  w := rc.right - rc.Left;
//  h := rc.bottom - rc.Top;
//  SetWindowPos(m_hWnd,0,0,0,w+1,h+1,SWP_FRAMECHANGED or SWP_NOREDRAW Or SWP_NOOWNERZORDER Or SWP_NOMOVE);
//  SetWindowPos(m_hWnd,0,0,0,w,h,SWP_FRAMECHANGED or SWP_DRAWFRAME Or SWP_NOOWNERZORDER Or SWP_NOMOVE);
//  InvalidateRect(m_hWnd, nil, False);
end;

procedure TSkinForm.WMMouseMove(var Message: TWMMouse);
var
  e: TTrackMouseEvent;
  nIndex: Integer;
  pt: TPoint;
begin
  inherited;
  if m_bTracking = False then
  begin
    m_bTracking := True;
    e.cbSize := SizeOf(TTrackMouseEvent);
    e.dwFlags := TME_LEAVE;
    e.dwHoverTime := 10;
    e.hwndTrack := m_hWnd;
    trackmouseevent(e);
  end;
  pt.x := Message.XPos;
  pt.y := Message.YPos;
  nIndex := GetHoverIndex(pt);
  SetHoverControl(nIndex);
end;

procedure TSkinForm.CMMouseLeave(var Message: TMessage);
begin
  inherited;
  m_bTracking := False;
  SetPressedControl(-1);
  SetHoverControl(-1);
end;

procedure TSkinForm.WMLButtonDown(var Message: TWMMouse);
var
  nIndex: Integer;
  pt: TPoint;
begin
  inherited;
  if (BorderStyle = bsSizeable) or (BorderStyle = bsSizeToolWin)  then
  begin
    // 处理鼠标左键双击事件
    if ((GetTickCount - tClick) < GetDoubleClickTime) and ((tpt.X = Message.XPos) and (tpt.Y = Message.YPos)) then
    begin
      if WindowState = wsMaximized then
        PostMessage(m_hWnd, WM_SYSCOMMAND, SC_RESTORE, 0)
      else
        PostMessage(m_hWnd, WM_SYSCOMMAND, SC_MAXIMIZE, 0);
    end;
    tClick := GetTickCount;
  end;
//
  tpt.x := Message.XPos;
  tpt.y := Message.YPos;
  pt.x := Message.XPos;
  pt.y := Message.YPos;
  nIndex := GetHoverIndex(pt);
  SetPressedControl(nIndex);
  if nIndex = -1 then
  begin
    ReleaseCapture();
    PostMessage(m_hWnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
  end;

end;

procedure TSkinForm.WMLButtonUp(var Message: TWMMouse);
var
  nIndex, nOldIndex: Integer;
  pt: TPoint;
  Control: TSkinControl;
begin
  inherited;
  pt.x := Message.XPos;
  pt.y := Message.YPos;
  nIndex := GetHoverIndex(pt);
  nOldIndex := m_PressedIndex;
  SetPressedControl(-1);
  if (nIndex >= 0) and (nIndex < m_ControlCount) then
  begin
    ReleaseCapture();
    Control := m_ControlArray[nIndex];
    PostMessage(m_hWnd, WM_SkinControl_SYSClick, Control.CtlID, nIndex);
  end;
end;

procedure TSkinForm.WMControlClick(var Msg: TMessage);
var
  nIndex: Integer;
  CtlID: Integer;
  Control: TSkinControl;
  bMsg: Boolean;
begin
  nIndex := Msg.LParam;
  CtlID := Msg.WParam;
  bMsg := False;
  if (nIndex >= 0) and (nIndex < m_ControlCount) then
  begin
    Control := m_ControlArray[nIndex];
    if Control.SCType = SCT_SYSBUTTON then
    begin
      if (CtlID = SCM_MAXIMIZE) and IsZoomed(m_hWnd) then
      begin
        CtlID := SCM_RESTORE;
      end;
      case CtlID of
        SCM_MINIMIZE:
          PostMessage(m_hWnd, WM_SYSCOMMAND, SC_MINIMIZE, 0);
        SCM_MAXIMIZE:
          PostMessage(m_hWnd, WM_SYSCOMMAND, SC_MAXIMIZE, 0);
        SCM_RESTORE:
          PostMessage(m_hWnd, WM_SYSCOMMAND, SC_RESTORE, 0);
        SCM_CLOSE:
          PostMessage(m_hWnd, WM_SYSCOMMAND, SC_CLOSE, 0);
        SCM_MAINMENU:
          bMsg := True;
      end;
    end
    else
    begin
      bMsg := True;
    end;
    if bMsg then
    begin
      Windows.PostMessage(m_hWnd, WM_SkinControl_Click, CtlID, nIndex);
    end;
  end;
end;

procedure TSkinForm.WMPaint(var Message: TWMPaint);
var
  ps: PAINTSTRUCT;
  dc: HDC;
begin
  dc := BeginPaint(Handle, ps);
  CopySkin(dc);
  EndPaint(Handle, ps);
  Message.Result := 0;
end;

procedure TSkinForm.WMEraseBkgnd(var Message: TWMEraseBkgnd);
begin
  CopySkin(Message.dc);
  Message.Result := 1;
end;

procedure TSkinForm.WMNCActivate(var Message: TWMNCActivate);
begin
  // 在这里不能调用默认的处理因为当窗口是非激活状态时会画出默认的Title
  // inherited;
  Message.Result := 1;
end;

procedure TSkinForm.WMNCUAHDrawCaption(var Msg: TMessage);
begin
  // 这两条消息是在xp sp2后加的.xp在以前有个bug在某些时候Titlebar会画错.
  // 在这里不能调用默认处理，直接自绘nc区.;
  // inherited;
end;

procedure TSkinForm.WMNCUAHDrawFrame(var Msg: TMessage);
begin
  // 这两条消息是在xp sp2后加的.xp在以前有个bug在某些时候Titlebar会画错.
  // 在这里不能调用默认处理，直接自绘nc区.;
  // inherited;
end;

function TSkinForm.CopySkin(hWndDC: HDC): Boolean;
begin
  if m_hCacheDC = 0 then
  begin
    DrawWindow();
  end;
  BitBlt(hWndDC, 0, 0, m_nWidth, m_nHeight, m_hCacheDC, 0, 0, SRCCOPY);
end;

function TSkinForm.DrawWindow(): Boolean;
var
  hSrcDC: HDC;
  rc: TRect;
  nWidth, nHeight: Integer;
  Rgn: HRGN;
begin
  m_bIsZoomed := Windows.IsZoomed(m_hWnd);
  Windows.GetClientRect(m_hWnd, rc);
  nWidth := rc.right - rc.Left;
  nHeight := rc.bottom - rc.Top;
  m_nWidth := nWidth;
  m_nHeight := nHeight;
  hSrcDC := GetDC(m_hWnd);
  m_hCacheDC := CreateCompatibleDC(hSrcDC);
  m_hBackDC := CreateCompatibleDC(hSrcDC);
  m_hCacheBitmap := CreateCompatibleBitmap(hSrcDC, nWidth, nHeight);
  m_hBackBitmap := CreateCompatibleBitmap(hSrcDC, nWidth, nHeight);
  m_hOldCacheBitmap := SelectObject(m_hCacheDC, m_hCacheBitmap);
  m_hOldBackBitmap := SelectObject(m_hBackDC, m_hBackBitmap);
  // --------------------------------------------
  SetBkMode(m_hCacheDC, TRANSPARENT);
  SetBkMode(m_hBackDC, TRANSPARENT);
  // --------------------------------------------
  ReleaseDC(m_hWnd, hSrcDC);
  DrawBackground();
  DrawControls();
  // --------------------------------------------
  // if m_bIsZoomed then
  // begin
  // Rgn := CreateRectRgn(0, 0, m_nWidth, m_nHeight);
  // end
  // else
  // begin
  // // 绘制圆角
  // Rgn := CreateRoundRectRgn(0, 0, m_nWidth + 1, m_nHeight + 1, 4, 4);
  // end;
  Rgn := CreateRectRgn(0, 0, m_nWidth, m_nHeight);
  SetWindowRgn(m_hWnd, Rgn, False);
  DeleteObject(Rgn);
  Result := True;
end;

function TSkinForm.DrawBackground(): Boolean;
var
  g: TGPGraphics;
  b: TGPSolidBrush;
  Pen1, Pen2: TGPPen;
  path1, path2: TGPGraphicsPath;
  x, y, w, h, cornerRadius, len: Integer;
  buf: array[0..MAX_PATH] of Char;
  hOldFont: HFONT;
  rc: TRect;
  rcF, SrcF: TGPRectF;
  w1, w2, w3: Single;
begin
  // ----------------
  g := TGPGraphics.Create(m_hBackDC);
  b := TGPSolidBrush.Create(m_bkColor);
  g.FillRectangle(b, 0, 0, m_nWidth, m_nHeight);
  b.Free;
  // ----------------
  if m_bkIsImage then
  begin
    w := m_bkImage.GetWidth();
    h := m_bkImage.GetHeight();
  end
  else
  begin
    w := 0;
    h := 0;
  end;

  if (w > 0) and (h > 0) then
  begin
    if (m_nWidth <= w) and (m_nHeight <= h) then
    begin
      rcF := MakeRect(0.0, 0.0, m_nWidth, m_nHeight);
      SrcF := MakeRect(w - m_nWidth, 0.0, m_nWidth, m_nHeight);
      g.DrawImage(m_bkImage, rcF, SrcF.x, SrcF.y, SrcF.Width, SrcF.Height, UnitPixel);
    end
    else if (m_bkNineRect.Width > 0) and (m_bkNineRect.Height > 0) then
    begin
      // 按九宫图绘制
      DrawNineRect(g);
    end;

  end;
  // ----------------
  Pen1 := TGPPen.Create(m_BorderColor1);
  Pen2 := TGPPen.Create(m_BorderColor2);
  { if m_bIsZoomed then
    begin
    // 最大化
    g.DrawRectangle(Pen1, 0, 0, m_nWidth - 1, m_nHeight - 1);
    g.DrawRectangle(Pen2, 1, 1, m_nWidth - 3, m_nHeight - 3);
    end
    else
    begin
    x := 0;
    y := 0;
    w := m_nWidth - 1;
    h := m_nHeight - 1;
    cornerRadius := 3;
    path1 := TGPGraphicsPath.Create();
    path1.AddArc(x, y, cornerRadius * 2, cornerRadius * 2, 180, 90); // 左上
    path1.AddArc(x + w - cornerRadius * 2, y, cornerRadius * 2, cornerRadius * 2, 270, 90); // 右上
    path1.AddArc(x + w - cornerRadius * 2, y + h - cornerRadius * 2, cornerRadius * 2, cornerRadius * 2, 0, 90); // 右下
    path1.AddArc(x, y + h - cornerRadius * 2, cornerRadius * 2, cornerRadius * 2, 90, 90); // 左下
    path1.CloseFigure();
    g.DrawPath(Pen1, path1);
    path1.Free;
    x := 1;
    y := 1;
    w := m_nWidth - 3;
    h := m_nHeight - 3;
    cornerRadius := 3;
    path2 := TGPGraphicsPath.Create();
    path2.AddArc(x, y, cornerRadius * 2, cornerRadius * 2, 180, 90); // 左上
    path2.AddArc(x + w - cornerRadius * 2, y, cornerRadius * 2, cornerRadius * 2, 270, 90); // 右上
    path2.AddArc(x + w - cornerRadius * 2, y + h - cornerRadius * 2, cornerRadius * 2, cornerRadius * 2, 0, 90); // 右下
    path2.AddArc(x, y + h - cornerRadius * 2, cornerRadius * 2, cornerRadius * 2, 90, 90); // 左下
    path2.CloseFigure();
    g.DrawPath(Pen2, path2);
    path2.Free;
    end; }
  g.DrawRectangle(Pen1, 0, 0, m_nWidth - 1, m_nHeight - 1);  // 绘制最外层边框
  //g.DrawRectangle(Pen2, 1, 1, m_nWidth - 3, m_nHeight - 3); // 绘制内层边框
  Pen1.Free;
  Pen2.Free;
  // ----------------
  // 绘制图标
  {
  x := 5;
  y := 5;
  w := 16;
  h := 16;
  if m_hIcon <> 0 then
  begin
    DrawIconEx(m_hBackDC, x, y, m_hIcon, w, h, 0, 0, DI_NORMAL);
    x := x + 20;
  end;
  // ----------------
  // 绘制标题

  rc.Left := x;
  rc.Top := y;
  rc.right := m_nWidth - 100;
  rc.bottom := y + h;
  GetWindowText(m_hWnd, buf, MAX_PATH);
  hOldFont := SelectObject(m_hBackDC, m_hBoldFont);
  SetTextColor(m_hBackDC, $333333);
  DrawText(m_hBackDC, buf, -1, rc, DT_SINGLELINE or DT_VCENTER);
  OffsetRect(rc, -1, -1);
  SetTextColor(m_hBackDC, $FFFFFF);
  DrawText(m_hBackDC, buf, -1, rc, DT_SINGLELINE or DT_VCENTER);
  SelectObject(m_hBackDC, hOldFont);
  }
  // ----------------
  g.Free;
  Result := True;
end;

function TSkinForm.DrawControls(): Boolean;
var
  i, x, y, nIndex: Integer;
  g: TGPGraphics;
begin
  BitBlt(m_hCacheDC, 0, 0, m_nWidth, m_nHeight, m_hBackDC, 0, 0, SRCCOPY);
  g := TGPGraphics.Create(m_hCacheDC);
  // g.SetSmoothingMode(SmoothingModeAntiAlias);
  g.SetInterpolationMode(InterpolationModeHighQualityBicubic);
  // ----------------
  x := m_nWidth - 2;
  y := 2;
  nIndex := GetSysButton(SCM_CLOSE);
  if nIndex > -1 then
  begin
    x := x - m_ControlArray[nIndex].Width;
    MoveControl(nIndex, x, y);
  end;
  nIndex := GetSysButton(SCM_MAXIMIZE);
  if nIndex > -1 then
  begin
    x := x - m_ControlArray[nIndex].Width;
    MoveControl(nIndex, x, y);
  end;
  nIndex := GetSysButton(SCM_MINIMIZE);
  if nIndex > -1 then
  begin
    x := x - m_ControlArray[nIndex].Width;
    MoveControl(nIndex, x, y);
  end;
  nIndex := GetSysButton(SCM_MAINMENU);
  if nIndex > -1 then
  begin
    x := x - m_ControlArray[nIndex].Width;
    MoveControl(nIndex, x, y);
  end;
  // ----------------
  for i := 0 to m_ControlCount - 1 do
  begin
    // 设置水平定位的控件
    if m_ControlArray[i].SCType = SCT_NULL_H then
    begin
      y := m_controlArray[i].y;
      x := m_nWidth - m_controlArray[i].xx;
      x := x - m_ControlArray[i].Width;
      MoveControl(i, x, y);
    end;
    // 设置垂直定位的控件
    if m_ControlArray[i].SCType = SCT_NULL_V then
    begin
      x := m_ControlArray[i].x;
      y := m_nHeight - m_controlArray[i].yy;
      y := y - m_controlArray[i].Height;
      MoveControl(i, x, y);
    end;
    DrawControl(g, i);
  end;
  // ----------------
  g.Free;
  Result := True;
end;

function TSkinForm.DrawControl(const Graphics: TGPGraphics; nIndex: Integer): Boolean;
var
  Control: TSkinControl;
begin
  Control := m_ControlArray[nIndex];
  case Control.SCType of
    SCT_SYSBUTTON:
      DrawControl_SysBtn(Graphics, Control);
    SCT_MODULEBUTTON:
      DrawControl_Module(Graphics, Control);
    SCT_NULL, SCT_NULL_V, SCT_NULL_H:
      DrawControl_Button(Graphics, Control);
    SCT_TEXT:
      DrawControl_Text(Graphics, Control);
  end;

  Result := True;
end;

function TSkinForm.DrawControl_Button(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
var
  x, y, w, h: Single;
  rc: TGPRectF;
  LineBrush1: TGPLinearGradientBrush;
  c1, c2: TGPColor;
begin
  // 画出图标 ========================
  if Control.bImage then
  begin
    w := Control.Image.GetWidth();
    h := Control.Image.GetHeight();
    rc.Width := w;
    rc.Height := h;
    rc.x := Control.x + (Control.Width - rc.Width) / 2;
    rc.y := Control.y + (Control.Height - rc.Height) / 2;
    Graphics.DrawImage(Control.Image, rc, 0, 0, w, h, UnitPixel);
  end;
  // 画出背景 ========================
  if Control.bCheck or Control.bPressed or Control.bHover then
  begin
    if Control.bCheck or Control.bPressed = True then
    begin
      c1 := MakeColor(50, 255, 255, 255);
      c2 := MakeColor(50, 255, 255, 255);
    end
    else
    begin
      c1 := MakeColor(30, 0, 0, 0);
      c2 := MakeColor(30, 0, 0, 0);
    end;

    x := Control.x;
    y := Control.y;
    w := Control.Width;
    h := Control.Height;
    rc := MakeRect(x, y, w, h);

    LineBrush1 := TGPLinearGradientBrush.Create(rc, c1, c2, LinearGradientModeVertical);
    rc := MakeRect(x, y, w, h);
    Graphics.FillRectangle(LineBrush1, rc);
    LineBrush1.Free();
  end;
  // --------------------------
  Result := True;
end;

function TSkinForm.DrawControl_Text(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
var
  rc: TGPRectF;
  Brush: TGPSolidBrush;
  x, y, w, h: Single;
  t_Format: TGPStringFormat;
begin
  // 绘制出文字
  x := Control.x;
  y := Control.y;
  w := Control.Width;
  h := Control.Height;
  t_Format := TGPStringFormat.Create();
  t_Format.SetAlignment(StringAlignmentNear);
  t_Format.SetLineAlignment(StringAlignmentCenter);

  Brush := TGPSolidBrush.Create(MakeColor(60, 0, 0, 0));
  rc := MakeRect(x, y, w, h);
  Graphics.DrawString(Control.WCaption, -1, m_ModuleFont, rc, t_Format, Brush);
  rc.x := rc.x - 1;
  rc.y := rc.y - 1;
  Graphics.DrawString(Control.WCaption, -1, m_ModuleFont, rc, t_Format, m_ModuleBrush);
  Brush.Free;
  t_Format.Free;
end;

function TSkinForm.DrawControl_Module(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
var
  x, y, w, h: Single;
  cornerRadius: Integer;
  rc: TGPRectF;
  c1, c2, c3, c4: TGPColor;
  Pen1, Pen2, Pen3: TGPPen;
  Brush: TGPSolidBrush;
  path1, path2, path3: TGPGraphicsPath;
  SmoothingMode: TSmoothingMode;
begin
  // 画出顶部模块按钮
  // 画出背景 ========================
  if Control.bCheck or Control.bPressed or Control.bHover then
  begin

    if Control.bCheck or Control.bPressed = True then
    begin
      c1 := MakeColor(20, 0, 0, 0);
      c2 := MakeColor(60, 0, 0, 0);
      c3 := MakeColor(120, 255, 255, 255);
      c4 := MakeColor(70, 255, 255, 255);
    end
    else
    begin
      c1 := MakeColor(15, 0, 0, 0);
      c2 := MakeColor(40, 0, 0, 0);
      c3 := MakeColor(90, 255, 255, 255);
      c4 := MakeColor(50, 255, 255, 255);
    end;

    Pen1 := TGPPen.Create(c1);
    Pen2 := TGPPen.Create(c2);
    Pen3 := TGPPen.Create(c3);
    Brush := TGPSolidBrush.Create(c4);

    x := Control.x;
    y := Control.y;
    w := Control.Width - 2;
    h := Control.Height - 2;

    path1 := CreateRoundPath(x, y, w, h, 5);
    path2 := CreateRoundPath(x + 1, y + 1, w - 2, h - 2, 5);
    path3 := CreateRoundPath(x + 2, y + 2, w - 4, h - 4, 5);

    SmoothingMode := Graphics.GetSmoothingMode();
    Graphics.SetSmoothingMode(SmoothingModeAntiAlias);

    Graphics.DrawPath(Pen1, path1);
    Graphics.DrawPath(Pen2, path2);
    Graphics.FillPath(Brush, path3);
    Graphics.DrawPath(Pen3, path3);

    Graphics.SetSmoothingMode(SmoothingMode);
    Pen1.Free;
    Pen2.Free;
    Pen3.Free;
    Brush.Free;
    path1.Free;
    path2.Free;
    path3.Free;
  end;
  // 画出图标 ========================
  if Control.bImage then
  begin
    w := Control.Image.GetWidth();
    h := Control.Image.GetHeight();
    rc.Width := w;
    rc.Height := h;
    if rc.Width > 48 then
      rc.Width := 48;
    if rc.Height > 48 then
      rc.Height := 48;
    rc.x := Control.x + (Control.Width - rc.Width) / 2;
    rc.y := Control.y + (Control.Height - rc.Height - 20) / 2;
    Graphics.DrawImage(Control.Image, rc, 0, 0, w, h, UnitPixel);
  end;
  // 画出文字 ========================
  if Control.wstrLength > 0 then
  begin
    Brush := TGPSolidBrush.Create(MakeColor(60, 0, 0, 0));
    rc := MakeRect(Control.x + 1, Control.y + 1 + Control.Height - 20, Control.Width - 1, 18.0);
    Graphics.DrawString(Control.WCaption, -1, m_ModuleFont, rc, m_ModuleFormat, Brush);
    rc.x := rc.x - 1;
    rc.y := rc.y - 1;
    Graphics.DrawString(Control.WCaption, -1, m_ModuleFont, rc, m_ModuleFormat, m_ModuleBrush);
    Brush.Free;
  end;
  // --------------------------
  Result := True;
end;

function TSkinForm.DrawControl_SysBtn(const Graphics: TGPGraphics; const Control: TSkinControl): Boolean;
var
  path1, IconPath, IconPath2: TGPGraphicsPath;
  IconBrush: TGPSolidBrush;
  IconPen: TGPPen;
  LineBrush1, LineBrush2: TGPLinearGradientBrush;
  x, y, w, h: Single;
  i, CtlID: Integer;
  rc: TGPRectF;
  c1, c2: TGPColor;
begin
  // 画出系统按钮(最小化、最大化...)
  CtlID := Control.CtlID;
  if (CtlID = SCM_MAXIMIZE) and m_bIsZoomed then
  begin
    CtlID := SCM_RESTORE;
  end;

  // 画出背景 ========================
  if Control.bPressed or Control.bHover then
  begin
    x := Control.x + 1;
    y := Control.y;
    w := Control.Width - 1;
    h := Control.Height;
    if Control.CtlID = SCM_CLOSE then
    begin
      if Control.bPressed = True then
      begin
        c1 := MakeColor(180, 128, 0, 0);
        c2 := MakeColor(0, 0, 0, 0);
      end
      else
      begin
        c1 := MakeColor(180, 255, 0, 0);
        c2 := MakeColor(180, 255, 0, 0);
      end;
    end
    else
    begin
      w := w - 2;
      if Control.bPressed = True then
      begin
        c1 := MakeColor(90, 0, 0, 0);
        c2 := MakeColor(0, 0, 0, 0);
      end
      else
      begin
        c1 := MakeColor(60, 123, 123, 123);
        c2 := MakeColor(60, 123, 123, 123);
      end;
    end;

    rc := MakeRect(x, y, w, h);
    LineBrush1 := TGPLinearGradientBrush.Create(rc, c1, c2, LinearGradientModeVertical);
    rc := MakeRect(x, y, w, h);
    Graphics.FillRectangle(LineBrush1, rc);
    // rc.x := rc.x - 1;

    // LineBrush2 := TGPLinearGradientBrush.Create(rc, c1, c2, LinearGradientModeVertical);
    // Graphics.FillRectangle(LineBrush2, rc);
    LineBrush1.Free();
    // LineBrush2.Free();
  end;
  // 画出图标 ========================
  w := 11;
  h := 9;
  x := Control.x + ((Control.Width - w) / 2) - 1;
  y := Control.y + ((Control.Height - h) / 2) - 1;
  IconPath := TGPGraphicsPath.Create();
  IconPath.SetFillMode(FillModeWinding);
  case CtlID of
    SCM_MINIMIZE:
      begin
        rc.x := Integer(Trunc(x));
        rc.y := Integer(Trunc(y)) + Integer(Trunc(h)) - 2;
        rc.Width := Integer(Trunc(w));
        rc.Height := 2;
        IconPath.AddRectangle(rc);
      end;
    SCM_MAXIMIZE:
      begin
        h := 8;
        y := y + 1;
        rc.x := Integer(Trunc(x));
        rc.y := Integer(Trunc(y));
        rc.Width := Integer(Trunc(w));
        rc.Height := 2;
        IconPath.AddRectangle(rc);
        rc.y := Integer(Trunc(y)) + Integer(Trunc(h)) - 1;
        rc.Height := 1;
        IconPath.AddRectangle(rc);
        rc.y := Integer(Trunc(y));
        rc.Width := 1;
        rc.Height := Integer(Trunc(h));
        IconPath.AddRectangle(rc);
        rc.x := Integer(Trunc(x)) + Integer(Trunc(w)) - 1;
        IconPath.AddRectangle(rc);
      end;
    SCM_RESTORE:
      begin
        w := 12;
        h := 8;
        y := y + 1;
        x := x - 1;
        rc := MakeRect(x + 2, y + 0.0, 10, 1);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x + 2, y + 0.0, 1, 2);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x + 11, y + 0.0, 1, 6);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x + 9, y + 6, 3, 1);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x, y + 2, 10, 2);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x, y + 2, 1, 6);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x + 9, y + 2, 1, 6);
        IconPath.AddRectangle(rc);
        rc := MakeRect(x, y + 7, 10, 1);
        IconPath.AddRectangle(rc);
      end;
    SCM_CLOSE:
      begin
        for i := 0 to 8 do
        begin
          rc.x := Integer(Trunc(x)) + i;
          rc.y := Integer(Trunc(y)) + i;
          rc.Width := 3;
          rc.Height := 1;
          IconPath.AddRectangle(rc);
          rc.x := Integer(Trunc(x)) + Integer(Trunc(w)) - i - 3;
          IconPath.AddRectangle(rc);
        end;
      end;
    SCM_MAINMENU:
      begin
        rc.x := Integer(Trunc(x));
        rc.y := Integer(Trunc(y));
        rc.Width := Integer(Trunc(w));
        rc.Height := 2;
        IconPath.AddRectangle(rc);
        rc.y := Integer(Trunc(y)) + Integer(Trunc(h)) - 1;
        rc.Height := 1;
        IconPath.AddRectangle(rc);
        rc.y := Integer(Trunc(y));
        rc.Width := 1;
        rc.Height := Integer(Trunc(h));
        IconPath.AddRectangle(rc);
        rc.x := Integer(Trunc(x)) + Integer(Trunc(w)) - 1;
        IconPath.AddRectangle(rc);

        rc.Width := 1;
        rc.Height := 1;
        rc.y := Integer(Trunc(y)) + Integer(Trunc(h)) - 3;
        rc.x := Integer(Trunc(x)) + ((w - rc.Width) / 2);
        IconPath.AddRectangle(rc);
        rc.Width := 3;
        rc.y := rc.y - rc.Height;
        rc.x := Integer(Trunc(x)) + ((w - rc.Width) / 2);
        IconPath.AddRectangle(rc);
        rc.Width := 5;
        rc.y := rc.y - rc.Height;
        rc.x := Integer(Trunc(x)) + ((w - rc.Width) / 2);
        IconPath.AddRectangle(rc);
      end;
  end;

  IconPath.CloseAllFigures();
  IconPath2 := TGPGraphicsPath.Create(IconPath);
  IconBrush := TGPSolidBrush.Create(MakeColor(255, 255, 255));
  IconPen := TGPPen.Create(MakeColor(50, 0, 0, 0));

  IconPath.Widen(IconPen);
  Graphics.DrawPath(IconPen, IconPath);
  IconPath.Widen(IconPen);
  Graphics.DrawPath(IconPen, IconPath);
  Graphics.FillPath(IconBrush, IconPath2);
  IconPath.Free;
  IconPath2.Free;
  IconPen.Free;
  IconBrush.Free;
  // 画出分割线 ========================
  // if Control.CtlID <> SCM_CLOSE then
  // begin
  // x := Control.x + Control.Width - 1;
  // y := Control.y;
  // rc := MakeRect(x, y, 1, Control.Height);
  // c1 := MakeColor(120, 255, 255, 255);
  // c2 := MakeColor(0, 255, 255, 255);
  //
  // LineBrush1 := TGPLinearGradientBrush.Create(rc, c1, c2, LinearGradientModeVertical);
  // Graphics.FillRectangle(LineBrush1, rc);
  // rc.x := rc.x - 1;
  // c1 := MakeColor(90, 0, 0, 0);
  // c2 := MakeColor(0, 0, 0, 0);
  //
  // LineBrush2 := TGPLinearGradientBrush.Create(rc, c1, c2, LinearGradientModeVertical);
  // Graphics.FillRectangle(LineBrush2, rc);
  // LineBrush1.Free();
  // LineBrush2.Free();
  // end;
  // --------------------------
  Result := True;
end;

function TSkinForm.CreateControl(SCType: SkinControlType; x, y, Width, Height: Integer; CtlID: Integer = 0): Integer;
var
  nIndex: Integer;
begin
  SetLength(m_ControlArray, m_ControlCount + 1);
  nIndex := m_ControlCount;
  m_ControlCount := Length(m_ControlArray);
  m_ControlArray[nIndex].SCType := SCType;
  m_ControlArray[nIndex].CtlID := CtlID;
  m_ControlArray[nIndex].bHover := False;
  m_ControlArray[nIndex].bPressed := False;
  m_ControlArray[nIndex].bDisable := False;
  m_ControlArray[nIndex].bCheck := False;
  m_ControlArray[nIndex].bImage := False;
  m_ControlArray[nIndex].xx := Self.Width - x;
  m_ControlArray[nIndex].yy := Self.Height - y;
  MoveControl(nIndex, x, y, Width, Height);
  Result := nIndex;
end;

procedure TSkinForm.MoveControl(nIndex, x, y: Integer; Width: Integer = -1; Height: Integer = -1);
begin
  m_ControlArray[nIndex].x := x;
  m_ControlArray[nIndex].y := y;
  if Width > -1 then
    m_ControlArray[nIndex].Width := Width;
  if Height > -1 then
    m_ControlArray[nIndex].Height := Height;
  m_ControlArray[nIndex].Rect.Left := x;
  m_ControlArray[nIndex].Rect.Top := y;
  m_ControlArray[nIndex].Rect.right := x + m_ControlArray[nIndex].Width;
  m_ControlArray[nIndex].Rect.bottom := y + m_ControlArray[nIndex].Height;
end;

function TSkinForm.GetSysButton(CtlID: Integer): Integer;
var
  nIndex, i: Integer;
begin
  nIndex := -1;
  for i := 0 to m_ControlSysCount - 1 do
  begin
    if m_ControlArray[i].CtlID = CtlID then
    begin
      nIndex := i;
      break;
    end;
  end;
  Result := nIndex;
end;

procedure TSkinForm.SetBkColor(bkColor: Tcolor; bReDraw: Boolean = True);
begin
  m_bkColor := ColorRefToARGB(bkColor);
  if bReDraw then
    ReDrawWindow();
end;

procedure TSkinForm.SetBkColor(r, g, b: Byte; bReDraw: Boolean = True);
begin
  m_bkColor := MakeColor(r, g, b);
  if bReDraw then
    ReDrawWindow();
end;

procedure TSkinForm.SetBkImage(ResName: string; NineX, NineY, NineWidth, NineHeight: Integer);
begin
  // 设置窗口背景图片
  m_bkNineRect := MakeRect(NineX, NineY, NineWidth, NineHeight);
  if m_bkIsImage then
  begin
    m_bkImage.destroy();
    m_bkImage.Free();
    m_bkIsImage := False;
  end;
  m_bkImage := TGPImage.Create(ResName);
  m_bkIsImage := True;

  ReDrawWindow();
end;

procedure TSkinForm.ReDrawWindow();
begin
  if (IsWindowVisible(m_hWnd)) and (IsIconic(m_hWnd) = False) then
  begin
    DrawWindow();
    InvalidateRect(m_hWnd, nil, False);
  end;
end;

procedure TSkinForm.DrawControlEx(nIndex: Integer);
var
  Control: TSkinControl;
  g: TGPGraphics;
  dc: HDC;
begin

  if (nIndex >= 0) and (nIndex < m_ControlCount) then
  begin
    Control := m_ControlArray[nIndex];
    BitBlt(m_hCacheDC, Control.x, Control.y, Control.Width, Control.Height, m_hBackDC, Control.x, Control.y, SRCCOPY);
    g := TGPGraphics.Create(m_hCacheDC);
    g.SetInterpolationMode(InterpolationModeHighQualityBicubic);
    // --------------
    DrawControl(g, nIndex);
    // --------------
    dc := GetDC(m_hWnd);
    BitBlt(dc, Control.x, Control.y, Control.Width, Control.Height, m_hCacheDC, Control.x, Control.y, SRCCOPY);
    ReleaseDC(m_hWnd, dc);
  end;
end;

procedure TSkinForm.SetHoverControl(nIndex: Integer = -1);
var
  nOldIndex: Integer;
begin
  if m_HoverIndex <> nIndex then
  begin
    nOldIndex := m_HoverIndex;
    m_HoverIndex := nIndex;
    if (nOldIndex > -1) and (nOldIndex < m_ControlCount) then
    begin
      m_ControlArray[nOldIndex].bHover := False;
      DrawControlEx(nOldIndex);
    end;
    if (nIndex >= 0) and (nIndex < m_ControlCount) then
    begin
      m_ControlArray[nIndex].bHover := True;
      DrawControlEx(nIndex);
    end;
  end;
end;

procedure TSkinForm.SetPressedControl(nIndex: Integer = -1);
var
  nOldIndex: Integer;
begin
  if m_PressedIndex <> nIndex then
  begin
    nOldIndex := m_PressedIndex;
    m_PressedIndex := nIndex;
    if (nOldIndex >= 0) and (nOldIndex < m_ControlCount) then
    begin
      m_ControlArray[nOldIndex].bPressed := False;
      DrawControlEx(nOldIndex);
    end;
    if (nIndex >= 0) and (nIndex < m_ControlCount) then
    begin
      m_ControlArray[nIndex].bPressed := True;
      DrawControlEx(nIndex);
    end;
  end;
end;

function TSkinForm.GetHoverIndex(pt: TPoint): Integer;
var
  nIndex, i: Integer;
begin
  nIndex := -1;
  for i := 0 to m_ControlCount - 1 do
  begin
    if PtInRect(m_ControlArray[i].Rect, pt) then
    begin
      nIndex := i;
      break;
    end;
  end;
  Result := nIndex;
end;

procedure TSkinForm.DisableSysTheme();
//var
//  dwAttr: DWMWINDOWATTRIBUTE;
//  pvAttr: DWMNCRENDERINGPOLICY;
begin
  // 防止xp 、vista、win7 用主题绘制窗口nc区
  // vista、win7厚边框问题解决办法
  SetWindowTheme(m_hWnd, '', '');
//  dwAttr := DWMWA_NCRENDERING_POLICY;
//  pvAttr := DWMNCRP_DISABLED;
//  DwmSetWindowAttribute(m_hWnd,2,@pvAttr,SizeOf(pvAttr));

end;

procedure TSkinForm.DrawNineRect(const Graphics: TGPGraphics);
var
  DestRect, SrcRect, NineRect: TRect;
begin
  DestRect.Left := 0;
  DestRect.Top := 0;
  DestRect.right := m_nWidth;
  DestRect.bottom := m_nHeight;
  SrcRect.Left := 0;
  SrcRect.Top := 0;
  SrcRect.right := m_bkImage.GetWidth();
  SrcRect.bottom := m_bkImage.GetHeight();
  NineRect.Left := m_bkNineRect.x;
  NineRect.Top := m_bkNineRect.y;
  NineRect.right := m_bkNineRect.x + m_bkNineRect.Width;
  NineRect.bottom := m_bkNineRect.y + m_bkNineRect.Height;
  DrawNineRect(Graphics, m_bkImage, DestRect, SrcRect, NineRect);
end;

procedure TSkinForm.DrawNineRect(const Graphics: TGPGraphics; const Image: TGPImage; DestRect, SrcRect, NineRect: TRect);
var
  x, y, nWidth, nHeight: Integer;
  xSrc, ySrc, nSrcWidth, nSrcHeight: Integer;
  nDestWidth, nDestHeight: Integer;
begin
  // g.DrawImage(m_bkImage,rcF,SrcF.X,SrcF.Y,SrcF.Width,SrcF.Height,UnitPixel);
  nDestWidth := DestRect.right - DestRect.Left;
  nDestHeight := DestRect.bottom - DestRect.Top;
  nDestWidth := DestRect.right - DestRect.Left;
  nDestHeight := DestRect.bottom - DestRect.Top;
  // 左上-------------------------------------;
  x := DestRect.Left;
  y := DestRect.Top;
  nWidth := NineRect.Left - SrcRect.Left;
  nHeight := NineRect.Top - SrcRect.Top;
  xSrc := SrcRect.Left;
  ySrc := SrcRect.Top;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nWidth, nHeight);
  // 上-------------------------------------;
  x := DestRect.Left + NineRect.Left - SrcRect.Left;
  nWidth := nDestWidth - nWidth - (SrcRect.right - NineRect.right);
  xSrc := NineRect.Left;
  nSrcWidth := NineRect.right - NineRect.Left;
  nSrcHeight := NineRect.Top - SrcRect.Top;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nSrcWidth, nSrcHeight);
  // 右上-------------------------------------;
  x := DestRect.right - (SrcRect.right - NineRect.right);
  nWidth := SrcRect.right - NineRect.right;
  xSrc := NineRect.right;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nWidth, nHeight);
  // 左-------------------------------------;
  x := DestRect.Left;
  y := DestRect.Top + NineRect.Top - SrcRect.Top;
  nWidth := NineRect.Left - SrcRect.Left;
  nHeight := DestRect.Top + nDestHeight - y - (SrcRect.bottom - NineRect.bottom);
  xSrc := SrcRect.Left;
  ySrc := NineRect.Top;
  nSrcWidth := NineRect.Left - SrcRect.Left;
  nSrcHeight := NineRect.bottom - NineRect.Top;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nSrcWidth, nSrcHeight);
  // 中-------------------------------------;
  x := DestRect.Left + NineRect.Left - SrcRect.Left;
  nWidth := nDestWidth - nWidth - (SrcRect.right - NineRect.right);
  xSrc := NineRect.Left;
  nSrcWidth := NineRect.right - NineRect.Left;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nSrcWidth, nSrcHeight);
  // 右-------------------------------------;
  x := DestRect.right - (SrcRect.right - NineRect.right);
  nWidth := SrcRect.right - NineRect.right;
  xSrc := NineRect.right;
  nSrcWidth := SrcRect.right - NineRect.right;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nSrcWidth, nSrcHeight);
  // 左下-------------------------------------;
  x := DestRect.Left;
  y := DestRect.Top + nDestHeight - (SrcRect.bottom - NineRect.bottom);
  nWidth := NineRect.Left - SrcRect.Left;
  nHeight := SrcRect.bottom - NineRect.bottom;
  xSrc := SrcRect.Left;
  ySrc := NineRect.bottom;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nWidth, nHeight);
  // 下-------------------------------------;
  x := DestRect.Left + NineRect.Left - SrcRect.Left;
  nWidth := nDestWidth - nWidth - (SrcRect.right - NineRect.right);
  xSrc := NineRect.Left;
  nSrcWidth := NineRect.right - NineRect.Left;
  nSrcHeight := SrcRect.bottom - NineRect.bottom;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nSrcWidth, nSrcHeight);
  // 右下-------------------------------------;
  x := DestRect.right - (SrcRect.right - NineRect.right);
  nWidth := SrcRect.right - NineRect.right;
  xSrc := NineRect.right;
  DrawNineRect(Graphics, Image, x, y, nWidth, nHeight, xSrc, ySrc, nWidth, nHeight);
end;

procedure TSkinForm.DrawNineRect(const Graphics: TGPGraphics; const Image: TGPImage; x, y, w, h, srcx, srcy, srcw, srch: Integer);
var
  rcF, SrcF: TGPRectF;
begin
  rcF.x := x;
  rcF.y := y;
  rcF.Width := w;
  rcF.Height := h;
  SrcF.x := srcx;
  SrcF.y := srcy;
  SrcF.Width := srcw;
  SrcF.Height := srch;
  Graphics.DrawImage(Image, rcF, SrcF.x, SrcF.y, SrcF.Width, SrcF.Height, UnitPixel);
end;

procedure TSkinForm.AddModuleButton(CtlID: Integer; Caption, ResName: string);
var
  nIndex: Integer;
begin
  nIndex := CreateControl(SCT_MODULEBUTTON, m_ModuleLeft, 24, 72, 76, CtlID);
  m_ModuleLeft := m_ModuleLeft + m_ControlArray[nIndex].Width + 5;
  SetControlText(nIndex, Caption);
  SetControlImage(nIndex, ResName);
end;

procedure TSkinForm.AddButton(CtlID: Integer; ResName: string; x, y, w, h: Integer; const st: SkinControlType = SCT_NULL);
var
  nIndex: Integer;
begin
  nIndex := CreateControl(st, x, y, w, h, CtlID);
  SetControlImage(nIndex, ResName);
end;

procedure TSkinForm.AddText(sText: string; CtlID, x, y, w, h: Integer);
var
  nIndex: Integer;
begin
  nIndex := CreateControl(SCT_TEXT, x, y, w, h, CtlID);
  SetControlText(nIndex, sText);
end;

procedure TSkinForm.SetModuleCheck(CtlID: Integer);
var
  i: Integer;
begin
  for i := 0 to m_ControlCount - 1 do
  begin
    if m_ControlArray[i].SCType = SCT_MODULEBUTTON then
    begin
      if m_ControlArray[i].CtlID = CtlID then
      begin
        m_ControlArray[i].bCheck := True;
        DrawControlEx(i);
      end
      else if m_ControlArray[i].bCheck then
      begin
        m_ControlArray[i].bCheck := False;
        DrawControlEx(i);
      end;
    end;
  end;
end;

procedure TSkinForm.SetControlText(nIndex: Integer; strText: string);
var
  nLen: Integer;
begin
  if (nIndex < 0) or (nIndex >= m_ControlCount) then
    exit;
  m_ControlArray[nIndex].Caption := strText;
  // ----------------------
  if strText = '' then
  begin
    m_ControlArray[nIndex].WCaption := '';
    m_ControlArray[nIndex].wstrLength := 0;
  end
  else
  begin
    m_ControlArray[nIndex].WCaption := strText;
    m_ControlArray[nIndex].wstrLength := Length(strText);

    { nLen := MultiByteToWideChar(936, 1, PChar(@strText[1]), -1, nil, 0);
      SetLength(m_ControlArray[nIndex].WCaption, nLen - 1);
      if nLen > 1 then
      MultiByteToWideChar(936, 1, PChar(@strText[1]), -1,
      PWideChar(@m_ControlArray[nIndex].WCaption[1]), nLen - 1);
      m_ControlArray[nIndex].wstrLength := nLen; }
  end;

end;

procedure TSkinForm.SetControlImage(nIndex: Integer; ResName: string);
begin
  if (nIndex < 0) or (nIndex >= m_ControlCount) then
    exit;
  if m_ControlArray[nIndex].bImage then
  begin
    m_ControlArray[nIndex].Image.destroy();
    m_ControlArray[nIndex].Image.Free();
    m_ControlArray[nIndex].bImage := False;
  end;
  m_ControlArray[nIndex].Image := TGPImage.Create(ResName);
  m_ControlArray[nIndex].bImage := True;

end;

function TSkinForm.CreateRoundPath(x, y, w, h, cornerRadius: Single): TGPGraphicsPath;
var
  path1: TGPGraphicsPath;
begin
  path1 := TGPGraphicsPath.Create();
  path1.AddArc(x, y, cornerRadius * 2, cornerRadius * 2, 180, 90); // 左上
  path1.AddArc(x + w - cornerRadius * 2, y, cornerRadius * 2, cornerRadius * 2, 270, 90); // 右上
  path1.AddArc(x + w - cornerRadius * 2, y + h - cornerRadius * 2, cornerRadius * 2, cornerRadius * 2, 0, 90); // 右下
  path1.AddArc(x, y + h - cornerRadius * 2, cornerRadius * 2, cornerRadius * 2, 90, 90); // 左下
  path1.CloseFigure();
  Result := path1;
end;


// --- FormEx ---
procedure TSkinFormEx.WMCreate(var Message: TWMCreate);
begin
  inherited;
  // 防止xp 、vista、win7 用主题绘制窗口nc区
  // vista、win7厚边框问题解决办法
  SetWindowTheme(Handle, '', '');
end;

procedure TSkinFormEx.WMNCActivate(var Message: TWMNCActivate);
begin
  // 这里不能用默认处理
  Message.Result := 1;
end;

procedure TSkinFormEx.WMNCPaint(var Message: TWMNCPaint);
begin
  Message.Result := 1;
end;

procedure TSkinFormEx.CreateParams(var Params: TCreateParams);
begin
  inherited CreateParams(Params);
  Params.Style := Params.Style or WS_CLIPCHILDREN or WS_CLIPSIBLINGS;
  Params.Style := Params.Style and (not WS_CAPTION);
  Params.Style := Params.Style and (not WS_BORDER);
  Params.ExStyle := Params.ExStyle or WS_EX_CLIENTEDGE;
  Params.WinClassName := 'JMUI_Frame_Ex';
end;

procedure TSkinFormEx.WMNchist(var Msg: TMessage);
const
  brd = 4;
var
  MouseX, MouseY: Integer;
begin
  MouseX := LOWORD(Msg.LParam);
  MouseY := HIWORD(Msg.LParam);
  if (MouseX >= Left + Width - brd) and (MouseY >= Top + Height - brd) then
    Msg.Result := HTBOTTOMRIGHT
  else if (MouseX <= Left + brd) and (MouseY <= Top + brd) then
    Msg.Result := HTTOPLEFT
  else if (MouseX <= Left + brd) and (MouseY >= Top + Height - brd) then
    Msg.Result := HTBOTTOMLEFT
  else if MouseX >= Left + Width - brd then
    Msg.Result := HTRIGHT
  else if MouseX <= Left + brd then
    Msg.Result := HTLEFT
  else if MouseY >= Top + Height - brd then
    Msg.Result := HTBOTTOM
  else if MouseY <= Top + brd then
    Msg.Result := HTTOP
  else
    inherited;
end;

procedure TSkinFormEx.WMNCCalcSize(var Message: TWMNCCalcSize);
var
  xx: Integer;
begin
  // 修改非客户区(标题栏、窗口边框)尺寸
  if IsZoomed(Handle) then
  begin
    with Message.CalcSize_Params^.rgrc[0] do
    begin
      xx := Abs(Left);
      inc(Left, xx);
      inc(Top, xx);
      Dec(Right, xx);
      Dec(Bottom, xx);
    end;
  end;
  if Message.CalcValidRects then
  begin
    Message.CalcSize_Params^.rgrc[2] := Message.CalcSize_Params^.rgrc[1];
    Message.CalcSize_Params^.rgrc[1] := Message.CalcSize_Params^.rgrc[0];
  end;
  Message.Result := 1;
  //inherited;
end;

procedure TSkinFormEx.WMNCUAHDrawCaption(var Msg: TMessage);
begin
  Msg.Result := 1;
end;

procedure TSkinFormEx.WMNCUAHDrawFrame(var Msg: TMessage);
begin
  Msg.Result := 1;
end;

end.

