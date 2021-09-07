<?php
require_once('es/core/System.php');
require_once('es/core/Reflect.php');
require_once('es/core/RegExp.php');
require_once('es/core/Array.php');
require_once('es/core/Number.php');
require_once('es/core/Promise.php');
require_once('es/core/Number.php');
require_once('com/TestInterface.php');
require_once('es/core/Object.php');
require_once('Types.php');
require_once('es/core/Number.php');
require_once('es/core/String.php');
require_once('es/core/IIterator.php');
require_once('Person.php');
use \es\core\IIterator;
use \com\TestInterface;
use \es\core\Promise;
use \es\core\RegExp;
use \es\core\Reflect;
use \es\core\System;
/**
* @class IndexTest
* @implements \es\core\IIterator
* @inherit \Person
* Test a class
*/
class IndexTest extends Person implements \es\core\IIterator{

	/**
	* @constructor IndexTest
	* a constructor method
	*/
	public function __construct(){
		parent::__construct();
	}

	/**
	* @method getClass
	* 返回一个类的引用
	*/
	static public function getClass(){
		$a = '\IndexTest';
		$buname = (object)['a'=>1];
		$buname->test = $a;
		$buname->person = '\Person';
		$test=$buname->test;
		$test::getClassObject();
		return $buname;
	}

	/**
	* @method getClassObject
	*/
	static public function getClassObject(){
		$a = '\IndexTest';
		$b = (object)['test'=>$a];
		$b->person = '\Person';
		return $b->test;
	}

	/**
	* @method getObject
	*/
	static public function getObject(){
		return new IndexTest();
	}

	/**
	* @getter uuName
	* @public
	* the is static getter
	*/
	static public function getUuName():string{
		return 'uuName';
	}

	/**
	* @property iiu
	* @private
	* the is class type.
	*/
	static private $iiu = '\IndexTest';

	/**
	* @property bbss
	* @private
	* Automatic inference string type
	*/
	private $bbss = 'bbss';

	/**
	* @property age
	* property const age
	*/
	private $age = 40;

	/**
	* @method testBase
	*/
	public function testBase(){
		$this->assertEquals("uuName",IndexTest::getClassObject()::getUuName());
		$this->assertEquals(40,$this->age);
		$this->assertTrue($this instanceof \Person);
		$this->assertTrue(is_a($this,'\Person'));
		$this->assertTrue($this instanceof \com\TestInterface);
		$this->assertTrue(is_a($this,'\com\TestInterface'));
		$this->assertEquals('\IndexTest',IndexTest::getClass()->test);
		$this->assertEquals('\Person',IndexTest::getClass()->person);
		$_refClass = IndexTest::getClass()->person;
		$o = new $_refClass();
		$this->assertTrue($o instanceof \Person);
		$this->assertEquals('bbss',$this->bbss);
		$this->bbss = "666666";
		$this->assertEquals('666666',$this->bbss);
		$this->setPersonName("test name");
		$this->assertEquals('test name',$this->getPersonName());
		$bsp = function($flag=null){
			return $this;
		};
		$this->assertEquals($this,$bsp(1));
		$obj = (object)[];
		$bsp = function($flag=null)use(&$obj){
			if($flag){
				return $obj;
			}else{
				return $this;
			}
		};
		$three = $bsp(false);
		$once = (object)['two'=>(object)['three'=>$three,'four'=>$bsp]];
		$this->assertEquals($this,$once->two->three);
		$this->assertEquals($obj,call_user_func($once->two->four,true));
		$this->assertTrue((new RegExp('\d+'))->test("123"));
		$this->assertFalse((new RegExp('^\d+'))->test(" 123"));
		$this->assertTrue(!!(new RegExp('^\d+'))->exec("123"));
		$this->assertEquals([1,"s","test"],$this->restFun(1,"s","test"));
	}

	/**
	* @method testComputeProperty
	*/
	public function testComputeProperty(){
		$bname = "123";
		$_c1=(object)[];
		$_c1->$bname=3;
		$_c=(object)[];
		$_c->$bname=1;
		$_c->sssss=2;
		$_c->uuu=$_c1;
		$o = $_c;
		$this->assertEquals(1,$o->$bname);
		$this->assertEquals(3,$o->uuu->$bname);
		$this->assertEquals(3,$o->uuu->{"123"});
		Reflect::set('IndexTest',$o->{"uuu"},$bname,true);
		$this->assertTrue(Reflect::get('IndexTest',$o->{"uuu"},$bname));
	}

