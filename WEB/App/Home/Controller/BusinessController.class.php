<?php

namespace Home\Controller;

use Think\Controller;

class BusinessController extends BaseController {

    //招商中心-报名管理-我要报名
    public function index() {
        if(!session('user.id')){
            $this->redirect('/Home/business/login');
        }
        $cmod=M("item_cate");
        $itemcate=$cmod->where('spid>0')->select();
        $cate=array();
        $tag=array();
        foreach($itemcate as $v){
            if($v['spid']==1){
              //  $this->assign("c")
              $cate[]=$v;
            }else{
             $tag[]=$v;
            }
        }
        $this->assign('cate',$cate);
        $this->assign('tag',$tag);
        $this->display();
    }
    public function index_reg(){
        if(session("reguser")){
            $this->assign("isreg",true);
        }
        $this->display('userinfo');
    }
    
    //招商中心-报名管理-报名记录
    public function signupRecord() {
        if(!session('user.id')){
            $this->redirect('/Home/business/login');
        }         
        $this->display();
    }
    public function getMyItems() {
        if(!session('user.id')){
            $this->ajaxReturn('[]');
        }      
        $userid=session('user.id');
        $itemMod=M('item');
        $pageSize=I('post.pageSize',5);
        $pageIndex=I('post.page',1);
        $start= $pageSize*($pageIndex-1);
        $end=$pageSize*$pageIndex;
        $query=$itemMod->alias('g')->join('inner join hamster_sub_info s  on s.itemid=g.id ')->where('g.author='.$userid);
        $item=$query->limit($start,$end)->field('g.*,s.serverMoney,s.hSell,s.activeStartTime,s.activeEndTime')->select();
        $query=$itemMod->alias('g')->join('inner join hamster_sub_info s  on s.itemid=g.id ')->where('g.author='.$userid);
        $count=$query->count();
        $data["item"]=$item;
        $data["totalCount"]=$count;
        $this->ajaxReturn($data);
       
    }
    //使用帮助
    public function help(){
        $this->display();
    }
    //商家发布商品
    public function pubgoods(){ 
        $data['status']=0;
        if(!session("user.id")){
			$data['status']=2;
            $data['content']='登录超时，请重新登录';
            $this->ajaxReturn($data);
		}
        $url = I('post.goodslink', '', 'urldecode'); //解码
        if ($url) {
            $item_info = json_decode(getItemInfo($url),true);
            $d = $item_info['data']['pageList'][0];
            if($d){
                $mod=D('item');
                $count=$mod->where('auctionId='.$d['auctionId'].' and author='.session('user.id').' and status=3')->count();
                if($count>0){
                    $data['status']=0;
                    $data['message']='这个商品您已经提交、并且还在审核中。';
                }else{
                     $d['status']=3;
                     $d['cate_id']=45;
                     $d['author']=session('user.id');
                     $d['couponAmount']=I('post.couponAmount');
                     $d['couponTotalCount']=I('post.couponTotalCount');
                     $d['remark']=I('post.remark','','htmlspecialchars');
                     $d['tkRate']=I('post.tkRate');
                     $d['tkCommFee']=I('post.tkCommFee');
                     $d['add_time']=time();
                     $d['couponLink']=I('post.couponLink');
                   // $mod->create($d);
                    $ret= $mod->add($d);
                    if($ret){
                        $smod=M('sub_info');
                        $sdata=I('post.');
                        $sdata['activeStartTime']=strtotime($sdata['activeStartTime']);
                        $sdata['activeEndTime']=strtotime($sdata['activeEndTime']);
                        $sdata['itemid']=$ret;
                        $r=$smod->add($sdata);
                        $data['status']=1;
                        $data['message']='';
                    }else{
                        $data['status']=2;
                        $data['message']='商品提交失败';
                    }
                }
            }else{
                 $data['status']=2;
                 $data['message']='没有获取到商品相关信息，请检查商品地址是否正确。';
            }
        }else{
            $data['status']=2;
            $data['message']='商品地址不能为空';
        }
        $this->ajaxReturn($data);
    }

    //招商中心-个人中心-基本资料
    public function userinfo() {
        if(!session('user.id')){
                $this->redirect('/Home/business/login');
        }else{
                $this->assign("user",session("user"));
        }
        $this->display();
    }

    public function login(){
        $callback = 'http://www.j1m1.com/index.php?s=Home/business/login_qq';
        $QC = new \Org\ConnectQQ\api\QC();
        $QC->qq_login($callback);    
    }

    public function login_qq(){
        $QC = new \Org\ConnectQQ\api\QC();
        $token = $QC->qq_callback('http://www.j1m1.com/index.php?s=Hamster/user/login_qq');
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

        $user = D('Members');
        $_user = $user->create($data);
        if (!$_user) {
            // 写入登陆状态
            $data = array();
            $data = $user->getByQq_openid($openid);
            session('user', $data);
            setcookie("userid", $data["id"]);
            // 写入登陆时间
            $user->lastlogintime = time();
            $user->save();
            $this->redirect('/home/business/index');
        } else {
            session('reguser', $_user);
            $this->redirect('/home/business/index_reg');
        }
    }

    	/**
	 * 输入手机验证码完成注册
	 */
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
        if(empty($user)){
            $data['message'] = 'QQ登录超时，请重新登录再注册';
             $this->ajaxReturn($data);
        }
        if ($checkCode == $uCheck && $phone == $tel && $uCheck != '') {
            //$user = session('reguser');
            $user['tel'] = $phone;
            $mem = D('Members');
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

    
    public function logout(){
        session("user",null);
        $this->redirect('/');
    }
}
