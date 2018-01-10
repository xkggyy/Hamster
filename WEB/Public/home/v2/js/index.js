var pageSize = 16; //每页条数
var flag = true;
var mask;
var zkPriceP = 1;//价格升序
var pageFlag = true;

//首页
$(function () {
    couponfen();//领券直播分类
    couponPx();//领券直播排序
    copyGoodsInfo();//复制文案
    goodsScreen();//高级筛选
    clickSx();
    searchLike();//搜索商品
    //加载商品
    getList({
        tcid: goodsNav()
    });
    goPage();//翻页
    //回到顶部
    $(window).scroll(function () {
        var scrollTop = parseInt($(this).scrollTop());
        if (scrollTop > 600)
            $(".go_top").show();
        else
            $(".go_top").hide();
    });
    $(".go_top").click(function () {
        $("body").animate({scrollTop: 0}, 400);
    });
});

//获得条数页码相关信息并在首页显示分页信息
function pageInfo() {
    var pageIndex = parseInt($("input:hidden[name='pageIndex']").last().val());//页码
    var all_page = parseInt($("input:hidden[name='all_page']").last().val());//总页数
    var count = parseInt($("input:hidden[name='count']").last().val());//总条数
    if (all_page === 1) {
        $(".page_num1,.page_num2,.page_num3,.page_num4").show();
        $(".page_num2,.page_num3,.page_num4").hide();
    } else if (all_page === 2) {
        $(".page_num1,.page_num2,.page_num3,.page_num4").show();
        $(".page_num3,.page_num4").hide();
    } else if (all_page === 3) {
        $(".page_num1,.page_num2,.page_num3,.page_num4").show();
        $(".page_num4").hide();
    } else {
        $(".page_num1,.page_num2,.page_num3,.page_num4").show();
    }
    $(".count b").html(count);
    $(".all_page").html(all_page);
    $(".go_numpage select").empty();//清空下拉项；
    //设置下拉项
    for (var i = 1; i < all_page + 1; i++) {
        var addOption = "<option value='" + i + "'>第" + i + "页</option>";
        $('.go_numpage select').append(addOption);
    }
}
//设置排序后面的上一页下一页按钮样式
function cgolarBtn() {
    var pageIndex = parseInt($("input:hidden[name='pageIndex']").last().val());
    var all_page = parseInt($("input:hidden[name='all_page']").last().val());
    if (all_page === 1 && pageIndex === 1) {
        $(".cgo_lar_left").css({"background-position": "0px -16px"});
        $(".cgo_lar_right").css({"background-position": "-9px -16px"});
    } else if (pageIndex === 1) {
        $(".cgo_lar_left").css({"background-position": "0px -16px"});
        $(".cgo_lar_right").css({"background-position": "-9px -32px"});
    } else if (pageIndex === all_page) {
        $(".cgo_lar_left").css({"background-position": "0px -32px"});
        $(".cgo_lar_right").css({"background-position": "-9px -16px"});
    } else {
        $(".cgo_lar_left").css({"background-position": "0px -32px"});
        $(".cgo_lar_right").css({"background-position": "-9px -32px"});
    }
}

