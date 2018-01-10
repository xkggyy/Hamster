unit jsapp;

interface

uses
  Winapi.Windows,
  Winapi.Messages,
  System.SysUtils,
  Common,
  mapshare,
  pubCon;

type
  // 扩展
  TApp = class
    // 窗口操作
    class function hWMove: Integer;
    class function hWMin: Integer;
    class function hWMax: Integer;
    class function hExitApp: Integer;
    // 显示淘宝登陆窗口
    class function hShowTkLogin: Integer;
    // 获取tkuserinfo
    class function hGetTkInfo: Integer;
    // 自动建立导购名和渠道名
    class function hautoCreateTk(qq: string): Integer;
    // 转换成自己的佣金地址
    class function hToTkUrl(fun: string): Integer;
    // 下载图片并返回地址
    class function hGetImg(sUrl: string): string;
    // 获取MMID
    class function hGetMmid: string;
    // 使用默认浏览器打开URL
    class function hOpenUrl(sUrl: string): Integer;
    // 获取当前报表数据
    class function hGetRpt(t: Integer): string;
    // 获取定向计划列表，以JSON格式返回；
    class function hGetCommoncampaignbyitemid(iid: string): string;
    // 申请定向计划,POST方式提交
    class function hApplyforcommoncampaign(s: string): string;
    // 根据MemberId获取店铺信息
    class function hPromotioninfo(mid: string): string;
    // 获取商品详情
    class function hSearch(s: string): string;
    // 打开QQ群快捷方式目录
    class function hOpenDir: Integer;
    // 开始群发QQ消息
    class function hSendQQMsg(name: string): Integer;
    // 获取QQ群
    class function hGetQQGroup: string;
    // 获取微信群
    class function hGetWXGroup: string;
    // 发送微信消息
    class function hSendWxMsg(name: string): Integer;
    // 打开excel文档
    class function hOpenExcel: Integer;
    // 根据行号读取EXCEL文档内容并封装成JSON格式
    class function hReadRow(iid: string): string;
    //读取excel全部内容 并返回JSON格式字符串
    class function hReadAll():string;
    //读取httpGet数据 并返回信息
    class function hHttpGet(url:string):string;
    class function hHttpPost(json:string):string;
  end;

implementation

// 鼠标按下
class function TApp.hWMove: Integer;
begin
  Result := SendMessage(pShMem^.MHWND, WM_H_MOVE_WINDOW, 0, 0);
end;

class function TApp.hWMin: Integer;
begin
  Result := SendMessage(pShMem^.MHWND, WM_H_MIN_WINDOW, 0, 0);
end;

class function TApp.hWMax: Integer;
begin
  Result := SendMessage(pShMem^.MHWND, WM_H_MAX_WINDOW, 0, 0);
end;

class function TApp.hExitApp: Integer;
begin
  // 退出小仓鼠
  Result := SendMessage(pShMem^.MHWND, WM_CLOSE, 0, 0);
end;

class function TApp.hShowTkLogin: Integer;
begin
  // 显示淘宝登陆窗口
  SendMessage(pShMem^.MHWND, WM_SHOW_TK_LOGIN, 0, 0);
  Result := pShMem^.ret;
end;

class function TApp.hGetTkInfo: Integer;
begin
  // 获取淘客信息
  SendMessage(pShMem^.MHWND, WM_TK_HGETTKINFO, 0, 0);
  Result := pShMem^.ret;
end;

class function TApp.hautoCreateTk(qq: string): Integer;
begin
  // 自动建立广告位
  CopyMChar(qq);
  Result := SendMessage(pShMem^.MHWND, WM_TK_HAUTOCREATETK, 0, 0);
end;

class function TApp.hToTkUrl(fun: string): Integer;
begin
  with pShMem^ do
  begin
    CopyMChar(fun);       // json数据
    if PostMessage(MHWND, WM_TOTKURL, 0, 0) then
      Result := 1
    else
      Result := 0;
  end;
end;

