<?php

namespace Hamster\Model;

use Think\Model;

class itemModel extends Model {
    // 商品表模型定义

    /**
     * 按条件查询商品列表
     */
    public function getGoodsList($start = 0, $len = 10, $where = 1) {
        $ret = M('item')->alias('g')
                ->join('left join __ITEM_CATE__ c on c.id = g.cate_id')
                ->field('g.*,c.name as cate_name')
                ->where($where)
                ->order('g.id desc')
                ->limit($start . ',' . $len)
                ->select();
        return $ret;
    }

    /**
     * 按商品id 查询商品信息
     */
    public function getItemInfo($item_id = 0) {
        if ($item_id == 0) {
            return false;
        }
        $ret = M('item')->getById($item_id);
        return $ret;
    }

}
