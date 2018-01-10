var pageSize = 20; //每页条数
//var flag = true;
var goods = new Array(); //选品库商品数组
var dilog_login;
var reg_dialog;
var selectLength = 50;
var geturlflag=true;

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});
function loadfail() {
    BUI.Message.Alert("网路不通，无法加载数据", 'info');
}
//function getCookie(name) {
//  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//  if (arr = document.cookie.match(reg))
//      return unescape(arr[2]);
//  else
//      return null;
//}
//
//function setCookie(name, value, exp) {
//
//  if (exp != 'undefinded' && exp != null) {
//      var expDate = new Date();
//      expDate.setTime(expDate.getTime() + exp * 60 * 1000);
//      document.cookie = name + "=" + escape(value) + ";expires=" + expDate.toUTCString();
//  } else {
//      document.cookie = name + "=" + value;
//  }
//}
 


//获取商品分类
function couponfen2() {
    var itid;
    $(".goods_classify li").each(function () {
        if ($(this).attr("class") === "nav_btn b_menu_h") {
            itid = $(this).attr("data-itid");
        }
    });
    //    alert(itid);
    return itid;
}
//商品分类
function couponfen() {
    $(".goods_classify li").each(function () {
        $(this).click(function () {
            var itid = $(this).attr("data-itid");
            $(this).siblings().removeClass("b_menu_h");
            $(this).addClass("b_menu_h");
            var data = {
                sxid: goodsScreen2(),
                itid: itid,
                pageSize: pageSize,
                pageIndex: 1
            };
            $("#listView").html(""); //清空所有商品
            getList(data); //加载商品
        });
    });
}
//获取高级筛选已勾选
function goodsScreen2() {
    var xx = "";
    $("input[name='shaixuan']:checked").each(function () {
        xx += $(this).attr("data-sxid") + ",";
    });
    xx = xx.substr(0, xx.lastIndexOf(","));
    return xx;
}
//高级筛选
function goodsScreen() {
    $(".goods_filter ul li").each(function () {
        $(this).find("input").click(function () {
            var data = {
                sxid: goodsScreen2(),
                itid: couponfen2(),
                pageSize: pageSize,
                pageIndex: 1
            };
            $("#listView").html(""); //清空所有商品
            getList(data);
        });
    });
}
// 获取最小价格
function getMinPrice() {
    var minPrice = $(".goods_filter_jsx p input:nth-child(1)").val();
    return minPrice;
}
// 获取最高价格
function getMaxPrice() {
    var maxPrice = $(".goods_filter_jsx p input:nth-child(2)").val();
    return maxPrice;
}
// 获取佣金比例
function getYjScale() {
    var yjScale = $(".goods_filter_jsx p input:nth-child(3)").val();
    return yjScale;
}
// 获取销量
function getSalesVolume() {
    var salesVolume = $(".goods_filter_jsx p input:nth-child(4)").val();
    return salesVolume;
}
// 点击筛选，筛选价格、佣金比例、销量
function clickSx() {
    $(".goods_shaixuan_submit").click(function () {
        var data = {
            minPrice: getMinPrice(),
            maxPrice: getMaxPrice(),
            yjScale: getYjScale(),
            salesVolume: getSalesVolume(),
            itid: couponfen2(),
            sxid: goodsScreen2(),
            pageSize: pageSize,
            pageIndex: 1
        };
        $("#listView").html(""); //清空所有商品
        getList(data);
    });
}

function search(pageSize, pageIndex, isReload) {
    if (isReload) {
        $("#listView").html("");
    }
    //var kw = $("#kw").val();
    var tcid = $(".bot_menu .b_menu_h").attr("data-cid");
    //    alert(couponfen2());
    var data = {
        //kw: kw,
        minPrice: getMinPrice(),
        maxPrice: getMaxPrice(),
        yjScale: getYjScale(),
        salesVolume: getSalesVolume(),
        itid: couponfen2(),
        sxid: goodsScreen2(),
        tcid: tcid,
        pageSize: pageSize,
        pageIndex: pageIndex
    };
    getList(data);
}

