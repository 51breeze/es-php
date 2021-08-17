<?php
require_once('es/core/System.php');
require_once('Types.php');
require_once('es/core/Reflect.php');
require_once('es/core/RegExp.php');
require_once('com/TestInterface.php');
require_once('Person.php');
use \com\TestInterface;
use \es\core\RegExp;
use \es\core\Reflect;
use \es\core\System;
/**
* @class Test
* @implements \Iterator
* @inherit \Person
* Test a class
*/
 class Test extends Person{

	/**
	* @constructor Test
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
		$a = '\Test';
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
		$a = '\Test';
		$b = (object)['test'=>$a];
		$b->person = '\Person';
		return $b->test;
	}

	/**
	* @method getObject
	*/
	static public function getObject(){
		return new Test();
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
	static private $iiu = '\Test';

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
		$this->assertEquals("uuName",Test::getClassObject()::getUuName());
		$this->assertEquals(40,$this->age);
		$this->assertTrue($this instanceof \Person);
		$this->assertTrue(is_a($this,'\Person'));
		$this->assertTrue($this instanceof \com\TestInterface);
		$this->assertTrue(is_a($this,'\com\TestInterface'));
		$this->assertEquals('\Test',Test::getClass()->test);
		$this->assertEquals('\Person',Test::getClass()->person);
		$_refClass = Test::getClass()->person;
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
		$this->assertTrue((new RegExp('\d+'))->test("123"));
		$this->assertFalse((new RegExp('^\d+'))->test(" 123"));
		$this->assertTrue(!!(new RegExp('^\d+'))->exec("123"));
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
		$this->assertEquals(1,Reflect::get('Test',$o,$bname));
		$this->assertEquals(3,Reflect::get('Test',$o->uuu,$bname));
		$this->assertEquals(3,Reflect::get('Test',$o->uuu,"123"));
		Reflect::set('Test',Reflect::get('Test',$o,"uuu"),$bname,true);
		$this->assertTrue(Reflect::get('Test',Reflect::get('Test',$o,"uuu"),$bname));
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
			$this->assertEquals($i,Reflect::get('Test',$array,$i));
		}
		for($this->rewind();($IRV1 = $this->next()) && !$IRV1->done;){
			$b=$IRV1->value;
			array_push($array,$b);
		}
		$this->assertEquals([0,1,2,3,4,0,1,2,3,4],$array);
		$o = $this;
		$ITO = System::getIterator($o);
		for(call_user_func([$ITO,'rewind']);($IRV2 = call_user_func([$ITO,'next'])) && !$IRV2->done;){
			$c=$IRV2->value;
			array_push($array,$b);
		}
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
		$this->assertEquals(1,Reflect::get('Test',$bds,$types));
		Reflect::set('Test',$bds,$types,99);
		$this->assertEquals('string',System::typeof($this->avg("test")));
		$this->assertEquals("1.00",floatval(number_format($ccc->name,2,'.','')));
		$this->assertEquals(30,$cccww->age);
		$this->assertEquals(99,Reflect::get('Test',$bds,$types));
		$obj = $this->getTestObject(true);
		$bs = $obj->getNamess(1);
		$this->assertEquals("1.00",Reflect::call('Test',$bs,'toFixed',[2]));
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
			$o->test = new Test();
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
	public function restFun(array ...$types):array{
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
		$_V = [$name,$age];
		array_push($b,$_V);
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
}