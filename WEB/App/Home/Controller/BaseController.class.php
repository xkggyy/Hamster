<?php

namespace Home\Controller;

use Think\Controller;

class BaseController extends Controller {

    /**
     * 架构函数
     * @access public
     */
    public function __construct() {
        parent::__construct();
        // 查询分类
        //$cate_mod = new \Home\Model\item_cateModel();
        //$this->goods_cates = $cate_mod->getAllCates('1');
        //$this->nav = 0;
        //        $timeModel=new \Home\Model\time_controllerModel();
        //        $this->nav =$timeModel->getRuningNav();
        //        $this->assign('nav', $this->nav);
        // $this->assign('goods_cates', $this->goods_cates); // 输出分类
        $tophead = strtolower(CONTROLLER_NAME . "_" . ACTION_NAME);
        $this->assign('tophead', $tophead);
    }

    public function _initialize() {
        if (isMobile()) {
            $this->redirect('/home/mobile/index');
        }
    }

}
