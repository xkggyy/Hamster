<?php

namespace Home\Controller;
use Think\Controller;

vendor('top.Autoloader');
vendor('top.top.TopClient');
/**
 * Description of MerchantsController
 *
 * @author 朱焱华
 */
class MerchantsController  extends BaseController{
    //put your code here
    function __construct() {
        parent::__construct();
//        if(session("id")==''||  session("id")==NULL){
//            return $this->redirect('/login/qq_login/return/CURRENT_URL');
//        }
    }
    public function  index(){
        return $this->display();
    }
    /*
     * 获取商品信息
     */
    public function goods_info_get() {
        $url = I('get.url', '', 'urldecode'); //解码
        if ($url) {
            //为url则开始解析 是淘宝、天门店铺　以及taoid
            $url_arr = parse_url($url);
            $host = $url_arr['host'];
            $param = $url_arr['query'];
            $taoid = convertUrlQuery(htmlspecialchars_decode($param))['id']; //将&等转义后的字符转回，否则取不到id
            $c = new \TopClient;
            
            $c->appkey = "23331745";
            $c->secretKey = "ecda557e8b73541d04d72c84f7e36d11";
            $c->format = 'json';
            $req = new \TbkItemInfoGetRequest;
            $req->setFields("num_iid,nick,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,volume");
            $req->setNumIids($taoid);
            $resp = $c->execute($req);

            if (!empty($resp->results->n_tbk_item[0]->num_iid)) {
                $item_info = '';
                $item_info['taoid'] = $resp->results->n_tbk_item[0]->num_iid;
                $item_info['type'] = $resp->results->n_tbk_item[0]->user_type + 1;
                $item_info['url'] = $resp->results->n_tbk_item[0]->item_url;
                $item_info['title'] = $resp->results->n_tbk_item[0]->title;
                $item_info['wangwang'] = $resp->results->n_tbk_item[0]->nick;
                $item_info['img'] = $resp->results->n_tbk_item[0]->pict_url;
                $item_info['price'] = $resp->results->n_tbk_item[0]->reserve_price;
                $item_info['discount_price'] = $resp->results->n_tbk_item[0]->zk_final_price;
              //  $item_info['mb'] = $item_info['discount_price'] * 100; // 米粒 = 商品原价 * 100 
                $item_info['volume'] = $resp->results->n_tbk_item[0]->volume;
               // $req=new \TbkItemsDetailGetRequest
                $data['status'] = 1;
                $data['item_info'] = $item_info;
                $data['content'] = '商品信息 获取成功！';
                $this->ajaxReturn($data);
            } else {
                $data['status'] = 2;
                $data['content'] = '这件商品没有设置淘宝客佣金！';
                $this->ajaxReturn($data);
            }
        } else {
            $data['status'] = 2;
            $data['content'] = '淘宝商品地址不能为空！';
            $this->ajaxReturn($data);
        }
    }
    public  function addgoods(){
         $this->_cate_mod = new \Admin\Model\item_cateModel();
         $cateList = $this->_cate_mod->getAllCates(0, 40, NULL, '1');
        $this->assign("cateList", $cateList);
        return $this->display();
    }
      public function goods_save() {
        $goods_data = I('post.good_info');
        $img_data = I('post.img_data'); //图片列表信息
        //处理商品信息格式(js数组转为php数组)
        $goods_info = array();
        foreach ($goods_data as $v) {
            $goods_info[$v['name']] = $v['value'];
        }
        //如果选择了图片列表图片，则保存主图为其他图片
        if ($goods_info['img_num'] <> 0) {
            $goods_info['img'] = $img_data[$goods_info['img_num']];
        }
        unset($goods_info['img_num']); //清空该字段，以便入库
        //数据格式检查
        if ($goods_info['cate_id'] == 0 || !$goods_info['taoid'] || !$goods_info['title'] || !$goods_info['url'] || !$goods_info['img'] || !$goods_info['old_price'] || !$goods_info['price']) {
            $data['status'] = 2;
            $data['content'] = '尚有必填项为空，请核对后从新提交！';
            $this->ajaxReturn($data);
        }
        //重复taoid检查
        if ((M('item')->getFieldBytaoid($goods_info['taoid'], 'id')) > 0) {
            $data['status'] = 2;
            $data['content'] = '该商品已经存在，请勿重复添加！';
            $this->ajaxReturn($data);
        }

        $item_mod = D('item');
        $item_mod->create($goods_info);
        $item_mod->discount = sprintf("%.2f", ($item_mod->price / $item_mod->old_price) * 10);
        $item_mod->add_time = time();
        $item_id = $item_mod->add();
        if ($item_id) {
            //同步添加相应图片列表 //批量添加入库
            $dataList = null;
            foreach ($img_data as $v) {
                $dataList[] = array(
                    'item_id' => $item_id,
                    'url' => $v
                );
            }
            M('item_img')->addAll($dataList);
            $data['status'] = 1;
            $data['content'] = '添加成功！';
        } else {
            $data['status'] = 2;
            $data['content'] = '添加失败！';
        }
        $this->ajaxReturn($data);
    }

   
   
}
