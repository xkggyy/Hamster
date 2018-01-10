$(function(){
                //导航菜单切换样式
            $(".t_nav li").each(function(){
                $(this).click(function(){
                    $(".t_nav li").removeClass("li_xuan");
                    $(this).addClass("li_xuan");
                });
            });
    
    //750、1420、2150、2850
    $(window).scroll(function () {
        var scrollTop = parseInt($(this).scrollTop());
        if(scrollTop<100){
            $("#synopsis").addClass("sec1");
        }else if(scrollTop>650 && scrollTop<850){
            $("#synopsis").removeClass("sec1");
            $("#exclusive").addClass("sec2");
        }else if(scrollTop>1320 && scrollTop<1520){
            $("#exclusive").removeClass("sec2");
            $("#operate").addClass("sec3");
        }else if(scrollTop>2050 && scrollTop<2250){
            $("#operate").removeClass("sec3");
            $("#threshold").removeClass("sec5");
            $("#powerful").addClass("sec4");
        }else if(scrollTop>2750){
            $("#powerful").removeClass("sec4");
            $("#threshold").addClass("sec5");
        }
    });
});