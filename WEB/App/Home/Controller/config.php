<?php

return $array = array(
    'DEFAULT_THEME' => 'v2.0', // 默认模板文件名称
    'SHOW_PAGE_TRACE' => FALSE, // 显示页面Trace信息
    'DEFAULT_FILTER'  =>  '',
    'TMPL_PARSE_STRING' => array(
        '__PUBLIC__' => __ROOT__ . '/Public/Hamster', // 更改默认的/Public 替换规则
        '__IMG__' => __ROOT__ . '/Public/Hamster/images',
        '__CSS__' => __ROOT__ . '/Public/Hamster/css', // 增加新的CSS类库路径替换规则
        '__JS__' => __ROOT__ . '/Public/Hamster/js', // 增加新的JS类库路径替换规则
        '__BUI__' => __ROOT__ . '/Public/Hamster/bui', // BUI框架目录
        '__IMG2__' => __ROOT__ . '/Public/Hamster/v2.0/img',
        '__CSS2__' => __ROOT__ . '/Public/Hamster/v2.0/css',
        '__STATIC__' => __ROOT__ . '/Public/static'
    ),
    'SmsConfig' => array(
//        'username'=>'xiaocangshu',
//        'password'=> '123456Aaa',
        'content_tep' => '您的验证码是{vcode}，请于5分钟内正确输入，超时无效。'
    ),
);
