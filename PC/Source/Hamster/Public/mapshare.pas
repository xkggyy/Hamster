{ ******************************************************* }
{ 内存映像共享数据单元 }
{ ******************************************************* }
unit mapshare;

interface

uses
  windows,
  messages;

const
  // 自定义消息
  WM_H_MOVE_WINDOW = WM_USER + 7001;
  WM_H_MIN_WINDOW = WM_USER + 7002;
  WM_H_MAX_WINDOW = WM_USER + 7003;
  // qq 群发相关消息
  WM_OPENDIR = WM_USER + 5004;                    // 打开QQ群快捷方式目录
  WM_QQMSG = WM_USER + 5005;                      // 自动发送QQ消息
  WM_GET_GROUP = WM_USER + 5006;                  // 获取群

  // 微信群发相关消息
  WM_GET_WX_GROUP = WM_USER + 5007;
  WM_SEND_WX = WM_USER + 5008;
  WM_STOP = WM_USER + 5009;
  // 打开EXCEL文档
  WM_OPEN_EXCEL = WM_USER + 5010;
  WM_READ_ROW = WM_USER + 5011;
  WM_READ_ALL=WM_USER+5012;

  WM_INIMAIN = WM_USER + 8101;                    // 窗口建立的初始化消息
  WM_SHOW_TK_LOGIN = WM_USER + 8102;              // 显示淘宝登陆窗口
  WM_GET_TK_COOKIE = WM_USER + 8103;              // 获取淘宝登账户登陆后的cookie
  WM_TOTKURL = WM_USER + 8104;                    // 单个链接赚淘客链接
  WM_GETIMG = WM_USER + 8105;                     // 下载图片并返回地址
  WM_GETMMID = WM_USER + 8106;                    // 获取mmid
  WM_OPENURL = WM_USER + 8107;                    // 打开URL
  WM_GETRPT = WM_USER + 8108;                     // 获取报表数据
  WM_GET_COMMONCAMPAIGNBYITEMID = WM_USER + 8109; // 获取定向计划列表，以JSON格式返回；
  WM_APPLYFORCOMMONCAMPAIGN = WM_USER + 8112;     //  申请定向计划,POST方式提交
  WM_PROMOTIONINFO = WM_USER + 8113;              // 根据MemberId获取店铺信息
  WM_SEARCH = WM_USER + 8114;                     // 获取商品详细信息
  WM_TK_SHUTDOWN=WM_USER+8115; //关机
  WM_TK_HTTP_GET=WM_USER+8116;//GET请求方式
  WM_TK_HTTP_POST=WM_USER+8117;//POST请求方式

  WM_TK_HGETTKINFO = WM_USER + 8110;
  WM_TK_HAUTOCREATETK = WM_USER + 8111;


  MappingFileName = '{C7F46FCE-7B24-4DFA-90D9-8F9E9EEBAC56}';
  IceMutex = '{2165109E-F55A-45AD-BADD-11AF9D44D6CA}';
  IceMutexLauncher = '{2B6298AD-9ED2-490F-BD78-1AAC63A875A3}';

type
  TShareMem = record
    MHWND: HWND;                                  // 主窗口句柄
    LHWND: HWND;                                  // Launcher窗口句柄
    INDATA: array[0..100000] of Char;
    OUTDATA: array[0..100000] of Char;
    RET: Integer;
  end;

  PShareMem = ^TShareMem;

function CheckForPrevInstance: Boolean;            // 判断程序是否启动 已经启动返回 false

function CheckForPrevInstanceLauncher: Boolean;

procedure ClearUpCheckForPrevInstance;

procedure ClearUpCheckForPrevInstanceLauncher;

procedure CopyMChar(p1: string; inout: Byte = 0);

var
  hMapObj: THandle;
  Mutex, MutexLauncher: Cardinal;
  pShMem: PShareMem;

implementation

procedure CopyMChar(p1: string; inout: Byte = 0);
begin
  // 拷贝字符到内存因子中
  with pShMem^ do
  begin
    if inout = 0 then
    begin
      FillChar(INDATA, 100000, 0);
      CopyMemory(@(INDATA), PChar(p1), Length(p1) * SizeOf(Char));
    end
    else
    begin
      FillChar(OUTDATA, 100000, 0);
      CopyMemory(@(OUTDATA), PChar(p1), Length(p1) * SizeOf(Char));
    end;
  end;
end;

procedure OpenMap;
begin
  // 打开内存映像
  hMapObj := OpenFileMapping(FILE_MAP_WRITE, False, PChar(MappingFileName));

  if hMapObj = 0 then
    hMapObj := CreateFileMapping($FFFFFFFF, nil, PAGE_READWRITE, 0, SizeOf(TShareMem), PChar(MappingFileName));

  pShMem := PShareMem(MapViewOfFile(hMapObj, FILE_MAP_ALL_ACCESS, 0, 0, 0));
  if pShMem = nil then
  begin
    CloseHandle(hMapObj);
    Halt;
  end;

  // FillChar(pShMem^, SizeOf(TShareMem), 0);
end;

procedure CloseMap;
begin
  // 关闭内存映像
  if pShMem <> nil then
    UnmapViewOfFile(pShMem);
  if hMapObj <> 0 then
    CloseHandle(hMapObj);
end;

function CheckForPrevInstance: Boolean;
begin
  // 检测程序是否已经运行
  Mutex := CreateMutex(nil, True, PChar(IceMutex));
  Result := (Mutex <> 0) and (GetLastError = 0);
end;

procedure ClearUpCheckForPrevInstance;
begin
  if Mutex <> 0 then
  begin
    CloseHandle(Mutex);
    Mutex := 0;
  end;
end;

function CheckForPrevInstanceLauncher: Boolean;
begin
  // 检测程序是否已经运行
  MutexLauncher := CreateMutex(nil, True, PChar(IceMutexLauncher));
  Result := (MutexLauncher <> 0) and (GetLastError = 0);
end;

procedure ClearUpCheckForPrevInstanceLauncher;
begin
  if MutexLauncher <> 0 then
  begin
    CloseHandle(MutexLauncher);
    MutexLauncher := 0;
  end;
end;


initialization
  OpenMap;

finalization
  CloseMap;

end.

