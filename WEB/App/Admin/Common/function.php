<?php

/**
 * File: function.php
 * 访问所有的模块之前都会首先加载公共模块下面的配置文件（Conf/config.php）和公共函数文件（Common/function.php）
 */
//****************html解析相关定义*********************
/**
 * All of the Defines for the classes below.
 * @author S.C. Chen <me578022@gmail.com>
 */
define('HDOM_TYPE_ELEMENT', 1);
define('HDOM_TYPE_COMMENT', 2);
define('HDOM_TYPE_TEXT', 3);
define('HDOM_TYPE_ENDTAG', 4);
define('HDOM_TYPE_ROOT', 5);
define('HDOM_TYPE_UNKNOWN', 6);
define('HDOM_QUOTE_DOUBLE', 0);
define('HDOM_QUOTE_SINGLE', 1);
define('HDOM_QUOTE_NO', 3);
define('HDOM_INFO_BEGIN', 0);
define('HDOM_INFO_END', 1);
define('HDOM_INFO_QUOTE', 2);
define('HDOM_INFO_SPACE', 3);
define('HDOM_INFO_TEXT', 4);
define('HDOM_INFO_INNER', 5);
define('HDOM_INFO_OUTER', 6);
define('HDOM_INFO_ENDSPACE', 7);
define('DEFAULT_TARGET_CHARSET', 'UTF-8');
define('DEFAULT_BR_TEXT', "\r\n");
define('DEFAULT_SPAN_TEXT', " ");
define('MAX_FILE_SIZE', 600000);
/* * *******************************************    html解析      ***************************** */

/**
 * @param $url
 * @param bool $use_include_path
 * @param null $context
 * @param $offset
 * @param $maxLen
 * @param bool $lowercase
 * @param bool $forceTagsClosed
 * @param string $target_charset
 * @param bool $stripRN
 * @param string $defaultBRText
 * @param string $defaultSpanText
 * @return bool|\Org\Util\simple_html_dom
 */
// get html dom from file
// $maxlen is defined in the code as PHP_STREAM_COPY_ALL which is defined as -1.
function file_get_html($url, $use_include_path = false, $context = null, $offset = -1, $maxLen = -1, $lowercase = true, $forceTagsClosed = true, $target_charset = DEFAULT_TARGET_CHARSET, $stripRN = true, $defaultBRText = DEFAULT_BR_TEXT, $defaultSpanText = DEFAULT_SPAN_TEXT) {
    // We DO force the tags to be terminated.
    $dom = new \Org\Util\simple_html_dom(null, $lowercase, $forceTagsClosed, $target_charset, $stripRN, $defaultBRText, $defaultSpanText);
    // For sourceforge users: uncomment the next line and comment the retreive_url_contents line 2 lines down if it is not already done.
    $contents = file_get_contents($url, $use_include_path, $context, $offset);
    // Paperg - use our own mechanism for getting the contents as we want to control the timeout.
    //$contents = retrieve_url_contents($url);
    if (empty($contents) || strlen($contents) > MAX_FILE_SIZE) {
        return false;
    }
    // The second parameter can force the selectors to all be lowercase.
    $dom->load($contents, $lowercase, $stripRN);
    return $dom;
}

/**
 * @param $str
 * @param bool $lowercase
 * @param bool $forceTagsClosed
 * @param string $target_charset
 * @param bool $stripRN
 * @param string $defaultBRText
 * @param string $defaultSpanText
 * @return bool|\Org\Util\simple_html_dom
 */
// get html dom from string
function str_get_html($str, $lowercase = true, $forceTagsClosed = true, $target_charset = DEFAULT_TARGET_CHARSET, $stripRN = true, $defaultBRText = DEFAULT_BR_TEXT, $defaultSpanText = DEFAULT_SPAN_TEXT) {
    $dom = new \Org\Util\simple_html_dom(null, $lowercase, $forceTagsClosed, $target_charset, $stripRN, $defaultBRText, $defaultSpanText);
    if (empty($str) || strlen($str) > MAX_FILE_SIZE) {
        $dom->clear();
        return false;
    }
    $dom->load($str, $lowercase, $stripRN);
    return $dom;
}

/**
 * @param $node
 * @param bool $show_attr
 * @param int $deep
 */
// dump html dom tree
function dump_html_tree($node, $show_attr = true, $deep = 0) {
    $node->dump($node);
}

/* * ************************* html 解析  完毕 *************************** */

/**
 * 解析url中参数值
 */
function convertUrlQuery($query) {
    $queryParts = explode('&', $query);
    $params = array();
    foreach ($queryParts as $param) {
        $item = explode('=', $param);
        $params[$item[0]] = $item[1];
    }
    return $params;
}

/**
 * post方式提交
 */
function do_post($url, $data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_URL, $url);
    $ret = curl_exec($ch);

    curl_close($ch);
    return $ret;
}

