<?php

namespace Hamster\Model;

use Think\Model;

class ItemCateModel extends Model {
	/**
	 * 根据状态等查询分类
	 */
	public function getAllCates($status = '1', $spid = '0') {
		$where = "c.status =$status and c.spid=$spid";
		$order = "c.ordid asc";
		$contents = M('item_cate') -> alias('c') -> where($where) -> order($order) -> select();
		return $contents;
	}

	/**
	 * 按条件 查询 分类
	 */
	public function getCateList($start = 0, $len = 10, $where = '1', $order = 'c.ordid asc') {
		$ret = M('item_cate') -> alias('c') -> where($where) -> order($order) -> limit($start . ',' . $len) -> select();
		return $ret;
	}

}