function getList(data) {
    $.ajax({
        url: '/index.php/hamster/index/listView',
        data: data,
        type: 'get',
        dataType: 'html',
        success: function (h) {
            //$("#listView").append(h);
            var o = $(h).appendTo("#listView");
            bindClick(o);
            //            jby();
        },
        error: function (r, s, e) {

        },
        beforeSend: function () {
            //提示加载信息
            if(mask){
                mask.show();
            }
        },
        complete: function () {
            //隐藏加载提示
            // setTimeout(function () {
            //     flag = true;
            // }, 500);
            if(mask){
             mask.hide();
            }
        }
    });
}
var errtimes = 0;
//打开推广窗口回调
function callback(iid, s) {
    setTimeout(function () {
        mask.hide();
        if (s == '302' || s == 'err') {

            errtimes++;
            if (errtimes == 3) {
                BUI.Message.Alert('多次获取失败，请重新登录', 'info');
            } else {
                BUI.Message.Alert('获取失败，请重试', 'info');
            }
            return;
        }
        if (s == '302' || s == 'err') {

            errtimes++;
            if (errtimes == 3) {
                BUI.Message.Alert('多次获取失败，请重新登录', 'info');
            } else {
                BUI.Message.Alert('获取失败，请重试', 'info');
            }
            return;
        }
        if (s == 'ndk') {
            BUI.Message.Alert('操作太快，请稍后再操作', 'info');
            return;
        }
        if (s == 'nck') {
            BUI.Message.Alert('淘宝登录超时', function () {
                TApp.hShowTkLogin();
            }, 'info');
            return;
        }
        if (s == 'ntk') {
            BUI.Message.Alert('您还不是淘宝客，所以无法使用我们的工具', 'info');
            return;
        }
        errtimes = 0;
        console.log(s);
        var data = s.data;
        if (data != undefined) {
            _t.attr("data-taoToken", data.taoToken);
            _t.attr("data-shortLinkUrl", data.shortLinkUrl);
            _t.attr("data-couponShortLinkUrl", data.couponShortLinkUrl);
            _t.attr("data-couponLinkTaoToken", data.couponLinkTaoToken);
            _t.attr("data-clickUrl", data.clickUrl);
            _t.attr("data-couponLink", data.couponLink);
            _t.attr("data-qrCodeUrl", data.qrCodeUrl);
        }
        showDetail(_t);
    }, 1000);
}

//选取时使用的回调
function fcallback(iid, s) {
    //mask.set('msg','1111');
    setTimeout(function () {
        mask.set('text', '正在获取您的推广链接...');
    }, 1000)
    setTimeout(function () {
        mask.hide();
        if (s == '302' || s == 'err') {

            errtimes++;
            if (errtimes == 3) {
                BUI.Message.Alert('多次获取失败，请重新登录', 'info');
            } else {
                BUI.Message.Alert('获取失败，请重试', 'info');
            }
            return;
        }
        if (s == 'ndk') {
            BUI.Message.Alert('操作太快，请稍后再操作', 'info');
            return;
        }
        if (s == 'nck') {
            BUI.Message.Alert('淘宝登录超时', function () {
                TApp.hShowTkLogin();
            }, 'info');
            return;
        }
        if (s == 'ntk') {
            BUI.Message.Alert('您还不是淘宝客，所以无法使用我们的工具', 'info');
            return;
        }
        errtimes = 0;
        var data = s.data;

        $.each(equeue, function (i, o) {
            if (o.tid == iid) {
                o.c.attr("data-taoToken", data.taoToken);
                o.c.attr("data-qrCodeUrl", data.qrCodeUrl);
                o.c.attr("data-couponLinkTaoToken", data.couponLinkTaoToken);
                o.c.attr("data-shortLinkUrl", data.shortLinkUrl);
                o.c.attr("data-couponShortLinkUrl", data.couponShortLinkUrl);
                o.c.attr("data-clickUrl", data.clickUrl);
                o.c.attr("data-couponLink", data.couponLink);
                cfly(o.c, o.id, o.e);
                equeue.splice(i, 1);
                return false;
            }
        });
    }, 2000);
}

function getDxInfo() {
    var data = TApp.hGetCommoncampaignbyitemid(_tid);
    // alert(data)
    data = eval("(" + data + ")");
    data = data.data;
    if (typeof (data.length) == 'undefined') {
        data = new Array();
    }
    store.setResult(data)
}

function shopDetail(data) {
    var shopdiv = $("#shopdiv");
    if (shopdiv.length == 0) {
        var html = "<div id=\"shopdiv\" style='display:hidden;position:absolute;background:#fff;border:1px solid #cdcdcd;padding:4px 8px;'> </div>"
        shopdiv = $(html).appendTo("body");
    } else {
        shopdiv = $("#shopdiv")
    }

    var titleimg = "<img src='" + data.SellLevelPicture[0] + "' />"
    var shoptile = "<div>经营类目:<span style='color:red'>" + data.Ind[0] + "</span></div>"
    var line = "<div>描述相符:" + data.MerchandisAvgScore[0] + "&nbsp;&nbsp;&nbsp;" + (data.MerchandisGapBottom[0] ? "低于" : "高于") + "同行:" + data.MerchandisGap[0] + " </div>"
    var line2 = "<div>服务态度:" + data.ServiceAvgScore[0] + "&nbsp;&nbsp;&nbsp;" + (data.ServiceGapBottom[0] ? "低于" : "高于") + "同行:" + data.ServiceGap[0] + " </div>"
    var line3 = "<div>发货速度:" + data.ConsignmentAvgScore[0] + "&nbsp;&nbsp;&nbsp;" + (data.ConsignmentGapBottom[0] ? "低于" : "高于") + "同行:" + data.ConsignmentGap[0] + " </div>"
    shopdiv.html("");
    shopdiv.append(titleimg);
    shopdiv.append(shoptile);
    shopdiv.append(line);
    shopdiv.append(line2);
    shopdiv.append(line3);
    shopdiv.show();
}

