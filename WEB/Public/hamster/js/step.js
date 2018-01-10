$(function () {
//    var url = window.location.href;//获取当前的URL
//    url = url.replace(/[^a-z0-9]/gi, "");//用正则清除字符串中的所有非字母和数字的内容
//    if ($.cookie("url") == "" || $.cookie("url") == null) {
//        $.cookie("url", url, {expires: 2592000});//存储时间30天
//        setStep();
//    }
   var isfirst =  storage.get('isfirst',false);
   if(isfirst==null){
       //第一次
       isfirst=true;
       setStep();
       storage.set("isfirst",true);
   }
});
function setStep() {
    //首页
    var step_1_1 = "<img src='/public/hamster/v2.0/img/img/step/step_1-1.png' alt=''/>" +
            "<div class='step_look' style='width: 220px;height: 38px;position: absolute;left: 380px;top: 396px;cursor: pointer;'></div>" +
            "<div class='step_close' style='width: 11px;height: 11px;position: absolute;cursor: pointer;left: 621px;top: 194px;'></div>";
    var step_html = "<div id='step' style='width:100%;height:100%;position: fixed;z-index: 999999999;'>" + step_1_1 + "</div>";
    $("#main_v3").before(step_html);
    //首页
    $(".step_close").click(function () {
        $("#step").remove();
    });
    $(".step_look").click(function () {
        $("#step").empty();
        $("#step").append(setHtml("step_1-2","step_12_next",715,593));
        
        $(".step_12_next").click(function () {
            $("#step").remove();
        });
    });
    //点击今日推荐
    $(".rmdSr").click(function () {
        $("#main_v3").before(step_html);
        $("#step").empty();
        $("#step").append(setHtml("step_4-1","step_41_next",462,307));

        $(".step_41_next").click(function () {
            $("#step").remove();
        });
    });
    //点击帮助中心
    $(".help").click(function () {
        $("#main_v3").before(step_html);
        $("#step").empty();
        $("#step").append(setHtml("step_5-1","step_51_next",228,423));
        $(".step_51_next").click(function () {
            //帮助页面切换到客服中心            
            $("#iframe_aa").contents().find(".help_title li").eq(4).siblings().removeClass("li_xuan").find("span").css("background-position-x", "0px");
            $("#iframe_aa").contents().find(".help_title li").eq(4).addClass("li_xuan").find("span").css("background-position-x", "-40px");
            $("#iframe_aa").contents().find(".help_right").eq(4).siblings().hide();
            $("#iframe_aa").contents().find(".help_right").eq(4).show();

            $("#step").empty();
            $("#step").append(setHtml("step_5-2","step_52_next",675,560));
            $(".step_52_next").click(function () {
                $("#step").remove();
            });
        });
    });
    //点击QQ群发
    $(".qqgroup").click(function () {
        if (count != 0) {
            $("#main_v3").before(step_html);
            $("#step").empty();
            $("#step").append(setHtml("step_2-1","step_21_next",616,375));
            $(".step_21_next").click(function () {
                $("#step").empty();
                $("#step").append(setHtml("step_2-2","step_22_next",619,322));
                $(".step_22_next").click(function () {
                    $("#step").empty();
                    $("#step").append(setHtml("step_2-3","step_23_next",169,316));
                    $(".step_23_next").click(function () {
                        $("#step").remove();
                    });
                });
            });
        }
    });
    //点击微信群发
    $(".wxgroup").click(function () {
        if (count != 0) {
            $("#main_v3").before(step_html);
            $("#step").empty();
            $("#step").append(setHtml("step_3-1","step_31_next",701,391));
            $(".step_31_next").click(function () {
                $("#step").empty();
                $("#step").append(setHtml("step_3-2","step_32_next",619,322));
                $(".step_32_next").click(function () {
                    $("#step").empty();
                    $("#step").append(setHtml("step_3-3","step_33_next",169,316));
                    $(".step_33_next").click(function () {
                        $("#step").remove();
                    });
                });
            });
        }
    });
}
function setHtml(a,b,c,d){
    return "<img src='/public/hamster/v2.0/img/img/step/"+ a +".png' alt=''/><div class='"+ b +"' style='width: 100px;height: 37px;position: absolute;cursor: pointer;left: "+ c +"px;top: "+ d +"px;'></div>";
}

