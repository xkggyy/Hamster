<?php

namespace Admin\Controller;

use Think\Controller;

class TagsController extends BaseController {
    
    function __construct() {
        parent::__construct();
        $this->_mod = new \Admin\Model\item_tagModel();
    }
    
    /**
    * 分类管理-首页
    */
    public function index() {
        $this->redirect('Tags/tags_list');
    }
    
    /**
    * 分类 列表页面
    */
    public function tags_list() {
//        $where = 'c.status in(1,2)';
        $type=I('get.type',0,'intval');
//        $where.=' and spid='.$type;
        //分页
        $count = $this->_mod->alias('c')->where($where)->count(); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $tagsList = $this->_mod->getTagsList($Page->firstRow, $Page->listRows, $where);
        $this->assign('tagsList', $tagsList);
        $this->assign('page', $show); // 赋值分页输出
        switch($type){
            case 0:
                $typename="添加分类";
            break;
            case 1:
                $typename="添加商品分类";
            break;
            case 2:
                $typename="添加商品标签";
            break;
            default:
             $typename="添加分类";
        }
        $this->assign('type',$type);
        $this->assign('typename',$typename);
        $this->display();
    }
    
   
    
    /*     * *
    * 分类 添加页面
    */
    
    public function tags_add() {
        $this->display();
    }
    
    /*     * *
    * 分类 入库
    */
    
    public function tags_save() {
        //数据格式检查
        if (!I('post.name', '', 'trim')) {
            $data['status'] = 2;
            $data['content'] = '分类名称不能为空！';
            $this->ajaxReturn($data);
        }
        //重复分类检查
        if ((M('item_tag')->where("name='".I('post.name', '0', 'trim')."' and spid=".I('post.spid',0,'intval'))->count()) > 0) {
            $data['status'] = 2;
            $data['content'] = ' 该分类已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }
        $item_tags_mod = D('item_tag');
        $item_tags_mod->create();
        $ret = $item_tags_mod->add();
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '添加成功！';
        } else {
            $data['status'] = 2;
            $data['content'] = '添加失败！';
        }
        $this->ajaxReturn($data);
    }
    
    /*     * *
    * 分类 编辑页面
    */
    
    public function tags_edit() {
        $tags_id = I('get.id', 0, 'intval');
        if ($tags_id > 0) {
            $tags_info = $this->_mod->getById($tags_id);
            if (empty($tags_info)) {
                $this->error('该分类不存在！', '/Admin/Tags/tags_list', 3);
            }
            $this->assign('tags', $tags_info);
            $this->display();
        } else {
            $this->error("非法操作！");
        }
    }
    
    /*     * *
    * 分类 更新入库
    */
    
    public function tags_update() {
        //数据格式检查
        if (!I('post.name', '', 'trim')) {
            $data['status'] = 2;
            $data['content'] = '分类名称不能为空！';
            $this->ajaxReturn($data);
        }
        //重复分类检查
        $tags_id_tmp = M('item_tag')->where("name='".I('post.name', '0', 'trim')."' and spid=".I('post.spid',0,'intval'))->count();
        if ($tags_id_tmp > 0 && $tags_id_tmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该分类名已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }
        
        $item_tags_mod = D('item_tag');
        $item_tags_mod->create();
        $ret = $item_tags_mod->save();
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '更新成功！';
        } else {
            $data['status'] = 2;
            $data['content'] = '未更新数据！';
        }
        $this->ajaxReturn($data);
    }
    
    /**
    * 单个分类 删除
    */
    public function tags_del() {
        $item_id = I('get.id', null, 'trim'); //商品分类id
        if (empty($item_id)) {
            $data['content'] = '非法分类id！';
            $this->error($data['content'], '/Admin/Tags/tags_list', 1);
        }
        $ret = $this->_mod->delete($item_id);
        if ($ret) {
            //同步更新该分类商品的 分类id为0
            $where = array(
            'tags_id' => $item_id
            );
            $data = array(
            'tags_id' => 0
            );
            M('item')->where($where)->save($data);
            //ajax返回
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'], '/Admin/Tags/tags_list', 1);
        } else {
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'], '/Admin/Tags/tags_list', 1);
        }
    }
    
    /**
    * 分类 批量删除
    */
    public function tags_del_batch() {
        $tags_ids = I('post.vm', null, 'trim'); //商品分类id
        if (empty($tags_ids)) {
            $msg['status'] = 2;
            $msg['content'] = '非法分类id！';
            $this->ajaxReturn($msg);
        }
        $tags_ids_str = $tags_ids ? implode(',', $tags_ids) : 0; //已经存在的商品Id串
        $ret = $this->_mod->delete($tags_ids_str);
        if ($ret) {
            //同步更新该分类商品的 分类id为0
            $where['tags_id'] = array('in', $tags_ids);
            $data = array(
            'tags_id' => 0
            );
            M('item')->where($where)->save($data);
            //ajax返回
            $msg['status'] = 1;
            $msg['content'] = '删除成功！';
            $this->ajaxReturn($msg);
        } else {
            $msg['status'] = 2;
            $msg['content'] = '未删除数据！';
            $this->ajaxReturn($msg);
        }
    }
}