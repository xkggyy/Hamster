<?php

namespace Admin\Controller;

use Think\Controller;

class OauthController extends BaseController {
    function __construct() {
        parent::__construct();
    }
    public function rule_list(){
        $rule=D('auth_rule');
        $list=$rule->select();
        $this->assign('list',$list);
        $this->display();
    }
    public function rule_add(){
         $id=I('id');
         if($id){
             $auth_rule=D('auth_rule');
             $rule=$auth_rule->getById($id);
             $this->assign('item',$rule);
         }
         $this->display();
    }
    //添加或者更新模块
    public function dorule_add(){
            $rule=D('auth_rule');
            $rule->create();
            if(I("id")==""){//添加
                $ret=$rule->add();
                $data['success']=$ret;
                $data['message']='添加';
            }else{//更新
                $ret=$rule->save();
                $data['success']=$ret;
                $data['message']='更新';
            }
            $this->ajaxReturn($data);
    }

    public function group_list(){
        $group=D('auth_group');
        $list=$group->select();
        $this->assign('list',$list);
        $this->display();
    }
    public function group_add(){
        $id=I('id');
        if($id){
            $group=D('auth_group');
            $g=$group->getById($id);
            $this->assign('group',$g);
        }
         $rule=D('auth_rule');
         $rule_items=$rule->where(' status=1')->select();
         $this->assign('items',$rule_items);
         $this->display();
    }
    public function dogroup_add(){
        //$test=I('rules');
        $data['rules']=implode(',',I('rules'));
        if($data['rules']==null){
            $data['rules']=I('rules');
        }
        $data['title']=I('title');
        if(I('status')=='1'){
            $data['status']=1;
        }
        $group=D('auth_group');
        $id=I('post.id');
        if(!empty($id)){
           
            $group->create($data);
            $group->where('id='.$id)->save();
        }else{
            $group->create($data);
            $ret= $group->add();
            $data['success']=$ret;
            $data['message']='添加';
        }
        $this->ajaxReturn($data);
    }

    public function rules_delete(){
        $id=I("post.id");
        $rule=D('auth_rule');
        $ret=$rule->delete($id);
        $this->ajaxReturn($ret);
    }
    public function group_delete(){
        $id=I("post.id");
        $group=D('auth_group');
        $ret=$group->delete($id);
        $this->ajaxReturn($ret);
    }
}