<?php

namespace Hamster\Controller;

use Think\Controller;

/**
 * @author 朱焱华
 */
class MerchantsController extends BaseController {

    public function index() {
        return $this->display();
    }

    public function addgoods() {
        $cateList = D('item_cate')->getAllCates(0, 40, NULL, '1');
        $this->assign("cateList", $cateList);
        return $this->display();
    }

}