	/**
	* @method testLabel
	*/
	public function testLabel(){
		$num = 0;
		for($i = 0;$i < 5;$i++){
			for($j = 0;$j < 5;$j++){
				if($i == 3 && $j == 3){
					break 2;
				}
				$num++;
			}
		}
		$this->assertEquals(18,$num);
	}

	/**
	* @method testEnum
	*/
	public function testEnum(){
		$Type=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$Type[$Type->address=5]='address';
		$Type[$Type->name=6]='name';
		$t = $Type->address;
		$b = Types::ADDRESS;
		$this->assertEquals(5,$t);
		$this->assertEquals(6,$Type->name);
		$this->assertEquals(0,$b);
		$this->assertEquals(1,Types::NAME);
	}

	/**
	* @method testIterator
	*/
	public function testIterator(){
		$array = [];
		for($this->rewind();($IRV = $this->next()) && !$IRV->done;){
			$val=$IRV->value;
			array_push($array,$val);
		}
		$this->assertEquals(5,count($array));
		$this->assertEquals([0,1,2,3,4],$array);
		for($i = 0;$i < 5;$i++){
			$this->assertEquals($i,$array[$i]);
		}
		for($this->rewind();($IRV1 = $this->next()) && !$IRV1->done;){
			$b=$IRV1->value;
			array_push($array,$b);
		}
		$this->assertEquals([0,1,2,3,4,0,1,2,3,4],$array);
		$o = $this;
		$array1 = [];
		$ITO = System::getIterator($o);
		for($ITO->rewind();($IRV2 = $ITO->next()) && !$IRV2->done;){
			$c=$IRV2->value;
			array_push($array1,$c);
		}
		$this->assertEquals([0,1,2,3,4],$array1);
		$o1 = [1,2,3];
		$array2 = [];
		foreach($o1 as $d){
			array_push($array2,$d);
		}
		$this->assertEquals($o1,$array2);
		$o3 = (object)['length'=>3,'0'=>1,'1'=>2,'2'=>3];
		$array3 = [];
		$ITO1 = System::getIterator($o3);
		for($ITO1->rewind();($IRV3 = $ITO1->next()) && !$IRV3->done;){
			$e=$IRV3->value;
			array_push($array3,$e);
		}
		$this->assertEquals([1,2,3],$array3);
		$o5 = (array)$o3;
		$ot = [1,2,3];
		$ot["length"] = 3;
		$this->assertEquals($ot,$o5);
		$o4 = 'abcdefg';
		$array4 = [];
		$ITO2 = System::getIterator($o4);
		for($ITO2->rewind();($IRV4 = $ITO2->next()) && !$IRV4->done;){
			$f=$IRV4->value;
			array_push($array4,$f);
		}
		$this->assertEquals($o4,implode("", $array4));
	}

	/**
	* @method testFor
	*/
	public function testFor(){
		$o = (object)['name'=>'testFor','age'=>30,'1'=>100];
		$t = (object)[];
		foreach(\es\core\es_object_keys($o) as $name){
			$t->$name = $o->$name;
		}
		$this->assertEquals($o,$t);
		$s = 'abcd';
		$items = [];
		foreach(\es\core\es_object_keys($s) as $n){
			array_push($items,$s[$n]);
		}
		$this->assertEquals(['a','b','c','d'],$items);
	}

	/**
	* @method testGenerics
	*/
	public function testGenerics(){
		$ddee = $this->map();
		$dd = $ddee;
		$ccc = call_user_func($ddee->name,(object)['name'=>1,'age'=>1],"123");
		$cccww = call_user_func($dd->name,(object)['name'=>1,'age'=>30],666);
		$types = '333';
		$_c2=(object)[];
		$_c2->name=123;
		$_c2->$types=1;
		$bds = $_c2;
		$this->assertEquals(123,$bds->name);
		$this->assertEquals(1,$bds->$types);
		$bds->$types = 99;
		$this->assertEquals('string',System::typeof($this->avg("test")));
		$this->assertEquals("1.00",floatval(number_format($ccc->name,2,'.','')));
		$this->assertEquals(30,$cccww->age);
		$this->assertEquals(99,$bds->$types);
		$obj = $this->getTestObject(true);
		$bs = $obj->getNamess(1);
		$this->assertEquals("1.00",Reflect::call('IndexTest',$bs,'toFixed',[2]));
		$bsstring = $this->getTestGenerics("ssss",'age');
		$this->assertEquals('age',$bsstring);
		$obj = $this->getTestObject(true);
		$sss = &$obj->getClassTestGenerics(1,1);
		$this->assertEquals([1,1],$sss);
	}

