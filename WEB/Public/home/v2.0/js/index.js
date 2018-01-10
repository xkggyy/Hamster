$(function () {
    $("#top_nav .wx,.ewm").mousemove(function () {
        $("#top_nav .ewm").show();
    }).mouseout(function () {
        $("#top_nav .ewm").hide();
    });
    $("#top_nav .qq,.qh").mousemove(function () {
        $("#top_nav .qh").show();
    }).mouseout(function () {
        $("#top_nav .qh").hide();
    });
});