var clickflag = true; //为flase才执行
var _t;
var equeue = new Array(); //事件队列
var _tid;
var dialog;//立即推广BUI弹出层
//加载完成后bind事件
function bindClick(o) {
    $(o).find(".icon-wrap").on('click', function () {
        _tid = $(this).attr("data-tid");
        getDxInfo();
        dxdialog.show();
    });
    $(o).find(".good_but_x").on('click', function () {
        _tid = $(this).attr("data-tid");
        getDxInfo();
        dxdialog.show();
    });
    $(o).find('.dianpu').hover(function () {
        var data = TApp.hPromotioninfo($(this).attr("data-sellerid"));
        data = eval("(" + data + ")");
        data = data.data;
        shopDetail(data);
        var shopdiv = $("#shopdiv")
        var offset = $(this).offset();
        shopdiv.css({
            left: offset.left + "px",
            top: (offset.top + $(this).height()) + "px"
        })
    }, function () {
        var shopdiv = $("#shopdiv");
        shopdiv.hide();
    })
    $(o).find("[data-openurl]").on('click', function () {
        //alert($(this).attr("data-openurl"));
        TApp.hOpenUrl($(this).attr("data-openurl"));
    });
    $(o).find(".good_but_t").on('click',function(){
        encodeURI
        console.log('http://pub.alimama.com/promo/search/index.htm?q='+encodeURIComponent($(this).attr('data-url')));
        
        TApp.hOpenUrl('http://pub.alimama.com/promo/search/index.htm?q='+encodeURIComponent($(this).attr('data-url')));
    });
    //$(o).find(".good_but_t").off("click");
//	$(o).find(".good_but_t").on('click', function() { //显示立即推广弹层
//
//		var t = $(this);
//		_t = t;
//		//var tid = t.attr("data-tid");
//		//mask.show();
//		var data = getTkUrl(t, 'callback');
//		if(data != null) {
//			showDetail(t);
//		}
//
//	});

    // var tg_con = '<div class="tg_content">' +
    //         '<p class="con_title"></p>' +
    //         '<div class="content">' +
    //         '<div class="con_img">' +
    //         '<img src="" alt="" title="">' +
    //         '</div>' +
    //         '<div class="con_info">' +
    //         '<p style="font-size:14px;">' +
    //         '<em class="site" id="tort"></em><span class="baoyou"><span class="baoyou">【包邮】</span></span>原价:<span class="old_price"></span>元 现价:' +
    //         '<span class="new_price"></span>元 券后价:<span class="ds_price"></span>元 佣金比例' +
    //         '<span class="rates"></span>%（预估收入<span class="estimate_price"></span>元） 到手价仅需<span class="ds_price"></span>元</p>' +
    //         '<div class="con_price">' +
    //         '<div class="con_price_1">' +
    //         '<span class="con_price_qian"></span>' +
    //         '<span class="con_price_jg qh_price good_tg_jiage_b"></span>' +
    //         '<span class="con_price_qhj"></span>' +
    //         '</div>' +
    //         '<div class="con_price_2 con_price_zd">' +
    //         '<p>在售价<br><span class="new_price good_tg_jiage"></span>元</p>' +
    //         '</div>' +
    //         '<div class="con_price_3 con_price_zd">' +
    //         '<p>到手价<br><span class="ds_price good_tg_jiage"></span>元</p>' +
    //         '</div>' +
    //         '</div>' +
    //         '<div id="couponurl" class="con_price60 con_price_a">' +
    //         '<p><span class="coupon">0</span>元优惠券：' +
    //         '<a href="#" target="_blank" class="owt4"></a>' +
    //         '</p>' +
    //         '</div>' +
    //         '<div class="con_price_order con_price_a">' +
    //         '<p>下单链接：' +
    //         '<a href="javascript:;" data-clip="true" target="_blank" class="owt4"></a>' +
    //         '</p>' +
    //         '</div>' +
    //         '<div class="con_fx"><p style="line-height: 34px;"><span style="float:left;">一键分享至：</span><a href="javascript:;" data-action="fx" to="qzone" target="_blank"><span class="con_fx_qzon"></span></a><a href="https://wx.qq.com/" data-action="fx" to="weixin" target="_blank"><span class="con_fx_wx"></span></a><a href="javascript:;" data-action="fx" to="weibo" target="_blank"><span class="con_fx_xl"></span></a><a href="javascript:;" data-action="fx" to="renren" target="_blank"><span class="con_fx_rr"></span></a><a href="javascript:;" data-action="fx" to="qq" target="_blank"><span class="con_fx_qq"></span></a></p></div>' +
    //         '</div><div style="clear: both"></div></div></div>';

    // //立即推广弹出层
    // BUI.use('bui/overlay', function (Overlay) {
    //     dialog = new Overlay.Dialog({
    //         title: '文案推广',
    //         width: 720,
    //         height: 445,
    //         //配置文本
    //         bodyContent: tg_con,
    //         elCls: 'custom-dialog',
    //         buttons: []
    //     });
    // });
    // $(o).find(".good_but_t").on('click', function () { //显示立即推广弹层
    //     var t = $(this);
    //     _t = t;
    //     var data = getTkUrl(t, 'callback');
    //     if (data != null) {
    //         showDetail(t);
    //     }
    //     dialog.show();
    // });


    //$(o).find(".good_but_x").off('click');
    // $(o).find(".good_but_x").on('click', function(e) {
    // 	// mask.show();
    // 	var id = $(this).attr("data-id");
    // 	var c = $('[data-tg=' + id + ']');
    // 	var data = getTkUrl(c, 'fcallback');
    // 	if(data != null) {
    // 		cfly(c, id, e);
    // 	} else {
    // 		//alert('a');
    // 		equeue.push({
    // 			tid: c.attr('data-tid'),
    // 			id: id,
    // 			c: c,
    // 			e: e
    // 		});
    // 	}
    // });

}