//翻页
function goPage() {
    //点击首页、上一页、下一页、尾页时的翻页
    $(".first_page,.up_page,.down_page,.last_page").click(function () {


        if (pageFlag) {
            pageFlag = false;
            var pageIndex = parseInt($("input:hidden[name='pageIndex']").last().val());
            var all_page = parseInt($("input:hidden[name='all_page']").last().val());
            if (pageIndex === 1 && all_page === 1) {
            } else if (pageIndex === 1) {
                if ($(this).text() === '下一页>') {
                    pageIndex = downPage(pageIndex, all_page);
                } else if ($(this).text() === '尾页') {
                    pageIndex = lastPage(pageIndex, all_page);
                }
            } else if (pageIndex === all_page) {
                if ($(this).text() === '首页') {
                    pageIndex = firstPage(pageIndex);
                } else if ($(this).text() === '<上一页') {
                    pageIndex = upPage(pageIndex, all_page);
                }
            } else {
                if ($(this).text() === '首页') {
                    pageIndex = firstPage(pageIndex);
                } else if ($(this).text() === '<上一页') {
                    pageIndex = upPage(pageIndex, all_page);
                } else if ($(this).text() === '下一页>') {
                    pageIndex = downPage(pageIndex, all_page);
                } else if ($(this).text() === '尾页') {
                    pageIndex = lastPage(pageIndex, all_page);
                }
            }
            search(pageIndex, all_page);
        }
    });
    //选择第几页时翻页
    $(".go_numpage select").change(function () {
        if (pageFlag) {
            pageFlag = false;
            var all_page = parseInt($("input:hidden[name='all_page']").last().val());
            var pageIndex = parseInt($(this).val());
            $(".page_size span").each(function (i) {
                if (pageIndex > 2 && pageIndex < all_page) {
                    $(this).text(pageIndex + (i - 2));
                } else if (pageIndex === 1 || pageIndex === 2) {
                    firstPage(pageIndex);
                } else if (pageIndex === all_page) {
                    lastPage(pageIndex, all_page);
                }
            });
            search(pageIndex, all_page);
        }
    });
    //点击页码跳转页面
    $(".page_size span").each(function () {
        $(this).click(function () {
            if (pageFlag) {
                pageFlag = false;
                var all_page = parseInt($("input:hidden[name='all_page']").last().val());
                var pageIndex = parseInt($(this).text());
                $(".page_size span").each(function (i) {
                    if (pageIndex > 2 && pageIndex < all_page) {
                        $(this).text(pageIndex + (i - 2));
                    } else if (pageIndex === 1 || pageIndex === 2) {
                        firstPage(pageIndex);
                    } else if (pageIndex === all_page) {
                        lastPage(pageIndex, all_page);
                    }
                });
                search(pageIndex, all_page);
            }
        });
    });
    //点击排序后面的分页
    $(".cgo_lar_left,.cgo_lar_right").click(function () {
        if (pageFlag) {
            pageFlag = false;
            var pageIndex = parseInt($("input:hidden[name='pageIndex']").last().val());
            var all_page = parseInt($("input:hidden[name='all_page']").last().val());
            if (all_page === 1 && pageIndex === 1) {
            } else if (pageIndex === 1) {
                if ($(this).attr("class") === 'cgo_lar_right') {
                    pageIndex = downPage(pageIndex);
                }
            } else if (pageIndex === all_page) {
                if ($(this).attr("class") === 'cgo_lar_left') {
                    pageIndex = upPage(pageIndex, all_page);
                }
            } else {
                if ($(this).attr("class") === 'cgo_lar_left') {
                    pageIndex = upPage(pageIndex, all_page);
                } else if ($(this).attr("class") === 'cgo_lar_right') {
                    pageIndex = downPage(pageIndex);
                }
            }
            search(pageIndex, all_page);
        }
    });
}
//首页
function firstPage(pageIndex) {
    pageIndex = 1;
    $(".page_size span").each(function (i) {
        $(this).text(i + 1);
    });
    return pageIndex;
}
//上一页
function upPage(pageIndex, all_page) {
    pageIndex = pageIndex - 1;
    if (pageIndex > 2 && pageIndex < (all_page - 1)) {
        $(".page_size span").each(function (i) {
            $(this).text(parseInt($(this).text()) - 1);
        });
    }
    return pageIndex;
}
//下一页
function downPage(pageIndex, all_page) {
    pageIndex = pageIndex + 1;
    if (pageIndex > 3 && pageIndex !== all_page) {
        $(".page_size span").each(function (i) {
            $(this).text(parseInt($(this).text()) + 1);
        });
    }
    return pageIndex;
}
//尾页
function lastPage(pageIndex, all_page) {
    pageIndex = all_page;
    $(".page_size span").each(function (i) {
        $(this).text(pageIndex - (3 - i));
    });
    return pageIndex;
}
//设置页码首页上一页下一页尾页样式
function setPage(pageIndex, all_page) {
    $(".first_page,.up_page,.down_page,.last_page").removeClass("page_no");
    $(".page_size span").removeClass("page_num_no");
    //设置页面及首页上一页下一页尾页等样式
    if (pageIndex === 1 && all_page === 1) {
        $(".page_num1").addClass("page_num_no");
        $(".first_page,.up_page,.down_page,.last_page").addClass("page_no");
    } else if (pageIndex === 2 && all_page === 2) {
        $(".page_num2").addClass("page_num_no");
        $(".down_page,.last_page").addClass("page_no");
    } else if (pageIndex === 3 && all_page === 3) {
        $(".page_num3").addClass("page_num_no");
        $(".down_page,.last_page").addClass("page_no");
    } else if (pageIndex === all_page) {
        $(".page_num4").addClass("page_num_no");
        $(".down_page,.last_page").addClass("page_no");
    } else if (pageIndex === 1) {
        $(".page_num1").addClass("page_num_no");
        $(".first_page,.up_page").addClass("page_no");
    } else if (pageIndex === 2) {
        $(".page_num2").addClass("page_num_no");
    } else {
        $(".page_num3").addClass("page_num_no");
    }
    $(".pageIndex").text(pageIndex);
}

