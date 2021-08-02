<?php
require_once('es/core/RegExp.php');
require_once('es/core/String.php');
require_once('es/core/System.php');
require_once('es/core/ArrayMethod.php');
use \PHPUnit\Framework\TestCase;
use \es\core\System;
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
		$this->assertEquals(4,count($items));
		$this->assertEquals($items,$this->list);
		array_push($this->items,5,6,7);
		$this->assertEquals(3,count($this->items));
		$bb = [];
		$this->addArray($bb,9);
		$this->assertEquals(1,count($bb));
		$_V = [];
		$this->addArray($_V,6);
		$bs = $_RD2 = &$this->ccArray();
		array_push($_RD2,6);
		$this->assertEquals($_RD2,$this->arrItems);
		$bs = [];
		$this->pushArray($bs,9);
		$this->pushArray($bs,1);
		$this->assertEquals($bs,[9,1]);
		$newBs = \es\core\es_array_map($bs,function($val,$index){
			return $val;
		});
		$this->assertEquals($bs,$newBs);
		array_push($newBs,5,12,0,3,3,1);
		$dd = \es\core\es_array_sort($newBs);
		$this->assertEquals([0,1,1,12,3,3,5,9],$dd);
		$this->assertEquals($dd,$newBs);
		$af = [];
		array_push($af,1,6,0,9,'a',"B","A");
		\es\core\es_array_sort($af);
		$this->assertEquals([0,1,6,9,'A','B','a'],$af);
		$this->assertEquals([0,1,6,9],\es\core\es_array_filter($af,function($value){
			return System::typeof($value) === 'number';
		}));
		$this->assertEquals([0,1,6,9,"A","B",'a',10,11,12,13,'15',[16]],\es\core\es_array_concat($af,10,[11,12],13,'15',[[16]]));
		$this->assertEquals("16ABa",\es\core\es_array_reduce($af,function($all,$value){
			return System::addition($all,$value);
		}));
		$this->assertEquals("aBA9610",\es\core\es_array_reduce_right($af,function($all,$value){
			return System::addition($all,$value);
		}));
		$searchItem = 'B';
		$this->assertEquals("B",\es\core\es_array_find($af,function($val)use(&$searchItem){
			return $val === $searchItem;
		}));
		$this->assertEquals(6,\es\core\es_array_find($af,function($val){
			return $val > 5;
		}));
		$this->assertEquals(5,\es\core\es_array_find_index($af,function($val){
			return $val === 'B';
		}));
		$this->assertEquals([0,1,2,[3,4]],\es\core\es_array_flat([0,1,2,[3,4]],0));
		$this->assertEquals([0,1,2,3,4],\es\core\es_array_flat([0,1,2,[3,4]]));
		$this->assertEquals([0,1,2,[3,4]],\es\core\es_array_flat([0,1,2,[[[3,4]]]],2));
		$this->assertEquals([0,1,2,3,4],\es\core\es_array_flat([0,1,2,[[[3,4]]]],3));
		$this->assertEquals([0,1,2,3,4],\es\core\es_array_flat_map([0,1,2,[3,4]],function($val){
			return $val;
		}));
		$this->assertEquals([0,1,2,[[3,4]]],\es\core\es_array_flat_map([0,1,2,[[[3,4]]]],function($val){
			return $val;
		}));
		$this->assertFalse(\es\core\es_array_every(['a','b',1],function($val){
			return System::typeof($val) === 'string';
		}));
		$this->assertTrue(\es\core\es_array_every([1,2,3],function($val){
			return System::typeof($val) === 'number';
		}));
		$this->assertTrue(\es\core\es_array_some([1,2,3,'a','b'],function($val){
			return System::typeof($val) === 'string';
		}));
		$this->assertTrue(in_array('a',[1,2,3,'a','b']));
		$this->assertEquals([0,1,2,3,4],array_keys([1,2,3,'a','b']));
		$this->assertEquals([1,2,3,'a','b'],array_values([1,2,3,'a','b']));
		$this->assertEquals([1,2,6,6,'ssss'],\es\core\es_array_fill([1,2,3,4,'ssss'],6,2,4));
		$this->assertEquals([2,1],array_reverse([1,2]));
		$months = ['Jan','March','April','June'];
		$this->assertEquals([],array_splice($months,1,0,'Feb'));
		$this->assertEquals(["Jan","Feb","March","April","June"],$months);
		$this->assertEquals(["Jan"],array_splice($months,0,1,'Feb'));
		$this->assertEquals(["Feb","Feb","March","April","June"],$months);
		$this->assertEquals("Feb, Feb, March, April, June",implode(', ',$months));
		$this->assertEquals("Feb- Feb- March- April- June",implode('- ', $months));
		$this->assertEquals(["April","June","March","April","June"],\es\core\es_array_copy_within($months,0,3,5));
		$this->assertEquals(["d","b","c","d","e"],\es\core\es_array_copy_within(['a','b','c','d','e'],0,3,4));
		$this->assertTrue(array_key_exists(2,$months));
		$this->assertTrue(array_key_exists(2,$months));
		$this->assertFalse(is_array(''));
		$this->assertTrue(is_array(['']));
		printf('%s',json_encode(array_slice([1,2,3],1),JSON_UNESCAPED_UNICODE));
		printf('%s',json_encode(array_slice([1,2,34,56],1),JSON_UNESCAPED_UNICODE));
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
		$this->assertEquals(($str) . 'AAB',($str . 'AAB'));
		$this->assertEquals(0,strcmp($str,'aab'));
		$this->assertEquals(1,strcmp($str,'aaa'));
		$this->assertEquals(-1,strcmp($str,'aac'));
		$this->assertEquals('AAB',mb_strtoupper($str));
		$this->assertEquals('aab',mb_strtolower('AAB'));
		$this->assertEquals('AAB',trim('AAB  '));
		$this->assertEquals(['A','A','B'],explode('.','A.A.B'));
		$this->assertEquals('def',\es\core\es_string_slice('abcdefg',3,6));
		$str2 = 'The quick brown fox jumps over the lazy dog.';
		$this->assertEquals('the lazy dog.',\es\core\es_string_slice($str2,31));
		$this->assertEquals('quick brown fox',\es\core\es_string_slice($str2,4,19));
		$this->assertEquals('dog.',\es\core\es_string_slice($str2,-4));
		$this->assertEquals('lazy',\es\core\es_string_slice($str2,-9,-5));
		$chinese = '中中国人民解放军';
		$this->assertEquals(8,mb_strlen($chinese));
		$this->assertEquals(3,\es\core\es_string_index($chinese,"人"));
		$this->assertEquals(3,\es\core\es_string_last_index($chinese,"人"));
		$this->assertEquals('全' . ($chinese),\es\core\es_string_replace($chinese,'中','全中'));
		$mixed = "中国人A民bc解De放军FFFDDdd";
		$this->assertEquals(19,mb_strlen($mixed));
		$this->assertEquals(12,\es\core\es_string_index($mixed,"F"));
		$this->assertEquals(14,\es\core\es_string_last_index($mixed,"F"));
		$this->assertEquals('中国人A民bc解De放军FFFdddd',\es\core\es_string_replace($mixed,'DD','dd'));
		$this->assertEquals('民bc解',mb_substr($mixed,4,4));
		$paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
		$regex = new RegExp('[^\w\s]','g');
		$this->assertEquals(43,$regex->search($paragraph));
		$this->assertEquals('.',$paragraph[$regex->search($paragraph)]);
		$this->setNames("Ye Jun");
		$this->assertEquals('Ye Jun',$this->getNames());
	}
	public function getNames():string{
		return $this->_names;
	}
	public function setNames(string $val){
		$this->_names = $val;
	}
	private $_names = 'test';
}