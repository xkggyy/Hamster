unit Common;

interface

uses
  Windows,
  SysUtils,
  Classes,
  Registry,
  System.Win.ComObj,
  Messages,
  IniFiles,
  ShlObj,
  DateUtils,
  CnCommon;

function GetCookie(url: string): string;

procedure LoadHookFlash;
// 运行一个文件并返回进程句柄

function WinExecuteEx(FileName: string; Visibility: Integer = SW_NORMAL): DWORD;
// 获取IE的版本

function GetIeV: DWORD;
// 读取注册表string值

function readReg(var destStr: string; keyName, keyPath: string; rootKey: HKEY): Boolean; overload;

function readReg(var destStr: Integer; keyName, keyPath: string; rootKey: HKEY): Boolean; overload;

function readReg(var destStr: TDateTime; keyName, keyPath: string; rootKey: HKEY): Boolean; overload;
// 写入注册表string值

function writeReg(destStr: string; keyName, keyPath: string; rootKey: HKEY): Boolean; overload;

function writeReg(destStr: TDateTime; keyName, keyPath: string; rootKey: HKEY): Boolean; overload;
// 写入注册表DWORD值

function writeDword(destDword: DWORD; keyName, keyPath: string; rootKey: HKEY): Boolean;
// 删除注册表

function DeleteReg(keyName: string; rootKey: HKEY): Boolean;
// 判断是否win7 64位系统

function IsWin64: Boolean;

// 发送统计信息
function cin(t: Integer): Integer; stdcall; external 'cnt.dll';

// CTRL + V
procedure cv(const esc: Boolean = True);

procedure send(h: DWORD);
implementation

procedure LoadHookFlash;
var
  hModule: DWORD;
begin
  hModule := LoadLibrary('HookFlash.dll');
end;
// 运行一个文件并返回进程句柄

function WinExecuteEx(FileName: string; Visibility: Integer = SW_NORMAL): DWORD;
var
  StartupInfo: TStartupInfo;
  ProcessInfo: TProcessInformation;
