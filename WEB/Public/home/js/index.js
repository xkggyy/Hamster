$(function () {
    lunbo();//米粒英雄榜轮播
    follow();//关注几米网微平台
    hb_close();//关闭红包弹出窗
    cookie();//红包弹出窗
});
//米粒英雄榜轮播
function lunbo() {
    var num = $(".persons_w .list").length - 1;
    var stop = true;
    setInterval(function () {
        if (stop) {
            $(".persons_w .list:eq(0)").animate({"margin-left": "-230px"}, 600, function () {
                $(".persons_w .list:eq(0)").css("margin-left", 10).insertAfter(".persons_w .list:eq(" + num + ")");
                marginLeft = 0;
            });
        }
    }, 5000);
    $(".persons_s").mousemove(function () {
        stop = false;
    }).mouseout(function () {
        stop = true;
    });
}
//关注几米网微平台
function follow() {
    $(".follow_wx,#follow").mousemove(function () {
        $("#follow").show();
    }).mouseout(function () {
        $("#follow").hide();
    });
}
//关闭红包弹出窗
function hb_close() {
    $(".hb_close_img").click(function () {
        $("#hb_t,#login_bg").hide();
    });
}
//红包弹出窗
function cookie() {
    //判断cookie是否存在
    if ($.cookie("example") === null || $.cookie("example") === undefined) {
        $("#hb_t").show();
        $.cookie("example", 1, {expires: 1});//设置cookie值为1,存储时间1天
    }
}

