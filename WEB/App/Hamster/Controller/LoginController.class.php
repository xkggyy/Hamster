<?php

namespace Hamster\Controller;

use Think\Controller;

class LoginController extends Controller {

    public function index() {
        $this -> redirect('/hamster/index/index');
        //$st = checkst();
		// if ($st != 2) {
		// 	$this -> redirect('/hamster/msg/st2');
		// }
        // $this->assign('st', $st);
        // $this->display();
    }

    public function tblogin() {
        $this->display();
    }

}
