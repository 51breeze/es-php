<?php
require_once('Types.php');
require_once('es/core/Number.php');
require_once('es/core/Object.php');
require_once('es/core/RegExp.php');
require_once('es/core/String.php');
require_once('es/core/Reflect.php');
require_once('es/core/System.php');
require_once('es/core/Array.php');
use \PHPUnit\Framework\TestCase;
use \es\core\System;
use \es\core\Reflect;
use \es\core\RegExp;
class Start extends TestCase{

	/**
	* @constructor Start
	*/
	public function __construct(){
		parent::__construct();
	}

	/**
	* @property items
	*/
	private $items = [];

	/**
	* @property list
	*/
	private $list = [];

	/**
	* @method testArray
	*/
	public function testArray(){
		$_ARV = 0;
		$items = $_RD = &$this->items;
		$flag = true;
		if($flag){
			$_ARV = 1;
			$items = $_RD1 = &$this->list;
		}
		/*References $items memory address*/
		$_REF = function &()use(&$items,&$_ARV,&$_RD,&$_RD1){
			if($_ARV===null)return $items;
			switch($_ARV){
				case 0 : return $_RD;
				case 1 : return $_RD1;
				default: return $items;
			}
		};
		array_push($_REF(),1);
		array_push($_REF(),2,3,4);
		$this->assertEquals(4,count($_REF()));
		$this->assertEquals($_REF(),$this->list);
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
		$this->assertEquals("Feb, Feb, March, April, June",implode(', ', $months));
		$this->assertEquals("Feb- Feb- March- April- June",implode('- ', $months));
		$this->assertEquals(["April","June","March","April","June"],\es\core\es_array_copy_within($months,0,3,5));
		$this->assertEquals(["d","b","c","d","e"],\es\core\es_array_copy_within(['a','b','c','d','e'],0,3,4));
		$this->assertTrue(isset($months[2]));
		$this->assertTrue(isset($months[2]));
		$this->assertFalse(is_array(''));
		$this->assertTrue(is_array(['']));
		$ip = [];
		array_splice($ip,0,0,[2,3,5]);
		$this->assertEquals([2,3,5],$ip);
		array_splice($ip,1,1,[2,3,6,5]);
		$this->assertEquals([2,2,3,6,5,5],$ip);
		if($ip){
			$_ARV1 = 0;
			$ip = $_RD3 = &$this->arrItems;
		}
		/*References $ip memory address*/
		$_REF1 = function &()use(&$ip,&$_ARV1,&$_RD3){
			if($_ARV1===null)return $ip;
			switch($_ARV1){
				case 0 : return $_RD3;
				default: return $ip;
			}
		};
		array_splice($_REF1(),0,1,1);
		$this->assertEquals([1],$_REF1());
		$ds = [1,2,3];
		$_splice = System::bind('array_splice',$ds);
		$this->assertEquals([1,2],$_splice(0,2));
		$this->assertEquals([3],$ds);
		$testObj = (object)['name'=>66];
		$_splice2 = System::bind('array_splice',$testObj);
		$_push = System::bind('array_push',$testObj);
		$s = $_splice2(0,1,3,6,9);
		$_push("Jun");
		$this->assertEquals([],$s);
		$this->assertEquals((object)['0'=>3,'1'=>6,'2'=>9,'3'=>"Jun",'length'=>4,'name'=>66],$testObj);
		$s = $_splice2(0,2);
		$this->assertEquals((object)['0'=>9,'1'=>"Jun",'length'=>2,'name'=>66],$testObj);
		$this->assertEquals([3,6],$s);
		$this->assertEquals(6,array_pop($s));
		$this->assertEquals(3,array_pop($s,));
	}

	/**
	* @method addArray
	*/
	public function addArray(array &$a,$b){
		array_push($a,$b);
	}

	/**
	* @property arrItems
	*/
	private $arrItems = [];

	/**
	* @method ccArray
	*/
	public function &ccArray():array{
		$b = &$this->arrItems;
		return $b;
	}

	/**
	* @method pushArray
	*/
	public function pushArray(array &$a,$b){
		array_push($a,$b);
	}

