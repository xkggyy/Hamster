<?php

/**
 * File: function.php
 * 访问所有的模块之前都会首先加载公共模块下面的配置文件（Conf/config.php）和公共函数文件（Common/function.php）.
 */
// defined('CURRENT_URL') or define('CURRENT_URL',base64_encode(I('server.REQUEST_URI')));
/** * 用DES算法加密/解密字符串 * *
 @return string 返回经过加密/解密的字符串
 */
// 加密，注意，加密前需要把数组转换为json格式的字符串
function des_encrypt($string, $key)
{
    $size = mcrypt_get_block_size('des', 'ecb');
    $string = mb_convert_encoding($string, 'GBK', 'UTF-8');
    $pad = $size - (strlen($string) % $size);
    $string = $string.str_repeat(chr($pad), $pad);
    $td = mcrypt_module_open('des', '', 'ecb', '');
    $iv = @mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    @mcrypt_generic_init($td, $key, $iv);
    $data = mcrypt_generic($td, $string);
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
    $data = base64_encode($data);

    return $data;
}

// 解密，解密后返回的是json格式的字符串
function des_decrypt($string, $key)
{
    $string = base64_decode($string);
    $td = mcrypt_module_open('des', '', 'ecb', '');
    $iv = @mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    $ks = mcrypt_enc_get_key_size($td);
    @mcrypt_generic_init($td, $key, $iv);
    $decrypted = mdecrypt_generic($td, $string);
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
    $pad = ord($decrypted[strlen($decrypted) - 1]);
    if ($pad > strlen($decrypted)) {
        return false;
    }
    if (strspn($decrypted, chr($pad), strlen($decrypted) - $pad) != $pad) {
        return false;
    }
    $result = substr($decrypted, 0, -1 * $pad);
    $result = mb_convert_encoding($result, 'UTF-8', 'GBK');

    return $result;
}

// 检测是否是积米浏览器 控制标识符0（不是积米浏览器） 1（是积米浏览器但版本不对）2（全部符合）
function checkst()
{
    $agent = I('server.HTTP_USER_AGENT'); // 判断浏览器USER-AGENT标识是否是积米浏览器
    $st = 0; // 控制标识符0（不是积米淘客助手） 1（是积米淘客助手但版本不对）2（全部符合）
    if (preg_match("/Hamster\/(\d+\.\d+\.\d+\.\d+)/i", $agent, $content)) {
        $st = 1;
        if (strtover($content[1]) >= strtover(C('HVER'))) {
            $st = 2;
        }
    }

    return $st;
}

// 用于将字符版本号转换成数字
function strtover($sv)
{
    if (preg_match("/(\d+)\.(\d+)\.(\d+)\.(\d+)/i", $sv, $content)) {
        return $content[1] * 10000000 + $content[2] * 10000 + $content[3] * 100 + $content[4];
    } else {
        return 100000000;
    }
}

function convertUrlQuery($query)
{
    $queryParts = explode('&', $query);
    $params = array();
    foreach ($queryParts as $param) {
        $item = explode('=', $param);
        $params[$item[0]] = $item[1];
    }

    return $params;
}

/**
 * post方式提交.
 */
function do_post($url, $data)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_URL, $url);
    $ret = curl_exec($ch);

    curl_close($ch);

    return $ret;
}

/**
 * get方式获取内容.
 */
function get_url_contents($url)
{
    //    if (ini_get("allow_url_fopen") == "1") {
    //        return file_get_contents($url);
    //    } else {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
    //    }
}

/**
 * 生成验证码
 */
function randCheckCode()
{
    $str = '0123456789';
    $checkCode = '';
    for ($i = 0; $i < 6; ++$i) {
        $num = mt_rand(0, 9);
        $checkCode .= $str[$num];
    }

    return $checkCode;
}

/**
 * 淘宝商品采集模块
 */
function getItemInfo($url) {
    $url_arr = parse_url($url);
    $scheme = $url_arr['scheme'];
    $host = $url_arr['host'];
    $path = $url_arr['path'];
    $param = $url_arr['query'];
    $taoid = convertUrlQuery(htmlspecialchars_decode($param))['id']; //将&等转义后的字符转回，否则取不到id
    $qurl = $scheme . '://' . $host . $path . '?id=' . $taoid;
    $qurl = urlencode($qurl);
    return get_url_contents('http://pub.alimama.com/items/search.json?_tb_token_=test&q='.$qurl);
}