function search(pageIndex, all_page) {
    //设置页码首页上一页下一页尾页样式
    setPage(pageIndex, all_page);
    //获得价格、佣金比例、销量筛选
    var minPrice = $(".minPrice").val();
    var maxPrice = $(".maxPrice").val();
    var yjScale = $(".yjScale").val();
    var salesVolume = $(".salesVolume").val();
    //获得高级筛选所勾选
    var sxid;
    $(".goods_shaixuan ul li").each(function () {
        if ($(this).find("input").attr('checked')) {
            sxid = $(this).attr("data-cid");
        }
    });
    //获得价格排序（升序还是降序）

    var data = {
        goodsName: searchLike2(), //获得搜索商品名称
        tcid: goodsNav(), //头部导航分类
        sxid: goodsScreen2(), //高级筛选所勾选项
        minPrice: minPrice, //最小价格
        maxPrice: maxPrice, //最高价格
        yjScale: yjScale, //佣金比例
        salesVolume: salesVolume, //销量
        pageIndex: pageIndex, //页码
        itid: couponfen2(), //分类ID
        order: goodsPaixu() //排序
    };
    getList(data);
}
//加载领券直播商品
function getList(data) {
    $.ajax({
        url: '/index.php/home/index/listView',
        data: data,
        type: 'post',
        dataType: 'html',
        success: function (h) {
            $("#listView").empty();
            var o = $(h).appendTo("#listView");
            $("body").animate({scrollTop: 0}, 100);
            pageFlag = true;
            copyGoodsInfo();//复制文案
            addtuiguang();//点击“加入推广”弹出提示框
            pageInfo();
            cgolarBtn();
        },
        error: function (r, s, e) {
        },
        beforeSend: function () {
            //提示加载信息
//            mask.show();
        },
        complete: function () {
            //隐藏加载提示
            setTimeout(function () {
                flag = true;
            }, 500);
//            mask.hide();
        }
    });
}
//获得头部导航
function goodsNav() {
    var tcid = $(".tm_nav").find(".nav_xz").attr("data-cid");
    if (tcid !== "undefined") {
        return tcid;
    }
}
//获取分类
function couponfen2() {
    var itid;
    $(".goods_fenlei li").each(function () {
        if ($(this).attr("class") === "nav_btn cgf_xuanz") {
            itid = $(this).attr("data-cid");
        }
    });
    return itid;
}
//领券直播分类
function couponfen() {
    $(".goods_fenlei li").each(function () {
        $(this).click(function () {
            //清空筛选框内容
            $(".goods_shaixuan_jiage p input").val("");
            var itid = $(this).attr("data-cid");
            $(this).siblings().removeClass("cgf_xuanz");
            $(this).addClass("cgf_xuanz");
            var data = {
                tcid: goodsNav(),
                sxid: goodsScreen2(),
                itid: itid,
                pageIndex: 1,
                order: "g.id desc"
            };
            $("#listView").html(""); //清空所有商品
            //排序选择综合排序
            $(".coupon_goods_other li").removeClass("cgo_xuanz");
            $(".coupon_goods_other li:first-child").addClass("cgo_xuanz");
            goFirstPage();
            getList(data); //加载商品
        });
    });
}
//获取高级筛选已勾选
function goodsScreen2() {
    var xx = "";
//    alert($("input[name='shaixuan']:checked").length);
    $("input[name='shaixuan']:checked").each(function () {
        xx += $(this).attr("data-cid") + ",";
    });
    xx = xx.substr(0, xx.lastIndexOf(","));
//    alert(xx);
    return xx;
}
//高级筛选
function goodsScreen() {
    $(".goods_shaixuan ul li").each(function () {
        $(this).find("input").click(function () {
            var data = {
                goodsName: searchLike2(),
                tcid: goodsNav(),
                sxid: goodsScreen2(),
                itid: couponfen2(),
                pageIndex: 1,
                order: "g.id desc"
            };
            goFirstPage();
            getList(data);
        });
    });
}
//设置第一页时分页的样式
function goFirstPage() {
    $(".page_size span").each(function (i) {
        $(this).text(i + 1);
    });
    $(".pageIndex").text(1);
    $(".first_page,.up_page,.down_page,.last_page").removeClass("page_no");
    $(".page_size span").removeClass("page_num_no");
    $(".page_num1").addClass("page_num_no");
    $(".first_page,.up_page").addClass("page_no");
}
//领券直播排序
function couponPx() {
    $(".coupon_goods_other li").each(function () {
        $(this).click(function () {
            //获得价格、佣金比例、销量筛选
            var minPrice = $(".minPrice").val();
            var maxPrice = $(".maxPrice").val();
            var yjScale = $(".yjScale").val();
            var salesVolume = $(".salesVolume").val();
            $(this).siblings().removeClass("cgo_xuanz");
            $(this).addClass("cgo_xuanz");
            var a = "a";
            var data = {
                minPrice: minPrice,
                maxPrice: maxPrice,
                yjScale: yjScale,
                salesVolume: salesVolume,
                goodsName: searchLike2(),
                tcid: goodsNav(),
                itid: couponfen2(),
                sxid: goodsScreen2(),
                pageIndex: 1,
                order: goodsPaixu(a)
            };
            goFirstPage();
            getList(data);
        });
    });
}
//点击筛选，筛选价格、佣金比例、销量
function clickSx() {
    $(".goods_shaixuan_submit").click(function () {
        //获得相关数据！
        var minPrice, maxPrice, yjScale, salesVolume;
        var inputNum = $(".goods_shaixuan_jiage p input").length;
        for (var i = 1; i < inputNum + 1; i++) {
            var inputVal = $(".goods_shaixuan_jiage p input:nth-child(" + i + ")").val();
            if (inputVal === "" || inputVal === null) {
                inputVal = 0;
            }
            if (i === 1)
                minPrice = parseInt(inputVal);
            else if (i === 2)
                maxPrice = parseInt(inputVal);
            else if (i === 3)
                yjScale = parseInt(inputVal);
            else if (i === 4)
                salesVolume = parseInt(inputVal);
        }
        //设置为选中综合排序
        $(".coupon_goods_other li").removeClass("cgo_xuanz");
        $(".coupon_goods_other li:first-child").addClass("cgo_xuanz");
        var data = {
            goodsName: searchLike2(),
            tcid: goodsNav(),
            minPrice: minPrice,
            maxPrice: maxPrice,
            yjScale: yjScale,
            salesVolume: salesVolume,
            itid: couponfen2(),
            sxid: goodsScreen2(),
            pageIndex: 1,
            order: "g.id desc"
        };
        goFirstPage();
        getList(data);
    });
}
//获得当前选中的排序
function goodsPaixu(a) {
    var order;
    $(".coupon_goods_other li").each(function () {
        if ($(this).attr("class") === "cgo_xuanz") {
            var good_px = $(this).text();
            if (good_px === "最新") {
                order = "add_time desc";
            } else if (good_px === "销量") {
                order = "biz30day desc";
            } else if (good_px === "领券量") {
                //券总量-券剩余量
                order = "(couponTotalCount - couponLeftCount) desc";
            } else if (good_px === "佣金比例") {
                order = "tkRate desc";
            } else if (good_px === "价格") {
                order = "zkPrice asc";//默认升序
                //通过点击价格排序获得升序还是降序
                if (a === "a") {
                    if (zkPriceP === 1) {
                        zkPriceP = 0;
                        $(".cgo_pai").css({"background-position": "-25px 0px"});
                        order = "zkPrice asc";//默认升序
                    } else {
                        zkPriceP = 1;
                        $(".cgo_pai").css({"background-position": "-18px 0px"});
                        order = "zkPrice desc";
                    }
                    //通过点击页数获取排序
                } else {
                    if ($(".cgo_pai").css("background-position") === "-25px 0px") {
                        order = "zkPrice asc";//默认升序
                    } else {
                        order = "zkPrice desc";
                    }
                }
            }
        }
    });
    return order;
}
//获取搜索商品内容
function searchLike2() {
    var goodsNameLike = $(".goodsNameLike").val();
    return goodsNameLike;
}
//模糊搜索商品
function searchLike() {
    $(".search_goods").click(function () {
        //清空筛选框内容
        $(".goods_shaixuan_jiage p input").val("");
        //设置为选中综合排序
        $(".coupon_goods_other li").removeClass("cgo_xuanz");
        $(".coupon_goods_other li:first-child").addClass("cgo_xuanz");
        var data = {
            goodsName: searchLike2(),
            tcid: goodsNav(), //头部导航分类
            sxid: goodsScreen2() //高级筛选所勾选项
//            order: goodsPaixu() //排序
        };
        goFirstPage();
        getList(data);
    });
}

