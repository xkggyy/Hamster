<?php

namespace Home\Controller;

use Think\Controller;

class IndexController extends BaseController {

    function __construct() {
        parent::__construct();

        //$this->assgin= $_GET["_URL_"][1];
        // $this->assign('page',$_SERVER["REQUEST_URI"]);

        $a = 1;
        $url = $_SERVER["REQUEST_URI"];
        if (strpos($url, 'help') != false) {
            $a = 2;
        }
        if (strpos($url, 'contactus') != false) {
            $a = 3;
        }
        $this->assign('page', $a);
    }

    /**
     * 首页
     */
    public function index() {
        //领券直播
        $mode = new \Home\Model\ItemListModel();
        $items = $mode->getOnsaleGoods('1', 'g.id desc', 0, 6, false);
        $this->assign('items', $items);

        //分类信息
        $cate_mod = new \Home\Model\item_cateModel();
        $cates = $cate_mod->getCateList(0, 99, ' 1 and spid>0', $order = 'c.ordid,c.id asc');
        $nav = array();
        $tag = array();
        foreach ($cates as $a) {
            switch ($a['spid']) {
                case 1:
                    $nav[] = $a;
                    break;
                case 2:
                    $tag[] = $a;
                    break;
            }
        }
        $this->assign('nav', $nav);
        $this->assign('tag', $tag);
        $this->display();
    }

    //领券直播
    public function listView() {
        $keyword = I('kw');
        $tcid = I('tcid');
        $itid=I('itid');
        $sxid = I('sxid');
        $goodsName = I('goodsName','');
        $pageIndex = I('pageIndex', 1);
        $pageSize = I('pageSize', 16);
        $order = I('order', 'g.id desc');
        if ($pageIndex == 'NaN') {
            $pageIndex = 1;
        }
        $where = '1';
        if (!empty($keyword)) {
            $where .= " and (title like '%" . $keyword . "%' or c.name='" . $keyword . "')";
        }
        if (!empty($tcid)) {
            $where .= ' and c.id=' . $tcid;
        }
        if (!empty($itid)) {
            $where .= ' and g.item_cate=' . $itid;
        }
        if (!empty($sxid)) {
            $where .= ' and g.item_tag like "%' . $sxid . '%"';
        }
        if (!empty($goodsName)) {
            $where .= ' and g.title like "%' . $goodsName . '%"';
        }
        $minPrice = I('minPrice', 0);
        $maxPrice = I('maxPrice', 0);
        $yjScale = I('yjScale', 0);
        $salesVolume = I('salesVolume', 0);
        if ($minPrice != 0) {
            $where .= ' and g.zkPrice>=' . $minPrice;
        }
        if ($maxPrice != 0) {
            $where .= ' and g.zkPrice<=' . $maxPrice;
        }
        if ($yjScale != 0) {
            $where .= ' and g.tkRate>=' . $yjScale;
        }
        if ($salesVolume != 0) {
            $where .= ' and g.biz30day<=' . $salesVolume;
        }
        $item_list_mod = new \Home\Model\item_listModel();
        $count = $item_list_mod->getOnsaleGoodsCount($where); //获取总条数；
        $all_page = ceil($count / $pageSize); //总页数
//        $order = 'g.id desc';
        $dh_f_goods = $item_list_mod->getOnsaleGoods($where, $order, ($pageIndex - 1) * $pageSize, $pageSize);
        //分页读取数据。
        $this->assign('dh_f_goods', $dh_f_goods);
        $this->assign('count', $count);
        $this->assign('pageIndex', $pageIndex);
        $this->assign('all_page', $all_page);
        $this->display();
    }

    //联系我们
    public function contactus() {
        $this->display();
    }

    //帮助
    public function help() {

        $this->display();
    }

    /**
     * 获取用户选中要推广的商品
     */
    public function metas() {
        $ids = I('ids');

        $goods = $this->item_list_mod->getOnsaleGoods(' il.itemid in (' . $ids . ')');

        $data['result'] = $goods;
        $data['status'] = 0;
        $json = json_encode($data);
        $json = "Choice.fn(" . $json . ")";
        //$this->display($json);
        echo $json;
    }

