<?php

namespace Home\Controller;

use Think\Controller;

class MobileController extends Controller {

    public function index() {
        if (!isMobile()) {
            $this->redirect('/home/index');
        }

        $this->display();
    }

    public function help() {
        if (!isMobile()) {
            $this->redirect('/home/index');
        }

        $this->display();
    }

    public function about() {
        if (!isMobile()) {
            $this->redirect('/home/index');
        }
        $this->display();
    }

    public function mdapp() {
        if (!isMobile()) {
            $this->redirect('/home/index');
        }
        $this->display();
    }

}
