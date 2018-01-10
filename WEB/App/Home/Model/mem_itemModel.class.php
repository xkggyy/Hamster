<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Home\Model;
use Think\Model;
/**
 * Description of mem_itemModel
 *
 * @author icebox01
 */
class mem_itemModel  extends Model{
    
    protected  $_auto=array(
        array('userId','getSession',1,'function'),
    );
    private function getSession(){
       return session("usre.id");
    }
    //put your code here
    /**
     * 获取用户选品条数
     */
    public function getMemCount($userId){
        $count=M("mem_item")
            ->where("userId='".$userId."'")
            ->count();
        return $count; 
    }

    public function getMemItem($userId='1'){
        $ret=M("mem_item")->alias('mi')
            ->join('left join __ITEM__ i on i.id=mi.itemid')
            ->field('i.*,mi.aditemshorturl,mi.couponshorturl')
            ->where("userid=".$userId)
            ->select();
        return $ret;
    }
}