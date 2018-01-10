<?php

namespace Admin\Controller;

use Think\Controller\HproseController;

class ImportController extends HproseController {
    protected $allowMethodList =array('insert');
    public function insert($object){
       // $Item=M("Item");
         set_time_limit(120);
        $ItemTag=M("ItemTag");
        $object=json_decode(json_encode($object),true);
        //$time=time();
        $mode=M();
        $j=0;
         try{
            foreach($object as $d){
                try{
                    
                    // $d["add_time"]=$time;
                    // $Item->add($d,array(),true);
                    $tags=explode('/',$d['item_tag']);
                    foreach($tags as $t){
                        $it["tag_name"]=$t;
                        $it["usetime"]=$d["add_time"];
                        $ItemTag->add($it,array(),true);
                    }
                    // $d["add_time"]=$time;
                   
                    $wordsArray=get_tags($d["title"]);
                    $words=implode(',', $wordsArray);
                    $d["title"]=str_replace('\'','\\\'',$d["title"]);
                    $sql="call Pro_inser_Item({$d["auctionId"]},'{$d["auctionUrl"]}','{$d["title"]}','{$d["pictUrl"]}',{$d["zkPrice"]},{$d["biz30day"]},{$d["tkRate"]},{$d["tkCommFee"]},'{$d["shopTitle"]}',{$d["userType"]},{$d["couponTotalCount"]},{$d["couponLeftCount"]},'{$d["couponInfo"]}','{$d["couponEffectiveStartTime"]}','{$d["couponEffectiveEndTime"]}','{$d["couponLink"]}',{$d["add_time"]},{$d["item_cate"]},'{$words}');";
                    
                    $id=$mode->query($sql);
                    if($id[0]["rid"]!=0){
                        $j++;
                    }
                }catch(Exception $ex){
                    continue;
                }
            }
            set_time_limit(30);
            return $j."";
        }catch(Exception $ex){
            return $j."";
        }
    }
}