	/**
	* @method getClassTestGenerics
	*/
	private function getClassTestGenerics($name,$age=null):array{
		$a = [$age,$name];
		return $a;
	}

	/**
	* @method getTestGenerics
	*/
	private function getTestGenerics($name,$age=null){
		return $age;
	}

	/**
	* @method getTestObject
	*/
	private function getTestObject(bool $flag=null){
		$factor = function(){
			$o = (object)[];
			$o->test = new IndexTest();
			$o->name = "test";
			return $o->test;
		};
		$o = $factor();
		return $o;
	}

	/**
	* @method getNamess
	*/
	public function getNamess($s){
		return $s;
	}

	/**
	* @method testAwait
	*/
	public function testAwait(){
		(function(){
			$res = $this->loadRemoteData(1);
			$res->then(function(&$data){
				$this->assertEquals(['one',1],$data[0]);
				$this->assertEquals((object)['bss'=>['two',2],'cc'=>['three',3]],$data[1]);
				$this->assertEquals(['three',3],$data[2]);
			});
		})();
		(function(){
			$res = $this->loadRemoteData(2);
			$res->then(function(&$data){
				$this->assertEquals(['0',0],$data[0]);
				$this->assertEquals(['1',1],$data[1]);
				$this->assertEquals(['2',2],$data[2]);
				$this->assertEquals(['3',3],$data[3]);
				$this->assertEquals(['4',4],$data[4]);
			});
		})();
		$res = $this->loadRemoteData(3);
		$res->then(function(&$data){
			$this->assertEquals(['four',4],$data);
		});
		(function(){
			$res = $this->loadRemoteData(4);
			$res->then(function(&$data){
				$this->assertEquals([['five',5],['0',0],['1',1],['2',2],['3',3],['4',4]],$data);
			});
		})();
		$this->assertEquals(123,$this->getJson()->name);
	}

	/**
	* @method getJson
	*/
	public function getJson(){
		return (object)['name'=>123];
	}

	/**
	* @method testTuple
	*/
	public function testTuple(){
		$data = $this->method("end",9);
		$this->assertEquals([['a','b'],[1],[1,1,'one'],['one',['one',1],'three','four',['end',9]]],$data);
	}

	/**
	* @property len
	*/
	private $len = 5;

	/**
	* @property currentIndex
	*/
	private $currentIndex = 0;

	/**
	* @method next
	*/
	public function next(){
		if(!($this->currentIndex < $this->len)){
			return (object)['value'=>null,'done'=>true];
		}
		$d = (object)['value'=>$this->currentIndex++,'done'=>false];
		return $d;
	}

	/**
	* @method rewind
	*/
	public function rewind(){
		$this->currentIndex = 0;
	}

	/**
	* @method restFun
	*/
	public function restFun(...$types):array{
		return $types;
	}

	/**
	* @method tetObject
	*/
	public function tetObject(){
		$b = $t;
		$ii = (object)['bb'=>$b];
		return $ii->bb;
	}

	/**
	* @getter iuuu
	*/
	public function getIuuu(){
		$ii = $this->getPersonName();
		if(6){
			$ii = [];
		}
		$ii = true;
		return $ii;
	}

	/**
	* @getter data
	*/
	public function getData(){
		$b = [];
		if(4){
			$b = Reflect::get('IndexTest',$this,'avg');
		}
		$b = Reflect::get('IndexTest',$this,'avg');
		return $b;
	}

	/**
	* @method fetchApi
	*/
	public function fetchApi(string $name,int $data,int $delay):Promise{
		return new Promise(function($resolve,$reject)use(&$name, &$data, &$delay){
			call_user_func(function()use(&$name, &$data, &$resolve){
				$_V = [$name,$data];
				$resolve($_V);
			});
		});
	}

	/**
	* @method loadRemoteData2
	*/
	public function loadRemoteData2():Promise{
		return Promise::getInstance(Promise::sent($this->fetchApi("one",1,800)));
	}

	/**
	* @method loadRemoteData
	*/
	public function loadRemoteData($type){
		if($type === 1){
			$a = Promise::sent($this->fetchApi("one",1,800));
			$bs = (object)['bss'=>Promise::sent($this->fetchApi("two",2,500))];
			$c = Promise::sent($this->fetchApi("three",3,900));
			$bs->cc = $c;
			return Promise::getInstance([$a,$bs,$c]);
		}else{
			$list = [];
			switch($type){
				case 3 :
					$b = Promise::sent($this->fetchApi("four",4,300));
					return Promise::getInstance($b);
				case 4 :
					$bb = Promise::sent($this->fetchApi("five",5,1200));
					array_push($list,$bb);
			}
			for($i = 0;$i < 5;$i++){
				array_push($list,Promise::sent($this->fetchApi($i . '',$i,100)));
			}
			array_values($list);
			return Promise::getInstance($list);
		}
	}

