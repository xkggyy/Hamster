<?php

namespace Admin\Controller;

use Think\Controller;

class LoginController extends Controller {

    /**
     * 登录页
     */
    public function index() {
        // 登录判断
        if (session('?user')) {
            $this->redirect("index/index");
        } else {
            $this->display();
        }
        //$this->display();
    }

    public function registqweasd() {
        $this->display();
    }

    public function login() {
        $callback = 'http://www.j1m1.com/index.php?s=admin/login/qq_callback';
        $QC = new \Org\ConnectQQ\api\QC();
        $QC->qq_login($callback);
    }

    public function registasd() {
        $callback = 'http://www.j1m1.com/index.php?s=admin/login/qq_callback_register';
        $QC = new \Org\ConnectQQ\api\QC();
        $QC->qq_login($callback);
    }

    /**
     * 显示没有权限的提示
     */
    public function noAuth() {
        $this->display();
    }

    /**
     * 退出登录
     */
    public function out() {
        session(null);
        $this->redirect("login/index");
    }

    /**
     * qq登陆回调
     */
    public function qq_callback() {
        //引入QQ登陆类
        $QC = new \Org\ConnectQQ\api\QC();
        $token = $QC->qq_callback('http://www.j1m1.com/index.php?s=admin/login/qq_callback');
        $openid = $QC->get_openid();
        $QC_info = new \Org\ConnectQQ\api\QC($token, $openid);
        $arr = $QC_info->get_user_info();
        // 将用户信息填入data数组
        $data['qq_openid'] = $openid; //QQ登陆唯openid
        // $data['account'] = $arr['nickname']; //用户ID
        $data['nickname'] = $arr['nickname']; //网名
        $data['gender'] = $arr['gender']; //姓名
        $data['province'] = $arr['province']; //省
        $data['city'] = $arr['city']; //市
        $data['thumb'] = $arr['figureurl_qq_2']; //头像

        $user = D("members");
        $_user = $user->create($data);
        if (!$_user) {
            // 写入登陆状态
            session('user.id', $user->id);
            session('user.account', $user->account);
            session('user.nickname', $user->nickname);
            session('user.thumb', $user->thumb);
            session('user.flag', $user->flag);
            // 写入登陆时间
            $user->lastlogintime = time();
            $user->save();
        }
        echo '<script>top.location.href="index.php/admin/index/index"</script>';
        // $this->redirect('index/index');
    }

    /**
     * qq登陆回调--新用户先注册,在配置权限.
     */
    public function qq_callback_register() {
        //引入QQ登陆类
        $QC = new \Org\ConnectQQ\api\QC();
        $token = $QC->qq_callback('http://www.j1m1.com/index.php?s=Hamster/user/qq_callback');
        $openid = $QC->get_openid();
        $QC_info = new \Org\ConnectQQ\api\QC($token, $openid);
        $arr = $QC_info->get_user_info();
        // 将用户信息填入data数组
        $data['qq_openid'] = $openid;
        //QQ登陆唯openid
        // $data['account'] = $arr['nickname']; //用户ID
        $data['nickname'] = $arr['nickname']; //网名
        $data['gender'] = $arr['gender']; //姓名
        $data['province'] = $arr['province']; //省
        $data['city'] = $arr['city']; //市
        $data['thumb'] = $arr['figureurl_qq_2']; //头像

        $user = D('members');
        $_user = $user->create($data);
        $data = array();
        if (!$_user) {
            // 写入登陆状态
            $this->redirect('/noAuth');
        } else {
            session('reguser', $_user);
            $user->add($data);
            $this->redirect('index/index');
        }
    }

}
