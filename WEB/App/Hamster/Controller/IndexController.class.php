<?php

namespace Hamster\Controller;

use Think\Controller;

class IndexController extends BaseController {

    public function __construct() {
        parent::__construct();
    }

    /**
     * 首页
     */
    public function index() {

        $this->display();
    }
    
    /**
     * 今日推荐
     */
   public function todaty() {
        if (!session("user.id")) {
            $this->redirect('/hamster/login/index');
        }
        $user = session('user');

        $cate_mod = D("item_cate");
        $cates = $cate_mod->getCateList(0, 99, ' 1 and spid>0', $order = 'c.ordid,c.id asc');
        $nav = array();
        $tag = array();
        foreach ($cates as $a) {
            switch ($a['spid']) {
                case 1 :
                    $nav[] = $a;
                    break;
                case 2 :
                    $tag[] = $a   ;
                    break;
            }
        }

        $this->assign('user', $user);
        $this->assign('nav', $nav);
        //商品分类
        $this->assign('tag', $tag);
        //高级筛选
        $this->display();
    }
    
    /**
     * 商品列表
     */
    public function listView() {
        $keyword = I('kw');
        $tcid = I('tcid');
        $itid = I('itid');
        //商品分类
        $sxid = I('sxid');
        //高级筛选
        $pageIndex = I('pageIndex', 1);
        $pageSize = I('pageSize', 50);

        $where = '1';
        if (!empty($keyword)) {
            $where .= " and (title like '%" . $keyword . "%' or c.name='" . $keyword . "')";
        }
        if (!empty($tcid)) {
            $where .= ' and c.id=' . $tcid;
        }
        if (!empty($itid)) {
            $where .= ' and g.item_cate=' . $itid;
        }
        if (!empty($sxid)) {
            $where .= ' and g.item_tag like "%' . $sxid . '%"';
        }
        $minPrice = I('minPrice', 0);
        //最低价格
        $maxPrice = I('maxPrice', 0);
        //最高价格
        $yjScale = I('yjScale', 0);
        //佣金比例
        $salesVolume = I('salesVolume', 0);
        //销量
        if ($minPrice != 0) {
            $where .= ' and g.zkPrice>=' . $minPrice;
        }
        if ($maxPrice != 0) {
            $where .= ' and g.zkPrice<=' . $maxPrice;
        }
        if ($yjScale != 0) {
            $where .= ' and g.eventRate>=' . $yjScale;
        }
        if ($salesVolume != 0) {
            $where .= ' and g.biz30day<=' . $salesVolume;
        }
        $item_list_mod = D('item_list');
        $count = $item_list_mod->getOnsaleGoodsCount($where);
        //获取总条数；
        $order = 'g.id desc';
        $goods = $item_list_mod->getOnsaleGoods($where, $order, ($pageIndex - 1) * $pageSize, $pageSize);
        //分页读取数据

        $this->assign('goods', $goods);
        $this->assign('count', $count);
        $this->assign('pageIndex', $pageIndex);
        $this->display();
    }

    /**
     * 显示登录
     */
    public function tkLogin() {
        $this->display();
    }

    /**
     * 创建推广位
     */
    public function createAdZone() {
        $this->display();
    }

    /**
     * 显示升级界面
     */
    public function st2() {
        $this->display();
    }

    /**
     * 加入选品库
     */
    public function add_item() {
        $user = session('user');
        $returnData['success'] = 3;
        //未登录或者登录超时
        if (empty($user)) {
            $returnData['message'] = '未登录';
            $this->ajaxReturn($returnData);
        }
        try {
            $data = I('post.data');
            $mi = M('mem_item');
            // $mi->delete(array('userId'=>$user["id"]));
            $mi->where('userId=' . $user['id'])->delete();
            //$insData = array();
            foreach ($data as $value) {
                $value['userId'] = $user['id'];
                //array_push($insData, $value);
                $mi->add($value);
            }
            //$mi -> addAll($insData);
            $returnData['success'] = 1;
            $returnData['url'] = '/index.php/home/index/tktg?id=' . $user['id'];
            $returnData['message'] = '选品成功';
        } catch (Exception $e) {
            $returnData['success'] = 2;
            $returnData['message'] = '操作失败';
        }
        //$returnData['id']=$user['id'];
        $this->ajaxReturn($returnData);
    }

}
