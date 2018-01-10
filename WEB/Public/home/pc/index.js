var pageSize = 20; //每页条数
var flag = true;
var goods = new Array(); //选品库商品数组
var dilog_login;
var reg_dialog;

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
/**
 * @param {type} name cookie 名称
 * @param {type} value 值
 * @param {type} exp  过期时间 单位为分钟
 * @returns {undefined}
 */
function setCookie(name, value, exp) {

    if (exp != 'undefinde' && exp != null) {
        var expDate = new Date();
        expDate.setTime(expDate.getTime() + exp * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    } else {
        document.cookie = name + "=" + value;
    }
}
var mmid;
if (getCookie("mmid") == null) {
    mmid = TApp.hGetMmid();
    if (mmid == 'NULL' || mmid == 'null') {
        BUI.Message.Alert('你还没有申请淘宝客账号，请到阿里妈妈申请，申请完成后请重新登录淘客助手，助手将自动给你创建推广位。点击确定去阿里妈妈申请', function() {
            window.open('http://pub.alimama.com', '_blank');
        }, 'info')
    } else {
        setCookie('mmid', mmid);
    }
} else {
    mmid = getCookie("mmid");
}

$(function() {
    getList({});
    $("#login_btn").on('click', function() {
        $('#login_frame').attr("src", "http://www.j1m1.com/index.php?s=home/pc/qq_login")
        dilog_login.show();
    });
    //点击导航菜单
    $(".nav_btn").click(function() {
        var tcid = $(this).attr("data-cid");
        $(".nav_ul .nav_a_col").removeClass("nav_a_col");
        $(this).attr("nav_a_col");
        var data = { tcid: tcid, pageSize: pageSize };
        $("#kw").val(""); //清空搜索框内容
        $("#listView").html(""); //清空所有商品
        getList(data); //加载商品

    });
    //点击搜索图标查询商品并显示
    $(".glyphicon-search").click(function() {
        if (kw == "") {
            return;
        }
        search(pageSize, 1, true);
    });
    //键盘按下时查询商品并显示
    $("#kw").keydown(function(e) {
        //判断是回车键
        if (e.keyCode == 13) {
            if (kw == "") {
                return;
            }
            search(pageSize, 1, true);
            return false;
        }
    });
    //scroll()滚动事件
    $("#right").scroll(function() {
        var conHeight = $(".container").height();
        var rigHeight = $("#right").height();
        //所加载的数据块的高度是不是大于right div的高度
        if (conHeight > rigHeight) {
            //判断滚动条是不是移动到最下面了
            if ($("#right").scrollTop() == conHeight - rigHeight) {
                var pageIndex = parseInt($("input:hidden[name='pageIndex']").last().val());
                var count = parseInt($("input:hidden[name='count']").last().val());
                var pageCount = 1;

                pageCount = Math.ceil(count / pageSize);
                if (pageIndex === pageCount || pageIndex > pageCount) {
                    BUI.Message.Show({ msg: "没有更多商品加载了", icon: 'info', buttons: [], autoHide: true, autoHideDelay: 1000 });
                } else {
                    if (flag) {
                        flag = false;
                        search(pageSize, pageIndex + 1, false);
                        //防止请求过快,2秒后才能加载下一页
                        setTimeout(function() {
                            flag = true;
                        }, 2000);
                    }
                }
                //search();
            }
        }
    });
})

function search(pageSize, pageIndex, isReload) {
    if (isReload) {
        $("#listView").html("");
    }
    var kw = $("#kw").val();
    var tcid = $(".nav_ul .nav_a_col").attr("data-cid");
    var data = { kw: kw, tcid: tcid, pageSize: pageSize, pageIndex: pageIndex };
    getList(data);
}

function getList(data) {
    $.ajax({
        url: '/index.php/pc/listView',
        data: data,
        type: 'get',
        dataType: 'html',
        success: function(h) {
            //$("#listView").append(h);
            var o = $(h).appendTo("#listView");
            first_h_w(); //设置商品列表的宽度和商品图片的高度
            window.onresize = first_h_w; //动态设置商品列表的宽度和商品图片的高度
            jby();
            bindClick(o);

        },
        error: function(r, s, e) {

        },
        beforeSend: function() {
            //提示加载信息
            mask.show();
        },
        complete: function() {
            //隐藏加载提示
            mask.hide();
        }
    });
}
var clickflag = true; //为flase才执行
var _t;
//显示立即推广弹窗
function bindClick(o) {

    $(o).find(".good_but_t").off("click")
    $(o).find(".good_but_t").on('click', function() {

        var t = $(this);
        _t = t;
        $("#couponurl").html("");

        if (t.attr("data-couponprice") != "" && t.attr("data-couponprice") != "0.00" && t.attr("data-couponprice") !== 'undefined' && t.attr("data-couponprice") != "null") {

            $("#couponurl").html("<p><span class=\"coupon\">" + t.attr("data-couponprice") + "</span>元优惠券：</p>");
            $(" .ds_price").text(parseFloat(t.attr("data-price")) - parseFloat(t.attr("data-couponprice")));
        } else {

            $("#couponurl").html("<p>优惠券链接：</p>");
            $(".ds_price").text(t.attr("data-price"));
        }
        var data;

        //mask.show();
        try {
            var tid = t.attr("data-tid");

            data = getTkUrl(tid, t);

            //alert(clickflag);

            if (data.couponShortLinkUrl != "" && data.couponShortLinkUrl != null && data.couponShortLinkUrl != "null") {
                $("#couponurl").append("<a href='javascript:;' data-clip='true' data-clipboard-text=" + data.couponShortLinkUrl + " target='_blank'>" + data.couponShortLinkUrl + "</a>");
                _t.attr("data-couponShortLinkUrl", data.couponShortLinkUrl);
            } else {
                $("#couponurl").append("没有优惠券");
            }
            if (!data.isAdd) {
                _t.attr("data-taoToken", data.taoToken);
                _t.attr("data-qrCodeUrl", data.qrCodeUrl);
                _t.attr("data-couponLinkTaoToken", data.couponLinkTaoToken);
                _t.attr("data-shortLinkUrl", data.shortLinkUrl);
                _t.attr("data-couponShortLinkUrl", data.couponShortLinkUrl);
                //$(".tg_content .con_price_order a").attr(data.shortLinkUrl);
            }
        } catch (e) {
            alert(e.message)
            BUI.Message.Alert('没有获取到推广链接，请确认登录账号是否完成淘客申请，或者重新打开应用', 'info');
        }
        // mask.hide();
        $(".tg_content .con_img img").attr("src", t.attr("data-img"));
        $(".tg_content .con_title").text(t.attr("data-title")); //商品标题
        $(".tg_content .con_info .old_price").text(t.attr("data-old_price"));
        $(".new_price").text(t.attr("data-price")); //现价
        $(".rates").text(t.attr("data-rates")); //佣金比例
        // $(".tg_content .con_price60 .coupon").text(t.attr("data-coupon")); //多少元优惠券
        // $(".tg_content .con_price60 a").text(t.attr("data-couponurl")); //多少元优惠券链接
        $(".tg_content .con_price60 a").attr("href", 'javascript:;'); //多少元优惠券链接
        $(".tg_content .con_price_order a").text(t.attr("data-shortLinkUrl")); //下单链接
        $(".tg_content .con_price_order a").attr("data-clipboard-text", t.attr("data-shortLinkUrl"));
        $(".tg_content .con_price_order a").attr('href', 'javascript:;')
            //下单链接
            //$(".tg_content .con_info .baoyou").text(t.attr("data-baoyou") == 1 ? "【包邮】" : ""); //是否包邮



        $(".con_price_jg").text(t.attr("data-price"));
        //alert(t.attr("data-tkCommFee"));
        $(".estimate_price").text(t.attr("data-tkCommFee") == "0.00" ? 0 : t.attr("data-tkCommFee"));
        $("#tg_bg").show();
        $('[to="weixin"]').attr("data-clipboard-text", "原价：" + _t.attr('data-old_price') + "现价：" + _t.attr("data-price") + "复制淘口令，打开淘宝APP即可查看详情，淘口令:【" + data.taoToken + "】");
        //targetElem=t.parents('[data-info]')[0];
    });
    $(o).find(".good_but_x").off('click');
    $(o).find(".good_but_x").on('click', function(e) {
        // mask.show();
        var id = $(this).attr("data-id");
        var c = $('[data-tg=' + id + ']');
        try {

            var data = getTkUrl(c.attr("data-tid"), c);
            if (!data.isAdd) {
                c.attr("data-taoToken", data.taoToken);
                c.attr("data-qrCodeUrl", data.qrCodeUrl);
                c.attr("data-couponLinkTaoToken", data.couponLinkTaoToken);
                c.attr("data-shortLinkUrl", data.shortLinkUrl);
                c.attr("data-couponShortLinkUrl", data.couponShortLinkUrl);
            }
        } catch (e) {
            alert(e.message)
            BUI.Message.Alert('没有获取到推广链接，请确认登录账号是否完成淘客申请，或者重新打开应用', 'info');
        }
        //mask.hide();
        cfly(c, id, e);
    });

}
/**
 * 
 * @param {type} tid 商品淘宝id
 * @param {type} o  推广按钮dom对象
 * @returns {getTkUrl.d|Object}
 */
function getTkUrl(tid, o) {
    var d;
    if (o.attr('data-taoToken') != null && o.attr("data-taoToken") != 'undefined' && o.attr("data-taoToken") != '' && o.attr("data-taoToken") != 'null') {
        d = {
            taoToken: o.attr("data-taoToken"),
            qrCodeUrl: o.attr("data-qrCodeUrl"),
            couponLinkTaoToken: o.attr("data-couponLinkTaoToken"),
            shortLinkUrl: o.attr("datt-shortLinkUrl"),
            couponShortLinkUrl: o.attr("data-couponShortLinkUrl"),
            isAdd: true
        }
        return d;
    }
    if (!clickflag) { //防止请求过快，为true时才能往下执行，在请求拿到数据后1.5秒后才能继续拿数据
        return;
    }
    clickflag = false;
    mask.show();
    var dt = TApp.hToTkUrl(tid);
    setTimeout(function() {
        mask.hide();
        clickflag = true;
    }, 1500);
    dt = eval("(" + dt + ")");
    d = dt.data;
    if (d.couponShortLinkUrl === null) {
        var param = "{'itemid':'" + tid + "','sellerId':'" + o.attr("data-sid") + "'}";
        var objs = TApp.hGetCoupons_base(param);
        if (objs != "" && objs != null) {
            objs = eval("(" + objs + ")");
            var data = objs.data;
            //$.each(data, function(i, item) {
            if (data.length > 0) {
                //d.couponShortLinkUrl = "http://shop.m.taobao.com/shop/coupon.htm?seller_id=" + o.attr("data-sid") + "&activity_id=" + data[0].activity_id + '&pid=' + mmid;
                d.couponShortLinkUrl = 'http://uland.taobao.com/coupon/edetail?activityId=' + data[0].activity_id + '&itemId=' + tid + '&pid=' + mmid + '&dx=1&src=j1m1'; //二合一地址
            }
            //_t.attr("data-couponShortLinkUrl","http://shop.m.taobao.com/shop/coupon.htm?seller_id="+t.attr("data-sid")+"&activity_id="+o.activity_id);
            //});
        }
    }
    d.isAdd = false;
    return d;
}
//加入选品动画
/**
 * 
 * @param {type} c 推广按钮dom对象
 * @param {type} id 商品id
 * @param {type} e 事件
 * @returns {undefined}
 */
function cfly(c, id, e) {
    if (goods.length > 20) {
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
    var o = new Object();
    o.itemId = c.attr("data-id");
    o.adItemShortUrl = c.attr("data-shortLinkUrl");
    if (c.attr("data-couponShortLinkUrl") == null || c.attr("data-couponShortLinkUrl") == 'undefind' || c.attr("data-couponShortLinkUrl") == '') {
        o.couponShortUrl = ""
    } else {
        o.couponShortUrl = c.attr("data-couponShortLinkUrl")
    }
    goods.push(o);
    var offset = $('.already_sel .as_goods').offset();
    var img = $("[data-info='" + id + "'] .good_img").attr("src");
    img = "<img   src='" + img + "' />";
    img = $(img).css({ height: '57px', width: '57px' });

    img.fly({
        start: {
            left: e.pageX,
            top: e.pageY
        },
        end: {
            left: offset.left,
            top: offset.top
        },
        onEnd: function() {
            //this.destory();
            //var c=$('[data-tg='+id+']');
            putBox(c);
            img.remove();
        }
    })
}
//将选择的商品放入左边box中
function putBox(c) {
    var html = '<div class="as_goods_info">' +
        '<img src="" alt="">' +
        '<div class="as_goods_con">' +
        '<p class="as_goods_title owt"></p>' +
        '<div class="as_goods_sell">' +
        '<p class="f_l"><span class="qian qian_w"></span><span></span></p>' +
        '<p class="f_r">月销:<span>2495</span></p>' +
        '</div>' +
        '<br />' +
        '<p class="as_goods_yong">佣金：<span class="qian qian_y"></span><span>10.13</span></p>' +
        '<div class="as_goods_info_close" data-id="' + c.attr('data-id') + '" onclick="goods_remove(this)"></div>' +
        '</div>' +
        '</div>';
    var selector = $(html);

    //     var c=$('[data-tg='+id+']');
    selector.find("img").attr("src", c.attr("data-img"));
    selector.find(".as_goods_title").text(c.attr("data-title"));
    selector.find(".f_l span").last().text(c.attr("data-price"));
    selector.find(".f_r span").text(c.attr("data-biz30day"));
    selector.find("as_goods_yong span").last().text(c.attr("data-tkCommFee"))

    $(".already_sel .as_goods").prepend(selector).find("#no_goods").hide();

}
$("#tg_bg .top_close").click(function() {
    $("#tg_bg").hide();
});
//添加商品
$(".con_but_add").click(function(e) {
    var id = _t.attr("data-id");
    cfly(_t, id, e);
});
//移除选品库中的商品
function goods_remove(good_cl) {
    //if (confirm("你确定要移除此商品吗？")) {\
    BUI.Message.Show({
        msg: '你确定要移除此商品吗？',
        icon: 'question',
        autoHide: false,
        autoHideDelay: 20000,
        buttons: [{
            text: '确定',
            elCls: 'button button-primary',
            handler: function() {
                var id = $(good_cl).attr("data-id");
                for (var i = 0; i < goods.length; i++) {
                    if (goods[i].itemId == id) {
                        $(good_cl).parents('.as_goods_info').remove();
                        goods.splice(i, 1);
                        this.close();
                        break;
                    }
                }
                //if (goods.length == 0) $("#no_goods").show();
                this.close();
            }
        }, {
            text: '取消',
            elCls: 'button button-primary',
            handler: function() {
                this.close();
            }
        }]
    })

    //}
}

//复制到剪切板
var clipboard = new Clipboard('.con_but_copy', {
    target: function(trigger) {
        var elemet = $("#intro_" + _t.attr("data-tid"))[0];
        try {
            $("#intro_" + _t.attr("data-tid")).show();
            var url = _t.attr("data-couponShortLinkUrl");
            var url2 = _t.attr("data-shortLinkUrl");
            var img = TApp.hGetImg(_t.attr("data-img"));

        } catch (e) {
            BUI.Message.Alert('请使用积米淘客助手淘客助手', 'info');
        }
        if (elemet) {
            var first = elemet.querySelector('img');
            $(first).attr("src", img);
            $(elemet).find("span").last().text(url2)
            $(elemet).find("span").first().text(url)
        }
        return elemet;
    }
});

clipboard.on('success', function(e) {
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
clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    $("#intro_" + _t.attr("data-tid")).hide();

});

//分享
mobShare.config({
    debug: true,
    key: '1bf0503b093b0',
    callback: function(plat, params) {

    }
});
var clipboard1 = new Clipboard('[to="weixin"]'); //微信复制淘口令
var clipboardurl = new Clipboard('[data-clip=true]');
clipboardurl.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    BUI.Message.Show({
        msg: '推广链接已经复制到剪切板',
        icon: 'success',
        buttons: [],
        autoHide: true,
        autoHideDelay: 1000
    });
    e.clearSelection();
});
clipboardurl.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
$('[data-action="fx"]').click(function(e) {
    var params;
    var url = _t.attr("data-couponShortLinkUrl");
    var taoToken = _t.attr("data-taoToken");
    if ($(this).attr("to") === "qzone" || $(this).attr("to") === "weixin") {

        params = {
            title: _t.attr('data-title'),
            description: "原价：" + _t.attr('data-old_price') + "现价：" + _t.attr("data-price") + "复制淘口令，打开淘宝APP即可查看详情，淘口令:【" + taoToken + "】",
            pic: _t.attr('data-img')
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
        //$(this).attr("data-clipboard-text", params.description);
        window.open("https://wx.qq.com/");
    } else {
        var fx = mobShare($(this).attr("to"));
        fx.send();
        //document.execCommand()
    }
});

$(".t_r_close").click(function() {
    TApp.hExitApp();
});
$(".t_r_most").click(function() {
    TApp.hWMax();
});
$(".t_r_least").click(function() {
    TApp.hWMin();
});
var regform;
var button;
var mask;
BUI.use(['bui/overlay', 'bui/form', 'bui/mask'], function(Overlay, Form, Mask) {
    dilog_login = new Overlay.Dialog({
        width: 500,
        height: 500,

        elCls: 'custom-dialog',
        //bodyContent:'<iframe target="_top" width="100%" height="300px;" frameborder="0" scrolling="no" src="http://ui.ptlogin2.qq.com/cgi-bin/login?hide_title_bar=0&low_login=0&qlogin_auto_login=1&no_verifyimg=1&link_target=blank&appid=716027609&target=self&s_url=http%3a%2f%2fwww.j1m1.com%2findex.phps%3fs%3dhome%2fpc%2fqq_callback" marginheight="0" marginwidth="0" border="0"></iframe>',
        bodyContent: '<iframe target="_top"  name="login_frame" width="100%" id="login_frame" height="400px;" frameborder="0" onload="listenIframe(this)" scrolling="no" src="http://www.j1m1.com/index.php?s=home/pc/qq_login"></iframe>',
        //bodyContent:"<iframe target='_top' width='100%' height='300px;' frameborder='0' scrolling='no' src='https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&daid=383&pt_no_auth=1&style=33&login_text=%E6%8E%88%E6%9D%83%E5%B9%B6%E7%99%BB%E5%BD%95&hide_title_bar=1&hide_border=1&target=self&s_url=https%3A%2F%2Fgraph.qq.com%2Foauth%2Flogin_jump&pt_3rd_aid=101386691&pt_feedback_link=http%3A%2F%2Fsupport.qq.com%2Fwrite.shtml%3Ffid%3D780%26SSTAG%3Dwww.j1m1.com.appid101386691'></iframe>",
        buttons: []

    });
    regform = new Form.HForm({
        srcNode: '#regform'
    }).render();

    reg_dialog = new Overlay.Dialog({
        title: '注册--绑定手机号码',
        width: 400,
        height: 200,
        //配置DOM容器的编号
        contentId: 'regcontent',
        success: function() {
            regform.valid();
            if (!regform.isValid()) {
                return;
            }
            regform.ajaxSubmit({
                url: '/index.php/home/pc/regMem',
                data: { tel: $("#tel").val(), Check: $("#Check").val() },
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        BUI.Message.Alert("恭喜你注册成功", function() {
                            document.location.reload();
                        }, 'success');
                    } else {
                        BUI.Message.Alert(data.message, 'error');
                    }
                }
            });
        }
    });
    $("#add_items").click(function() {
        if (goods.length == 0) {
            BUI.Message.Alert('请选择要推广的商品', 'info');
            return;
        }
        $.ajax({
            url: '/index.php/home/pc/add_item',
            data: { data: goods },
            type: 'post',
            dataType: 'json',
            success: function(d) {
                //alert(d);
                if (d.success == 1) {
                    $('.already_sel .as_goods').html();
                    BUI.Message.Show({
                        msg: '个人推广单页已经生成,',
                        icon: 'success',
                        autoHide: false,
                        buttons: [{
                                text: '复制链接',
                                elCls: 'button button-primary',
                                handler: function() {
                                    alert(this.buttons[0].text);
                                }
                            },
                            {
                                text: '点击查看',
                                elCls: 'button button-primary',
                                handler: function() {
                                    window.open(d.url, '_blank');
                                }
                            }
                        ]

                    });
                } else if (d.success == 2) {
                    BUI.Message.Alert(d.message, 'error');
                } else {
                    BUI.Message.Alert(d.message, 'info');

                }
            },
            error: function(r, s, e) {

            }
        })
    });
    mask = new Mask.LoadMask({
        el: 'body',
        msg: '积米淘客助手正在努力工作...'
    });

    //reg_dialog.show();
});


function listenIframe(obj) {
    var url = obj.contentWindow.location.href;

    //alert(url);
    if (url.indexOf("register") != -1) {
        reg_dialog.show();
        dilog_login.close();

    }
}

function setEnable(time) {
    self.setInterval(function() {

        if (time === 0) {
            window.clearInterval();
            $("#sendsms").removeClass("disabled");
            regform.text("发送验证码");
            $("#sendsms").removeAttr("disabled");
        }
        $("#sendsms").text(time + "秒重新发送");
        time--;
    }, 1000)
}

$("#sendsms").click(function() {
    if ($("#sendsms").hasClass("disabled")) {
        return;
    }
    regform.valid()
    if (!regform.getChild("tel", true).isValid()) {
        regform.focusError();
        return;
    }
    $.ajax({
        url: '/index.php/home/pc/sendSms',
        data: { phone: $("#tel").val() },
        type: 'post',
        dataType: 'json',
        success: function(d) {
            if (d.success) {
                $("#sendsms").addClass("disabled");
                $("#sendsms").attr("disabled", "disabled");
                setEnable(60)
            }
        },
        error: function(r, s, e) {

        }
    });
});