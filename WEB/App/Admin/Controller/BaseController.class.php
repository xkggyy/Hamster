<?php

namespace Admin\Controller;

use Think\Controller;
use \Think\Auth;

class BaseController extends Controller {

    protected function _initialize() {
//        if (!session('user.id')) {
//            $this->redirect("login/index");
//        }
//        $access = D("auth_group_access");
//        $uaccess = $access->where('uid=' . session('user.id'))->count();
//        if ($uaccess < 1) {
//            $this->error('你不是后台管理员，没有权限！');
//        }
//        $in_auth = array('Admin/Goods/goods_list', 'Admin/Schedule/schedule_list', 'Admin/Members/members_list',
//            'Admin/Category/category_list', 'Admin/Oauth/group_list', 'Admin/Oauth/rule_list');
//        if (!in_array(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME, $in_auth)) {
//            return true;
//        }
//        $auth = new Auth();
//        if (!$auth->check(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME, session('user.id'))) {
//            $this->error('没有权限！' . MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME . "," . session('user.id'));
//        }
    }

    /**
     * 架构函数
     */
    public function __construct() {
        parent::__construct();
        // 登录检测
        // if (!session('?user')) {
        //     // 判断是否是管理员
        //     $this->redirect("login/index");
        // }else{
        //     if (session('user.flag') != 1) {
        //         $this->redirect("login/out");
        //     }
        // }
    }

}
