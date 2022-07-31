<?php
include_once("./Person.php");
include_once("./com/TestInterface.php");
include_once("./es/core/RegExp.php");
include_once("./unit/Param.php");
include_once("./Types.php");
include_once("./es/core/Number.php");
include_once("./es/core/Reflect.php");
include_once("./es/core/Promise.php");
include_once("./es/core/Array.php");
include_once("./es/core/String.php");
include_once("./es/core/System.php");
include_once("./es/core/Iterator.php");
use Person;
use TestInterface;
use RegExp;
use Param;
use Types;
use Number;
use Reflect;
use Promise;
use Array;
use String;
use System;
use Iterator;
public class IndexTest extends Person{
    public function __construct(){
        parent::__construct();
    }
    public function getClass(){
        $a = IndexTest::class;
        $buname = (object)[
            "a"=>1
        ];
        $buname->test=$a;
        $buname->person=Person::class;
        ${$test=>$test} = $buname;
        $test->getClassObject();
        return $buname;
    }
    public function getClassObject(){
        $a = IndexTest::class;
        $b = (object)[
            "test"=>$a
        ];
        $b->person=Person::class;
        return $b->test;
    }
    public function getObject(){
        return new IndexTest();
    }
    public function getUuName(){
        return 'uuName';
    }
    static private $iiu=IndexTest::class;
    private $bbss='bbss';
    private const age=40;
    public function testBase(){
        $this->assertEquals("uuName",IndexTest::getClassObject()->getUuName());
        $this->assertEquals(40,$this->age);
        $this->assertTrue($this instanceof Person::class);
        $this->assertTrue(is_a($this,Person::class));
        $this->assertTrue($this instanceof TestInterface);
        $this->assertTrue(is_a($this,TestInterface));
        $this->assertEquals($,IndexTest::getClass()->test);
        $this->assertEquals($,IndexTest::getClass()->person);
        $o = new (IndexTest::getClass()->person)();
        $this->assertTrue($o instanceof Person::class);
        $this->assertEquals('bbss',$this->bbss);
        $this->bbss="666666";
        $this->assertEquals('666666',$this->bbss);
        $this->setPersonName("test name");
        $this->assertEquals('test name',$this->getPersonName());
        $bsp = function($flag=null){
            return $this;
        }
        $this->assertEquals($this,call_user_func_array($bsp,1));
        $obj = (object)[];
        $bsp=function($flag=null){
            if($flag){
                return $obj;
            }else{
                return $this;
            }
        }
        $obds = 1;
        $three = call_user_func_array($bsp,false);
        $once = (object)[
            "two"=>(object)[
                "three"=>$three,
                "four"=>$bsp
            ]
        ];
        $this->assertEquals($this,$once->two->three);
        $this->assertEquals($obj,$once->two->four(true));
        $this->assertTrue((new RegExp("/\d+/"))->test("123"));
        $this->assertFalse((new RegExp("/^\d+/"))->test(" 123"));
        $this->assertTrue(!!(new RegExp("/^\d+/"))->exec("123"));
        $this->assertEquals([1,"s","test"],$this->restFun(1,"s","test"));
        $param = new Param();
        $param->start();
    }
    public function testComputeProperty(){
        $bname = "123";
        $o = (object)[
            [bname]=>1,
            "sssss"=>2,
            "uuu"=>(object)[
                [bname]=>3
            ]
        ];
        $this->assertEquals(1,$o->$bname);
        $this->assertEquals(3,$o->uuu->$bname);
        $this->assertEquals(3,$o->uuu->{"123"});
        $o->{"uuu"}->$bname=true;
        $this->assertTrue($o->{"uuu"}->$bname);
    }
    public function testLabel(){
        $num = 0;
        start:
        for($i = 0;$i < 5;$i++){
            for($j = 0;$j < 5;$j++){
                if($i == 3 && $j == 3){
                    break start;
                }
                $num++;
            }
        }
        $this->assertEquals(18,$num);
    }
    public function testEnum(){
        $s = Types::class;
        $t = $Type->address;
        $b = Types::ADDRESS;
        $this->assertEquals(5,$t);
        $this->assertEquals(6,$Type->name);
        $this->assertEquals(0,$b);
        $this->assertEquals(1,Types::NAME);
    }
    public function testIterator(){
        $array = [];
        for($_i=System::getIterator($this);$_i && ($_v=$_i->next()) && !$_v->done;){
            $val=$_v->value;
            array_push($array,$val);
        }
        $this->assertEquals(5,$array->length);
        $this->assertEquals([0,1,2,3,4],$array);
        for($i = 0;$i < 5;$i++){
            $this->assertEquals($i,$array[$i]);
        }
        for($_i=System::getIterator($this);$_i && ($_v=$_i->next()) && !$_v->done;){
            $b=$_v->value;
            array_push($array,$b);
        }
        $this->assertEquals([0,1,2,3,4,0,1,2,3,4],$array);
        $o = $this;
        $array1 = [];
        for($_i=System::getIterator($o);$_i && ($_v=$_i->next()) && !$_v->done;){
            $c=$_v->value;
            array_push($array1,$c);
        }
        $this->assertEquals([0,1,2,3,4],$array1);
        $o1 = [1,2,3];
        $array2 = [];
        foreach($o1 as $d){
            array_push($array2,$d);
        }
        $this->assertEquals($o1,$array2);
        $o3 = (object)[
            "length"=>3,
            0=>1,
            1=>2,
            2=>3
        ];
        $array3 = [];
        for($_i=System::getIterator($o3);$_i && ($_v=$_i->next()) && !$_v->done;){
            $e=$_v->value;
            array_push($array3,$e);
        }
        $this->assertEquals([1,2,3],$array3);
        $o5 = (array)$o3;
        $ot = [1,2,3];
        $ot["length"]=3;
        $this->assertEquals($ot,$o5);
        $o4 = 'abcdefg';
        $array4 = [];
        foreach($o4 as $f){
            array_push($array4,$f);
        }
        $this->assertEquals($o4,implode("",$array4));
    }
    public function testFor(){
        $o = (object)[
            "name"=>'testFor',
            "age"=>30,
            1=>100
        ];
        $t = (object)[];
        foreach($o as $name =>$_ ){
            $t->$name=$o->$name;
        }
        $this->assertEquals($o,$t);
        $s = 'abcd';
        $items = [];
        foreach($s as $n =>$_ ){
            array_push($items,$s[$n]);
        }
        $this->assertEquals(['a','b','c','d'],$items);
    }
    public function testGenerics(){
        $ddee = $this->map();
        $dd = $ddee;
        $ccc = $ddee->name((object)[
            "name"=>1,
            "age"=>1
        ],"123");
        $cccww = $dd->name((object)[
            "name"=>1,
            "age"=>30
        ],666);
        $types = '333';
        $bds = (object)[
            "name"=>123,
            [types]=>1
        ];
        $this->assertEquals(123,$bds->name);
        $this->assertEquals(1,$bds->$types);
        $bds->$types=99;
        $this->assertEquals('string',gettype($this->avg("test")));
        $this->assertEquals("1.00",es\core\es_number_to_fixed(2));
        $this->assertEquals(30,$cccww->age);
        $this->assertEquals(99,$bds->$types);
        $obj = $this->getTestObject(true);
        $bd = $obj;
        $bs = $obj->getNamess(1);
        $this->assertEquals("1.00",Reflect::call(IndexTest::class,$bs,"toFixed",[2]));
        $bsint = $this->getTestGenerics('sssss');
        $bsstring = $this->getTestGenerics("ssss",'age');
        $bdss = $bsstring;
        $this->assertEquals('age',$bsstring);
        $obj=$this->getTestObject(true);
        $sss = $obj->getClassTestGenerics(1,1);
        $this->assertEquals([1,1],$sss);
    }
    private function getClassTestGenerics($name,$age=null){
        $a = [$age,$name];
        return $a;
    }
    private function getTestGenerics($name,string $age=null){
        $t = new IndexTest();
        return $age;
    }
    private function getTestObject($flag=null){
        $factor = function(){
            $o = (object)[];
            $o->test=new IndexTest();
            $o->name="test";
            return $o->test;
        }
        $o = call_user_func($factor);
        return $o;
    }
    public function getNamess($s){
        return $s;
    }
    public function testAwait(){
        (function(){
            $res = $this->loadRemoteData(1);
            $res->then(function($data){
                $this->assertEquals(['one',1],$data[0]);
                $this->assertEquals((object)[
                    "bss"=>['two',2],
                    "cc"=>['three',3]
                ],$data[1]);
                $this->assertEquals(['three',3],$data[1]);
            });
        })();
        (function(){
            $res = $this->loadRemoteData(2);
            $res->then(function($data){
                $this->assertEquals(['0',0],$data[0]);
                $this->assertEquals(['1',1],$data[1]);
                $this->assertEquals(['2',2],$data[2]);
                $this->assertEquals(['3',3],$data[3]);
                $this->assertEquals(['4',4],$data[4]);
            });
        })();
        $res = $this->loadRemoteData(3);
        $res->then(function($data){
            $this->assertEquals(['four',4],$data);
        });
        (function(){
            $res = $this->loadRemoteData(4);
            $res->then(function($data){
                $this->assertEquals([['five',5],['0',0],['1',1],['2',2],['3',3],['4',4]],$data);
            });
        })();
        $this->assertEquals(123,$this->getJson()->name);
    }
    public function getJson(){
        return (object)[
            "name"=>123
        ];
    }
    public function testTuple(){
        $data = $this->method("end",9);
        $this->assertEquals([['a','b'],[1],[1,1,'one'],['one',['one',1],'three','four',['end',9]]],$data);
    }
    private const len=5;
    private $currentIndex=0;
    public function next(){
        if(!($this->currentIndex < $this->len)){
            return (object)[
                "value"=>null,
                "done"=>true
            ];
        }
        $d = (object)[
            "value"=>$this->currentIndex++,
            "done"=>false
        ];
        return $d;
    }
    public function rewind(){
        $this->currentIndex=0;
    }
    public function restFun(...types){
        return $types;
    }
    public function tetObject(){
        $t = new IndexTest();
        $b = $t;
        $ii = (object)[
            "bb"=>$b
        ];
        return $ii->bb;
    }
    public function getIuuu(){
        $ii = $this->getPersonName();
        if(6){
            $ii=[];
        }
        $ii=true;
        return $ii;
    }
    public function getData(){
        $b = [];
        if(4){
            $b=[$this,"avg"];
        }
        $b=[$this,"avg"];
        $dd = function(){
            $bs = new Promise(function($resolve,$reject){
                setTimeout(function(){
                    call_user_func_array($resolve,[]);
                },100);
            });
            return $bs;
        }
        return $b;
    }
    public function fetchApi(string $name,Int $data,Int $delay){
        return new Promise(function($resolve,$reject){
            setTimeout(function(){
                call_user_func_array($resolve,[$name,$data]);
            },$delay);
        });
    }
    public function loadRemoteData2(){
        return $this->fetchApi("one",1,800);
    }
    public function loadRemoteData($type){
        if($type === 1){
            $a = $this->fetchApi("one",1,800);
            $bs = (object)[
                "bss"=>$this->fetchApi("two",2,500)
            ];
            $c = $this->fetchApi("three",3,900);
            $bs->cc=$c;
            return $a;
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
                array_push($list,$this->fetchApi($i + '',$i,100));
            }
            array_values($list);
            return $list;
        }
    }
    public function method(string $name,Int $age){
        parent::method($name,$age);
        $str = ["a","b"];
        $b = ["one",["one",1]];
        $cc = [1];
        $x = [1,1,'one'];
        array_push($b,'three');
        array_push($b,'four');
        $_V=[$name,$age];
        array_push($b,$_V);
        return [$str,$cc,$x,$b];
    }
    public function getPersonName(){
        return parent::getPersonName();
    }
    public function setPersonName(string $value){
        parent::setPersonName($value);
    }
    public function avg(string $yy){
        $ii = function(){
            return 1;
        }
        $bb = ['1'];
        function name(TestInterface $i){
            $b = $i;
            $i->avg(1);
            $i->method('',1);
            return $b;
        }
        $person = new Person();
        name($person);
        $bbb = name($person);
        name($person);
        $dd = [1,1,"2222","66666","8888"];
        array_push($dd,1);
        return $yy;
    }
    public function map(){
        $ddss = (object)[
            "name"=>function(object $c,$b){
                $id = $b;
                return $c;
            }
        ];
        return $ddss;
    }
    public function testArray(){
        $dd = [];
        $bb = (object)[
            "global"=>1,
            "private"=>1,
            "items"=>[]
        ];
        array_push($dd,1);
        $this->assertEquals([1],es\core\es_array_filter($dd,function($value,$key,$array){
            return true;
        },$this));
        $this->assertEquals([],es\core\es_array_filter($dd,function($value,$key,$array){
            return false;
        },$this));
        $tt = ["==="];
        $tt['index']=0;
        $tt['input']='============';
        $this->assertEquals($tt,es\core\es_string_math("============",'==='));
        $bds = new Array($bb->global);
        $this->assertEquals([null],$bds);
        $this->assertEquals($bb->global,$bds->length);
        $this->assertEquals([1],System::toArray($dd));
        $items = $bb->items;
        if($bb->global === 1){
            $items=$dd;
        }
        array_push($items,0);
        $bsdd = $items;
        array_push($items,1,9,6);
        $this->assertEquals([1,0,1,9,6],$items);
        $this->assertEquals($items=[],$items);
        array_push($items,9999);
        $this->assertEquals([9999],$items);
        $this->assertEquals(9999,array_pop($items));
        array_splice($items,0,0,[1,2,3]);
        $this->assertEquals([1,2,3],$items);
        $this->assertEquals([1,2],array_splice($items,0,2,9));
        $this->assertEquals([9,3],$items);
        $this->assertEquals(9,array_shift($items));
        array_unshift($items,0,5,6);
        $this->assertEquals([0,5,6,3],$items);
        $bs = null;
        $bs=$this->items;
        $bs=$dd;
        $this->assertEquals('array',gettype($dd));
        array_push($this->getArrItems(),999);
        $this->assertEquals([999],$this->items);
        $this->assertEquals([],$this->getArrItems());
        $da = $this->getArrItems();
        array_push($da,9999666);
        $this->assertEquals([9999666],$this->itemsB);
        $da=["hhhhhhhhhh"];
        $bdsu = $da;
        $this->assertEquals("hhhhhhhhhh",array_pop($da));
        $ui = System::addition(es\core\es_string_concat("==",'da','bs'),"=========");
        $this->assertEquals("==dabs=========",$ui);
        $n = 8 + 6;
        $this->assertEquals(14,$n);
        return $dd;
    }
    private function getArrItems(){
        $b = $this->items;
        if($b){
            $b=$this->itemsB;
        }
        return $b;
    }
    private $items=[];
    private $itemsB=[];
}