<?php
return $array = array(

    //'配置项'=>'配置值'
    //'URL_MODEL' => 2, //URL模式
    'DEFAULT_THEME' => 'default',
    'SHOW_PAGE_TRACE' => FALSE, // 显示页面Trace信息
//    'APP_DEBUG' => TRUE, //开启调试模式
    'DEFAULT_FILTER'  =>  '',   // 默认参数过滤方法 用于I函数...
    'TMPL_ACTION_SUCCESS' => 'Public:success',  //默认成功跳转对应的模板文件
    'TMPL_ACTION_ERROR' => 'Public:error',  //默认错误跳转对应的模板文件
    'TMPL_PARSE_STRING' => array(
        '__UPLOAD__' => __ROOT__ .'/Uploads', // 增加新的上传路径替换规则
        '__JS__'     => __ROOT__ .'/Public/admin/js', // 增加新的JS类库路径替换规则
        '__CSS__'    => __ROOT__ .'/Public/admin/css', // 增加新的JS类库路径替换规则
        '__PUBLIC__' => __ROOT__ .'/Public/admin', // 更改默认的/Public 替换规则
        '__STATIC__' => __ROOT__ .'/Public/static',
    ),
);