<?php
namespace Admin\Model;
use Think\Model;

class item_listModel extends Model {

    //todo 日程商品表模型定义完善

    /**
     * 查询日程 已经添加 商品列表
     * wdy
     */
    public function getScheduleItemList($start=0,$len=10,$where=1){
        $ret = M('item_list')->alias('il')
            ->join('left join __ITEM__ g on g.id = il.itemid')
            ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
            ->field('g.*,il.id as il_id,il.ordid as il_ordid,c.name as cate_name')
            ->where($where)
            ->order('il.ordid asc, g.id desc')
            ->limit($start.','.$len)->select();
        return $ret;
    }

    /**
     * 查询日程 待添加 商品总数
     * wdy
     */
    public function getScheduleLeftItemCount($where=1){
        //已经添加到日程的商品id
        $added_item_ids = M('item_list')->alias('il')
            ->join('left join __ITEM__ g on g.id = il.itemid')
            ->field('il.itemid as id')
            ->where($where)->select();
        foreach($added_item_ids as $v){$added_item_ids_tmp[] = $v['id'];}
        $added_item_ids = $added_item_ids?implode(',',$added_item_ids_tmp):0;//已经存在的商品Id串
        $ret = M('item')->alias('g')
            ->where("g.status = 1  and g.id not in ($added_item_ids) ")
            ->count();
        $ret = $ret?$ret:0;
        return $ret;
    }

    /**
     * 查询日程 待添加 商品列表
     * wdy
     */
    public function getScheduleLeftItem($start=0,$len=10,$where='1'){
        //已经添加到日程的商品id
        //$where.=" and g.author>0";
        $added_item_ids = M('item_list')->alias('il')
            ->join('left join __ITEM__ g on g.id = il.itemid')
            ->field('il.itemid as id')
            ->where($where)->select();
        $added_item_ids_tmp = null;
        foreach($added_item_ids as $v){$added_item_ids_tmp[] = $v['id'];}
        //已经存在的商品Id
        $added_item_ids = $added_item_ids?implode(',',$added_item_ids_tmp):0;
        $ret = M('item')->alias('g')
            ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
            ->field('g.*,c.name as cate_name')
            ->where(" g.`id` not in ($added_item_ids) and g.status=1")
            ->order('g.id desc')
            ->limit($start.','.$len)->select();
        return $ret;
    }


}