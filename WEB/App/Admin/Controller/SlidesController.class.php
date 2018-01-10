<?php

namespace Admin\Controller;
use Think\Controller;
use Qiniu\Auth;
use Qiniu\Storage\BucketManager;
use Qiniu\Storage\UploadManager;


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class SlidesController extends BaseController {

    function __construct() {
        parent::__construct();
        $this->_mod = new \Admin\Model\AdvertModel();
    }

    public function index() {
        $this->redirect('Slides/slides_list');
    }

    /**
     * 分类 列表页面
     */
    public function slides_list() {
        $where = 'c.status in(1,2)';
        $type = I('get.type', 0, 'intval');
//        $where.=' and spid='.$type;
        //分页
        $count = $this->_mod->alias('c')->where($where)->count(); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $slidesList = $this->_mod->getSlidesList($Page->firstRow, $Page->listRows, $where);
        $this->assign('slidesList', $slidesList);
        $this->assign('page', $show); // 赋值分页输出
        switch ($type) {
            case 0:
                $typename = "添加分类";
                break;
            case 1:
                $typename = "添加商品分类";
                break;
            case 2:
                $typename = "添加商品标签";
                break;
            default:
                $typename = "添加分类";
        }
        $this->assign('type', $type);
        $this->assign('typename', $typename);
        $this->display();
    }

    /*     * *
     * 分类 添加页面
     */

    public function slides_add() {
        $this->display();
    }

    /*     * *
     * 分类 入库
     */

    public function slides_save() {
        //数据格式检查
        if (!I('post.pic_advert', '', 'trim')) {
            $data['status'] = 2;
            $data['content'] = '保存上传图片不能为空！';
            $this->ajaxReturn($data);
        }

        $pic_advert = I('post.pic_advert', '', 'trim');
        if (empty($pic_advert)) {
            $data['status'] = 2;
            $data['content'] = '更新上传图片不能为空！';
            $this->ajaxReturn($data);
        }

        $m = M('advert');
        //重复分类名检查
        $slides_id_tmp = $m->where("title='" . I('post.title', '0', 'trim') . "'")->count();
        if ($slides_id_tmp > 0 && $slides_id_tmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该标题已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        //重复图片地址检查
        $slides_id_pmp = $m->where("pic_advert='" . I('post.pic_advert', '0', 'trim') . "'")->count();
        if ($slides_id_pmp > 0 && $slides_id_pmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该图片已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        $item_slides_mod = D('advert');
        $item_slides_mod->create();
        $ret = $item_slides_mod->add();
        if ($ret) {
            $data['status'] = true;
            $data['content'] = '添加成功！';
        } else {
            $data['status'] = false;
            $data['content'] = '添加失败！';
        }
        $this->ajaxReturn($data);
    }

    /*     * *
     * 分类 编辑页面
     */

    public function slides_edit() {
        $slides_id = I('get.id', 0, 'intval');
        
        if ($slides_id > 0) {
            $slides_info = $this->_mod->getById($slides_id);
            if (empty($slides_info)) {
                $this->error('该分类不存在！', '/Admin/Slides/slides_list', 3);
            }
            $this->assign('slides', $slides_info);
            $this->display();
        } else {
            $this->error("非法操作！");
        }
    }

    /*     * *
     * 分类 更新入库
     */

    public function slides_update() {
//        数据格式检查
        if (!I('post.title', '', 'trim')) {
            $data['status'] = 2;
            $data['content'] = '标题不能为空！';
            $this->ajaxReturn($data);
        }

        $pic_advert = I('post.pic_advert', '', 'trim');
        if (empty($pic_advert)) {
            $data['status'] = 2;
            $data['content'] = '更新上传图片不能为空！';
            $this->ajaxReturn($data);
        }

        $m = M('advert');
        //重复分类名检查
        $slides_id_tmp = $m->where("title='" . I('post.title', '0', 'trim') . "'")->count();
        if ($slides_id_tmp > 0 && $slides_id_tmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该标题已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        //重复图片地址检查
        $slides_id_pmp = $m->where("pic_advert='" . I('post.pic_advert', '0', 'trim') . "'")->count();
        if ($slides_id_pmp > 0 && $slides_id_pmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该图片已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        $item_slides_mod = D('advert');
        $item_slides_mod->create();
        $ret = $item_slides_mod->save();
        if ($ret) {
            $data['status'] = true;
            $data['content'] = '更新成功！';
        } else {
            $data['status'] = false;
            $data['content'] = '未更新数据！';
        }
        $this->ajaxReturn($data);
    }

    /**
     * 单个分类 删除
     */
    public function slides_del() {
        $item_id = I('get.id', null, 'trim'); //商品分类id
        if (empty($item_id)) {
            $data['content'] = '非法分类id！';
            $this->error($data['content'], '/Admin/Slides/slides_list', 1);
        }
        $ret = $this->_mod->delete($item_id);
        if ($ret) {
            //同步更新该分类商品的 分类id为0
            $where = array(
                'slides_id' => $item_id
            );
            $data = array(
                'slides_id' => 0
            );
            M('item')->where($where)->save($data);
            //ajax返回
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'], '/Admin/Slides/slides_list', 1);
        } else {
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'], '/Admin/Slides/slides_list', 1);
        }
    }

    /**
     * 分类 批量删除
     */
    public function slides_del_batch() {
        $slides_ids = I('post.vm', null, 'trim'); //商品分类id
        if (empty($slides_ids)) {
            $msg['status'] = 2;
            $msg['content'] = '非法分类id！';
            $this->ajaxReturn($msg);
        }
        $slides_ids_str = $slides_ids ? implode(',', $slides_ids) : 0; //已经存在的商品Id串
        $ret = $this->_mod->delete($slides_ids_str);
        if ($ret) {
            //同步更新该分类商品的 分类id为0
            $where['slides_id'] = array('in', $slides_ids);
            $data = array(
                'slides_id' => 0
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

    //图片上传
     public function uploadSlide(){
         $setting = C('UPLOAD_FILE_QINIU');
         $Upload = new \Think\Upload($setting);
         $info = $Upload->upload($_FILES);
         $path = str_replace('/','_',$info['Filedata']['savepath']);
         $filename = $path.$info['Filedata']['savename'];//七牛云保存的文件名称
         if(!$info) {
             $data = ['status'=>false,'msg'=>'上传失败，'.$Upload->getError()];
         }else{
             $data = [
                 'status'=>true,
                 'msg'   => '上传成功',
                 'name'  => $_FILES['Filedata']['name'],
                 'size'  => $_FILES['Filedata']['size'],
                 'cname' => $filename,
                 'type'  => $info['Filedata']['ext'],
                 'link'  => $info['Filedata']['url'],
             ];
         }
          $this->ajaxReturn($data);  
     }
}
