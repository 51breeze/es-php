<?php
require_once('Types.php');
require_once('es/core/System.php');
require_once('es/core/Reflect.php');
require_once('es/core/RegExp.php');
require_once('com/TestInterface.php');
require_once('Person.php');
use \com\TestInterface;
use \es\core\RegExp;
use \es\core\Reflect;
use \es\core\System;
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
		$i = 0;
		start:for(;$i < 5;$i++){
			for($j = 0;$j < 5;$j++){
				if($i == 3 && $j == 3){
					goto start;
				}
				$num++;
			}
		}
		System::print('testLabel start',$num);
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
}