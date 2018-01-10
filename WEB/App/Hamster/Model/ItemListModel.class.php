<?php

namespace Hamster\Model;

use Think\Model;

class ItemListModel extends Model {

    /**
     * 首页查询上架展示的兑换商品
     */
    public function getOnsaleGoods($where = '1', $order = 'g.add_time desc', $start = 0, $len = 99) {
        $where .= ' and g.status=1  and c.status=1 and (g.author=0 or (tc.status=1 and  (unix_timestamp(now()) between start_time and end_time)))';
        $order='start_time desc, tc.ordid asc,il.ordid asc,'.$order;
        // $ret = M('item_list')->alias('il')
        //         ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
        //         ->join('left join __ITEM__ g on g.id = il.itemid')
        //         ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
        //         ->field('g.*,c.name as cate_name')
        //         ->where($where)
        //         ->group('g.id')
        //         ->limit($start . ',' . $len)
        //         ->select();
         $ret=M('item')->alias('g')  
            ->join('left join hamster_item_list il on g.id = il.itemid')
            ->join('left join __TIME_CONTROLLER__ tc on tc.id=il.timeid') 
            
            ->join('left join __ITEM_CATE__  c on c.id=g.cate_id')       
            ->field('g.*,c.name as cate_name')
            ->where($where)
            ->order($order)
            ->group('g.id')
            ->limit($start . ',' . $len)  
            ->select();
        
        return $ret;
    }

    /**
     * 获取兑换上架商品总数
     */
    public function getOnsaleGoodsCount($where = '1') {
         $where .= ' and g.status=1  and c.status=1 and (g.author=0 or (tc.status=1 and  (unix_timestamp(now()) between start_time and end_time)))';
        // $ret = M('item_list')->alias('il')
        //         ->join('left join __TIME_CONTROLLER__ tc on tc.id = il.timeid')
        //         ->join('left join __ITEM__ g on g.id = il.itemid')
        //         ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
        //         ->where($where)
        //         ->distinct("g.id")
        //         ->count();
         $ret=M('item')->alias('g')  
            ->join('left join hamster_item_list il on g.id = il.itemid') 
            ->join('left join __TIME_CONTROLLER__ tc on tc.id=il.timeid')  
            ->join('left join __ITEM_CATE__  c on c.id=g.cate_id')  
            ->where($where)
            ->distinct("g.id")
            ->count();
        return $ret;
    }

    /**
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

}
