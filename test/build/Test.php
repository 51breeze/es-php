<?php
use \Person;
use \com\TestInterface;
use \es\core\RegExp;
use \es\core\Reflect;
use \Types;
use \es\core\System;
use \es\core\ArrayMethod;
use \Start;
class Test extends Person{
	public function __construct(string $name,$age){
		parent::__construct($name);
		parent::setType('1');
		$this->getTarget();
		new Start();
	}
	static public function getClass(){
		$a = Test;
		$buname = (object)['a'=>1];
		$buname->test = $a;
		$buname->person = Person;
		$test=$buname->test;
		$test->getClassObject();
		return $buname;
	}
	static public function getClassObject(){
		$a = Test;
		$b = (object)['test'=>$a];
		$b->person = Person;
		return $b->test;
	}
	static public function getObject(){
		return new Test('1','2');
	}
	static public function getUuName():string{
		return 'uuName';
	}
	static private $iiu = Test;
	private $bbss = 'bbss';
	private $age = 40;
	public function start(){
		it('static get uuName accessor',function(){
			expect(Test::getClassObject()->getUuName())->toBe("uuName");
		});
		it('\'this.age\' should is true',function(){
			expect($this->age)->toBe(40);
		});
		it('\'this instanceof Person\' should is true',function(){
			expect($this instanceof Person)->toBeTrue();
		});
		it('"this is Person" should is true',function(){
			expect(is_a($this,'Person'))->toBeTrue();
		});
		it('\'this instanceof TestInterface\' should is false',function(){
			expect($this instanceof TestInterface)->toBeFalse();
		});
		it('\'this is TestInterface\' should is true',function(){
			expect(is_a($this,'TestInterface'))->toBeFalse();
		});
		it('\'Test.getClass().test\' should is Test',function(){
			expect(Test::getClass()->test)->toBe(Test);
		});
		it('\'Test.getClass().person\' should is Person',function(){
			expect(Test::getClass()->person)->toBe(Person);
		});
		it('\'new (Test.getClass().person)(\'\')\' should is true',function(){
			$_refClass = Test::getClass()->person;
			$o = new $_refClass('name');
			expect($o instanceof Person)->toBeTrue();
		});
		it('\'this.bbss="666666"\' should is \'666666\' ',function(){
			expect($this->bbss)->toBe('bbss');
			$this->bbss = "666666";
			expect($this->bbss)->toBe('666666');
		});
		it('test name accessor ',function(){
			expect($this->getName())->toBe('Test');
			$this->setName("test name");
			expect($this->getName())->toBe('test name');
		});
		it('\'var bsp = ()=>{}\' should is \'()=>this\' ',function(){
			$bsp = function(){
				return $this;
			};
			expect($bsp())->toBe($this);
		});
		it('once.two.three should is this or object ',function(){
			$bsp = function(){
				return $this;
			};
			$obj = (object)[];
			$bsp = function($flag)use(&$obj){
				if($flag){
					return $obj;
				}else{
					return $this;
				}
			};
			$three = $bsp(false);
			$once = (object)['two'=>(object)['three'=>$three,'four'=>$bsp]];
			expect($once->two->three)->toBe($this);
			expect($once->two->four(true))->toBe($obj);
			$once->$obds;
		});
		it('/d+/.test( "123" ) should is true ',function(){
			expect((new RegExp('\d+'))->test("123"))->toBe(true);
			expect((new RegExp('^\d+'))->test(" 123"))->toBe(false);
			expect((new RegExp('^\d+'))->exec("123"))->toBe(false);
		});
		it("test rest params",function(){
			$res = $_RD = &$this->restFun(1,"s","test");
			expect($res)->toEqual([1,"s","test"]);
		});
		$this->testEnumerableProperty();
		$this->testComputeProperty();
		$this->testLabel();
		$this->testEnum();
		$this->testIterator();
		$this->testGenerics();
		$this->testAwait();
		$this->testTuple();
		$this->next();
	}
	private function testEnumerableProperty(){
		it('for( var name in this) should is this or object ',function(){
			$labels = ["name","data","target","addressName","iuuu"];
			foreach($this as $key=>$_item){
				expect($key)->toBe($labels[es_array_search_index($labels,$key)]);
				expect(Reflect::get(Test,$this,$key))->toBe(Reflect::get(Test,$this,$key));
			}
		});
	}
	private function testComputeProperty(){
		$bname = "123";
		$_c1=(object)[];
		$_c1->$bname=3;
		$_c=(object)[];
		$_c->$bname=1;
		$_c->sssss=2;
		$_c->uuu=$_c1;
		$o = $_c;
		it('compute property should is true ',function()use(&$bname, &$o){
			expect($o->$bname)->toBe(1);
			expect($o->uuu->$bname)->toBe(3);
			expect($o->uuu->{"123"})->toBe(3);
			Reflect::set(Test,$o->{"uuu"},$bname,true);
			expect(Reflect::get(Test,$o->{"uuu"},$bname))->toBe(true);
		});
	}
	private function testLabel(){
		$num = 0;
		start:for($i = 0;$i < 5;$i++){
			for($j = 0;$j < 5;$j++){
				if($i == 3 && $j == 3){
					goto start;
				}
				$num++;
			}
		}
		it('label for should is loop 18',function()use(&$num){
			expect($num)->toBe(18);
		});
	}
	private function testEnum(){
		$Type=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$Type[$Type->address=5]='address';
		$Type[$Type->name=6]='name';
		$t = $Type->address;
		$b = Types::ADDRESS;
		it('Type local enum should is true',function()use(&$t, &$Type){
			expect($t)->toBe(5);
			expect($Type->name)->toBe(6);
		});
		it('Type local enum should is true',function()use(&$b){
			expect($b)->toBe(0);
			expect(Types::NAME)->toBe(1);
		});
	}
	private function testIterator(){
		$array = [];
		foreach($this as $val){
			array_push($array,$val);
		}
		it('impls iterator should is [0,1,2,3,4]',function()use(&$array){
			expect(5)->toBe(count($array));
			for($i = 0;$i < 5;$i++){
				expect($i)->toBe($array[$i]);
			}
		});
	}
	private function testGenerics(){
		$ddee = $this->map();
		$dd = $ddee;
		$ccc = $ddee->name((object)['name'=>1,'age'=>1],"123");
		$cccww = $dd->name((object)['name'=>1,'age'=>30],666);
		$types = '333';
		$_c2=(object)[];
		$_c2->name=123;
		$_c2->$types=1;
		$bds = $_c2;
		Reflect::set(Test,$bds,$types,99);
		it('Generics should is true',function()use(&$ccc, &$cccww){
			expect(System::typeof($this->avg("test")))->toBe('string');
			expect($ccc->name->toFixed(2))->toBe("1.00");
			expect($cccww->age)->toBe(30);
		});
		it('class Generics',function(){
			$obj = $this->getTestObject(true);
			$bs = $obj->getNamess(1);
			expect($bs->toFixed(2))->toBe("1.00");
		});
		$obj = $this->getTestObject(true);
	}
	private function getClassTestGenerics($name,$age):array{
		$a = [$age,$name];
		return $a;
	}
	private function getTestGenerics($name,$age){
		return $age;
	}
	private function getTestObject(bool $flag){
		$factor = function(){
			$o = (object)[];
			$o->test = new Test('name',1);
			$o->name = "test";
			return $o->test;
		};
		$o = $factor();
		return $o;
	}
	public function getNamess($s){
		return $s;
	}
	private function testAwait(){
		it('test Await',function($done){
			$res = $this->loadRemoteData(1);
			$res->then(function($data)use(&$done){
				expect(Reflect::get(Test,$data,0))->toEqual(['one',1]);
				expect(Reflect::get(Test,$data,1))->toEqual((object)['bss'=>['two',2],'cc'=>['three',3]]);
				expect(Reflect::get(Test,$data,2))->toEqual(['three',3]);
				$done();
			});
		});
		it('test for Await',function($done){
			$res = $this->loadRemoteData(2);
			$res->then(function($data)use(&$done){
				expect(Reflect::get(Test,$data,0))->toEqual(['0',0]);
				expect(Reflect::get(Test,$data,1))->toEqual(['1',1]);
				expect(Reflect::get(Test,$data,2))->toEqual(['2',2]);
				expect(Reflect::get(Test,$data,3))->toEqual(['3',3]);
				expect(Reflect::get(Test,$data,4))->toEqual(['4',4]);
				$done();
			});
		});
		it('test switch Await',function($done){
			$res = $this->loadRemoteData(3);
			$res->then(function($data)use(&$done){
				expect($data)->toEqual(['four',4]);
				$done();
			});
		});
		it('test switch and for Await',function($done){
			$res = $this->loadRemoteData(4);
			$res->then(function($data)use(&$done){
				expect($data)->toEqual([['five',5],['0',0],['1',1],['2',2],['3',3],['4',4]]);
				$done();
			});
		});
		'';
	}
	public function getJson(){
		return (object)['name'=>123];
	}
	public function testTuple(){
		$data = $this->method("end",9);
		it('test tuple',function()use(&$data){
			expect($data)->toEqual([['a','b'],[1],[1,1,'one'],['one',['one',1],'three','four',['end',9]]]);
		});
	}
	private $len = 5;
	private $currentIndex = 0;
	public function next(){
		if(!($this->currentIndex < $this->len)){
			return (object)['value'=>null,'done'=>true];
		}
		$d = (object)['value'=>$this->currentIndex++,'done'=>false];
		return $d;
	}
	public function restFun(...$types):array{
		return $types;
	}
	public function tetObject(){
		$b = $t;
		$ii = (object)['bb'=>$b];
		return $ii->bb;
	}
	public function getIuuu(){
		$ii = $this->getName();
		if(6){
			$ii = [];
		}
		$ii = true;
		return $ii;
	}
	public function getData(){
		$b = [];
		if(4){
			$b = $this->avg;
		}
		$b = $this->avg;
		return $b;
	}
	public function fetchApi(string $name,int $data,int $delay){
		return new Promise(function($resolve,$reject)use(&$delay){
			setTimeout(function()use(&$name, &$data, &$resolve){
				$resolve([$name,$data]);
			},$delay);
		});
	}
	public function loadRemoteData2(){
		return $this->fetchApi("one",1,800);
	}
	public function loadRemoteData($type){
		if($type === 1){
			$a = $this->fetchApi("one",1,800);
			$bs = (object)['bss'=>$this->fetchApi("two",2,500)];
			$c = $this->fetchApi("three",3,900);
			$bs->cc = $c;
			return [$a,$bs,$c];
		}else{
			$list = [];
			switch($type){
				case 3 :
					$b = $this->fetchApi("four",4,300);
					return $b;
				case 4 :
					$bb = $this->fetchApi("five",5,1200);
					array_push($list,$bb);
			}
			for($i = 0;$i < 5;$i++){
				array_push($list,$this->fetchApi($i . '',$i,100));
			}
			array_values($list);
			return $list;
		}
	}
	public function method(string $name,int $age){
		parent::method($name,$age);
		$str = ["a","b"];
		$b = ["one",["one",1]];
		$cc = [1];
		$x = [1,1,'one'];
		array_push($b,'three');
		array_push($b,'four');
		array_push($b,[$name,$age]);
		return [$str,$cc,$x,$b];
	}
	public function getName():string{
		return parent::getName();
	}
	public function setName(string $value):string{
		parent::setName($value);
	}
	public function avg($yy,$bbc){
		$bb = ['1'];
		function name($i){
			$b = $i;
			$i->avg();
			$i->method('',1);
			return $b;
		}
		$person = new Person('');
		name($person);
		name($person);
		$dd = [1,1,"2222","66666","8888"];
		array_push($bb);
		array_push($dd,1);
		return $yy;
	}
	public function map(){
		$ddss = (object)['name'=>function($c,$b){
			return $c;
		}];
		return $ddss;
	}
	private function address():array{
		$dd = [];
		$bb = (object)['global'=>1,'private'=>1,'items'=>[]];
		array_push($dd,1);
		printf('%s %s',json_encode(es_array_filter($dd,function($value,$key,$array){
			return true;
		},$this),true),json_encode((new RegExp('==='))->match("============"),true));
		$bds = es_array_new($bb->global);
		count($bds);
		array_slice($dd,0);
		$items = $_RD1 = &$bb->items;
		if($bb->global === 1){
			$_ARV = 1;
			$items = $_RD2 = &$dd;
		}
		$items_push = function(...$_args)use(&$items,&$_ARV,&$_RD1,&$_RD2){
			switch($_ARV){
				case 1 :
					$_RV = array_push($_RD2,...$_args);
					$items = $_RD2;
					return $_RV;
				default :
					$_RV = array_push($_RD1,...$_args);
					$items = $_RD1;
					return $_RV;
			}
		};
		$items_push(0);
		$_ARV = 2;
		printf('%s %s %s',json_encode($items_push(1,9,6),true),json_encode($items = [],true),json_encode($items_push(9999),true));
		$items_pop = function()use(&$items,&$_ARV,&$_RD1,&$_RD2,&$_RD3){
			switch($_ARV){
				case 1 :
					$_RV1 = array_pop($_RD2);
					$items = $_RD2;
					return $_RV1;
				case 2 :
					$_RV1 = array_pop($_RD3);
					$items = $_RD3;
					return $_RV1;
				default :
					$_RV1 = array_pop($_RD1);
					$items = $_RD1;
					return $_RV1;
			}
		};
		printf('%s',json_encode($items_pop(),true));
		$items_splice = function(...$_args)use(&$items,&$_ARV,&$_RD1,&$_RD2,&$_RD3){
			switch($_ARV){
				case 1 :
					$_RV2 = array_splice($_RD2,...$_args);
					$items = $_RD2;
					return $_RV2;
				case 2 :
					$_RV2 = array_splice($_RD3,...$_args);
					$items = $_RD3;
					return $_RV2;
				default :
					$_RV2 = array_splice($_RD1,...$_args);
					$items = $_RD1;
					return $_RV2;
			}
		};
		printf('%s',json_encode($items_splice(0,5,''),true));
		$items_shift = function()use(&$items,&$_ARV,&$_RD1,&$_RD2,&$_RD3){
			switch($_ARV){
				case 1 :
					$_RV3 = array_shift($_RD2);
					$items = $_RD2;
					return $_RV3;
				case 2 :
					$_RV3 = array_shift($_RD3);
					$items = $_RD3;
					return $_RV3;
				default :
					$_RV3 = array_shift($_RD1);
					$items = $_RD1;
					return $_RV3;
			}
		};
		printf('%s',json_encode($items_shift(),true));
		$items_unshift = function(...$_args)use(&$items,&$_ARV,&$_RD1,&$_RD2,&$_RD3){
			switch($_ARV){
				case 1 :
					$_RV4 = array_unshift($_RD2,...$_args);
					$items = $_RD2;
					return $_RV4;
				case 2 :
					$_RV4 = array_unshift($_RD3,...$_args);
					$items = $_RD3;
					return $_RV4;
				default :
					$_RV4 = array_unshift($_RD1,...$_args);
					$items = $_RD1;
					return $_RV4;
			}
		};
		printf('%s',json_encode($items_unshift(0,5,''),true));
		System::typeof($dd);
		array_push($this->getArrItems(),999);
		$da = $_RD4 = &$this->getArrItems();
		array_push($da,9999666);
		$_ARV1 = 1;
		$da = ["hhhhhhhhhh"];
		printf('%s',json_encode($da,true));
		printf('%s',json_encode(array_pop($da),true));
		$ui = ("==" . 'da' . 'bs') . "=========";
		$n = 8 + 6;
		printf('%s %s',json_encode($ui,true),json_encode($n,true));
		return $dd;
	}
	private function &getArrItems():array{
		$b = $_RD5 = &$this->items;
		if($b){
			$_ARV2 = 1;
			$b = $_RD5 = &$this->items;
		}
		$_ARV2 = 2;
		$b = [];
		return $b;
	}
	private $items = [];
}
/*externals code*/;
$test = new Test('Test');
$test->start();