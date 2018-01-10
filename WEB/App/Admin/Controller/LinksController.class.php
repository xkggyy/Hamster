<?php

namespace Admin\Controller;

use Think\Controller;

class LinksController extends BaseController {
    function __construct() {
        parent::__construct();
        $this->_mod = new  \Admin\Model\linksModel();
    }

    /**
     * 链接管理 -首页
     */
    public function index() {
        if ($_SESSION['admin_info'] == null){
            $this->redirect("Login/index");
        } else {
            $this->redirect("Links/links_list");
        }
    }

    /***
     * 链接 列表页面
     */
    public function links_list() {
      /*  $where = 'l.status in(1,2)';
        //分页
        $count = $this->_mod->alias('l')->where($where)->count();// 查询满足要求的总记录数
        $Page = new \Think\Page($count,10);// 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header','<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev','上一页');
        $Page->setConfig('next','下一页');
        $show = $Page->show();// 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $LinksList = $this->_mod->getLinksList($Page->firstRow,$Page->listRows,$where);
        $this->assign('LinksList',$LinksList);
        $this->assign('page',$show);// 赋值分页输出*/
        $this->display();
    }

    /***
     * 链接 添加页面
     */
    public function links_add() {
        $this->display();
    }

    /***
     * 链接 入库
     */
    public function links_save() {
        //数据格式检查
        if(!I('post.name','','trim')){
            $data['status'] = 2;
            $data['content'] = '链接名称不能为空！';
            $this->ajaxReturn($data);
        }
        //重复链接检查
        if((M('item_Links')->getFieldByName(I('post.name','0','trim'),'id'))>0){
            $data['status'] = 2;
            $data['content'] = ' 该链接已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }
        $item_Links_mod = D('item_Links');
        $item_Links_mod->create();
        $ret = $item_Links_mod->add();
        if($ret){
            $data['status'] = 1;
            $data['content'] = '添加成功！';
        }else{
            $data['status'] = 2;
            $data['content'] = '添加失败！';
        }
        $this->ajaxReturn($data);
    }

    /***
     * 链接 编辑页面
     */
    public function links_edit() {
        $Links_id = I('get.id',0,'intval');
        if($Links_id>0){
            $Links_info = $this->_mod->getById($Links_id);
            if(empty($Links_info)){
                $this->error('该链接不存在！','/Admin/Links/links_list',3);
            }
            $this->assign('Links',$Links_info);
            $this->display();
        }else{
            $this->error("非法操作！");
        }
    }

    /***
     * 链接 更新入库
     */
    public function links_update() {
        //数据格式检查
        if(!I('post.name','','trim')){
            $data['status'] = 2;
            $data['content'] = '链接名称不能为空！';
            $this->ajaxReturn($data);
        }
        //重复链接检查
        $Links_id_tmp = M('item_Links')->getFieldByName(I('post.name','0','trim'),'id');
        if($Links_id_tmp>0 && $Links_id_tmp<>I('post.id','-1','intval')){
            $data['status'] = 2;
            $data['content'] = ' 该链接名已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        $item_Links_mod = D('item_Links');
        $item_Links_mod->create();
        $ret = $item_Links_mod->save();
        if($ret){
            $data['status'] = 1;
            $data['content'] = '更新成功！';
        }else{
            $data['status'] = 2;
            $data['content'] = '未更新数据！';
        }
        $this->ajaxReturn($data);
    }


    /**
     * 单个链接 删除
     */
    public function links_del(){
        $item_id = I('get.id',null,'trim');//商品链接id
        if(empty($item_id)){
            $data['content'] = '非法链接id！';
            $this->error($data['content'],'/Admin/Links/links_list',1);
        }
        $ret = $this->_mod->delete($item_id);
        if($ret){
            //同步更新该链接商品的 链接id为0
            $where = array(
                'Links_id'=>$item_id
            );
            $data = array(
                'Links_id'=>0
            );
            M('item')->where($where)->save($data);
            //ajax返回
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'],'/Admin/Links/links_list',1);
        }else{
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'],'/Admin/Links/links_list',1);
        }
    }


    /**
     * 链接 批量删除
     */
    public function links_del_batch(){
        $Links_ids = I('post.vm',null,'trim');//商品链接id
        if(empty($Links_ids)){
            $data['content'] = '非法链接id！';
            $this->error($data['content'],'/Admin/Links/links_list',1);
        }
        $Links_ids_str = $Links_ids?implode(',',$Links_ids):0;//已经存在的商品Id串
        $ret = $this->_mod->delete($Links_ids_str);
        if($ret){
            //同步更新该链接商品的 链接id为0
            $where['Links_id'] = array('in',$Links_ids);
            $data = array(
                'Links_id'=>0
            );
            M('item')->where($where)->save($data);
            //ajax返回
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'],'/Admin/Links/links_list',1);
        }else{
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'],'/Admin/Links/links_list',1);
        }
    }

}