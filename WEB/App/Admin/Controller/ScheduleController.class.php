<?php

namespace Admin\Controller;

use Think\Controller;

class ScheduleController extends BaseController {
    
    function __construct() {
        parent::__construct();
        $this->_mod = new \Admin\Model\time_controllerModel();
        $this->_item_list_mod = new \Admin\Model\item_listModel();
    }
    
    /**
    * 日程管理-首页
    */
    public function index() {
        $this->redirect("Schedule/schedule_list");
    }
    
    /**
    * 日程列表页面
    */
    public function schedule_list() {
        $where = 1;
        //分页
        $count = $this->_mod->alias('tc')->where($where)->count(); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 15); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $activityList = $this->_mod->getScheduleList($Page->firstRow, $Page->listRows, $where);
        $this->assign('activityList', $activityList);
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('now', time());
        $this->display();
    }
    
    /**
    * 日程 添加页面
    */
    public function schedule_add() {
        $this->display();
    }
    
    /**
    * 日程 添加入库
    */
    public function schedule_save() {
        //数据格式检查
        if (!I('post.start_time') || !I('post.end_time') || !I('post.status') || !I('post.type') || !I('post.remark')) {
            $data['status'] = 2;
            $data['content'] = '尚有必填项为空，请选择所属板块等！';
            $this->ajaxReturn($data);
        }
        $this->_mod->create();
        $this->_mod->start_time = strtotime(I('post.start_time'));
        $this->_mod->end_time = strtotime(I('post.end_time'));
        $ret = $this->_mod->add();
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '添加成功！';
        } else {
            $data['status'] = 2;
            $data['content'] = '添加失败！';
        }
        $this->ajaxReturn($data);
    }
    
    /**
    * 日程 编辑
    */
    public function schedule_edit() {
        $schedule_id = I('get.id', 0, 'intval');
        $schedule_info = $this->_mod->getById($schedule_id);
        if (empty($schedule_info)) {
            $this->error('日程 不存在！', '/index.php/Admin/Schedule/schedule_list', 3);
        }
        $this->assign('schedule', $schedule_info);
        $this->display();
    }
    
    /**
    * 日程 更新入库
    */
    public function schedule_update() {
        //数据格式检查
        if (!I('post.start_time') || !I('post.end_time') || !I('post.status') || !I('post.type') || !I('post.remark')) {
            $data['status'] = 2;
            $data['content'] = '尚有必填项为空！';
            $this->ajaxReturn($data);
        }
        
        $this->_mod->create();
        $this->_mod->start_time = strtotime(I('post.start_time'));
        $this->_mod->end_time = strtotime(I('post.end_time'));
        $ret = $this->_mod->save();
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
    * 日程 单个删除
    */
    public function schedule_del() {
        $schedule_id = I('get.id', null, 'trim');
        if (empty($schedule_id)) {
            $data['content'] = '非法日程 id！';
            $this->error($data['content'], '/index.php/Admin/Schedule/schedule_list', 1);
        }
        $ret = $this->_mod->delete($schedule_id);
        if ($ret) {
            //同步删除 相关 item_list表项
            $where_item_list = array("timeid" => $schedule_id);
            $this->_item_list_mod->where($where_item_list)->delete();
            //ajax返回
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'], '/index.php/Admin/Schedule/schedule_list', 1);
        } else {
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'], '/index.php/Admin/Schedule/schedule_list', 1);
        }
    }
    
    /**
    * 日程 批量删除
    */
    public function schedule_del_batch() {
        $schedule_ids = I('post.vm', null, 'trim');
        if (empty($schedule_ids)) {
            $msg['status'] = 1;
            $msg['content'] = '请选则日程后再删除！';
            $this->ajaxReturn($msg);
        }
        $cate_ids_str = $schedule_ids ? implode(',', $schedule_ids) : 0; //已经存在的商品Id串
        $ret = $this->_mod->delete($cate_ids_str);
        if ($ret) {
            //同步删除 相关 item_list表项
            $where_item_list['timeid'] = array('in', $schedule_ids);
            $this->_item_list_mod->where($where_item_list)->delete();
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
    
    /**
    * 日程商品 列表页
    */
    public function schedule_item_list() {
        $schedule_id = I('get.id', 0, 'intval');
        //日程信息
        $schedule_info = $this->_mod->getById($schedule_id);
        if (empty($schedule_info)) {
            $this->error('日程 不存在！', '/index.php/Admin/Schedule/schedule_list', 3);
        }
        $this->assign('activity', $schedule_info); //日程信息
        //日程 已经添加商品 分页
        $where = "il.timeid = $schedule_id";
        $count = $this->_item_list_mod->alias('il')->where($where)->count(); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $schedule_item_list = $this->_item_list_mod->getScheduleItemList($Page->firstRow, $Page->listRows, $where);
        $this->assign('goodsList', $schedule_item_list); //日程已经添加的商品列表
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('now', time());
        $this->display();
    }
    
    /**
    * 日程商品 添加页
    */
    public function schedule_item_add() {
        $schedule_id = I('get.id', 0, 'intval');
        //日程信息
        $schedule_info = $this->_mod->getById($schedule_id);
        if (empty($schedule_info)) {
            $this->error('日程 不存在！', '/index.php/Admin/Schedule/schedule_list', 3);
        }
        $this->assign('activity', $schedule_info); //日程信息
        //日程 待添加商品 列表
        $where = "il.timeid = $schedule_id and g.status=1";
        $count = $this->_item_list_mod->getScheduleLeftItemCount($where); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $schedule_left_item_list = $this->_item_list_mod->getScheduleLeftItem($Page->firstRow, $Page->listRows, $where);
        $this->assign('goodsList', $schedule_left_item_list); //日程已经添加的商品列表
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('now', time());
        $this->display();
    }
    
    /**
    * 日程商品 单个添加入库
    */
    public function schedule_item_save() {
        //数据格式检查
        if (!I('get.timeid') || !I('get.itemid')) {
            $this->error('非法操作，请正常添加商品！', '/index.php/Admin/Schedule/schedule_list', 1);
        }
        $data = array(
        'timeid' => I('get.timeid', '', 'intval'),
        'itemid' => I('get.itemid', '', 'intval')
        );
        $ret = $this->_item_list_mod->data($data)->add();
        if ($ret) {
            $this->success('添加成功！', '/index.php/Admin/Schedule/schedule_item_add/id/' . I('get.timeid', '0', 'intval'), 1);
        } else {
            $this->error('添加失败！', '/index.php/Admin/Schedule/schedule_item_add/id/' . I('get.timeid', '0', 'intval'), 1);
        }
    }
    
    /**
    * 日程商品 批量添加入库
    */
    public function schedule_item_save_batch() {
        $timeid = I('post.timeid', null, 'trim'); //日程id
        $item_ids = I('post.vm', null, 'trim'); //商品id数组
        //数据格式检查
        if (!$timeid || !$item_ids) {
            $this->error('非法操作，请正常添加商品！', '/index.php/Admin/Schedule/schedule_list', 1);
        }
        //批量入库
        $dataList = null;
        foreach ($item_ids as $v) {
            $dataList[] = array(
            'timeid' => $timeid,
            'itemid' => $v
            );
        }
        
        $ret = $this->_item_list_mod->addAll($dataList);
        if ($ret) {
            $this->success('批量添加成功！', '/index.php/Admin/Schedule/schedule_item_add/id/' . $timeid, 1);
        } else {
            $this->error('批量添加失败！', '/index.php/Admin/Schedule/schedule_item_add/id/' . $timeid, 1);
        }
    }
    
    /**
    * 日程商品 改变排序
    */
    public function schedule_item_order() {
        //数据格式检查
        if (!I('post.ordid') || !I('post.il_id')) {
            $data['status'] = 2;
            $data['content'] = '请注意：排序值为1~255！';
            $this->ajaxReturn($data);
        }
        $da = array(
        'ordid' => I('post.ordid', '', 'intval'),
        'id' => I('post.il_id', '', 'intval'),
        );
        $ret = $this->_item_list_mod->data($da)->save();
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
    * 日程商品 单个删除
    */
    public function schedule_item_del() {
        $schedule_id = I('get.id', null, 'trim');
        $il_id = I('get.il_id', null, 'trim');
        if (empty($schedule_id) || empty($il_id)) {
            $data['content'] = '非法日程 id 或商品id！';
            $this->error($data['content'], '/index.php/Admin/Schedule/schedule_item_list/id/' . $schedule_id, 1);
        }
        $ret = $this->_item_list_mod->delete($il_id);
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'], '/index.php/Admin/Schedule/schedule_item_list/id/' . $schedule_id, 1);
        } else {
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'], '/index.php/Admin/Schedule/schedule_item_list/id/' . $schedule_id, 1);
        }
    }
    
    /**
    * 日程商品 批量删除
    */
    public function schedule_item_del_batch() {
        $schedule_id = I('post.timeid', null, 'trim'); //日程id
        $il_ids = I('post.vm', null, 'trim');
        if (empty($schedule_id) || empty($il_ids)) {
            $data['content'] = '非法日程 id 或商品id！';
            $this->error($data['content'], '/index.php/Admin/Schedule/schedule_item_list/id/' . $schedule_id, 1);
        }
        $il_ids_str = $il_ids ? implode(',', $il_ids) : 0; //已经存在的商品Id串
        $ret = $this->_item_list_mod->delete($il_ids_str);
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'], '/index.php/Admin/Schedule/schedule_item_list/id/' . $schedule_id, 1);
        } else {
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'], '/index.php/Admin/Schedule/schedule_item_list/id/' . $schedule_id, 1);
        }
    }
    
}