// 下载图片并返回地址
class function TApp.hGetImg(sUrl: string): string;
begin
  with pShMem^ do
  begin
    CopyMChar(sUrl);
    SendMessage(MHWND, WM_GETIMG, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 获取MMID
class function TApp.hGetMmid: string;
begin
  with pShMem^ do
  begin
    SendMessage(MHWND, WM_GETMMID, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 使用默认浏览器打开URL
class function TApp.hOpenUrl(sUrl: string): Integer;
begin
  with pShMem^ do
  begin
    CopyMChar(sUrl);
    Result := SendMessage(MHWND, WM_OPENURL, 0, 0);
  end;
end;

// 获取当前报表数据
class function TApp.hGetRpt(t: Integer): string;
begin
  with pShMem^ do
  begin
    ret := t;
    SendMessage(MHWND, WM_GETRPT, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 获取定向计划列表，以JSON格式返回；
class function TApp.hGetCommoncampaignbyitemid(iid: string): string;
begin
  with pShMem^ do
  begin
    CopyMChar(iid);
    SendMessage(MHWND, WM_GET_COMMONCAMPAIGNBYITEMID, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 申请定向计划,POST方式提交
class function TApp.hApplyforcommoncampaign(s: string): string;
begin
  with pShMem^ do
  begin
    CopyMChar(s);
    SendMessage(MHWND, WM_APPLYFORCOMMONCAMPAIGN, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 根据MemberId获取店铺信息
class function TApp.hPromotioninfo(mid: string): string;
begin
  with pShMem^ do
  begin
    CopyMChar(mid);
    SendMessage(MHWND, WM_PROMOTIONINFO, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 获取商品详情
class function TApp.hSearch(s: string): string;
begin
  with pShMem^ do
  begin
    CopyMChar(s);
    SendMessage(MHWND, WM_SEARCH, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

//打开文件夹
class function TApp.hOpenDir: Integer;
begin
  Result := SendMessage(pShMem^.MHWND, WM_OPENDIR, 0, 0);
end;

// 开始群发QQ消息
class function TApp.hSendQQMsg(name: string): Integer;
begin
  with pShMem^ do
  begin
    CopyMChar(name);
    if PostMessage(MHWND, WM_QQMSG, 0, 0) then
      Result := 1
    else
      Result := 0;
  end;
end;

// 获取QQ群
class function TApp.hGetQQGroup: string;
begin
  with pShMem^ do
  begin
    SendMessage(MHWND, WM_GET_GROUP, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 获取微信群
class function TApp.hGetWXGroup: string;
begin
  with pShMem^ do
  begin
    SendMessage(MHWND, WM_GET_WX_GROUP, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

// 发送微信消息
class function TApp.hSendWxMsg(name: string): Integer;
begin
  with pShMem^ do
  begin
    CopyMChar(name);
    if PostMessage(MHWND, WM_SEND_WX, 0, 0) then
      Result := 1
    else
      Result := 0;
  end;
end;

// 打开excel文档  返回行数
class function TApp.hOpenExcel: Integer;
begin
  with pShMem^ do
  begin
    SendMessage(MHWND, WM_OPEN_EXCEL, 0, 0);
    Result := RET;
  end;

end;

// 根据行号读取EXCEL文档内容并封装成JSON格式
class function TApp.hReadRow(iid: string): string;
begin
  with pShMem^ do
  begin
    RET := StrToInt(iid);
    SendMessage(MHWND, WM_READ_ROW, 0, 0);
    Result := StrPas(OUTDATA);
  end;
end;

class function TApp.hReadAll():string;
begin
    with pShMem^ do
    begin
      SendMessage(MHWND,WM_READ_ALL,0,0);
      Result:=StrPas(OUTDATA);
    end;
end;

class function TApp.hHttpGet(url: string):string;
begin
   with pShMem^ do
   begin
      CopyMChar(url);
      SendMessage(MHWND,WM_TK_HTTP_GET,0,0);
      Result:=StrPas(OUTDATA);
   end;
end;

class function TApp.hHttpPost(json:string):string;
begin
   with pShMem^ do
   begin
      CopyMChar(json);
      SendMessage(MHWND,WM_TK_HTTP_POST,0,0);
      Result:=StrPas(OUTDATA);
   end;
end;

end.

