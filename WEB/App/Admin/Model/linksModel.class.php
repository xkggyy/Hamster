<?php
namespace Admin\Model;
use Think\Model;

class linksModel extends Model {
    //todo 分类表模型定义完善
    /**
     * @param int $start
     * @param int $limit
     * @param string $sort
     * @param string $status
     * @return mixed
     * 根据状态等查询分类
     * wdy
     */

    public function getAllCates($start = 0, $limit = 10, $sort='c.id',$status='1,2') {
        $has_sort = empty($sort)?null:$sort;
        $where = "c.status in ($status)";
        $limit = " $start,$limit";
        if($has_sort){
            $order = "c.ordid asc , $sort";
        }else{
            $order = "c.ordid asc";
        }
        $contents = M('item_cate')->alias('c')->where($where)->order($order)->limit($limit)->select();
        return $contents;
    }

    /**
     * @param int $start
     * @param int $len
     * @param int $where
     * @return mixed
     * 按条件 查询 分类
     */
    public function getCateList($start=0,$len=10,$where='1',$order='c.ordid asc'){
        $ret = M('item_cate')->alias('c')
            ->where($where)
            ->order($order)
            ->limit($start.','.$len)->select();
        return $ret;
    }


}