<?php

return array(
    'DB_TYPE' => 'mysql', // 数据库类型
    'DB_HOST' => 'rdsjb67frjb67fr.mysql.rds.aliyuncs.com', // 服务器地址
    //'DB_HOST' => 'xkggyy2.vicp.cc', // 服务器地址
    'DB_NAME' => 'ice_j1m1', // 数据库名
    'DB_USER' => 'icesql', // 用户名
    'DB_PWD' => '135798462', // 密码
    'DB_PORT' => 3306, // 端口
    'DB_PREFIX' => 'hamster_', // 数据库表前缀 线上为‘ju_’
    // 允许访问的模块列表'
    'MODULE_ALLOW_LIST' => array('Home', 'Admin', 'Hamster', 'Mobile','H5','HuiGou'),
    'DEFAULT_MODULE' => 'Home', // 默认模块
    'AUTH_CONFIG' => array(
        'AUTH_ON' => true, // 认证开关
        'AUTH_TYPE' => 1, // 认证方式，1为实时认证；2为登录认证。
        'AUTH_USER' => 'members', // 用户信息表
        
    ),
    'S_VER' => '1.0.0.8',
    'S_FILE' => 'http://dl.softmgr.qq.com/original/net_app/Hamster-1.0.0.8.exe',
    
    'UPLOAD_FILE_QINIU'     => array (
          'maxSize'           => 5 * 1024 * 1024,//文件大
          'rootPath'          => './Public/',
          'savePath'          => 'img/',// 文件上传的保存路径
          'saveName'          => array ('uniqid', ''),
          'exts'              => ['jpg', 'gif', 'png', 'jpeg'],  // 设置附件上传类型
          'driver'            => 'Qiniu',//七牛驱动
          'driverConfig'      => array (
          'secretKey'        => '0lx0KIoL3oxR2HadxVPQRPQZaswaDF91hUblQXHv',
          'accessKey'        => 'cgR_hCNy3L9oqG1NFT70UDZCWv2jlGONikaUeSKl',
          'domain'           => 'ou1zy599y.bkt.clouddn.com',
          'bucket'           => 'abcp',
         )
    ),
);