//banner图轮播
function lunbo() {
    var win_wid = $(window).width();
    $(".com_lunbo").width(win_wid * 3 + 10);
    $(".com_lunbo img").width(win_wid + 5);

    var index = 0;
    var stop = false;
    var left = 0;
    var indexMax = $(".com_lunbo img").length;
    //鼠标悬停停止轮播，鼠标离开继续轮播
    $(".com_lunbo img").mouseover(function () {
        stop = true;
    }).mouseout(function () {
        stop = false;
    });
    //每阁5秒轮换一次
    setInterval(function () {
        if (stop)
            return;
        index++;
        left = index * (win_wid);
        if (index === indexMax) {
            index = 0;
            left = 0;
        }
        $(".com_lunbo").css("margin-left", -left + "px");
        $(".com_ul li").removeClass();
        $(".com_ul li:eq(" + index + ")").addClass("com_ulli_xuan");
    }, 5000);
    //点击左右切换按钮
    $(".com_btn_left").click(function () {
        index--;
        left = index * (win_wid);
        if (index === -1) {
            index = indexMax - 1;
            left = index * (win_wid);
        }
        $(".com_lunbo").css("margin-left", -left + "px");
        $(".com_ul li").removeClass();
        $(".com_ul li:eq(" + index + ")").addClass("com_ulli_xuan");
    });
    $(".com_btn_right").click(function () {
        index++;
        left = index * (win_wid);
        if (index == indexMax) {
            index = 0;
            left = 0;
        }
        $(".com_lunbo").css("margin-left", -left + "px");
        $(".com_ul li").removeClass();
        $(".com_ul li:eq(" + index + ")").addClass("com_ulli_xuan");
    });
}