function showDetail(t) {
    $("#couponurl").html("");

    if (t.attr("data-couponprice") != "" && t.attr("data-couponprice") != "0.00" && t.attr("data-couponprice") !== undefined && t.attr("data-couponprice") != "null") {
        $("#couponurl").html("<p><span class=\"coupon\">" + t.attr("data-couponprice") + "</span>元优惠券：</p>");
        $(".ds_price").text(parseFloat((t.attr("data-price")) - parseFloat(t.attr("data-couponprice"))).toFixed(2));
        $(".con_price_jg").text(parseFloat((t.attr("data-price")) - parseFloat(t.attr("data-couponprice"))).toFixed(2));
    } else {
        //$("#couponurl").html("<p>优惠券链接：</p>");
        $(".ds_price").text(t.attr("data-price"));
        $(".con_price_jg").text(t.attr("data-price"));
    }
    if (t.attr('data-couponurl') != "") {
        $("#couponurl").html("");
        $("#couponurl").html("<p>优惠券链接：</p>");
        $("#couponurl p").append("<a href='javascript:;' style='' data-clip='true' data-clipboard-text=" + t.attr('data-couponurl') + " target='_blank'>点击复制</a>");
    } else {
        if (t.attr("data-couponShortLinkUrl") != "" && t.attr("data-couponShortLinkUrl") != "null" && t.attr("data-couponShortLinkUrl") != undefined) {
            $("#couponurl p").append("<a href='javascript:;' data-clip='true' data-clipboard-text=" + t.attr("data-couponShortLinkUrl") + " target='_blank'>点击复制</a>");
        } else {
            $("#couponurl").html("");
        }
    }
    $(".tg_content .con_img img").attr("src", t.attr("data-img"));
    $(".tg_content .con_title").text(t.attr("data-title")); //商品标题
    $(".tg_content .con_info .old_price").text(t.attr("data-old-price"));
    $(".new_price").text(t.attr("data-price")); //现价
    $(".rates").text(t.attr("data-rates")); //佣金比例
    // $(".tg_content .con_price60 .coupon").text(t.attr("data-coupon")); //多少元优惠券
    // $(".tg_content .con_price60 a").text(t.attr("data-couponurl")); //多少元优惠券链接
    $(".tg_content .con_price60 a").attr("href", 'javascript:;'); //多少元优惠券链接
    $(".tg_content .con_price_order a").text('点击复制'); //下单链接
    $(".tg_content .con_price_order a").attr("data-clipboard-text", t.attr("data-shortLinkUrl"));
    $(".tg_content .con_price_order a").attr('href', 'javascript:;');

    //alert(t.attr("data-tkCommFee"));
    $(".estimate_price").text(t.attr("data-tkCommFee") == "0.00" ? 0 : t.attr("data-tkCommFee"));
    $("#tg_bg").show();

    $('[to="weixin"]').attr("data-clipboard-text", "原价：" + t.attr('data-old-price') + "现价：" + t.attr("data-price") + "复制淘口令，打开淘宝APP即可查看详情，淘口令:【" + t.attr('data-taoToken') + "】");
    tg_jby();
    // var img;
    // try {
    //   img = TApp.hGetImg(t.attr("data-img"));
    //  } catch (e) {
    //     BUI.Message.Alert('请使用积米淘客助手淘客助手', 'info');
    //     return;
    //  }
    //  alert(img)
    //  t.attr("data-locimg",img);
}

/**
 * 
 * @param {type} tid 商品淘宝id
 * @param {type} o  推广按钮dom对象
 * @returns {getTkUrl.d|Object}
 */
