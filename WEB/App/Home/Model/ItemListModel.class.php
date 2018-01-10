<?php

namespace Home\Model;

use Think\Model;

class ItemListModel extends Model {

    /**
     * 首页查询上架展示的兑换商品
     */
    public function getOnsaleGoods($where = '1', $order = 'g.add_time desc', $start = 0, $len = 99,$ordflag=true) {
        $where .= ' and g.status=1  and c.status=1 and (tc.status=1 and  (unix_timestamp(now()) between start_time and end_time))';
        $order=$ordflag? 'start_time desc, tc.ordid asc,il.ordid asc,'.$order:'start_time desc, tc.ordid asc,il.ordid asc,'.$order;
        $ret = M('item')->alias('g')
                ->join('left join hamster_item_list il on g.id = il.itemid')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id=il.timeid')
                ->join('left join __ITEM_CATE__  c on c.id=g.item_cate')
                ->field('g.*,c.name as cate_name')
                ->where($where)
                ->order($order)
                ->group('g.id')
                ->limit($start . ',' . $len)
                ->select();

        return $ret;
    }

    /* 优惠券直播
     */

    public function getCouponList($where = '1', $order = 'g.id desc', $start = 0, $len = 99) {
        $where .= ' and g.status=1';
        $ret = $this->getOnsaleGoods($where, $order = 'g.id desc', 0, 99);
        return $ret;
    }

    public function getCouponCount($where = '1') {
        $where .= ' and g.status=1  and c.status=1 and tc.status=1 and (UNIX_TIMESTAMP(NOW()) BETWEEN tc.start_time AND tc.end_time)';
        $ret = M('item_list')->alias('il')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
                ->join('left join __ITEM__ g on g.id = il.itemid')
                ->field('g.*')
                ->where($where)
                ->distinct('g.id')
                ->count();
        return $ret;
    }

    /*
     * 首页查询上架展示的夺宝商品
     */

    public function getIndianaGoods($where = '1', $order = 'ic.orderid,ic.start_time desc', $start = 0, $len = 99) {
        $where .= ' and g.status=1 and ic.is_use=1 and ic.start_time <= ' . time() . ' and ic.end_time > ' . time();
        $ret = M('indiana_config')->alias('ic')
                ->join('left join __ITEM__ g on g.id = ic.item_id')
                ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
                ->field('g.*,ic.*,c.name as cate_name')
                ->where($where)
                ->order($order)
                ->limit($start . ',' . $len)
                ->select();
        return $ret;
    }

    /*
     * 获取兑换商品详情
     */

    public function getDetail_e($id) {
        $where = 'g.id = ' . $id;
        $ret = M('item_list')->alias('il')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
                ->join('left join __ITEM__ g on g.id = il.itemid')
                ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
                ->field('g.*, c.name as cate')
                ->where($where)
                ->find();
        return $ret;
    }

    /*
     * 获取夺宝商品详情
     */

    public function getDetail_i($id) {
        $where = 'ic.id = ' . $id . ' and g.status=1 and ic.is_use=1 and ic.start_time <= ' . time() . ' and ic.end_time > ' . time();
        $ret = M('indiana_config')->alias('ic')
                ->join('left join __ITEM__ g on g.id = ic.item_id')
                ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
                ->field('g.*,ic.*,c.name as cate')
                ->where($where)
                ->find();
        return $ret;
    }

    /*
     * 随机获取商品
     * len获取商品的个数
     * cateid商品分类ID
     */

    public function getRndGoods($len, $cateid) {
        $where .= ' and tc.start_time <= ' . time() . ' and tc.end_time > ' . time();
        $ret = M('item_list')->alias('il')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
                ->join('left join __ITEM__ g on g.id = il.itemid')
                ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
                ->field('g.*,c.name as cate_name')
                ->where($where)
                ->order('rand()')
                ->limit('1,' . $len)
                ->select();
        return $ret;
    }

    /**
     * 获取兑换上架商品总数
     */
    public function getOnsaleGoodsCount($where = '1') {
       $where .= ' and g.status=1  and c.status=1 and (tc.status=1 and  (unix_timestamp(now()) between start_time and end_time))';
        // $ret = M('item_list')->alias('il')
        //         ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
        //         ->join('left join __ITEM__ g on g.id = il.itemid')
        //         ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
        //         ->where($where)
        //         ->distinct("g.id")
        //         ->count();
        $ret = M('item')->alias('g')
                ->join('left join hamster_item_list il on g.id = il.itemid')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id=il.timeid')
                ->join('left join __ITEM_CATE__  c on c.id=g.item_cate')
                ->where($where)
                ->distinct("g.id")
                ->count();
        return $ret;
    }

    /**
     * 获取夺宝上架商品总数
     */
    public function getIndianaGoodsCount($where = '1') {
        $where .= ' and g.status=1 and ic.is_use=1 and ic.start_time <= ' . time() . ' and ic.end_time > ' . time();
        $ret = M('indiana_config')->alias('ic')
                ->join('left join __ITEM__ g on g.id = ic.item_id')
                ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
                ->where($where)
                ->count();
        return $ret;
    }

    /**
     * 明日商品 查询
     */
    public function getTomorrowGoods($start = 0, $len = 99, $order = 'il.ordid asc, g.id desc', $where = '1') {
        $hour = date('H');
        if ($hour < 10) {
            $tomorrow = strtotime(date('y-m-d', strtotime('+0 days'))) + 10 * 60 * 60; //今天10点
        } else {
            $tomorrow = strtotime(date('y-m-d', strtotime('+1 days'))) + 10 * 60 * 60; //明日10点
        }
        $where .= ' and tc.start_time <= ' . $tomorrow . ' and tc.end_time > ' . $tomorrow;
        $ret = M('item_list')->alias('il')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
                ->join('left join __ITEM__ g on g.id = il.itemid')
                ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
                ->field('g.*,c.name as cate_name')
                ->where($where)
                ->order($order)
                ->limit($start . ',' . $len)
                ->select();
        return $ret;
    }

    /**
     * 明日商品 总数
     */
    public function getTomorrowGoodsCount($where = '1') {
        $hour = date('H');
        if ($hour < 10) {
            $tomorrow = strtotime(date('y-m-d', strtotime('+0 days'))) + 10 * 60 * 60; //今天10点
        } else {
            $tomorrow = strtotime(date('y-m-d', strtotime('+1 days'))) + 10 * 60 * 60; //明日10点
        }
        $where .= ' and tc.start_time <= ' . $tomorrow . ' and tc.end_time > ' . $tomorrow;
        $ret = M('item_list')->alias('il')
                ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
                ->join('left join __ITEM__ g on g.id = il.itemid')
                ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
                ->where($where)
                ->count();
        return $ret;
    }

}