/**
 * get方式获取内容
 */
function get_url_contents($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

/**
 * 根据模块检测权限
 */
function checkAuth($id) {
    $AUTH = new \Think\Auth();
    //类库位置应该位于ThinkPHP\Library\Think\
    return $AUTH->check(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME, $id);
}

/**
 * 淘宝商品采集模块
 */
function getItemInfo($url) {
    $url_arr = parse_url($url);
    $scheme = $url_arr['scheme'];
    $host = $url_arr['host'];
    $path = $url_arr['path'];
    $param = $url_arr['query'];
    $taoid = convertUrlQuery(htmlspecialchars_decode($param))['id']; //将&等转义后的字符转回，否则取不到id
    $qurl = $scheme . '://' . $host . $path . '?id=' . $taoid;
    $qurl = urlencode($qurl);
    return get_url_contents('http://pub.alimama.com/items/search.json?_tb_token_=test&q='.$qurl);
}

function importExecl($file){
    if(!file_exists($file)){ 
        return array("error"=>0,'message'=>'file not found!');
    }
    Vendor("PHPExcel.PHPExcel.IOFactory"); 
    $objReader = PHPExcel_IOFactory::createReader('Excel5');
    $data=array();
    try{
        $PHPReader = $objReader->load($file);
    }catch(Exception $e){
        $data["status"]=false;
        $data["message"]=$e->getError();
    }
    if(!isset($PHPReader)){
        $data["status"]=false;
        $data["message"]="读取失败";
    } 
    $allWorksheets = $PHPReader->getAllSheets();
    foreach($allWorksheets as $objWorksheet){
        $sheetname=$objWorksheet->getTitle();
        $allRow = $objWorksheet->getHighestRow();//how many rows
        $highestColumn = $objWorksheet->getHighestColumn();//how many columns
        $allColumn = PHPExcel_Cell::columnIndexFromString($highestColumn);
        $array[$i]["Title"] = $sheetname; 
        $array[$i]["Cols"] = $allColumn; 
        $array[$i]["Rows"] = $allRow; 
        $arr = array();
        $isMergeCell = array();
        foreach ($objWorksheet->getMergeCells() as $cells) {//merge cells
            foreach (PHPExcel_Cell::extractAllCellReferencesInRange($cells) as $cellReference) {
                $isMergeCell[$cellReference] = true;
            }
        }
        for($currentRow = 1 ;$currentRow<=$allRow;$currentRow++){ 
            $row = array(); 
            for($currentColumn=0;$currentColumn<$allColumn;$currentColumn++){
                $cell =$objWorksheet->getCellByColumnAndRow($currentColumn, $currentRow);
                $afCol = PHPExcel_Cell::stringFromColumnIndex($currentColumn+1);
                $bfCol = PHPExcel_Cell::stringFromColumnIndex($currentColumn-1);
                $col = PHPExcel_Cell::stringFromColumnIndex($currentColumn);
                $address = $col.$currentRow;
                $value = $objWorksheet->getCell($address)->getValue();
                if(substr($value,0,1)=='='){
                    return array("error"=>0,'message'=>'can not use the formula!');
                    exit;
                }
                if($cell->getDataType()==PHPExcel_Cell_DataType::TYPE_NUMERIC){
                    $cellstyleformat=$cell->getParent()->getStyle( $cell->getCoordinate() )->getNumberFormat();
                    $formatcode=$cellstyleformat->getFormatCode();
                    if (preg_match('/^([$[A-Z]*-[0-9A-F]*])*[hmsdy]/i', $formatcode)) {
                        $value=gmdate("Y-m-d", PHPExcel_Shared_Date::ExcelToPHP($value));
                    }else{
                        $value=PHPExcel_Style_NumberFormat::toFormattedString($value,$formatcode);
                    }                
                }
                if($isMergeCell[$col.$currentRow]&&$isMergeCell[$afCol.$currentRow]&&!empty($value)){
                    $temp = $value;
                }elseif($isMergeCell[$col.$currentRow]&&$isMergeCell[$col.($currentRow-1)]&&empty($value)){
                    $value=$arr[$currentRow-1][$currentColumn];
                }elseif($isMergeCell[$col.$currentRow]&&$isMergeCell[$bfCol.$currentRow]&&empty($value)){
                    $value=$temp;
                }
                $row[$currentColumn] = $value; 
            } 
            $arr[$currentRow] = $row; 
        } 
        $array[$i]["Content"] = $arr; 
        $i++;
    } 
    spl_autoload_register(array('Think','autoload'));//must, resolve ThinkPHP and PHPExcel conflicts
    unset($objWorksheet); 
    unset($PHPReader); 
    unset($PHPExcel); 
    unlink($file); 
    return array("error"=>1,"data"=>$array); 
}