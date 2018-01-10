<?php

namespace Admin\Model;

use Think\Model;

class user_exchangeModel extends Model {

    //分页查询米粒兑换商品详情
    public function getRiceExchange($start = 0, $len = 10, $where = '1', $order = 'g.id desc') {

        return $this->alias('g')
                        ->join('left join __USER__ c on c.id = g.userid')
                        ->join('left join __ITEM__ p on p.id=g.itemid')
                        ->field('g.*')
                        ->where($where)
                        ->order('g.id asc')
                        ->limit($start . ',' . $len)->select();
    }

}
