<?php

namespace Admin\Model;

use Think\Model;

class ItemModel extends Model {
    
    // 自动验证
    protected $_validate = array(
        array('cate_id',0,'请选择商品分类！',3,'notequal'),
        array('auctionId', 'unique', '商品已存在！',3,'unique'), // 在新增的时候验证name字段是否唯一
    );
    // 自动完成
    protected $_auto = array(
        array('status', 1),
        array('add_time', 'time', 1, 'function'), // 对lastlogintime字段在所有时候写入当前时间戳
    );
    public function getGoodsCount($where = 1) {
        return $this->alias('g')->join('left join __ITEM_CATE__ c on c.id = g.item_cate')->where($where)->count();
    }
    
    /**
    * 按条件查询商品列表
    */
    public function getGoodsList($start = 0, $len = 10, $where = 1) {
        return $this->alias('g')
        ->join('left join __ITEM_CATE__ c on c.id = g.item_cate')
//        ->join('left join hamster_members m on m.id=g.author')
        ->field('g.*,c.name as cate_name')
        ->where($where)
        ->order('g.id desc')
        ->limit($start . ',' . $len)->select();
    }
    
    /**
    * 按商品id 查询商品信息
    */
    public function getItemInfo($item_id = 0) {
        if ($item_id == 0) {
            return false;
        }
        return $this->getById($item_id);
    }
    
}