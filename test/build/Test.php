<?php
use \Person;
use \com\TestInterface;
use \Reflect;
use \Types;
class Test extends Person
{
public function __construct(string $name,$age){
	parent($name);
	parent::setType('1');
	$this->getTarget();
}
static public function getClass(){
	$a = Test;
	$buname = new \ArrayObject(['a'=>1], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	$buname->test=$a;
	$buname->person=Person;
	$test=$buname->test;
	$test->getClassObject();
	return $buname;
}
static public function getClassObject(){
	$a = Test;
	$b = new \ArrayObject(['test'=>$a], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	$b->person=Person;
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
		$this->bbss="666666";
		expect($this->bbss)->toBe('666666');
	});
	it('test name accessor ',function(){
		expect($this->getName())->toBe('Test');
		$this->name="test name";
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
		$obj = new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$bsp=function($flag)use(&$obj){
			if($flag){
				return $obj;
			}else{
				return $this;
			}
		};
		$obds = 1;
		$three = $bsp(false);
		$once = new \ArrayObject(['two'=>new \ArrayObject(['three'=>$three,'four'=>$bsp], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS)], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		expect($once->two->three)->toBe($this);
		expect($once->two->four(true))->toBe($obj);
		$once->obds;
	});
	it('/d+/.test( "123" ) should is true ',function(){
		expect(!!preg_match('/\d+/',"123"))->toBe(true);
		expect(!!preg_match('/^\d+/'," 123"))->toBe(false);
	});
	it("test rest params",function(){
		$res = $this->restFun(1,"s","test");
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
		for($key in $this){
			expect($key)->toBe($labels->$labels->indexOf($key));
			expect(Reflect::get(Test,$this,key))->toBe(Reflect::get(Test,$this,key));
		}
	});
}
private function testComputeProperty(){
	$bname = "123";
	$o = ($_c=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS),
		$_c->$bname=1,
		$_c->sssss=2,
		$_c->uuu=($_c1=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS),
			$_c1->$bname=3,
			$_c1),
		$_c);
	it('compute property should is true ',function()use(&$o){
		expect($o->bname)->toBe(1);
		expect($o->uuu->bname)->toBe(3);
		expect($o->uuu->"123")->toBe(3);
		Reflect.set(Test,$o->"uuu",bname,true);
		expect(Reflect::get(Test,$o->"uuu",bname))->toBe(true);
	});
}
private function testLabel(){
	$num = 0;
	start:for($i = 0;$i < 5;$i++){
		for($j = 0;$j < 5;$j++){
			if($i == 3 && $j == 3){
				break start;
			}
			$num++;
		}
	}
	it('label for should is loop 18',function()use(&$num){
		expect($num)->toBe(18);
	});
}
private function testEnum(){
	$Type = ($Type=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS),$Type[$Type->address=5]='address',$Type[$Type->name=6]='name',$Type);
	$s = Types;
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
	for($val,_v,_i=System.getIterator($this); _i && (_v=_i.next()) && !_v.done;){
		val=_v.value;
		$array->push($val);
	}
	it('impls iterator should is [0,1,2,3,4]',function()use(&$array){
		expect(5)->toBe($array->length);
		for($i = 0;$i < 5;$i++){
			expect($i)->toBe($array->i);
		}
	});
}
private function testGenerics(){
	$ddee = $this->map();
	$dd = $ddee;
	$ccc = $ddee->name(new \ArrayObject(['name'=>1,'age'=>1], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS),"123");
	$cccww = $dd->name(new \ArrayObject(['name'=>1,'age'=>30], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS),666);
	$types = '333';
	$bds = ($_c2=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS),
		$_c2->name=123,
		$_c2->$types=1,
		$_c2);
	Reflect.set(Test,$bds,types,99);
	it('Generics should is true',function()use(&$ccc, &$cccww){
		expect(typeof $this->avg("test"))->toBe('string');
		expect($ccc->name->toFixed(2))->toBe("1.00");
		expect($cccww->age)->toBe(30);
	});
	it('class Generics',function(){
		$obj = $this->getTestObject(true);
		$bd = $obj;
		$bs = $obj->getNamess(1);
		expect($bs->toFixed(2))->toBe("1.00");
	});
	$bsint = $this->getTestGenerics('sssss');
	$bsstring = $this->getTestGenerics("ssss",'age');
	$bd = $bsstring;
	$obj = $this->getTestObject(true);
	$bsddd = $obj->getNamess(1);
	$sss = $obj->getClassTestGenerics(1,1);
}
private function getClassTestGenerics($name,$age){
	$a = [$age,$name];
	return $a;
}
private function getTestGenerics($name,$age){
	$t = new Test('name',$name);
	return $age;
}
private function getTestObject(bool $flag){
	$factor = function(){
		$o = new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$o->test=new Test('name',1);
		$o->name="test";
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
			expect(Reflect::get(Test,$data,1))->toEqual(new \ArrayObject(['bss'=>['two',2],'cc'=>['three',3]], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS));
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
	Reflect::get(Test,$this->getJson(),"name");
}
public function getJson(){
	return new \ArrayObject(['name'=>123], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
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
		return new \ArrayObject(['value'=>null,'done'=>true], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	}
	$d = new \ArrayObject(['value'=>$this->currentIndex++,'done'=>false], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	return $d;
}
public function restFun(types){
	return $types;
}
public function tetObject(){
	$t = new Test('1',1);
	$b = $t;
	$ii = new \ArrayObject(['bb'=>$b], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	return $ii->bb;
}
public function getIuuu(){
	$ii = $this->getName();
	if(6){
		$ii=[];
	}
	$ii=true;
	return $ii;
}
public function getData(){
	$b = [];
	if(4){
		$b=$this->avg;
	}
	$b=$this->avg;
	$dd = function(){
		$bs = new Promise(function($resolve,$reject){
			setTimeout(function()use(&$resolve){
				$resolve([]);
			},100);
		});
		return $bs;
	};
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
					return [4,$this->fetchApi("one",1,800)];
				case NaN:
					return [2, _a.sent()];
}
public function loadRemoteData($type){
					if(!($type === 1))return [3,NaN];
					return [4,$this->fetchApi("one",1,800)];
				case NaN:
					$a = _a.sent();
					return [4,$this->fetchApi("two",2,500)];
				case NaN:
					$bs = new \ArrayObject(['bss'=>_a.sent()], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
					return [4,$this->fetchApi("three",3,900)];
				case NaN:
					$c = _a.sent();
					$bs->cc=$c;
					return [2, [$a,$bs,$c]];
				case NaN:
					$list = [];
					switch($type){
						case 3 : return [3,NaN];
						case 4 : return [3,NaN];
					}
					return [3,NaN];
				case NaN:
					return [4,$this->fetchApi("four",4,300)];
				case NaN:
					$b = _a.sent();
					return [2, $b];
				case NaN:
					return [4,$this->fetchApi("five",5,1200)];
				case NaN:
					$bb = _a.sent();
					$list->push($bb);
					return [3,NaN];
				case NaN:
					i=0;
					_a.label=NaN;
				case NaN:
					if( !($i < 5) )return [3, NaN];
					return [4,$this->fetchApi($i + '',$i,100)];
				case NaN:
					$list->push(_a.sent());
					_a.label=NaN;
				case NaN:
					$i++;
					return [3, NaN];
				case NaN:
					$list->entries();
					return [2, $list];
}
public function method(string $name,int $age){
	parent::method($name,$age);
	$str = ["a","b"];
	$b = ["one",["one",1]];
	$cc = [1];
	$x = [1,1,'one'];
	$b->push('three');
	$b->push('four');
	$b->push([$name,$age]);
	return [$str,$cc,$x,$b];
}
public function getName():string{
	return parent::getName();
}
public function setName(string $value):string{
	parent::name.call(this,$value);
}
public function avg($yy,$bbc){
	$ii = function(){
	return 1;
	};
	$bb = ['1'];
	function name(com.TestInterface $i){
		$b = $i;
		$i->avg();
		$i->method('',1);
		return $b;
	}
	$person = new Person('');
	name($person);
	$bbb = name($person);
	name($person);
	$dd = [1,1,"2222","66666","8888"];
	$bb->push();
	$dd->push(1);
	return $yy;
}
public function map(){
	$ddss = new \ArrayObject(['name'=>function($c,$b){
		$id = $b;
		return $c;
	}], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	return $ddss;
}
private function address(){
	$dd = [];
	$bb = new \ArrayObject(['global'=>1,'private'=>1], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
	$dd->push(1);
	return $dd;
}
}
/*externals code*/;
var Test = System.getClass(0);
$test = new Test('Test');
$test->start();;