function getTkUrl(o, fun) {
    var tid = o.attr('data-tid');
    var d;
    if (o.attr('data-taoToken') != null && o.attr("data-taoToken") != 'undefined' && o.attr("data-taoToken") != '' && o.attr("data-taoToken") != 'null') {
        d = {
            taoToken: o.attr("data-taoToken"),
            qrCodeUrl: o.attr("data-qrCodeUrl"),
            couponLinkTaoToken: o.attr("data-couponLinkTaoToken"),
            shortLinkUrl: o.attr("data-shortLinkUrl"),
            couponShortLinkUrl: o.attr("data-couponShortLinkUrl"),
            clickUrl: o.attr("data-clickUrl"),
            couponLink: o.attr("data-couponurl") == '' ? o.attr("data-couponLink") : o.attr("data-couponurl")
        };
        return d;
    }
    var param = '{iid:"' + tid + '",fun:"' + fun + '"}';
    mask.show();
    geturlflag=false;//防登录超时,并且防止操作太快。
    setTimeout(function(){
        geturlflag=true;
    },3*60*1000)
    TApp.hToTkUrl(param);
    return null;
}
function get(){
    console.log('this is timeouter');
}
//防止淘宝登陆超时 
// function timeouter(){
//     if(geturlflag){
//         var ttid=$(".good_but_t:eq(0)").attr('data-tid');
//         var param = '{iid:"' + ttid + '",fun:"get"}';
//         mask.show();
//         geturlflag=false;//防登录超时,并且防止操作太快。
//         setTimeout(function(){
//             geturlflag=true;
//         },3*60*1000)
//         TApp.hToTkUrl(param);
//     }
//     setTimeout('timeouter',5*1000);//每5秒检测一次，3分钟内是否做个请求
// }
// setTimeout('timeouter',3*60*1000);//淘宝账号登录3分钟后执行
//加入选品动画
/**
 * 
 * @param {type} c 推广按钮dom对象
 * @param {type} id 商品id
 * @param {type} e 事件
 * @returns {undefined}
 */
function cfly(c, id, e) {
    if (goods.length > selectLength) {
        return;
    }
    if (getCookie('userid') == null) {
        dilog_login.show();
        return;
    }
    if (goods.length > 0) {
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].itemId === id) {
                BUI.Message.Alert('选品库中已存在该商品', 'info');
                return;
            }
        }
    }
    if (storage.get('openPlaint') == 'true') {
        var data = TApp.hGetCommoncampaignbyitemid(c.attr("data-tid"));
        data = eval("(" + data + ")");
        data = data.data;
        if (typeof (data.length) != 'undefined') {
            if (data.length > 0) {
                var max = data[0];
                var isplaint = false; //是否已经申请计划；
                for (var ii = 0; ii < data.length; ii++) {

                    if (data[ii].commissionRate > max.commissionRate) { //自定申请搞拥。
                        max = data[ii];
                    }
                }
                if (!max.Exist) {
                    if (max.commissionRate > parseFloat(c.attr("data-tkrate"))) {
                        var s = '{"campId":"' + max.CampaignID + '","keeperid":"' + max.ShopKeeperID + '","applyreason":"积米淘客助手"}';
                        TApp.hApplyforcommoncampaign(s);
                    }
                }
            }
        }
    }
    var o = new Object();
    o.itemId = c.attr("data-id");
    o.adItemShortUrl = c.attr("data-shortLinkUrl");
    o.taoToken = c.attr("data-taoToken");
    o.couponLinkTaoToken = c.attr("data-couponLinkTaoToken");
    o.qrCodeUrl = c.attr("data-qrCodeUrl");
    o.clickUrl = c.attr("data-clickUrl");
    if (c.attr("data-couponurl") != '') {
        o.couponLink = c.attr("data-couponurl");
    } else {
        o.couponLink = c.attr("data-couponLink");
    }
    //o.coup
    if (c.attr("data-couponShortLinkUrl") == null || c.attr("data-couponShortLinkUrl") == 'undefind' || c.attr("data-couponShortLinkUrl") == '') {
        o.couponShortUrl = ""
    } else {
        o.couponShortUrl = c.attr("data-couponShortLinkUrl")
    }
    goods.push(o);
    var offset = $('.bot_selgoods .bots_kexuan').offset();
    var img = $("[data-info='" + id + "'] .good_img").attr("src");
    img = "<img   src='" + img + "' />";
    img = $(img).css({
        height: '57px',
        width: '57px'
    });

    img.fly({
        start: {
            left: e.pageX,
            top: e.pageY
        },
        end: {
            left: offset.left,
            top: offset.top
        },
        onEnd: function () {
            //this.destory();
            //var c=$('[data-tg='+id+']');
            $('.bots_yixuan').text(goods.length);
            $('.botsa_top span').text(goods.length);
            $(".bots_add").css({
                "background": "#FF5500",
                "cursor": "pointer"
            });
            putBox(c);
            img.remove();
        }
    })
}
//将选择的商品放入左边box中
function putBox(c) {

    var html = '<div class="botsab_img" >' +
            '<span onclick="goods_remove(this)"></span>' +
            '<img src="" alt="">' +
            '</div>';
    var selector = $(html);
    selector.find("img").last().attr("src", c.attr("data-img"));
    selector.find("span").first().attr("data-id", c.attr("data-id"));

    $(".selectedbox").prepend(selector);

}
$("#tg_bg .top_close").click(function () {
    $("#tg_bg").hide();
});
//添加商品
$(".con_but_add").click(function (e) {
    var id = _t.attr("data-id");
    cfly(_t, id, e);
});
//移除选品库中的商品
function goods_remove(good_cl) {

    var id = $(good_cl).attr("data-id");
    for (var i = 0; i < goods.length; i++) {
        if (goods[i].itemId == id) {

            $(good_cl).parents('.botsab_img').remove();

            goods.splice(i, 1);
            $('.bots_yixuan').text(goods.length);
            $('.botsa_top span').text(goods.length);
            break;
        }
    }
    if (goods.length == 0) {
        $(".bots_add").css({
            "background": "#FFD4BE",
            "cursor": "not-allowed"
        });
    }
}
$("#clearbtn").click(function () {
    $('.bots_yixuan').text('0');
    $('.botsa_top span').text('0');
    $(".selectedbox").html("");
    $(".bots_add").css({
        "background": "#FFD4BE",
        "cursor": "not-allowed"
    });
    goods.splice(0, goods.length);

});

