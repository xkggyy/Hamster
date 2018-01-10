<?php

namespace Admin\Controller;

use Think\Controller;

class UserController extends BaseController {

    function __construct() {
        parent::__construct();
        $this->_exchange = new \Admin\Model\user_exchangeModel();
    }

    // * 用户管理 -首页
    public function index() {
        $this->redirect("User/user_details");
    }

    //搜索框  用户信息数据库分页查询
    public function user_details() {
        //分页
        $map['usernick'] = I('nickname');
        $map['id'] = I('account');
        $map['telphone'] = I('tel');
        //模糊搜索 两个字段
        empty($map['usernick']) || $where['tbnick'] = array('like', '%' . $map['usernick'] . '%');
        empty($map['id']) || $where['id'] = array('eq', $map['id']);
        empty($map['telphone']) || $where['telphone'] = array('eq', $map['telphone']);

        $user = D('user');
        $count = $user->getCount($where, 'user'); // 查询满足要求的总记录数
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

    //账户是否冻结
    public function amendStatus() {
        $id = I('post.id');
        $user = D('user');
        $info = $user->where('id=' . $id)->find();
        if (!empty($info)) {
            if ($info['status'] == 1) {
                $data['status'] = 0;
            } else {
                $data['status'] = 1;
            }
            $ret = $user->updateStatus($id, $data['status']);
        } else {
            
        }
        if (!empty($ret)) {
            $this->ajaxReturn($ret);
        }
    }

    //查询米粒兑换商品详情
    public function user_exchange() {
        $where = '1';
        $count = $this->_exchange->where($where)->count();
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $mList = $this->_exchange->getRiceExchange($Page->firstRow, $Page->listRows, $where, $order);
        $this->assign('mlist', $mList);
        $this->assign('page', $show); // 赋值分页输出
        $this->display();
    }

    //编辑米粒兑换商品的详情
    public function user_exchange_edit() {
        $id = I('get.id', 0, 'intval');
        if (!empty($id)) {
            $rice_info = M('user_exchange')->where('id=' . $id)->find();
            if (empty($rice_info)) {
                $this->error('该奖品不存在！', '/Admin/User/user_exchange', 3);
            }
            $this->assign('rice', $rice_info);
        } else {
            $this->error("非法操作！");
        }


        $items = M('item')->alias('g')->where('show_type=9')->field('id,title')->group('id')->order('g.id asc')->select();
        $this->assign('goods', $items);
        $this->display();
    }

    /*     * *
     * 米粒兑换信息更新入库
     */

    public function user_exchange_update() {
        //商品id非空检查
        if (!I('post.Id', 0, 'intval')) {
            $data['status'] = 2;
            $data['content'] = '奖品不能为空！';
            $this->ajaxReturn($data);
        }
        $user_mod = M('user_exchange');
        $user_mod->create();
        $ret = $user_mod->save();
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '更新成功！';
        } else {
            $data['status'] = 2;
            $data['content'] = '未更新数据！';
        }
        $this->ajaxReturn($data);
    }

}
