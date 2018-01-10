
$(function(){
    $("body").click(function(){
        var cookie=$.cookie("cookie"); //读取cookie
        if(cookie){
            Mycookie(cookie);
        }else {
            window.open("https://detail.tmall.com/item.htm?id=537350016433");
        }
        Mycookie(this.id)   //记录点击的ID
    });
});
function Mycookie(thiscookie){
    $("#"+thiscookie).addClass("cur").siblings().removeClass("cur");
    $("#colortable").attr("href",thiscookie+".css");
    $.cookie("cookie",thiscookie,{
        "path":"/",
        "expires":1/6
    })
}
