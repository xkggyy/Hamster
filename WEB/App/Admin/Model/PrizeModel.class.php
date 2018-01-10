<?php

namespace Admin\Model;

use Think\Model;

class PrizeModel extends Model {


    //查询用户中奖详情
    public function getTrophyInfo($start = 0, $len = 10, $where = '1', $order = 'g.id desc') {
        return M('user_prize')->alias('g')
                        ->join('left join __USER__ c on c.id = g.userid')
                        ->join('left join __PRIZE__ p on p.id=g.prizeid')
                        ->field('g.*')
                        ->where($where)
                        ->order('g.id desc')
                        ->limit($start . ',' . $len)->select();
    }

    //查询活动的奖品详情
    public function getPrizes($start = 0, $len = 10, $where = '1', $order = 'g.id desc') {
        return M('prize')->alias('g')
                        ->where($where)
                        ->order('g.id asc')
                        ->limit($start . ',' . $len)->select();
    }

}
