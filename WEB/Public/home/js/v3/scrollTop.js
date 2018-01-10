var slide = {
    index:1,
    scrollB:true,
    scroll:function(e){
        var e = e || window.event;
        if(!slide.scrollB) return;
        slide.scrollB = false;
        var top = [0,-750,-1420,-2150,-2850];//设置滚动高度
        var box = $("body");//找到滚动元素

        setTimeout(function(){
            //针对火狐
            if(e.detail){
                //向下滚动
                if(e.detail>0){
                    slide.index++;
                    if(slide.index>=6) slide.index=6;
                    box.style.cssText = "-webkit-transform:translateY("+top[slide.index-1]+"px);transform:translateY("+top[slide.index-1]+"px)";
                }else{
                    //向上滚动
                    slide.index--;
                    if(slide.index<=1) slide.index=1;
                    if(slide.index==5){
                        slide.index=4;
                    }
                    box.style.cssText = "-webkit-transform:translateY("+top[slide.index-1]+"px);transform:translateY("+top[slide.index-1]+"px)";
                }
                //除火狐之外的浏览器
            }else if(e.wheelDelta){
                //向上滚动
                if(e.wheelDelta>0){
                    slide.index--;
                    if(slide.index<=1) slide.index=1;
                    if(slide.index==5){
                        slide.index=4;
                    }
                    box.style.cssText = "-webkit-transform:translateY("+top[slide.index-1]+"px);transform:translateY("+top[slide.index-1]+"px)";
                }else{
                    //向下滚动
                    slide.index++;
                    if(slide.index>=6) slide.index=6;
                    box.style.cssText = "-webkit-transform:translateY("+top[slide.index-1]+"px);transform:translateY("+top[slide.index-1]+"px)";
                }
            }

            setTimeout(function(){
                //设置添加current
                var child = box.getElementsByTagName("section");
                var len = child.length;
                for( i in child ){
                    var s = child[i].className;
                    if(s && s.indexOf("current")>-1){
                        s = s.replace("current","");
                        child[i].className = s ;
                    }
                }
                if(slide.index==6){
                    slide.index=5;
                }
                //滚动到的当前区域添加current
                child[slide.index-1].className = 'sec'+slide.index+" current";
                slide.scrollB = true;
            },500);
            e.preventDefault();
        },300);

    },
    scrollEvent:function(){
        //判断浏览器 滚轮事件
        if(window.addEventListener){
            window.addEventListener("DOMMouseScroll",this.scroll,false);
        }
        window.onmousewheel = this.scroll;
    },
    init:function(){
        this.scrollEvent();
    }
};
slide.init();
