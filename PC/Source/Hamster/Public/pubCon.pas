unit pubCon;

interface

const
  IDM_BUTTON_1 = 8101;
  IDM_BUTTON_2 = 8102;
  IDM_BUTTON_3 = 8103;
  IDM_BUTTON_4 = 8104;
  IDM_BUTTON_5 = 8105;
  IDM_BUTTON_6 = 8106;

  D_MAIN_URL = 'http://www.j1m1.com/index.php/hamster/login';  // 默认首页
  //D_MAIN_URL = 'http://www.iqiyi.com/';
  D_TK_LOGIN = 'https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Fwww.alimama.com%2F&full_redirect=true&disableQuickLogin=true'; // 阿里妈妈登陆地址
  D_TK_USER_INFO = 'http://pub.alimama.com/common/adzone/newSelfAdzone2.json?tag=29&_tb_token_=%s&_input_charset=utf-8';
  D_TK_API_ADZONECREATE = 'http://pub.alimama.com/common/adzone/selfAdzoneCreate.json'; // 建渠道位
  D_TK_API_GUIDEADD = 'http://pub.alimama.com/common/site/generalize/guideAdd.json'; // 建立导购位
  D_TK_MMID = 'http://pub.alimama.com/common/adzone/adzoneManage.json?tab=3&toPage=%s&perPageSize=40&gcid=8&_tb_token_=%s&_input_charset=utf-8'; // 获取MMID
  //  D_TK_API_URLTRANS = 'http://pub.alimama.com/urltrans/urltrans.json?siteid=%s&adzoneid=%s&promotionURL=%s&_tb_token_=%s&_input_charset=utf-8';
  D_TK_API_URLTRANS ='http://pub.alimama.com/common/code/getAuctionCode.json?auctionid=%s&adzoneid=%s&siteid=%s&_tb_token_=%s&scenes=1';   // 获取淘宝客链接接口
  D_TK_GET_RPT = 'http://pub.alimama.com/report/mediaRptByPaging.json?gcId=8&siteId=%s&startTime=%s&endTime=%s&pageNo=1&pageSize=40&_tb_token_=%s&_input_charset=utf-8'; // 获取报表数据
  D_TK_GET_RPT2= 'http://pub.alimama.com/report/mediaRpt.json?gcId=8&siteType=&siteId=%s&startTime=%s&endTime=%s&pvid=&_tb_token_=%s&_input_charset=utf-8';
  D_TK_GET_COMMONCAMPAIGNBYITEMID = 'http://pub.alimama.com/pubauc/getCommonCampaignByItemId.json?itemId=%s&_tb_token_=%s';// 获取定向计划列表，以JSON格式返回；
  D_TK_APPLYFORCOMMONCAMPAIGN = 'http://pub.alimama.com/pubauc/applyForCommonCampaign.json'; // 申请定向计划,POST方式提交
  D_TK_PROMOTIONINFO = 'http://pub.alimama.com/pubauc/searchPromotionInfo.json?oriMemberId=%s&blockId=&_tb_token_=%S'; // 根据MemberId获取店铺信息
  D_TK_SEARCH = 'http://pub.alimama.com/items/search.json?q=%s&_tb_token_=%s'; // 根据商品链接获取商品信息
  D_TK_EXCLE='http://pub.alimama.com/favorites/item/export.json?spm=%s&pvid=%s&actionid=%s&scenes=1&adzoneId=%s&siteId=s%&groupId=%s'; //导出excle地址
  D_TK_USER_INFO2='http://pub.alimama.com/common/getUnionPubContextInfo.json' ;//获取联盟用户信息
  D_TK_PROD_GROUP='http://pub.alimama.com/favorites/group/newList.json?toPage=1&perPageSize=50&keyword=&t=1498486218699&_tb_token_=KPgJkTJfHlq&pvid=11_183.94.119.48_2691_1498486218599';//获取选品库信息
  D_TK_SAVE_GROUP='http://pub.alimama.com/favorites/group/save.json' ;//创建选品库分组 grouptype=1是普通分组，2是高佣分组  FormData:groupTitle=aaaaa&groupType=2&t=1498487410150&_tb_token_=KPgJkTJfHlq&pvid=11_183.94.119.48_1352_1498487365903
  otherAdzones_name = '积米淘客联盟';
  otherAdzones_sub_name = '积米淘客推广位';

  regSoftPath = 'Software\Hamster';
implementation

end.


