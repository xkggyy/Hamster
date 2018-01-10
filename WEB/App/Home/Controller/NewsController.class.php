<?php

namespace Home\Controller;

use Think\Controller;

class NewsController extends BaseController {
    /*     * 实时榜单* */

    public function index() {
                //分类信息
        $cate_mod = new \Home\Model\item_cateModel();
        $cates = $cate_mod->getCateList(0, 99, ' 1 and spid>0', $order = 'c.ordid asc');
        $nav = array();
        $tag = array();
        foreach ($cates as $a) {
            switch ($a['spid']) {
                case 1:
                    $nav[] = $a;
                    break;
                case 2:
                    $tag[] = $a;
                    break;
            }
        }
        $this->assign('nav', $nav);
        $this->assign('tag', $tag);
        
        
        
        $mode = D("item");
        $items = $mode->where('status=1')
                ->order('biz30day desc')
                ->limit('0,99')
                ->select();
        $this->assign('items', $items);
        $this->display();
    }

    /*     * 优惠券直播* */
    public function coupon() {
        
        //分类信息
        $cate_mod = new \Home\Model\item_cateModel();
        $cates = $cate_mod->getCateList(0, 99, ' 1 and spid>0', $order = 'c.ordid asc');
        $nav = array();
        $tag = array();
        foreach ($cates as $a) {
            switch ($a['spid']) {
                case 1:
                    $nav[] = $a;
                    break;
                case 2:
                    $tag[] = $a;
                    break;
            }
        }
        $this->assign('nav', $nav);
        $this->assign('tag', $tag);
        
        $where = '1';
        $item_list_mod = new \Home\Model\item_listModel();
        $count = $item_list_mod->getOnsaleGoodsCount($where);
        $all_page = ceil($count / 8);
        //获取总条数；

        $this->assign('count', $count);
        //计算总页数
        $this->assign('all_page', $all_page);


        $mode = new \Home\Model\item_listModel();
        $items = $mode->getCouponList('g.cate_id=45', 'g.couponamount desc', 0, 99);
        $this->assign('items', $items);
        $this->display();
    }

    /*     * 天猫独家* */

    public function tmall() {
                //分类信息
        $cate_mod = new \Home\Model\item_cateModel();
        $cates = $cate_mod->getCateList(0, 99, ' 1 and spid>0', $order = 'c.ordid asc');
        $nav = array();
        $tag = array();
        foreach ($cates as $a) {
            switch ($a['spid']) {
                case 1:
                    $nav[] = $a;
                    break;
                case 2:
                    $tag[] = $a;
                    break;
            }
        }
        $this->assign('nav', $nav);
        $this->assign('tag', $tag);
        
        
        $where = '1';
        $item_list_mod = new \Home\Model\item_listModel();
        $count = $item_list_mod->getOnsaleGoodsCount($where);
        $all_page = ceil($count / 8);
        //获取总条数；

        $this->assign('count', $count);
        //计算总页数
        $this->assign('all_page', $all_page);


        $mode = new \Home\Model\item_listModel();
        $items = $mode->getCouponList('g.cate_id=45', 'g.couponamount desc', 0, 99);
        $this->assign('items', $items);
        $this->display();
    }

    /*     * 积米首发* */

    public function first() {
        $mode = new \Home\Model\item_listModel();
        $items = $mode->getCouponList('tc.type=2', 'g.id desc', 0, 99);
        $this->assign('items', $items);
        $this->display('news:coupon');
    }

}
