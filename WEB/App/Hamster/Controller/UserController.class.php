<?php

namespace Hamster\Controller;

use Think\Controller;

class UserController extends BaseController {

    public function index() {
        $this->display();
    }

    /**
     * 帮助
     */
    public function help() {
        $this->display();
    }

    public function qq_login() {
        $callback = 'http://www.j1m1.com/index.php?s=Hamster/user/qq_callback';
        $QC = new \Org\ConnectQQ\api\QC();
        $QC->qq_login($callback);
    }

    /**
     * qq登陆回调.
     */
    public function qq_callback() {
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
            $data = $user->getByQq_openid($openid);
            session('user', $data);
            setcookie("userid", $data["id"]);
            // 写入登陆时间
            $user->lastlogintime = time();
            $user->save();
            $this->redirect('/hamster/user/loginsuccess');
        } else {
            session('reguser', $_user);
            $this->redirect('/hamster/user/register');
        }
    }

    public function register() {
        return $this->display();
    }

    /**
     * 短信验证
     */
    public function sendSms() {
        $data = array();
        $data['success'] = false;
        $phone = I('post.phone');
        if (empty($phone)) {
            $data['message'] = '没有参数';
            $this->ajaxReturn($data);
        } else {
            if (!preg_match("/^1[34578]\d{9}$/", $phone)) {
                $data['message'] = '手机号码不正确';
                $this->ajaxReturn($data);
            }
        }
        $mem = new \Hamster\Model\MembersModel();
        $count = $mem->valiMembersTel($phone);
        if ($count > 0) {
            $data['message'] = '手机号码已注册';
            $this->ajaxReturn($data);
        }
        $url = 'http://www.ztsms.cn/sendNSms.do';
        $now = date('YmdHis');
        $checkCode = randCheckCode();

        $pw = md5(md5('Xcs888999') . $now);
        $url .= '?username=xiaocangshu&tkey=' . $now . '&password=' . $pw . '&mobile=' . $phone . '&content=' . urlencode(str_replace('{vcode}', $checkCode, C('SmsConfig.content_tep'))) . '&productid=676767&xh=0';
        $output = get_url_contents($url);
        $l = strlen($output);
        if ($l > 2) {
            $status = substr($output, 0, 1);
            if ($status == '1') {
                session(array('name' => 'checkCode', 'expire' => 300));
                session('checkCode', $checkCode);
                session('phone', $phone);
                $data['success'] = true;
                $data['message'] = '短信发送成功';
            } else {
                $data['message'] = '短信发送失败';
            }
        } else {
            $data['message'] = '接口调用异常,返回代码为:' + $output;
        }
        $this->ajaxReturn($data);
    }

    /**
     * 输入手机验证码完成注册
     */
    public function regMem() {
        $checkCode = session('checkCode');
        $phone = session('phone');
        $uCheck = I('post.Check');
        $tel = I('post.tel');
        $tel = trim($tel);
        $data['success'] = false;
        if (empty($checkCode)) {
            $data['message'] = '验证码过期，或者没有发送验证码';
            $this->ajaxReturn($data);
        }
        $user = session('reguser');
        if (empty($user)) {
            $data['message'] = 'QQ登录超时，请重新登录再注册';
            $this->ajaxReturn($data);
        }
        if ($checkCode == $uCheck && $phone == $tel && $uCheck != '') {
            //$user = session('reguser');
            $user['tel'] = $phone;
            $mem = D('members');
            $result = $mem->add($user);
            if ($result > 0) {
                $user['id'] = $result;
                //session('user', $user);
                $data['success'] = true;
                $data['message'] = '注册成功';
                session('user', $user);
                setcookie("userid", $user["id"]);
                session('reguser', null);
            } else {
                $data['message'] = '注册失败';
            }
        } else {
            $data['message'] = '手机验证码错误或者过期,请确认或者重新发送';
        }
        $this->ajaxReturn($data);
    }

    /**
     * 效果报表
     */
    public function rpf() {
        $this->display();
    }

    /**
     * 用户中心
     */
    public function usercenter() {
        $user = session('user');
        // $mem_item = D('mem_item');
        // $items = $mem_item->getMemItem($user['id']);
        // $memdoc = D('members_doc');
        // $doc = $memdoc->where('uid=' . $user['id'])->select();
        $this->assign('user', $user);
        // $this->assign("items", $items);
        $this->assign("userid", $user['id']);
        // $this->assign("doc", $doc[0]['content']);
        $this->display();
    }

    /**
     * 保存用户自定义模板
     */
    public function savetemp() {
        $userid = session('user.id');
        $doc = D('members_doc');
        $udoc = $doc->where('uid=' . $userid)->select();
        $data['title'] = '自定义文版模版';
        if (empty($udoc)) {
            $content = I('content');
            $data['content'] = $content;
            $data['uid'] = $userid;
            $doc->create($data);
            $ret = $doc->add();
        } else {
            $content = I('content');
            $data['content'] = $content;
            $doc->create($data);
            $ret = $doc->where('uid=' . $userid)->save();
        }
        return $this->ajaxReturn($ret);
    }

    /**
     * 删除用户选品库单个商品
     */
    public function delusergood() {
        $userid = session('user.id');
        $itemid = I('post.delid');
        $useritems = D("mem_item");
        $ret = $useritems->where('userid=' . $userid . ' and itemid=' . $itemid)->delete();
        $this->ajaxReturn($ret);
    }

    /**
     * 批量删除
     */
    public function delusergoods() {
        $userid = session('user.id');
        $itemid = I('post.delid');
        $useritems = D("mem_item");
        $ret = $useritems->where('userid=' . $userid . ' and itemid in(' . $itemid . ')')->delete();
        $this->ajaxReturn($ret);
    }

    /**
     * 提交商品
     */
    public function userpubgoods() {
        $data['status'] = 0;
        if (!session("user.id")) {
            $data['status'] = 2;
            $data['content'] = '登录超时，请重新登录';
            $this->ajaxReturn($data);
        }
        $url = I('post.goodslink', '', 'urldecode'); //解码
        if ($url) {
            //$item_info = json_decode(getItemInfo($url),true);
            $d = I('post.');
            if ($d) {
                $mod = D('item');
                $count = $mod->where('auctionId=' . $d['auctionId'] . ' and author=' . session('user.id') . ' and status=3')->count();
                if ($count > 0) {
                    $data['status'] = 0;
                    $data['message'] = '这个商品您已经提交、并且还在审核中。';
                } else {
                    $d['status'] = 3;
                    $d['cate_id'] = 45;
                    $d['author'] = session('user.id');
                    // $d['couponAmount']=I('couponAmount');
                    // $d['couponTotalCount']=I('couponTotalCount');
                    $d['remark'] = I('post.remark', '', 'htmlspecialchars');
                    $d['add_time'] = time();
                    // $d['couponLink']=I('post.couponLink');
                    // $mod->create($d);
                    $ret = $mod->add($d);
                    if ($ret) {
                        $data['status'] = 1;
                        $data['message'] = '';
                    } else {
                        $data['status'] = 2;
                        $data['message'] = '商品提交失败';
                    }
                }
            } else {
                $data['status'] = 2;
                $data['message'] = '没有获取到商品相关信息，请检查商品地址是否正确。';
            }
        } else {
            $data['status'] = 2;
            $data['message'] = '商品地址不能为空';
        }
        $this->ajaxReturn($data);
    }

    public function getUserByTel() {
        $tel = I("tel");
        $mode = D("members")->valiMembersTel($tel);
        //  var_dump($mode);
        if ($mode) {
            $this->ajaxReturn($mode);
        } else {
            $data["isok"]=false;
            $data["message"]="没有找到数据";
            $this->ajaxReturn($data);
        }
    }

    public function search() {
        $this->display();
    }
     public function searchMobile() {
        $this->display();
    } 
    

}