	/**
	* @method testString
	*/
	public function testString(){
		$str = 'aab';
		$this->assertEquals(\es\core\es_string_replace($str,'a','A'),"Aab");
		$this->assertEquals(\es\core\es_string_index_of($str,'b'),2);
		$this->assertEquals(mb_substr($str,0,1),'a');
		$this->assertEquals(mb_ord(mb_substr($str,0,1),'UTF-8'),97);
		$this->assertEquals(mb_ord(mb_substr($str,2,1),'UTF-8'),98);
		$obj = ['b'];
		Reflect::set('\Start',$obj,'index',2);
		Reflect::set('\Start',$obj,'input','aab');
		$this->assertEquals((new RegExp('b'))->match($str),$obj);
		$this->assertEquals(Reflect::get('\Start',$obj,'index'),2);
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
		$this->assertEquals(3,\es\core\es_string_index_of($chinese,"人"));
		$this->assertEquals(3,\es\core\es_string_last_index_of($chinese,"人"));
		$this->assertEquals('全' . ($chinese),\es\core\es_string_replace($chinese,'中','全中'));
		$mixed = "中国人A民bc解De放军FFFDDdd";
		$this->assertEquals(19,mb_strlen($mixed));
		$this->assertEquals(12,\es\core\es_string_index_of($mixed,"F"));
		$this->assertEquals(14,\es\core\es_string_last_index_of($mixed,"F"));
		$this->assertEquals('中国人A民bc解De放军FFFdddd',\es\core\es_string_replace($mixed,'DD','dd'));
		$this->assertEquals('民bc解',mb_substr($mixed,4,4));
		$paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
		$regex = new RegExp('[^\w\s]','g');
		$this->assertEquals(43,$regex->search($paragraph));
		$this->assertEquals('.',Reflect::get('\Start',$paragraph,$regex->search($paragraph)));
		$this->setNames1("Ye Jun");
		$this->assertEquals('Ye Jun',$this->getNames1());
	}

	/**
	* @method testObject
	*/
	public function testObject(){
		$name = "Jun Ye";
		$o = (object)['name'=>$name];
		$this->assertEquals((object)['name'=>"Jun Ye"],$o);
		$this->assertEquals((object)['name'=>"ssss",'age'=>30],\es\core\es_object_assign($o,(object)['age'=>30,'name'=>"ssss"]));
		$this->assertEquals($this,Reflect::call('\Start',Reflect::call('\Start',$this,"call"),"getObject"));
		$fn = Reflect::get('\Start',$this,'getObject');
		$this->assertEquals($this,$fn());
	}

	/**
	* @method getObject
	*/
	public function getObject($name=null){
		return $this;
	}

	/**
	* @method testNumber
	*/
	public function testNumber(){
		$num = 5.123456;
		$this->assertEquals(5,\es\core\es_number_to_precision($num,1));
		$num = 77.1234;
		$this->assertEquals(8e+1,\es\core\es_number_to_precision($num,1));
		$nums = 999999;
		$bf = System::bind('\es\core\es_number_to_precision',$nums);
		$this->assertEquals(999999,$bf(6));
		$df = 1.236999999;
		$bfs = System::bind('\es\core\es_number_to_exponential',$df);
		$this->assertEquals(1.237000e+0,$bfs(6));
	}

	/**
	* @method testEnum
	*/
	public function testEnum(){
		$this->assertEquals(0,Types::ADDRESS);
		$this->assertEquals(1,Types::NAME);
		$Type=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$Type[$Type->address=5]='address';
		$Type[$Type->name=6]='name';
		$this->assertEquals(5,$Type->address);
		$this->assertEquals(6,$Type->name);
	}

	/**
	* @method call
	*/
	public function call():Start{
		return $this;
	}

	/**
	* @getter names
	*/
	public function getNames1():string{
		return $this->_names;
	}

	/**
	* @setter names
	*/
	public function setNames1(string $val){
		$this->_names = $val;
	}

	/**
	* @property _names
	*/
	private $_names = 'test';

	/**
	* @method getNames
	* the is getNames method
	*/
	public function getNames(){
	
	}

	/**
	* @method setNames
	*/
	public function setNames(){
	
	}

	public function __get( $name ){
		switch($name){
			case 'names' : return $this->getNames1();
		}
	}

	public function __set( $name, $value ){
		switch($name){
			case 'names' : $this->setNames1( $value ); break;
		}
	}
}