<?php

namespace Admin\Controller;

use Think\Controller;

class GoodsController extends BaseController {

    function __construct() {
        parent::__construct();
        $this->_cate_mod = new \Admin\Model\item_cateModel();
    }

    // 商品管理-首页
    public function index() {
        $this->redirect("Goods/goods_list");
    }

    // 商品列表 页面
    public function goods_list() {
        //搜索
        $map['auctionId'] = I('auctionId', null, 'trim');
        $map['title'] = I('title', null, 'trim');
        $map['cate_id'] = I('cate_id', null, 'trim');
        $gtype = I('gtype', null, 'trim');
        empty($map['auctionId']) || $where['auctionId'] = array('eq', $map['auctionId']);
        empty($map['title']) || $where['title'] = array('like', '%' . $map['title'] . '%');
        empty($map['cate_id']) || $where['cate_id'] = array('eq', $map['cate_id']);
        if ($gtype == 1) {
            $where['show_type'] = array('eq', 0);
            $where['g.status'] = array('eq', 3);
        } elseif ($gtype == 2) {
            $where['show_type'] = array('eq', 0);
            $where['g.status'] = array('eq', 1);
//            $where['g.author'] = array('gt', 0);
//            $where['g.auditor'] = array('eq', 0);
        } elseif ($gtype == 3) {
            $where['show_type'] = array('eq', 0);
//            $where['g.author'] = array('gt', 0);
//            $where['g.auditor'] = array('gt', 0);
        } elseif ($gtype == 4) {
            $where['show_type'] = array('eq', 1);
        } elseif ($gtype == 0) {
            $where['show_type'] = array('eq', 0);
        }
        $this->assign('gtype', $gtype);
        $mod = D('item');
        //分页
        $count = $mod->getGoodsCount($where); // 查询满足要求的总记录数
        $Page = new \Think\Page2($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $Page->setConfig('header', '<span class="rows">共 %TOTAL_ROW% 条记录</span>');
        $Page->setConfig('prev', '上一页');
        $Page->setConfig('next', '下一页');
        //分页跳转的时候保证查询条件
        foreach ($map as $key => $val) {
            $Page->parameter[$key] = urlencode($val);
        }
        $show = $Page->show(); // 分页显示输出

        $goodsList = $mod->getGoodsList($Page->firstRow, $Page->listRows, $where);
        foreach ($goodsList as $k => $v) {
            empty($v['cate_name']) && $goodsList[$k]['cate_name'] = '未分类';
        }

        $this->assign('map', $map);
        $this->assign('goodsList', $goodsList);
        $this->assign('page', $show); // 赋值分页输出
        //查询分类
        $item_cate_mod = new \Admin\Model\item_cateModel();
        $cateList = $item_cate_mod->getAllCates(0, 40, null, '1');
        $this->assign("cateList", $cateList);
        $this->display();
    }

    // 商品 添加页面
    public function goods_add() {
        $cateList = $this->_cate_mod->getAllCates(0, 100, null, '1');
        $cateList1 = array();
        $cateList2 = array();
        $TagList = array();
        foreach ($cateList as $value) {
            switch ($value['spid']) {
                case 0:
                    $cateList1[] = $value;
                    break;
                case 1:
                    $cateList2[] = $value;
                    break;
                case 2:
                    $TagList[] = $value;
                    break;
            }
        }
        //商品库分类
        $this->assign("cateList", $cateList1);
        $this->assign("cateList2", $cateList2);
        $this->assign("tagList", $TagList);
        $this->assign("username", session("user.nickname"));
        $this->display();
    }

    /**
     * 采集商品详细信息
     */
    public function goods_get_pub_info() {
        $url = I('get.url', '', 'urldecode'); //解码
        if ($url) {
            $item_info = json_decode(getItemInfo($url), true);
            $d = $item_info['data']['pageList'][0];
            if ($d) {
                $data['status'] = 1;
                $data['item_info'] = $d;
                $data['content'] = '商品信息获取成功！';
            } else {
                $data['status'] = 2;
                $data['content'] = '这件商品没有设置推广计划！';
            }
            $this->ajaxReturn($data);
        }
    }

    // 商品 添加入库
    public function goods_save() {
        if (!session("user.id")) {
            $data['status'] = 3;
            $data['content'] = '登录超时，请重新登录';
            $this->ajaxReturn($data);
        }
        $goods_data = I('post.good_info');
        //处理商品信息格式(js数组转为php数组)
        $tags = array();
        foreach ($goods_data as $v) {
            if ($v['name'] == 'item_tag') {
                $tags[] = $v['value'];
                continue;
            }
            $goods_info[$v['name']] = $v['value'];
        }
        $goods_info['item_tag'] = implode(',', $tags);

        $goods_info['author'] = session("user.id");
        $item = D('item');
        if (!$item->create($goods_info)) {
            $data['status'] = 2;
            $data['content'] = $item->getError();
            $this->ajaxReturn($data);
        } else {
            $item_id = $item->add();
            if ($item_id) {
                $data['status'] = 1;
                $data['content'] = '添加成功！';
            } else {
                $data['status'] = 2;
                $data['content'] = '添加失败！';
            }
            $this->ajaxReturn($data);
        }
    }

    /**
     * 商品编辑
     */
    public function goods_edit() {
        $item_id = I('get.id', 0, 'intval');
        $item_info = D('item')->getItemInfo($item_id);
        if (empty($item_info)) {
            $this->error('商品不存在！', '/Admin/Goods/goods_list', 1);
        }
        $this->assign('item', $item_info);
//		var_dump($item_info);die();
        $Mem = D('members');
        $author = $Mem->getById($item_info['author']);
        $this->assign("nickname", $author['nickname']);
        //查询分类
        $cateList = $this->_cate_mod->getAllCates(0, 100, null, '1');
        $cateList1 = array();
        $cateList2 = array();
        $TagList = array();
        foreach ($cateList as $value) {
            switch ($value['spid']) {
                case 0:
                    $cateList1[] = $value;
                    break;
                case 1:
                    $cateList2[] = $value;
                    break;
                case 2:
                    $TagList[] = $value;
                    break;
            }
        }
        //商品库分类
        $this->assign("cateList", $cateList1);
        $this->assign("cateList2", $cateList2);
        $this->assign("tagList", $TagList);
        $this->display();
    }

    public function goods_sh() {
        $item_id = I('post.id', 0, 'intval');
        $status = I('post.status', 3, 'intval');
        if (!session('user.id')) {
            $data['status'] = 0;
            $data['message'] = '登录超时，请重新登录';
            $this->ajaxReturn($data);
        }
        if ($item_id && $status) {
            $mod = D('item');
            $d["status"] = $status;
            $d["auditor"] = session('user.id');
            $ret = $mod->where('id=' . $item_id)->setField($d);
            if ($ret) {
                $data['status'] = 1;
                $data['message'] = '审核成功';
            } else {
                $data['status'] = 0;
                $data['message'] = '操作失败';
            }
        } else {
            $data['status'] = 0;
            $data['message'] = '参数错误';
        }
        $this->ajaxReturn($data);
    }

    /**
     * 商品更新入库
     */
    public function goods_update() {
        $goods_data = I('post.good_info');

        //处理商品信息格式(js数组转为php数组)
        $tags = array();
        foreach ($goods_data as $v) {
            if ($v['name'] == 'item_tag') {
                $tags[] = $v['value'];
                continue;
            }
            $goods_info[$v['name']] = $v['value'];
        }
        $goods_info['item_tag'] = implode(',', $tags);
        $item_mod = D('item');
        $item_mod->create($goods_info);
        $ret = $item_mod->save();
        //where('id='.$goods_info['id'])->setField($goods_info);
        if ($ret) {
            $data['status'] = 1;
            $data['content'] = '更新成功！';
        } else {
            $data['status'] = 2;
            $data['content'] = '更新失败，可能你未修改任何表单数据' . $item_mod->getLastSql();
        }
        $this->ajaxReturn($data);
    }

    /**
     * 商品单个删除
     */
    public function goods_del() {
        $item_id = I('get.id', null, 'trim');
        if (empty($item_id)) {
            $data['content'] = '非法商品id！';
            $this->error($data['content'], '/Admin/Goods/goods_list', 1);
        }
        $ret = D('item')->delete($item_id);
        if ($ret) {
            //同步删除相关 图片 、日程中该商品
            $where_img = array('item_id' => $item_id);
            $where_item_list = array('itemid' => $item_id);
            M('item_img')->where($where_img)->delete();
            M('item_list')->where($where_item_list)->delete();
            //ajax返回
            $data['status'] = 1;
            $data['content'] = '删除成功！';
            $this->success($data['content'], '/Admin/Goods/goods_list', 1);
        } else {
            $data['status'] = 2;
            $data['content'] = '未删除数据！';
            $this->error($data['content'], '/Admin/Goods/goods_list', 1);
        }
    }

    /**
     * 商品 批量删除 wdy
     */
    public function goods_del_batch() {
        $item_ids = I('post.vm', null, 'trim');
        if (empty($item_ids)) {
            $msg['status'] = 2;
            $msg['content'] = '请选中商品后再删除！';
            $this->ajaxReturn($msg);
        }
        $item_ids_str = $item_ids ? implode(',', $item_ids) : 0; //已经存在的商品Id串
        $ret = D('item')->delete();
        if ($ret) {
            //同步删除相关 图片 、日程中该商品
            $where_img['item_id'] = array('in', $item_ids);
            $where_item_list['itemid'] = array('in', $item_ids);
            M('item_img')->where($where_img)->delete();
            M('item_list')->where($where_item_list)->delete();
            //ajax返回
            $msg['status'] = 1;
            $msg['content'] = '删除成功！';
            $this->ajaxReturn($msg);
        } else {
            $msg['status'] = 2;
            $msg['content'] = '未删除数据！';
            $this->ajaxReturn($msg);
        }
    }

    /*
      伪删除到回收站
     *      */

    public function goods_pretend_del_batch() {
        //通过隐藏input语句传值
        $gtype = I('show_type', '');

        $item_ids = I('post.vm', null, 'trim');
        if (empty($item_ids)) {
            $msg['status'] = 2;
            $msg['content'] = '请选中商品后再删除！';
            $this->ajaxReturn($msg);
        }
        if ($gtype != 1 && $gtype != 0) {
            $msg['status'] = 2;
            $msg['content'] = '非法参数！';
            $this->ajaxReturn($msg);
        }
        $item_ids_str = $item_ids ? implode(',', $item_ids) : 0; //已经存在的商品Id串
        //修改对应数据库的字段show_type
        $ret = D('item')->where('id in (' . $item_ids_str . ')')->setField('show_type', $gtype);

        if ($ret) {
            //ajax返回
            $msg['status'] = 1;
            $msg['content'] = '删除成功！';
            $this->ajaxReturn($msg);
        } else {
            $msg['status'] = 2;
            $msg['content'] = '未删除数据！';
            $this->ajaxReturn($msg);
        }
    }

    /*
      导入Excel表格
     *      */

    public function goodsImport() {
        $upload = new \Think\Upload();
        $upload->maxSize = 1024 * 1024 * 1024; // 设置附件上传大小
        $upload->allowExts = array('xls'); // 设置附件上传类型
        $upload->rootPath = './Public/'; // 设置附件上传根目录
        $upload->savePath = 'excel/'; // 设置附件上传（子）目录
        $upload->replace = true;
        $upload->saveName = array('uniqid', array('', true)); //生成的文件名更加唯一
        $upload->autoSub = false;
        $upload->subName = '';
        // 上传文件
        $file_name = '';
        $info = $upload->upload();
        foreach ($info as $v) {
            $file_name = WEBSITE_ROOT . "\\Public\\excel\\" . $v['savename'];
        }
//        引入PHPExcel类
        vendor('PHPExcel');
        vendor('PHPExcel.PHPExcel.IOFactory');
        vendor('PHPExcel.PHPExcel.Reader.Excel5');
        //实例化PHPExcel类
        $objPHPExcel = new \PHPExcel();
        //默认用excel2007读取excel，若格式不对，则用之前的版本进行读取
        $PHPReader = new \PHPExcel_Reader_Excel2007();
        if (!$PHPReader->canRead($file_name)) {
            $PHPReader = new \PHPExcel_Reader_Excel5();
            if (!$PHPReader->canRead($file_name)) {
                echo 'no Excel';
                return;
            }
        }
        //读取Excel文件
        $objPHPExcel = $PHPReader->load($file_name);
        //读取excel文件中的第一个工作表
        $sheet = $objPHPExcel->getSheet(0);

        $highestRow = $sheet->getHighestRow(); // 取得总行数
        $highestColumn = $sheet->getHighestColumn(); // 取得总列数
        $bool = $this->parseTableData($objPHPExcel, $highestRow);
//      添加新数据时 已最后一个商品id做判断数据添加是否成功
//        $id = $d->getLastInsID();
        $result = array();
        if ($bool < 1) {// 上传错误提示错误信息
            $result["status"] = false;
            $result["message"] = "添加数据库失败";
        } else {
            $result["status"] = true;
            $result["message"] = "添加数据库成功";
        }
        $this->ajaxReturn($result);
    }

    //      Excel数据解析
    public function parseTableData($objPHPExcel, $highestRow) {
        $cates["女装"] = 1;
        $cates["男装"] = 2;
        $cates["内衣"] = 3;
        $cates["美妆"] = 4;
        $cates["护肤"] = 4;
        $cates["彩妆"] = 4;
        $cates["配饰"] = 5;
        $cates["饰品"] = 5;
        $cates["首饰"] = 5;
        $cates["鞋"] = 6;
        $cates["女鞋"] = 6;
        $cates["男鞋"] = 6;
        $cates["箱包"] = 7;
        $cates["包"] = 7;
        $cates["儿童"] = 8;
        $cates["童装"] = 8;
        $cates["玩具"] = 8;
        $cates["母婴"] = 9;
        $cates["尿片"] = 9;
        $cates["居家"] = 10;
        $cates["家居"] = 10;
        $cates["家庭"] = 10;
        $cates["厨房"] = 10;
        $cates["收纳"] = 10;
        $cates["美食"] = 11;
        $cates["零食"] = 11;
        $cates["食品"] = 11;
        $cates["熟食"] = 11;
        $cates["数码"] = 12;
        $cates["家电"] = 13;
        $cates["电器"] = 13;
        $d = M('item');
        $w = D('word');
        $time = strtotime(date("Y-m-d H:i:s"));
        for ($i = 2; $i <= $highestRow; $i++) {
//          前面小写的a是表中的字段名，后面的大写A是excel中位置
            $cate_text = $objPHPExcel->getActiveSheet()->getCell("E" . $i)->getValue();
            $type_text = $objPHPExcel->getActiveSheet()->getCell("N" . $i)->getValue();
            if ($type_text == "天猫") {
                $type_id = 1;
            } else {
                $type_id = 0;
            }

            $data['auctionId'] = $objPHPExcel->getActiveSheet()->getCell("A" . $i)->getValue();
            $data['title'] = $objPHPExcel->getActiveSheet()->getCell("B" . $i)->getValue();
            $data['pictUrl'] = $objPHPExcel->getActiveSheet()->getCell("C" . $i)->getValue();
            $data['auctionUrl'] = $objPHPExcel->getActiveSheet()->getCell("D" . $i)->getValue();
            if (!strstr($cate_text, "/")) {
                $data['item_cate'] = empty($cates[$cate_text]) ? 14 : $cates[$cate_text];
            } else {
                $text = explode("/", $cate_text);
                $data['item_cate'] = empty($cates[$text[0]]) ? 14 : $cates[$text[0]];
            }

            $data['biz30day'] = $objPHPExcel->getActiveSheet()->getCell("H" . $i)->getValue();
            $data['couponEffectiveEndTime'] = $objPHPExcel->getActiveSheet()->getCell("T" . $i)->getValue();
            $data['couponEffectiveStartTime'] = $objPHPExcel->getActiveSheet()->getCell("S" . $i)->getValue();
            $data['couponInfo'] = $objPHPExcel->getActiveSheet()->getCell("R" . $i)->getValue();
            $data['couponLeftCount'] = $objPHPExcel->getActiveSheet()->getCell("Q" . $i)->getValue();
            $data['couponLink'] = $objPHPExcel->getActiveSheet()->getCell("V" . $i)->getValue();
            $data['couponTotalCount'] = $objPHPExcel->getActiveSheet()->getCell("P" . $i)->getValue();
            $data['zkPrice'] = $objPHPExcel->getActiveSheet()->getCell("G" . $i)->getValue();
            $data['sellerId '] = $objPHPExcel->getActiveSheet()->getCell("L" . $i)->getValue();
            $data['shopTitle'] = $objPHPExcel->getActiveSheet()->getCell("M" . $i)->getValue();
            $data['tkCommFee'] = $objPHPExcel->getActiveSheet()->getCell("J" . $i)->getValue();
            $data['eventRate'] = $objPHPExcel->getActiveSheet()->getCell("I" . $i)->getValue();
            $data['userType'] = $type_id;
            $word['word'] = $this->getTags($data['title']);
            if (!empty($data['auctionId'])) {
                $bool = $d->add($data, array(), true); //$replace = true;每次添加数据都是替换掉相同的数据
            }
            $word['usetime'] = $time;
            if (!empty($word['word'])) {
                $dool = $w->add($word, array(), true);
            }
        }
        return $bool;
    }

    /**
     * 中文分词的方法
     */
    public function getTags($text, $number = null) {
        //实例化分词插件核心类
        $so = new \Org\Util\pscws4();
        //设置分词时所用编码
        $so->set_charset('utf8');
        // 这里没有调用 set_dict 和 set_rule 系统会自动试调用 ini 中指定路径下的词典和规则文件
        $so->set_dict('./Public/admin/dict/dict.utf8.xdb');
        $so->set_rule('./Public/admin/dict/rules.utf8.ini');
        $so->set_ignore(true); //不返回标点符号
        $so->set_multi(1);
//      SCWS_MULTI_SHORT   (1)短词
//      SCWS_MULTI_DUALITY (2)二元（将相邻的2个单字组合成一个词）
//      SCWS_MULTI_ZMAIN   (4)重要单字
//      SCWS_MULTI_ZALL    (8)全部单字
//        $so->set_duality(true);//将散字组合为词 
        //要进行分词的语句
        $so->send_text($text);
        //获取分词结果，如果提取高频词用get_tops方法
        $words = $so->get_tops(1, "string");
        $so->close();
        $tags = array();
        foreach ($words as $val) {
            $tags[] = $val['word'];
        }
        return implode(',', $tags);
    }

}