//复制到剪切板
var clipboard = new Clipboard('.con_but_copy', {
    target: function (trigger) {
        var usertmp = $('#usertemp').html();
        // usertmp = usertmp.replace(/ /g, "");
        var tmp = usertmp.replace(/\r/g, "");
        // //tmp= usertmp.replaceAll(" ","")
        tmp = tmp.replace(/\n/g, "");
        var cliptype = getCookie('cliptype');

        if (tmp == "" || usertmp == '' || cliptype == null || cliptype == 0) {
            $("#intro_" + _t.attr("data-tid")).show();
            var elemet = $("#intro_" + _t.attr("data-tid"))[0];
            var img;
            // alert(_t.attr("data-img"));
            var imgurl = _t.attr("data-img");
            if (imgurl.indexOf('http:') != 0) {
                imgurl = 'http:' + imgurl;
            }
            try {
                img = TApp.hGetImg(imgurl);
            } catch (e) {
                BUI.Message.Alert('请使用积米淘客助手', 'info');
                return;
            }
            //alert(img)
            if (elemet) {

                var first = elemet.querySelector('img');
                $(first).attr("src", img);
                var clcontent = $("#intro_" + _t.attr("data-tid") + " .clcontent");
                var zprice = 0;
                if (_t.attr("data-couponprice") != "" && _t.attr("data-couponprice") != "0.00" && _t.attr("data-couponprice") !== 'undefined' && _t.attr("data-couponprice") != "null") {
                    zprice = parseFloat((_t.attr("data-price")) - parseFloat(_t.attr("data-couponprice"))).toFixed(2);
                } else {
                    zprice = _t.attr("data-price");
                }
                if (clcontent.html() == "") {
                    clcontent.append("<br>【商品】:" + _t.attr("data-title"));
                    clcontent.append("<br> 【原价】:" + _t.attr("data-old-price"));
                    clcontent.append("<br> 【现价】:" + _t.attr("data-price"));
                    if (zprice != parseFloat(_t.attr("data-price"))) {
                        clcontent.append("<br>【券后价】:" + zprice)
                    }

                    if (_t.attr("data-couponurl") != '') {
                        clcontent.append("<br>【优惠券链接】:" + _t.attr("data-couponurl"));
                    } else {
                        if (_t.attr("data-couponShortLinkUrl") != "" && _t.attr("data-couponShortLinkUrl") != "null" && _t.attr("data-couponShortLinkUrl") != undefined) {

                            clcontent.append("<br>【" + _t.attr("data-couponprice") + "元优惠券】:" + _t.attr("data-couponShortLinkUrl"));
                        }
                    }

                    clcontent.append("<br>【下单】:" + _t.attr("data-shortLinkUrl"));
                    clcontent.append("<br>复制当前文字" + _t.attr("data-taoToken") + "然后直接打开手机淘宝立即下单购买")

                }
                // $(elemet).find("span").last().text(url2)
                // $(elemet).find("span").first().text(url)
            }
            return elemet;
        } else {
            // usertmp=usertmp.replace(/&lt;/g,'<')
            // usertmp=usertmp.replace(/&gt;/g,'>')
            usertmp = usertmp.replace(/<\/p><p/g, '</p><br><p');
            // usertmp=usertmp.replace(/<p>/g,'');
            // usertmp=usertmp.replace(/<\/p>/g,'');
            var imgurl = _t.attr("data-img");
            var img;
            if (imgurl.indexOf('http:') != 0) {
                imgurl = 'http:' + imgurl;
            }
            try {
                img = TApp.hGetImg(imgurl);
            } catch (e) {
                BUI.Message.Alert('请使用积米淘客助手淘客助手', 'info');
                return;
            }
            var html = usertmp.replace(/{title}/g, _t.attr("data-title"));
            var zprice = 0;
            if (_t.attr("data-couponprice") != "" && _t.attr("data-couponprice") != "0.00" && _t.attr("data-couponprice") !== 'undefined' && _t.attr("data-couponprice") != "null") {
                zprice = parseFloat((_t.attr("data-price")) - parseFloat(_t.attr("data-couponprice"))).toFixed(2);
            } else {

                zprice = _t.attr("data-price");

            }
            html = html.replace(/{picturl}/g, '<img src="' + img + '" />');
            html = html.replace(/{reserveprice}/g, _t.attr("data-old-price"));
            html = html.replace(/{zkprice}/g, _t.attr("data-price"));
            html = html.replace(/{couponamount}/g, _t.attr("data-coupon"));
            html = html.replace(/{usertype}/g, _t.attr("data-type") == "1" ? '天猫' : '淘宝');
            html = html.replace(/{zprice}/g, zprice);
            html = html.replace(/{shortLinkUrl}/g, _t.attr('data-shortLinkUrl'));
            html = html.replace(/{linkUrl}/g, _t.attr("data-clickUrl"));
            html = html.replace(/{taoToken}/g, _t.attr("data-taoToken"));
            if (_t.attr("data-couponurl") != '') {
                html = html.replace(/{couponShortLinkUrl}/g, _t.attr("data-couponurl"));
                html = html.replace(/{couponLinkUrl}/g, _t.attr("data-couponurl"));
            } else {
                html = html.replace(/{couponShortLinkUrl}/g, _t.attr("data-couponShortLinkUrl"));
                html = html.replace(/{couponLinkUrl}/g, _t.attr("data-couponLink"));
            }
            html = html.replace(/{couponLinkTaoToken}/g, _t.attr("data-couponLinkTaoToken"));
            html = html.replace(/{couponLinkTaoTaoken}/g, _t.attr("data-couponLinkTaoToken"));
            html = html.replace(/undefined/g, "")
            $("#customdoc").html(html);
            $("#customdoc").show();
            return $("#customdoc")[0];
        }

    }
});

clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    $("#intro_" + _t.attr("data-tid")).hide();
    BUI.Message.Show({
        msg: '成功复制到剪切板',
        icon: 'success',
        buttons: [],
        autoHide: true,
        autoHideDelay: 1000
    });
    e.clearSelection();
});
clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    var usertmp = $('#usertemp').html();
    usertmp = usertmp.replace(/ /g, "");
    if (usertmp == "") {
        $("#intro_" + _t.attr("data-tid")).hide();
    } else {
        $("#customdoc").hide();
    }

});

//分享
mobShare.config({
    debug: true,
    key: '1bf0503b093b0',
    callback: function (plat, params) {

    }
});
var clipboard1 = new Clipboard('[to="weixin"]'); //微信复制淘口令
var clipboardurl = new Clipboard('[data-clip=true]');
clipboardurl.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    //TApp.hOpenUrl(encodeURI(e.text));
    BUI.Message.Show({
        msg: '推广链接已经复制到剪切板',
        icon: 'success',
        buttons: [],
        autoHide: true,
        autoHideDelay: 1000
    });
    e.clearSelection();
});
clipboardurl.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
$('[data-action="fx"]').click(function (e) {
    var params;
    var url = _t.attr("data-couponShortLinkUrl");
    var taoToken = _t.attr("data-taoToken");
    if ($(this).attr("to") === "qzone" || $(this).attr("to") === "weixin") {

        params = {
            title: _t.attr('data-title'),
            description: "原价：" + _t.attr('data-old-price') + "现价：" + _t.attr("data-price") + "复制淘口令，打开淘宝APP即可查看详情，淘口令:【" + taoToken + "】",
            pic: _t.attr('data-img'),
            url: 'http://www.j1m1.com/index.php/index/tktg?id=' + $("#tg_bg").attr("data-uid")

        }
    } else {

        params = {
            title: _t.attr('data-title'),
            url: url,
            description: _t.attr('data-title'),
            pic: _t.attr('data-img')
        }
    }

    mobShare.config({
        params: params
    });
    if ($(this).attr("to") === 'weixin') {
        //document.execCommand('copy',true,params.description)
        //window.Clipboard.setData('text',params.description);
        //                        var str="<div style='width:1px;height:1px;'><img src="+params.pic+" /><br />"+params.description+"</div>";
        //                        var clipborde=e.originalEvent.clipboardData;
        //                        clipborde.setData('txt',str);
        // alert(params.description);
        $(this).attr("data-clipboard-text", params.description);
        window.open("https://wx.qq.com/");
    } else {
        var fx = mobShare($(this).attr("to"));
        fx.send();
        //document.execCommand()
    }
});

// $(".t_r_close").click(function() {
// 	TApp.hExitApp();
// });
// $(".t_r_most").click(function() {
// 	TApp.hWMax();
// });
// $(".t_r_least").click(function() {
// 	TApp.hWMin();
// });
function plaint(campid, keeperid) {
    var s = '{"campId":"' + campid + '","keeperid":"' + keeperid + '","applyreason":"积米淘客助手"}';
    TApp.hApplyforcommoncampaign(s);
    getDxInfo();
}

