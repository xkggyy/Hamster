<?php

namespace Admin\Controller;

use Think\Controller;

class RiceController extends BaseController {

    function __construct() {
        parent::__construct();
        $this->_rice = new \Admin\Model\rice_recordModel();
        
    }

    // * 用户管理 -首页
    public function index() {
        $this->redirect("Rice/rice_record_details");
    }

    //查询米粒详情
    public function rice_details() {
        $where = '1';
        $count = $this->_rice->where($where)->count();
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $show = $Page->show(); // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $mList = $this->_rice->getRiceList($Page->firstRow, $Page->listRows, $where, $order);
        foreach ($mList as $m) {
            $id = $m['userid'];
            $m['rice_num_record'] = M('rice_record')->where('userid=' . $id)->sum('rice_num_record');
            //通过用户id查询米粒变化数
        }
        $this->assign('rrlist', $mList);
        $this->assign('page', $show); // 赋值分页输出
        $this->display();
    }

    /**
     *  删除单条数据

      public function category_del() {
      $item_id = I('get.id', null, 'trim'); //商品分类id
      if (empty($item_id)) {
      $data['content'] = '非法分类id！';
      $this->error($data['content'], '/Admin/Category/category_list', 1);
      }
      $ret = $this->_mod->delete($item_id);
      if ($ret) {
      //同步更新该分类商品的 分类id为0
      $where = array(
      'cate_id' => $item_id
      );
      $data = array(
      'cate_id' => 0
      );
      M('item')->where($where)->save($data);
      //ajax返回
      $data['status'] = 1;
      $data['content'] = '删除成功！';
      $this->success($data['content'], '/Admin/Category/category_list', 1);
      } else {
      $data['status'] = 2;
      $data['content'] = '未删除数据！';
      $this->error($data['content'], '/Admin/Category/category_list', 1);
      }
      }
     * */
}
