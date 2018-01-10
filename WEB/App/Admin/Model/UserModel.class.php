<?php

namespace Admin\Model;

use Think\Model;

class UserModel extends Model {

    // 返回用户表总数
    public function getCount($where = '1', $table) {
        return M($table)->where($where)->count();
    }

    // 按条件 查询 用户表
    public function getMembersList($start = 0, $len = 10, $where = '1', $order = 'c.id desc') {
        return $this->alias('c')
                        ->where($where)
                        ->order($order)
                        ->limit($start . ',' . $len)
                        ->select();
    }


    // 按openid 更新用户信息的状态
    public function updateStatus($id, $status) {
        $data['status'] = $status;
        //只修改指定字段
        return $this->where('id=' . $id)->field('status')->save($data);
    }

}
