<?php

namespace Home\Model;

use Think\Model;

class item_cateModel extends Model {

    // 分类表模型定义完善
    /**
     * 根据状态等查询分类
     */
    public function getAllCates($status = '1',$spid='0') {
        $where = "c.status =$status and c.spid=$spid";
        $order = "c.ordid asc";
        $contents = M('item_cate')
                ->alias('c')
                ->where($where)
                ->order($order)
                ->select();
        return $contents;
    }

    /**
     * @param int $start
     * @param int $len
     * @param int $where
     * @return mixed
     * 按条件 查询 分类
     */
    public function getCateList($start = 0, $len = 10, $where = '1', $order = 'c.ordid asc') {
        $ret = M('item_cate')->alias('c')
                ->where($where)
                ->order($order)
                ->limit($start . ',' . $len)
                ->select();
        return $ret;
    }

}
