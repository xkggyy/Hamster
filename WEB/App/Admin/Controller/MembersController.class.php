<?php

namespace Admin\Controller;

use Think\Controller;

class MembersController extends BaseController {

    function __construct() {
        parent::__construct();
    }

    // * 用户管理 -首页
    public function index() {
        $this->redirect("members/members_list");
    }

    public function members_list() {
        //分页
        $map['nickname'] = I('nickname');
        $map['account'] = I('account');
        $map['tel'] = I('tel');
        empty($map['nickname']) || $where['nickname'] = array('like', '%' . $map['nickname'] . '%');
        empty($map['account']) || $where['account'] = array('eq', $map['account']);
        empty($map['tel']) || $where['tel'] = array('eq', $map['tel']);

        $user = D('members');
        $count = $user->getMembersCount($where); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        //分页跳转的时候保证查询条件
        foreach ($map as $key => $val) {
            $Page->parameter[$key] = urlencode($val);
        }
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $mList = $user->getMembersList($Page->firstRow, $Page->listRows, $where, $order);
        $this->assign('map', $map);
        $this->assign('mlist', $mList);
        $this->assign('page', $show); // 赋值分页输出
        $this->display();
    }

    // 编辑页面
    public function members_edit() {
        $user_id = I('get.id', 0, 'intval');
        $user = D('members');
        $user_info = $user->getMembersById($user_id);
        $this->assign('userdata', $user_info);
        $this->display();
    }

    // 更新入库
    public function members_update() {
        //数据格式检查
        $user_mod = D('members');
        $user_mod->create();
        $ret = $user_mod->save();
        if ($ret) {
            $this->ajaxReturn($ret);
        }
    }

    // 链接 批量删除
    public function members_del_batch() {
        $user_ids = I('post.vm', null, 'trim'); //商品链接id

        $user_ids_str = $user_ids ? implode(',', $user_ids) : 0; //已经存在的商品Id串
        $ret = D('members')->delete($Links_ids_str);
        if ($ret) {
            $this->success('删除成功！', '/Admin/members/members_list', 1);
        } else {
            $this->error('删除失败！', '/Admin/members/members_list', 1);
        }
    }
//
    public function set_access(){
        $group=D('auth_group');
        $grouplist=$group->where('status=1')->select();
        $this->assign('items',$grouplist);
        $uid=I('userid');
        $this->assign('userid',$uid);
       // $access=D('auth_group_access');
        
        $this->display();
    }

    public function doset_access(){
        $uid=I('post.userid');
        $access=D('auth_group_access');
        $aga=$access->where('uid='.$uid)->select();      
        $data['group_id']=I('post.group_id');
        if(empty($aga)){
            $data['uid']=$uid;
            $access->create($data);
            $ret= $access->add();
        }else{
           $access->create($data);
           $ret= $access->where('uid='.$uid)->save();
           $ret=1;
        }
        $this->ajaxReturn($ret);
        
    }
    public function delete_access(){
        $uid=I('post.uid');
        $access=D('auth_group_access');
        $ret=$access->where('uid='.$uid)->delete();
        $this->ajaxRetrun($ret);
    }
}
