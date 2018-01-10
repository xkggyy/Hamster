<?php
namespace Admin\Model;
use Think\Model;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class item_tagModel extends  Model{
    public function getAllTags($start = 0, $limit = 10, $sort='c.id',$status='1,2') {
        $has_sort = empty($sort)?null:$sort;
        $where = "c.status in ($status)";
        $limit = " $start,$limit";
//        if($has_sort){
//            $order = "c.order asc , $sort";
//        }else{
//            $order = "c.order asc";
//        }
        $contents = M('item_tag')->alias('c')->where($where)->order($order)->limit($limit)->select();
        return $contents;
    }
    
    
    public function getTagsList($start=0,$len=10,$where='1',$order='c.order asc'){
        $ret = M('item_tag')->alias('c')
            ->where($where)
//            ->order($order)
            ->limit($start.','.$len)->select();
        return $ret;
    } 
    
    
    
}
