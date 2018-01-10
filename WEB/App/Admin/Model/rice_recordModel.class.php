<?php

namespace Admin\Model;

use Think\Model;

class rice_recordModel extends Model {

    //分页查询米粒详情
    public function getRiceList($start = 0, $len = 10, $where = '1', $order = 'c.id desc') {
        $ret = M('rice_record')->alias('c')
                        ->where($where)
                        ->order($order)
                        ->limit($start . ',' . $len)->select();
        return $ret;
    }




}
