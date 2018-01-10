<?php

namespace Admin\Controller;

use Think\Controller;

class PrizeController extends BaseController {

    function __construct() {
        parent::__construct();
    }

    // * 用户管理 -首页
    public function index() {
        $this->redirect("Prize/prize_list");
    }

    //查询用户中奖详情
    public function trophy_information() {
        $p = D('Prize');
        $where = '1';
        $count = $p->where($where)->count();
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $mList = $p->getTrophyInfo($Page->firstRow, $Page->listRows, $where, $order);
        $this->assign('tlist', $mList);
        $this->assign('page', $show); // 赋值分页输出
        $this->display();
    }

    //查询活动奖品详情
    public function prize_list() {
        $p = D('Prize');
        $type = I('get.type', 0, 'intval');
        $where = '1';
        $count = $p->where($where)->count();
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $mList = $p->getPrizes($Page->firstRow, $Page->listRows, $where, $order);
        $this->assign('plist', $mList);
        $this->assign('page', $show); // 赋值分页输出
        switch ($type) {
            case 0:
                $typename = "添加活动奖品";
                break;
            case 1:
                $typename = "添加活动奖品";
                break;
            case 2:
                $typename = "添加活动奖品";
                break;
            default:
                $typename = "添加活动奖品";
        }
        $this->assign('type', $type);
        $this->assign('typename', $typename);
        $this->display();
    }

    /*     * *
     * 活动奖品 添加页面
     */

    public function prize_add() {
        $this->display();
    }

    /*     * *
     * 活动奖品 添加入库
     */

    public function prize_save() {

        //数据格式检查
        if (!I('post.prizeName', '', 'trim')) {
            $data['status'] = 2;
            $data['content'] = '奖品名称不能为空！';
            $this->ajaxReturn($data);
        }
        //重复分类检查
        $m = M('prize');
        $slides_id_tmp = $m->where("prizename='" . I('post.prizeName', '0', 'trim') . "' and id=" . I('post.id', 0, 'intval'))->count();
        if ($slides_id_tmp > 0 && $slides_id_tmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该奖品已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        //重复地址检查 
        $slides_id_pmp = $m->where("goodspic='" . I('post.goodSpic', '0', 'trim') . "' and id=" . I('post.id', 0, 'intval'))->count();
        if ($slides_id_pmp > 0 && $slides_id_pmp <> I('post.id', '-1', 'intval')) {
            $data['status'] = 2;
            $data['content'] = ' 该图片已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        $prize_mod = D('prize');
        $prize_mod->create();
        $ret = $prize_mod->add();
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
     * 活动奖品 编辑页面
     */

    public function prize_edit() {
        $id = I('get.id', 0, 'intval');
        if ($id > 0) {
            $prize_info = M('prize')->where('id=' . $id)->find();
            if (empty($prize_info)) {
                $this->error('该奖品不存在！', '/Admin/Prize/prize_list', 3);
            }
            $this->assign('prize', $prize_info);
            $this->display();
        } else {
            $this->error("非法操作！");
        }
    }

    /*     * *
     * 活动奖品 更新
     */

    public function prize_update() {
        $id = I('post.id', 0, 'intval');
        //数据格式检查
        if (!$id) {
            $data['status'] = 2;
            $data['content'] = '奖品不能为空！';
            $this->ajaxReturn($data);
        }

        $prizeName = I('post.prizeName', '', 'trim');
        //数据格式检查
        if (!$prizeName) {
            $data['status'] = 2;
            $data['content'] = '奖品名称不能为空！';
            $this->ajaxReturn($data);
        }
        $prize_mod = M('prize');
        $prize_mod->create();
        $ret = $prize_mod->save();
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
     * 活动奖品 批量删除
     */
    public function prize_del_batch() {
        $p = M('prize');
        $id = I('post.vm', null, 'trim'); //奖品id
        if (empty($id)) {
            $msg['status'] = 2;
            $msg['content'] = '非法奖品id！';
            $this->ajaxReturn($msg);
        }
        $prize_ids_str = $id ? implode(',', $id) : 0; //已经存在的奖品Id串
        $ret = $p->delete($prize_ids_str);
        if ($ret) {
            //同步更新该奖品id为0
            $where['id'] = array('in', $id);
            $data = array(
                '$id' => 0
            );
            $p->where($where)->save($data);
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
    public function uploadPrizeImg() {
        $setting = C('UPLOAD_FILE_QINIU');
        $Upload = new \Think\Upload($setting);
        $info = $Upload->upload($_FILES);

        $path = str_replace('/', '_', $info['Filedata']['savepath']);
        $filename = $path . $info['Filedata']['savename']; //七牛云保存的文件名称
        if (!$info) {
            $data = ['status' => false, 'msg' => '上传失败，' . $Upload->getError()];
        } else {
            $data = [
                'status' => true,
                'msg' => '上传成功',
                'name' => $_FILES['Filedata']['name'],
                'size' => $_FILES['Filedata']['size'],
                'cname' => $filename,
                'type' => $info['Filedata']['ext'],
                'link' => $info['Filedata']['url'],
            ];
        }
        $this->ajaxReturn($data);
    }

}
