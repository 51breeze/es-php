<?php
require_once('es/core/RegExp.php');
require_once('es/core/String.php');
use \PHPUnit\Framework\TestCase;
use \es\core\RegExp;
class Start extends TestCase{
	public function __construct(){
		parent::__construct();
	}
	private $items = [];
	private $list = [];
	public function testArray(){
		$_ARV = 0;
		$items = $_RD = &$this->items;
		$flag = true;
		if($flag){
			$_ARV = 1;
			$items = $_RD1 = &$this->list;
		}
		$items_push = function(...$_args)use(&$items,&$_ARV,&$_RD,&$_RD1){
			switch($_ARV){
				case 0 :
					$_RV = array_push($_RD,...$_args);
					$items = $_RD;
					return $_RV;
				case 1 :
					$_RV = array_push($_RD1,...$_args);
					$items = $_RD1;
					return $_RV;
				default:
					return array_push($items,...$_args);
			}
		};
		$items_push(1);
		$items_push(2,3,4);
		$this->assertEquals(4,count($items),"error");
		$this->assertEquals($items,$this->list,"error");
		array_push($this->items,5,6,7);
		$this->assertEquals(3,count($this->items),"error");
		$bb = [];
		$this->addArray($bb,9);
		$this->assertEquals(1,count($bb),"error");
		$_V = [];
		$this->addArray($_V,6);
		$bs = $_RD2 = &$this->ccArray();
		array_push($_RD2,6);
		$this->assertEquals($_RD2,$this->arrItems,"error");
		$bs = [];
		$this->pushArray($bs,9);
		$this->pushArray($bs,1);
		$this->assertEquals($bs,[9,1],"error");
	}
	public function addArray(array &$a,$b){
		array_push($a,$b);
	}
	private $arrItems = [];
	public function &ccArray():array{
		$b = &$this->arrItems;
		return $b;
	}
	public function pushArray(array &$a,$b){
		array_push($a,$b);
	}
	public function testString(){
		$str = 'aab';
		$this->assertEquals(\es\core\es_string_replace($str,'a','A'),"Aab");
		$this->assertEquals(\es\core\es_string_index($str,'b'),2);
		$this->assertEquals(mb_substr($str,0,1),'a');
		$this->assertEquals(mb_ord(mb_substr($str,0,1),'UTF-8'),97);
		$this->assertEquals(mb_ord(mb_substr($str,2,1),'UTF-8'),98);
		$obj = ['b'];
		$obj['index'] = 2;
		$obj['input'] = 'aab';
		$this->assertEquals((new RegExp('b'))->match($str),$obj);
		$this->assertEquals($obj['index'],2);
	}
}