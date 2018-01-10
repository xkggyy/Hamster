<?php

return $array = array(
//    'URL_MODEL' => 2, //URL模式
    'DEFAULT_THEME' => 'v2.0', // 默认模板文件名称
//    'DEFAULT_THEME' => 'sellerB', // 默认模板文件名称
    'SHOW_PAGE_TRACE' => FALSE, // 显示页面Trace信息
    'DEFAULT_FILTER' => '',
    'TMPL_PARSE_STRING' => array(
        '__PUBLIC__' => __ROOT__ . '/Public/Home/v2', 
        '__BUI__' => __ROOT__ . '/Public/Home/v2/bui', 
        '__JS__' => __ROOT__ . '/Public/Home/v2.0/js', 
        '__IMG__' => __ROOT__ . '/Public/Home/v2.0/images',
        '__CSS__' => __ROOT__ . '/Public/Home/v2.0/css',
        '__STATIC__' => __ROOT__ . '/Public/static',
        '__MPUBLIC__' => __ROOT__ . '/Public/home/mobile', // 更改默认的/Public 替换规则
        '__MIMG__' => __ROOT__ . '/Public/home/mobile/images',
        '__MCSS__' => __ROOT__ . '/Public/home/mobile/css', // 增加新的CSS类库路径替换规则
        '__MJS__' => __ROOT__ . '/Public/home/mobile/js', // 增加新的JS类库路径替换规则
        '__MBTP__' => __ROOT__ . '/Public/home/bootstrap', // BUI框架目录
        '__MSTATIC__'=>__ROOT__.'/Public/static',
        '__MPSTATIC__'=>__ROOT__.'/Public/home/static',
    ),
);