    /**
     * 兑换商品列表页
     */
    public function elist() {
        $data = I('get.', null, 'trim');
        //分类查询
        $where = 'tc.type = 1';
        if (!empty($data['cid'])) {
            $where .= ' And c.id=' . trim($data['cid']);
            $search_status['cid'] = $data['cid'];
        }
        //分页
        $count = $this->item_list_mod->getOnsaleGoodsCount($where);
        // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 40);
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $Page->setConfig('first', '首页');
        $Page->setConfig('last', '末页');
        $Page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%');
        //分页按钮排序
        $Page->lastSuffix = false;
        //不显示总页数
        $Page->rollPage = 6;
        //每页显示页数
        $show = $Page->show();
        // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性

        $order = 'tc.ordid,il.ordid asc';
        $dh_f_goods = $this->item_list_mod->getOnsaleGoods($where, $order, $Page->firstRow, $Page->listRows);
        //取99个
        //分离商品价格
        foreach ($dh_f_goods as $k => $v) {
            $int = floor($v['price']);
            $float = floor(10 * ($v['price'] - $int));
            if ($int < 100 && $float > 0) {
                $dh_f_goods[$k]['price'] = $int . '.<i>' . $float . '</i>';
            } else {
                $dh_f_goods[$k]['price'] = $int;
            }
        }
        $this->nav = 3;
        // 导航标识
        $this->assign('page', $show);
        //分页输出html
        $this->assign('search_status', $search_status);
        // 搜索状态
        $this->assign('dh_f_goods', $dh_f_goods);
        // 首页展示商品
        $this->assign('nav', $this->nav);
        $this->assign('time', strtotime('-1 day'));
        $this->display();
    }

    /**
     * 夺宝商品列表页
     */
    public function ilist() {
        $data = I('get.', null, 'trim');
        //分类查询
        $where = '1';
        if (!empty($data['cid'])) {
            $where .= ' and c.id=' . trim($data['cid']);
            $search_status['cid'] = $data['cid'];
        }
        //分页
        $count = $this->item_list_mod->getIndianaGoodsCount($where);
        // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 40);
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        $Page->setConfig('first', '首页');
        $Page->setConfig('last', '末页');
        $Page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%');
        //分页按钮排序
        $Page->lastSuffix = false;
        //不显示总页数
        $Page->rollPage = 6;
        //每页显示页数
        $show = $Page->show();
        // 分页显示输出// 进行分页数据查询 注意limit方法的参数要使用Page类的属性

        $order = 'ic.orderid';
        $db_f_goods = $this->item_list_mod->getIndianaGoods($where, $order, $Page->firstRow, $Page->listRows);
        //取99个

        foreach ($db_f_goods as $k => $v) {
            $int = floor($v['price']);
            $float = floor(10 * ($v['price'] - $int));
            if ($int < 100 && $float > 0) {
                $db_f_goods[$k]['price'] = $int . '.<i>' . $float . '</i>';
            } else {
                $db_f_goods[$k]['price'] = $int;
            }
            $db_f_goods[$k]['pg'] = sprintf("%.2f", $v['indianed'] / $v['indiana_totle'] * 100);
            $db_f_goods[$k]['indiana_s'] = $v['indiana_totle'] - $v['indianed'];
        }
        $this->nav = 4;
        // 导航标识
        $this->assign('page', $show);
        //分页输出html
        $this->assign('search_status', $search_status);
        //搜索状态
        $this->assign('db_f_goods', $db_f_goods);
        //首页展示商品
        $this->assign('nav', $this->nav);
        $this->display();
    }

    /*
     * 获取单条单品详情
     */

    public function getGoodsDetail() {
        $id = I('post.id');
        $obj["success"] = false;
        if (!empty($id)) {
            $data = M("item")->where("id=" . $id)->select();
            if ($data != NULL) {
                $obj["success"] = true;
                $obj["data"] = $data;
            } else {
                $obj["message"] = "商品不存在";
            }
        } else {

            $obj["message"] = "非法请求";
        }
        $this->ajaxReturn($obj);
    }

    public function tktg() {
        $userId = I("get.id");
        $mem_item = new \Home\Model\mem_itemModel();
        $items = $mem_item->getMemItem($userId);
        $this->assign("items", $items);
        $this->display();
    }

}
