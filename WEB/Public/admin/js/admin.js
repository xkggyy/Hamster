/**
 * 用户添加
 * @returns {Boolean}
 */
function inad() {
    if ($.trim($("#username").val()) == "")
    {
        alert("用户名不能为空！！");
        return false;
    }
    if ($.trim($("#userpass").val()) == "")
    {
        alert("密码不能为空！！");
        return false;
    }
    if ($.trim($("#userpass2").val()) != $.trim($("#userpass").val()))
    {
        alert("两次输入的密码不一致");
        return false;
    }
    $.post("save_user", {
        username: $.trim($("#username").val()),
        userpass: $.trim($("#userpass").val())
    }, function (result) {
        alert(result.info);
    }, "json");
}

function config_save() {
    var unit_price = $("#unit_price").val();
    var amount = $("#amount").val();
    if (unit_price == "" || amount == "")
    {
        alert('请完整填写所有必填项后再进行保存!');
        return false;
    }
    $.post("sys_save", {
        unit_price: unit_price,
        amount: amount
    }, function (result) {
        alert(result.info);
    }, "json");
}
function update_user(id) {
    var uid = id;
    var userpass = $.trim($("#userpass").val());
    var userlock = $("input[name=userlock]:checked").val();
    var payn = $("#payn").val();
    var dianhua = $("#dianhua").val();
    var amount = $("#amount").val();
    var qq = $("#qq").val();
    var pay_name = $("#pay_name").val();
    var pay_username = $("#pay_username").val();
    var pay_id = $("#pay_id").val();
    var unit_price = $("#unit_price").val();
    $.post("upuser_save", {
        unit_price: unit_price,
        dianhua: dianhua,
        id: uid,
        userpass: userpass,
        userlock: userlock,
        payn: payn,
        amount: amount,
        qq: qq,
        pay_username: pay_username,
        pay_name: pay_name,
        pay_id: pay_id
    }, function (result) {
        alert(result.info);
    }, "json");
}


function up() {
    var un = $.trim($("#adminname").val());
    var up = $.trim($("#password1").val());
    var nup = $.trim($("#password2").val());
    if (un == "" || up == "") {
        alert("用户名密码不能为空");
        return false;
    }
    if (up != nup) {
        alert("两次输入的密码不一致");
        return false;
    }
    $.post("upass", {
        username: un,
        userpass: up
    }, function (result) {
        alert(result.info);
    }, "json");
}