function addtuiguang() {
    //去掉“加入推广”按钮的点击事件
    $(".for_goods_spread").unbind();
    function click_goods() {
        BUI.Message.Show({
            msg: '请使用积米淘客助手！</br><span style="font-size:12px;">点击确认前往下载页</span>',
            icon: 'warning',
            autoHide: true,
            buttons: [{
                    text: '确认',
                    elCls: 'button button-primary',
                    handler: function () {
                        window.open("/index.php/home/index/introduce.html", "_self");
                    }
                }, {
                    text: '取消',
                    elCls: 'button',
                    handler: function () {
                        this.close();
                    }
                }],
            autoHideDelay: 2666
        });
    }
    //点击"加入推广"弹出提示
    $(".for_goods_spread").on('click', function () {
        click_goods();
    });
}

//复制文案
function copyGoodsInfo() {
    $(".for_goods").each(function () {
        $(this).mouseover(function () {
            //获得商品列表右边距浏览器右边的距离
            var goods_right = $(window).width() - $(this).offset().left - $(this).width();
            $(this).find(".for_goods_btn1").show();
            $(this).find(".copy_text").mouseover(function () {
                $(this).text("点击复制").siblings(".intro,.intro_coupon").show();
                copyGoods($(this));
                //复制框显示方向
                if (goods_right < 400) {
                    $(this).siblings(".intro").css({"left": "-40px"});
                    $(this).siblings(".intro_coupon").css({"left": "-90px"});
                    $(this).siblings(".intro,.intro_coupon").find(".jiantou_left").css({"transform": "rotate(180deg)", "left": "226px"});
                } else {
                    $(this).siblings(".intro").css({"left": "398px"});
                    $(this).siblings(".intro_coupon").css({"left": "295px"});
                    $(this).siblings(".intro,.intro_coupon").find(".jiantou_left").css({"transform": "rotate(0deg)", "left": "-8px"});
                }
            }).mouseout(function () {
                $(this).text("复制文案").siblings(".intro,.intro_coupon").hide();
            });
        }).mouseout(function () {
            $(this).find(".for_goods_btn1").hide();
            $(this).find(".copy_text").hide();
        });
    });
}