begin
  FillChar(StartupInfo, SizeOf(StartupInfo), #0);
  StartupInfo.cb := SizeOf(StartupInfo);
  StartupInfo.dwFlags := STARTF_USESHOWWINDOW;
  StartupInfo.wShowWindow := Visibility;
  CreateProcess(nil, PChar(FileName), nil, nil, False, CREATE_NEW_CONSOLE or NORMAL_PRIORITY_CLASS, nil, nil, StartupInfo, ProcessInfo);
  Result := ProcessInfo.hProcess;

end;

function GetCookie(url: string): string;
const
  INTERNET_COOKIE_HTTPONLY = $00002000;
  INTERNET_COOKIE_THIRD_PARTY = $00000010;
  INTERNET_FLAG_RESTRICTED_ZONE = $00020000;
var
  hModule: THandle;
  InternetGetCookieEx: function(lpszUrl, lpszCookieName, lpszCookieData: PChar; var lpdwSize: DWORD; dwFlags: DWORD; lpReserved: Pointer): BOOL; stdcall;
  CookieSize: DWORD;
  cookiedata: PWideChar;
  thebool: bool;
begin
  result := '';
  hModule := GetModuleHandle('wininet.dll');
  if hModule <> 0 then
  begin
    @InternetGetCookieEx := GetProcAddress(hModule, 'InternetGetCookieExW');
    if @InternetGetCookieEx <> nil then
    begin
      CookieSize := 10240;
      cookiedata := AllocMem(CookieSize);
      thebool := InternetGetCookieEx(PWideChar(url), nil, cookiedata, CookieSize, INTERNET_COOKIE_HTTPONLY, nil);
      if thebool then
        result := cookiedata;
      FreeMem(cookiedata);
    end;
    FreeLibrary(hModule);
  end;
end;

// 获取IE的版本
function GetIeV: DWORD;
var
  szVersion: string;
  dwIeKenel: DWORD;
begin
  Result := 0;
  szVersion := RegReadStringDef(HKEY_LOCAL_MACHINE, 'SOFTWARE\Microsoft\Internet Explorer', 'svcVersion', '');
  if szVersion = '' then
    szVersion := RegReadStringDef(HKEY_LOCAL_MACHINE, 'SOFTWARE\Microsoft\Internet Explorer', 'Version', '8.0');

  if InStr('.', szVersion) then
  begin
    szVersion := Copy(szVersion, 1, Pos('.', szVersion) - 1);
    dwIeKenel := StrToInt(szVersion);
    if dwIeKenel > 10 then
      dwIeKenel := 10;
    dwIeKenel := dwIeKenel * 10000;
    Result := dwIeKenel;
  end;
end;

{ -------------------------------------------------------------------------------
  日期:      2014-1-24 17:34:53
  说明:      检测windows版本
  ------------------------------------------------------------------------------- }

function IsWin64: Boolean;
var
  Kernel32Handle: THandle;
  IsWow64Process: function(Handle: Windows.THandle; var Res: Windows.BOOL): Windows.BOOL; stdcall;
  GetNativeSystemInfo: procedure(var lpSystemInfo: TSystemInfo); stdcall;
  isWoW64: BOOL;
  SystemInfo: TSystemInfo;
const
  PROCESSOR_ARCHITECTURE_AMD64 = 9;
  PROCESSOR_ARCHITECTURE_IA64 = 6;
begin
  Kernel32Handle := GetModuleHandle('KERNEL32.DLL');
  if Kernel32Handle = 0 then
    Kernel32Handle := LoadLibrary('KERNEL32.DLL');
  if Kernel32Handle <> 0 then
  begin
    IsWow64Process := GetProcAddress(Kernel32Handle, 'IsWow64Process');
    GetNativeSystemInfo := GetProcAddress(Kernel32Handle, 'GetNativeSystemInfo');
    if Assigned(IsWow64Process) then
    begin
      IsWow64Process(GetCurrentProcess, isWoW64);
      Result := isWoW64 and Assigned(GetNativeSystemInfo);
      if Result then
      begin
        GetNativeSystemInfo(SystemInfo);
        Result := (SystemInfo.wProcessorArchitecture = PROCESSOR_ARCHITECTURE_AMD64) or (SystemInfo.wProcessorArchitecture = PROCESSOR_ARCHITECTURE_IA64);
      end;
    end
    else
      Result := False;
  end
  else
    Result := False;
end;

{ -------------------------------------------------------------------------------
  日期:      2014-1-22 9:58:20
  说明:      读取注册表值
  ------------------------------------------------------------------------------- }
function readReg(var destStr: string; keyName, keyPath: string; rootKey: HKEY): Boolean;
var
  _reg: TRegistry;
begin
  Result := False;
  _reg := TRegistry.Create;
  try
    _reg.rootKey := rootKey;
    Result := _reg.OpenKey(keyPath, True);
    destStr := _reg.ReadString(keyName);
    _reg.CloseKey;
  finally
    _reg.Free;
  end;
end;

function readReg(var destStr: Integer; keyName, keyPath: string; rootKey: HKEY): Boolean;
var
  _reg: TRegistry;
begin
  Result := False;
  _reg := TRegistry.Create;
  try
    _reg.rootKey := rootKey;
    Result := _reg.OpenKey(keyPath, True);
    destStr := _reg.ReadInteger(keyName);
    _reg.CloseKey;
  finally
    _reg.Free;
  end;
end;

function readReg(var destStr: TDateTime; keyName, keyPath: string; rootKey: HKEY): Boolean;
var
  reg: TRegistry;
begin
  Result := False;
  try
    reg := TRegistry.Create;
    reg.rootKey := rootKey;
    Result := reg.OpenKey(keyPath, True);
    if reg.ValueExists(keyName) then
      destStr := reg.ReadDateTime(keyName);
    reg.CloseKey;
    reg.Free;
  except

  end;
end;
{ -------------------------------------------------------------------------------
  日期:      2014-1-22 9:58:31
  说明:      写入注册表值
  ------------------------------------------------------------------------------- }

function writeReg(destStr: string; keyName, keyPath: string; rootKey: HKEY): Boolean;
var
  _reg: TRegistry;
begin
  Result := False;
  _reg := TRegistry.Create;
  try
    _reg.rootKey := rootKey;
    Result := _reg.OpenKey(keyPath, True);
    _reg.WriteString(keyName, destStr);
    _reg.CloseKey;
  finally
    _reg.Free;
  end;
end;

function writeReg(destStr: TDateTime; keyName, keyPath: string; rootKey: HKEY): Boolean;
var
  reg: TRegistry;
begin
  Result := False;
  try
    reg := TRegistry.Create;
    reg.rootKey := rootKey;
    Result := reg.OpenKey(keyPath, True);
    reg.WriteDateTime(keyName, destStr);
    reg.CloseKey;
    reg.Free;
  except

  end;
end;

{ -------------------------------------------------------------------------------
  日期:      2014-1-22 9:58:31
  说明:      写入注册表DWORD值
  ------------------------------------------------------------------------------- }

function writeDword(destDword: DWORD; keyName, keyPath: string; rootKey: HKEY): Boolean;
var
  _reg: TRegistry;
begin
  Result := False;
  _reg := TRegistry.Create;
  try
    _reg.rootKey := rootKey;
    Result := _reg.OpenKey(keyPath, True);
    _reg.WriteInteger(keyName, destDword);
    _reg.CloseKey;
  finally
    _reg.Free;
  end;
end;

{ -------------------------------------------------------------------------------
  日期:      2014-1-22 9:58:31
  说明:      删除注册表项
  ------------------------------------------------------------------------------- }
function DeleteReg(keyName: string; rootKey: HKEY): Boolean;
var
  _reg: TRegistry;
begin
  Result := False;
  _reg := TRegistry.Create;
  try
    _reg.rootKey := rootKey;
    _reg.DeleteKey(keyName);
    _reg.CloseKey;
  finally
    _reg.Free;
  end;
end;

procedure cv(const esc: Boolean = True);
begin
  // CTRL + V
  keybd_event(VK_CONTROL, MapVirtualKey(VK_CONTROL, 0), 0, 0);
  keybd_event(Ord('V'), MapVirtualKey(Ord('V'), 0), 0, 0);
  keybd_event(Ord('V'), MapVirtualKey(Ord('V'), 0), KEYEVENTF_KEYUP, 0);
  keybd_event(VK_CONTROL, MapVirtualKey(VK_CONTROL, 0), KEYEVENTF_KEYUP, 0);
  Sleep(1500);
  // alt + s 发送消息
  keybd_event(VK_MENU, MapVirtualKey(VK_MENU, 0), 0, 0);
  keybd_event(Ord('S'), MapVirtualKey(Ord('S'), 0), 0, 0);
  keybd_event(Ord('S'), MapVirtualKey(Ord('S'), 0), KEYEVENTF_KEYUP, 0);
  keybd_event(VK_MENU, MapVirtualKey(VK_MENU, 0), KEYEVENTF_KEYUP, 0);
//  if not ce then
//  begin
//    // 回车
//    keybd_event(VK_RETURN, MapVirtualKey(VK_RETURN, 0), 0, 0);
//    keybd_event(VK_RETURN, MapVirtualKey(VK_RETURN, 0), KEYEVENTF_KEYUP, 0);
//  end
//  else
//  begin
//    // ctrl + 回车
//    keybd_event(VK_CONTROL, MapVirtualKey(VK_CONTROL, 0), 0, 0);
//    keybd_event(VK_RETURN, MapVirtualKey(VK_RETURN, 0), 0, 0);
//    keybd_event(VK_RETURN, MapVirtualKey(VK_RETURN, 0), KEYEVENTF_KEYUP, 0);
//    keybd_event(VK_CONTROL, MapVirtualKey(VK_CONTROL, 0), KEYEVENTF_KEYUP, 0);
//  end;

  if esc then
  begin
    Sleep(1500);
    // ESC
    keybd_event(VK_ESCAPE, MapVirtualKey(VK_ESCAPE, 0), 0, 0);
    keybd_event(VK_ESCAPE, MapVirtualKey(VK_ESCAPE, 0), KEYEVENTF_KEYUP, 0);
  end;
end;

procedure send(h: DWORD);
var
  r: TRect;
  bottom: Integer;
  left: Integer;
begin
  Sleep(500);
  GetWindowRect(h, r);
  left := r.Left;
  bottom := r.Bottom;

  SetCursorPos(left+10,bottom-45);
  mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, GetMessageExtraInfo());
  mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, GetMessageExtraInfo());
  keybd_event(VK_SPACE, MapVirtualKey(VK_SPACE, 0), 0, 0);
  keybd_event(VK_SPACE, MapVirtualKey(VK_SPACE, 0), KEYEVENTF_KEYUP, 0);
  Sleep(500);
  keybd_event(VK_CONTROL, MapVirtualKey(VK_CONTROL, 0), 0, 0);
  keybd_event(Ord('V'), MapVirtualKey(Ord('V'), 0), 0, 0);
  keybd_event(Ord('V'), MapVirtualKey(Ord('V'), 0), KEYEVENTF_KEYUP, 0);
  keybd_event(VK_CONTROL, MapVirtualKey(VK_CONTROL, 0), KEYEVENTF_KEYUP, 0);
  Sleep(1500);
  keybd_event(VK_MENU, MapVirtualKey(VK_MENU, 0), 0, 0);
  keybd_event(Ord('S'), MapVirtualKey(Ord('S'), 0), 0, 0);
  keybd_event(Ord('S'), MapVirtualKey(Ord('S'), 0), KEYEVENTF_KEYUP, 0);
  keybd_event(VK_MENU, MapVirtualKey(VK_MENU, 0), KEYEVENTF_KEYUP, 0);

end;

end.

