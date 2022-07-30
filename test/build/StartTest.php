<?php;
include_once("./Base.php");
include_once("./es/core/System.php");
include_once("./es/core/Array.php");
include_once("./es/core/Object.php");
include_once("./es/core/Reflect.php");
include_once("./Types.php");
include_once("./es/core/Date.php");
use Base;
use System;
use Array;
use Object;
use Reflect;
use Types;
use Date;
public class StartTest extends Base{
    function __construct(){
        parent->();
    }
    private $items=[];
    private $list=[];
    public function testArray(){
        $items = $this->$items;
        $flag = true;
        if($flag){
            $items=$this->list;
        }
        $items->push(1);
        $items->push(2,3,4);
        $this->assertEquals(4,$items->length);
        $this->assertEquals($items,$this->list);
        $this->$items->push(5,6,7);
        $this->assertEquals(3,$this->$items->length);
        $bb = [];
        $this->addArray($bb,9);
        $this->assertEquals(1,$bb->length);
        $this->addArray([],6);
        $bs = $this->ccArray();
        $bs->push(6);
        $this->assertEquals($bs,$this->arrItems);
        $bs=[];
        $this->pushArray($bs,9);
        $this->pushArray($bs,1);
        $this->assertEquals($bs,[9,1]);
        $newBs = $bs->map(function($val,$index){
            return $val;
        });
        $this->assertEquals($bs,$newBs);
        $newBs->push(5,12,0,3,3,1);
        $dd = $newBs->sort();
        $this->assertEquals([0,1,1,12,3,3,5,9],$dd);
        $this->assertEquals($dd,$newBs);
        $af = [];
        $af->push(1,6,0,9,'a',"B","A");
        $af->sort();
        $this->assertEquals([0,1,6,9,'A','B','a'],$af);
        $this->assertEquals([0,1,6,9],$af->filter(function($value){
            return typeof $value === 'number';
        }));
        $this->assertEquals([0,1,6,9,"A","B",'a',10,11,12,13,'15',[16]],$af->concat(10,[11,12],13,'15',[[16]]));
        $this->assertEquals("16ABa",$af->reduce(function($all,$value){
            return System::addition($all,$value);
        }));
        $this->assertEquals("aBA9610",$af->reduceRight(function($all,$value){
            return System::addition($all,$value);
        }));
        $searchItem = 'B';
        $this->assertEquals("B",$af->find(function($val){
            return $val === $searchItem;
        }));
        $this->assertEquals(6,$af->find(function($val){
            return $val > 5;
        }));
        $this->assertEquals(5,$af->findIndex(function($val){
            return $val === 'B';
        }));
        $this->assertEquals([0,1,2,[3,4]],[0,1,2,[3,4]]->flat(0));
        $this->assertEquals([0,1,2,3,4],[0,1,2,[3,4]]->flat());
        $this->assertEquals([0,1,2,[3,4]],[0,1,2,[[[3,4]]]]->flat(2));
        $this->assertEquals([0,1,2,3,4],[0,1,2,[[[3,4]]]]->flat(3));
        $this->assertEquals([0,1,2,3,4],[0,1,2,[3,4]]->flatMap(function($val){
            return $val;
        }));
        $this->assertEquals([0,1,2,[[3,4]]],[0,1,2,[[[3,4]]]]->flatMap(function($val){
            return $val;
        }));
        $this->assertFalse(['a','b',1]->every(function($val){
            return typeof $val === 'string';
        }));
        $this->assertTrue([1,2,3]->every(function($val){
            return typeof $val === 'number';
        }));
        $this->assertTrue([1,2,3,'a','b']->some(function($val){
            return typeof $val === 'string';
        }));
        $this->assertTrue([1,2,3,'a','b']->includes('a'));
        $this->assertEquals([0,1,2,3,4],[1,2,3,'a','b']->keys());
        $this->assertEquals([1,2,3,'a','b'],[1,2,3,'a','b']->values());
        $this->assertEquals([1,2,6,6,'ssss'],[1,2,3,4,'ssss']->fill(6,2,4));
        $this->assertEquals([2,1],[1,2]->reverse());
        $months = ['Jan','March','April','June'];
        $this->assertEquals([],$months->splice(1,0,'Feb'));
        $this->assertEquals(["Jan","Feb","March","April","June"],$months);
        $this->assertEquals(["Jan"],$months->splice(0,1,'Feb'));
        $this->assertEquals(["Feb","Feb","March","April","June"],$months);
        $this->assertEquals("Feb, Feb, March, April, June",$months->toString());
        $this->assertEquals("Feb- Feb- March- April- June",$months->join('- '));
        $this->assertEquals(["April","June","March","April","June"],$months->copyWithin(0,3,5));
        $this->assertEquals(["d","b","c","d","e"],['a','b','c','d','e']->copyWithin(0,3,4));
        $this->assertTrue($months->hasOwnProperty(2));
        $this->assertTrue($months->propertyIsEnumerable(2));
        $this->assertFalse(Array::isArray(''));
        $this->assertTrue(Array::isArray(['']));
        $ip = [];
        []->splice->call->call->call($ip,0,0,2,3,5);
        $this->assertEquals([2,3,5],$ip);
        $ip->splice(1,1,2,3,6,5);
        $this->assertEquals([2,2,3,6,5,5],$ip);
        if($ip){
            $ip=$this->arrItems;
        }
        $ip->splice(0,1,1);
        $this->assertEquals([1],$ip);
        $ds = [1,2,3];
        $_splice = []->splice->bind($ds);
        $this->assertEquals([1,2],$_splice(0,2));
        $this->assertEquals([3],$ds);
        $testObj = (object){
            name:66
        }
        $_splice2 = []->splice->bind($testObj);
        $_push = []->push->bind($testObj);
        $s = $_splice2(0,1,3,6,9);
        $_push("Jun");
        $this->assertEquals([],$s);
        $this->assertEquals((object){
            0:3,
            1:6,
            2:9,
            3:"Jun",
            length:4,
            name:66
        },$testObj);
        $s=$_splice2(0,2);
        $this->assertEquals((object){
            0:9,
            1:"Jun",
            length:2,
            name:66
        },$testObj);
        $this->assertEquals([3,6],$s);
        $this->assertEquals(6,[]->pop->call($s));
        $this->assertEquals(3,$s->pop());
    }
    public function addArray($a,$b){
        $a->push($b);
    }
    private $arrItems=[];
    public function ccArray(){
        $b = $this->arrItems;
        return $b;
    }
    public function pushArray($a,$b){
        $a->push($b);
    }
    public function testString(){
        $str = 'aab';
        $this->assertEquals($str->replace('a','A'),"Aab");
        $this->assertEquals($str->indexOf('b'),2);
        $this->assertEquals($str->charAt(0),'a');
        $this->assertEquals($str->charCodeAt(0),97);
        $this->assertEquals($str->charCodeAt(2),98);
        $obj = ['b'];
        $obj['index']=2;
        $obj['input']='aab';
        $this->assertEquals($str->match('b'),$obj);
        $this->assertEquals($obj['index'],2);
        $this->assertEquals("" + ($str) + "AAB",$str->concat('AAB'));
        $this->assertEquals(0,$str->localeCompare('aab'));
        $this->assertEquals(1,$str->localeCompare('aaa'));
        $this->assertEquals(-1,$str->localeCompare('aac'));
        $this->assertEquals('AAB',$str->toLocaleUpperCase());
        $this->assertEquals('aab','AAB'->toLocaleLowerCase());
        $this->assertEquals('AAB','AAB  '->trim());
        $this->assertEquals(['A','A','B'],'A.A.B'->split('.'));
        $this->assertEquals('def','abcdefg'->slice(3,6));
        $str2 = 'The quick brown fox jumps over the lazy dog.';
        $this->assertEquals('the lazy dog.',$str2->slice(31));
        $this->assertEquals('quick brown fox',$str2->slice(4,19));
        $this->assertEquals('dog.',$str2->slice(-4));
        $this->assertEquals('lazy',$str2->slice(-9,-5));
        $chinese = '中中国人民解放军';
        $this->assertEquals(8,$chinese->getLength());
        $this->assertEquals(3,$chinese->indexOf("人"));
        $this->assertEquals(3,$chinese->lastIndexOf("人"));
        $this->assertEquals("全" + ($chinese) + "",$chinese->replace('中','全中'));
        $mixed = "中国人A民bc解De放军FFFDDdd";
        $this->assertEquals(19,$mixed->getLength());
        $this->assertEquals(12,$mixed->indexOf("F"));
        $this->assertEquals(14,$mixed->lastIndexOf("F"));
        $this->assertEquals("中国人A民bc解De放军FFFdddd",$mixed->replace('DD','dd'));
        $this->assertEquals("民bc解",$mixed->substr(4,4));
        $paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
        $regex = /[^\w\s]/g;
        $this->assertEquals(43,$paragraph->search($regex));
        $this->assertEquals('.',$paragraph[$paragraph->search($regex)]);
        $this->setNames1()("Ye Jun");
        $this->assertEquals('Ye Jun',$this->getNames1());
    }
    public function testObject(){
        $name = "Jun Ye";
        $o = (object){
            $name:$name
        }
        $this->assertEquals((object){
            name:"Jun Ye"
        },$o);
        $this->assertEquals((object){
            name:"ssss",
            age:30
        },Object::assign($o,(object){
            age:30,
            name:"ssss"
        }));
        $this->assertEquals($this,Reflect::call(StartTest::class,Reflect::call(StartTest::class,$this,"call",[]),"getObject",[]));
        $fn = $this->getObject;
        $this->assertEquals($this,$fn());
    }
    public function getObject($name){
        return $this;
    }
    public function testNumber(){
        $num = 5.123456;
        $this->assertEquals(5,$num->toPrecision(1));
        $num=77.1234;
        $this->assertEquals(8e+1,$num->toPrecision(1));
        $nums = 999999;
        $bf = $nums->toPrecision->bind($nums);
        $this->assertEquals(999999,$bf(6));
        $df = 1.236999999;
        $bfs = $nums->toExponential->bind($df);
        $this->assertEquals(1.237000e+0,$bfs(6));
    }
    public function testEnum(){
        $this->assertEquals(0,Types::ADDRESS);
        $this->assertEquals(1,Types::NAME);
        $this->assertEquals(5,$Type->address);
        $this->assertEquals(6,$Type->name);
    }
    public function testNewObject(){
        $date = new Date::class('2021/8/14 14:59:59');
        $this->assertEquals(2021,$date->getFullYear());
        $this->assertEquals(7,$date->getMonth());
        $this->assertEquals(14,$date->getDate());
        $this->assertEquals(6,$date->getDay());
        $this->assertEquals(14,$date->getHours());
        $this->assertEquals(59,$date->getMinutes());
        $this->assertEquals(59,$date->getSeconds());
        $this->assertEquals(1628924399000,$date->getTime());
        $this->assertEquals("Sat Aug 14 2021 14:59:59 PRC+0800",$date->toString());
    }
    public function call(){
        return $this;
    }
    public function getNames1(){
        return $this->_names;
    }
    private $_names='test';
    public function setNames1($val){
        $this->_names=$val;
    }
    public function getNames(){}
    public function setNames(){}
}