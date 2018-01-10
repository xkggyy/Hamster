<?php

namespace Admin\Model;

use Think\Model;

class time_controllerModel extends Model {

    /**
     * 按条件查询日程列表
     */
    public function getScheduleList($start = 0, $len = 15, $where = 1) {
        $ret = M('time_controller')->alias('tc')
                        ->where($where)
                        ->order('tc.ordid,tc.id desc')
                        ->limit($start . ',' . $len)->select();
        return $ret;
    }

    /**
     * 按日程id 查询日程详情
     */
    public function getItemInfo($item_id = 0) {
        if ($item_id == 0) {
            return false;
        }
        $ret = M('item')->getById($item_id);
        return $ret;
    }

}
