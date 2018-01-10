<?php

namespace Hamster\Model;

use Think\Model;

class TimeControllerModel extends Model{
    public function  getRuningNav(){
        $where='start_time <='.time().' and end_time >'.time().' and status=1';
        $ret=M('time_controller')
            ->field('id,remark')
            ->where($where)
            ->order('ordid desc')
            ->select();
        return $ret;
    }
}