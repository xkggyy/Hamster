<?php
namespace Hamster\Controller;

use Think\Controller;

class BaseController extends Controller {
	/**
	 * 架构函数
	 */
	public function __construct() {
		parent::__construct();
		// if(!session("user.id")){
		// 	$this->redirect('/hamster/login/index');
		// }
		$tophead = strtolower(CONTROLLER_NAME."_".ACTION_NAME);
		$this->assign('tophead',$tophead);
		
	}

}
