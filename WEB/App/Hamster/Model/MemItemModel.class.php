<?php

namespace Hamster\Model;

use Think\Model;

class MemItemModel extends Model {

    protected $_auto = array(
        array('userId', 'getSession', 1, 'function'),
    );

    private function getSession() {
        return session("usre.id");
    }

    /**
     * 获取用户选品条数
     */
    public function getMemCount($userId) {
        $count = M("mem_item")
                ->where("userId='" . $userId . "'")
                ->count();
        return $count;
    }
   /***
    *获取当前用户专属页的选品
   **/
    public function getMemItem($userId = '1') {
        $ret = M("mem_item")->alias('mi')
                ->join('left join __ITEM__ i on i.id=mi.itemid')
                ->field('i.*,mi.aditemshorturl,mi.couponshorturl,mi.id as miid')
                ->where("userid=" . $userId)
                ->select();
        return $ret;
    }

}