function copyGoods() {
    //判断是否支持一键复制 0 不支持 1 支持
    var ClipboardSupport = 0;
    if (typeof Clipboard != "undefined") {
        ClipboardSupport = 1;
    } else {
        ClipboardSupport = 0;
    }
    $(".copy_text").each(function () {

        $(this).click(function (e) {
//        layer.closeAll();
            if (ClipboardSupport == 0) {
                BUI.Message.Show({
                    msg: '浏览器版本太低，请升级或更换浏览器后重新复制！',
                    icon: 'warning',
                    buttons: [],
                    autoHide: true,
                    autoHideDelay: 2000
                });
            } else {
                if ($(this).siblings(".intro,.intro_coupon").length > 0) {
                    if (document.getElementById('copyContent')) {
                        //存在复制内容框重置值
                        $('#copyContent').html($(this).siblings('.intro,.intro_coupon').html());
                        $('#copyContent').find('img').attr('src', $('#copyContent').find('img').data('src'));
                    } else {
                        //不存在复制内容框设置
                        var copy = document.createElement('div');
                        copy.id = "copyContent";
                        copy.innerHTML = $(this).siblings('.intro,.intro_coupon').html();
                        document.body.appendChild(copy);
                        $('#copyContent').find('img').attr('src', $('#copyContent').find('img').data('src'));
                    }
                    if (!$(this).hasClass('copy_text_btn')) {
                        $(this).addClass('copy_text_btn');
                    }
                    var copy = document.getElementById('copyContent');
                    copyFunction(copy);
                } else {
                    BUI.Message.Show({
                        msg: '太快了，请重新复制！',
                        icon: 'warning',
                        buttons: [],
                        autoHide: true,
                        autoHideDelay: 2000
                    });
                }
            }
        });

    });
    //设置一键复制
    var copyFunction = function (copy) {
        var clipboard = new Clipboard('.copy_text_btn', {
            target: function () {
                return copy;
            }
        });
        clipboard.on('success', function (e) {
            BUI.Message.Show({
                msg: '复制成功',
                icon: 'success',
                buttons: [],
                autoHide: true,
                autoHideDelay: 2000
            });
            $("#copyContent").hide();
            e.clearSelection();
        });
        clipboard.on('error', function (e) {
            BUI.Message.Show({
                msg: '复制失败，请升级或更换浏览器后重新复制！',
                icon: 'error',
                buttons: [],
                autoHide: true,
                autoHideDelay: 2000
            });
            $("#copyContent").hide();
            e.clearSelection();
        });
    };
}

BUI.use('bui/menu', function (Menu) {
    var dropMenu2 = new Menu.PopMenu({
        trigger: '#addsvc',
        autoRender: true,
        triggerEvent: 'mouseenter',
        triggerHideEvent: 'mouseleave',
        autoHideType: 'leave',
        width: 180,
        children: [{
                content: "官方二群：<a href='http://shang.qq.com/wpa/qunwpa?idkey=8b754d4cd88e9290dd1a8c794571eea748b4555788c97cb5a367701cc4b97868' target='_blank'> 596807694</a>"
            }, {
                content: "官方三群：<a href='http://shang.qq.com/wpa/qunwpa?idkey=3ab3d90c5e921fea5851c82c45d9beba0093606ac6a4c740f3b5e3120b3829f1' target='_blank'> 490010392</a>"
            }]
    });
});