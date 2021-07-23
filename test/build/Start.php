<?php
use \PHPUnit\Framework\TestCase;
class Start extends TestCase{
	public function __construct(){
		parent::__construct();
	}
	private $items = [];
	private $list = [];
	public function testArray(){
		$items = $_RD = &$this->items;
		$flag = true;
		if($flag){
			$_ARV = 1;
			$items = $_RD1 = &$this->list;
		}
		$items_push = function(...$_args)use(&$items,&$_ARV,&$_RD,&$_RD1){
			switch($_ARV){
				case 1 :
					$_RV = array_push($_RD1,...$_args);
					$items = $_RD1;
					return $_RV;
				default :
					$_RV = array_push($_RD,...$_args);
					$items = $_RD;
					return $_RV;
			}
		};
		$items_push(1);
		$items_push(2,3,4);
		$this->assertEquals(4,count($items),"error");
		$this->assertEquals($items,$this->list,"error");
		array_push($this->items,5,6,7);
		$this->assertEquals(3,count($this->items),"error");
	}
}