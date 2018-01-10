<?php

namespace Hamster\Model;

use Think\Model;

class MembersModel extends Model {

    protected $_validate = array(
        array('qq_openid', 'unique', '帐号已经存在！', 0, 'unique', 1), // 在新增的时候验证name字段是否唯一
    );
    // 自动完成
    protected $_auto = array(
        array('status', '0'),  // 新增的时候把status字段设置为0
        array('flag', '0'),  // 新增的时候把flag字段设置为0
        array('score', '200'), // 新登陆用户送200积分
        array('level', '0'),   // 新登陆用户等级为0
        array('account', 'getAccount', 3, 'callback'), // 对name字段在新增和编辑的时候回调getAccount方法
        array('regdate', 'time', 1, 'function'), // 对regdate字段在添加的时候写入当前时间戳
        array('lastlogintime', 'time', 3, 'function'), // 对lastlogintime字段在所有时候写入当前时间戳
    );
    
    // 计算用户登陆号
    public function getAccount() {
        $_sn = $this->max('id');
        $ss = 5000000 + $_sn;
        return $ss;
    }
    
    // 查找用户EMAIL是否被注册
    public function valiMembersTel($tel) {
        return M('members')->where("tel ='" . $tel."'")->find();
    }
    
    // 返回用户表总数
    public function getMembersCount($where = '1') {
        return $this->where($where)->count();
    }
    
    // 按条件 查询 用户表
    public function getMembersList($start = 0, $len = 10, $where = '1', $order = 'c.id asc') {
        return $this->alias('c')
        ->where($where)
        ->order($order)
        ->limit($start . ',' . $len)
        ->select();
    }
    
    // 根据ID返回用户信息
    public function getMembersById($id) {
        return $this->where('id =' . $id)->find();
    }
}
