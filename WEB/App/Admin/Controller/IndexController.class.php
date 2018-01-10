<?php

namespace Admin\Controller;

use Think\Controller;

class IndexController extends BaseController {

    /**
     * 后台首页
     */
    public function index() {
        //import('ORG.Util.Auth');//加载类库
        $auth = new \Think\Auth();
        $userid = session('user.id');
        $ret = $auth->getGroups($userid);
        $rules = $ret[0]['rules'];
        //$rules['']
        $this->display();
    }

    /**
     * 快速开始 导航页
     */
    public function main() {
        $this->display();
    }

}