var regform;
var button;
var mask;
var dxdialog;
var grid;
//var store;
BUI.use(['bui/overlay', 'bui/form', 'bui/mask', 'bui/grid', 'bui/data'], function (Overlay, Form, Mask, Grid, Data) {
    dilog_login = new Overlay.Dialog({
        width: 500,
        height: 500,

        elCls: 'custom-dialog',
        bodyContent: '<iframe target="_top"  name="login_frame" width="100%" id="login_frame" height="400px;" frameborder="0" onload="listenIframe(this)" scrolling="no" src="http://www.j1m1.com/index.php?s=hamster/user/qq_login"></iframe>',

        buttons: []

    });

    var Grid = Grid,
            Store = Data.Store,
            columns = [{
                    title: '计划名称',
                    dataIndex: 'CampaignName',
                    height: 39,
                    width: 150
                }, {
                    title: '收入比率',
                    dataIndex: 'commissionRate',
                    width: 80,
                    renderer: function (value) {
                        return value + "%";
                    }
                }, {
                    title: '佣金类型',
                    dataIndex: 'CampaignType',
                    width: 100
                }, {
                    title: '审核方式',
                    dataIndex: 'manualAudit',
                    width: 80,
                    renderer: function (value, obj) {
                        if (value == 0) {
                            return '自动';
                        } else if (value == 1) {
                            return '人工';
                        }
                    }
                }, {
                    title: '状态',
                    dataIndex: 'Exist',
                    width: 80,
                    renderer: function (value, obj) {
                        if (value) {
                            if (obj.ExistStatus == 2) {
                                return '<span style="color:#5aa62e">通过</span>';
                            } else if (obj.ExistStatus == 1) {
                                return '审核中';
                            } else {
                                return '<span style="color:#red">未通过</span>';
                            }
                        } else {
                            return '未申请';
                        }
                    }
                }, {
                    title: '操作',
                    dataIndex: 'CampaignName',
                    width: 100,
                    renderer: function (value, obj) {
                        if (!obj.Exist) {
                            return '<a href="javascript:;" onclick="plaint(\'' + obj.CampaignID + '\',\'' + obj.ShopKeeperID + '\')" style="color:#106FE1;">申请推广</a>';
                        }
                    }
                }];
    store = new Store({
        data: [],
        sortDirection: 'DESC',
        sortField: 'commissionRate',
        autoLoad: true
    })
    grid = new Grid.Grid({
        render: '#dxdialog',
        columns: columns,
        idField: 'CampaignID',
        innerBorder: false,
        store: store,
        forceFit: false,
        tbar: {
            items: [{
                    xclass: 'bar-item-text',
                    text: '<p style="line-height: 20px;margin-bottom: 15px;">定向计划需要申请，通过后即可享受定向计划佣金，无需单独再获取推广链接。另外，如果申请通过多个定向计划，后者会覆盖前者，实际以后者佣金比率结算。</p>'
                }]
        }
    });

    dxdialog = new Overlay.Dialog({
        title: '定向计划',
        width: 630,
        height: 360,
        children: [grid],
        childContainer: '.bui-stdmod-body',
        buttons: [],

        hide: function () {

            //grid.clearItems();
        }
    })

    //store=new Store();

    regform = new Form.HForm({
        srcNode: '#regform'
    }).render();

    reg_dialog = new Overlay.Dialog({
        title: '注册--绑定手机号码',
        width: 450,
        height: 200,
        //配置DOM容器的编号
        contentId: 'regcontent',
        success: function () {
            regform.valid();
            if (!regform.isValid()) {
                return;
            }
            regform.ajaxSubmit({
                url: '/index.php/hamster/user/regMem',
                data: {
                    tel: $("#tel").val(),
                    Check: $("#Check").val()
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    mask.show();
                },
                complete: function () {
                    mask.hide();
                },
                success: function (data) {
                    if (data.success) {
                        BUI.Message.Alert("恭喜你注册成功", function () {
                            document.location.reload();
                        }, 'success');
                    } else {
                        BUI.Message.Alert(data.message, 'error');
                    }
                }
            });
        }
    });
    $("#add_items").click(function () {
        if (goods.length == 0) {
            BUI.Message.Alert('请选择要推广的商品', 'info');
            return;
        }
        $.ajax({
            url: '/index.php/hamster/index/add_item',
            data: {
                data: goods
            },
            type: 'post',
            dataType: 'json',
            success: function (d) {
                //alert(d);
                if (d.success == 1) {
                    $('.selectedbox').html("");
                    BUI.Message.Show({
                        msg: "您的新推广页已经生成",
                        icon: 'success',
                        autoHide: true,
                        autoHideDelay: 1500,
                        buttons: []
                                // buttons: [{
                                // 	text: '点击查看',
                                // 	elCls: 'button button-primary',
                                // 	handler: function() {
                                // 		//window.open(d.url, '_blank');
                                // 		TApp.hOpenUrl("http://www.j1m1.com" + d.url);
                                // 		goods.splice(0, goods.length);
                                // 	}
                                // }]

                    });
                } else if (d.success == 2) {
                    BUI.Message.Alert(d.message, 'error');
                } else {
                    BUI.Message.Alert(d.message, 'info');

                }
            },
            error: function (r, s, e) {

            }
        });
    });
    mask = new Mask.LoadMask({
        el: '#bottom_bg',
        msg: '积米淘客助手正在努力工作...'
    });

    //reg_dialog.show();
});