	/**
	* @method method
	*/
	public function method(string $name,int $age){
		parent::method($name,$age);
		$str = ["a","b"];
		$b = ["one",["one",1]];
		$cc = [1];
		$x = [1,1,'one'];
		array_push($b,'three');
		array_push($b,'four');
		$_V1 = [$name,$age];
		array_push($b,$_V1);
		return [$str,$cc,$x,$b];
	}

	/**
	* @getter personName
	*/
	public function getPersonName():string{
		return parent::getPersonName();
	}

	/**
	* @setter personName
	*/
	public function setPersonName(string $value){
		parent::setPersonName($value);
	}

	/**
	* @method avg
	*/
	public function avg($yy){
		function name($i){
			$b = $i;
			$i->avg(1);
			$i->method('',1);
			return $b;
		}
		$person = new Person();
		name($person);
		name($person);
		$dd = [1,1,"2222","66666","8888"];
		array_push($dd,1);
		return $yy;
	}

	/**
	* @method map
	*/
	public function map(){
		$ddss = (object)['name'=>function($c,$b){
			return $c;
		}];
		return $ddss;
	}

	/**
	* @method testArray
	*/
	public function testArray():array{
		$dd = [];
		$bb = (object)['global'=>1,'private'=>1,'items'=>[]];
		array_push($dd,1);
		$this->assertEquals([1],\es\core\es_array_filter($dd,function($value,$key,&$array){
			return true;
		},$this));
		$this->assertEquals([],\es\core\es_array_filter($dd,function($value,$key,&$array){
			return false;
		},$this));
		$tt = ["==="];
		$tt['index'] = 0;
		$tt['input'] = '============';
		$this->assertEquals($tt,(new RegExp('==='))->match("============"));
		$bds = \es\core\es_array_new($bb->global);
		$this->assertEquals([null],$bds);
		$this->assertEquals($bb->global,count($bds));
		$this->assertEquals([1],System::toArray($dd));
		$_ARV = 0;
		$items = $_RD = &$bb->items;
		if($bb->global === 1){
			$_ARV = 1;
			$items = $_RD1 = &$dd;
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
		array_push($_REF(),0);
		array_push($_REF(),1,9,6);
		$this->assertEquals([1,0,1,9,6],$_REF());
		$_ARV = 2;
		$this->assertEquals($items = [],$_REF());
		array_push($_REF(),9999);
		$this->assertEquals([9999],$_REF());
		$this->assertEquals(9999,array_pop($_REF(),));
		array_splice($_REF(),0,0,[1,2,3]);
		$this->assertEquals([1,2,3],$_REF());
		$this->assertEquals([1,2],array_splice($_REF(),0,2,9));
		$this->assertEquals([9,3],$_REF());
		$this->assertEquals(9,array_shift($_REF(),));
		array_unshift($_REF(),0,5,6);
		$this->assertEquals([0,5,6,3],$_REF());
		$this->assertEquals('array',System::typeof($dd));
		array_push($this->getArrItems(),999);
		$this->assertEquals([999],$this->items);
		$this->assertEquals([],$this->getArrItems());
		$da = $_RD2 = &$this->getArrItems();
		array_push($_RD2,9999666);
		$this->assertEquals([9999666],$this->itemsB);
		$da = ["hhhhhhhhhh"];
		$this->assertEquals("hhhhhhhhhh",array_pop($da,));
		$ui = ("==" . 'da' . 'bs') . "=========";
		$this->assertEquals("==dabs=========",$ui);
		$n = 8 + 6;
		$this->assertEquals(14,$n);
		return $dd;
	}

	/**
	* @method getArrItems
	*/
	private function &getArrItems():array{
		$_ARV1 = 0;
		$b = $_RD3 = &$this->items;
		if($b){
			$_ARV1 = 1;
			$b = $_RD4 = &$this->itemsB;
		}
		/*References $b memory address*/
		$_REF = function &()use(&$b,&$_ARV1,&$_RD3,&$_RD4){
			if($_ARV1===null)return $b;
			switch($_ARV1){
				case 0 : return $_RD3;
				case 1 : return $_RD4;
				default: return $b;
			}
		};
		return $_REF();
	}

	/**
	* @property items
	*/
	private $items = [];

	/**
	* @property itemsB
	*/
	private $itemsB = [];
}