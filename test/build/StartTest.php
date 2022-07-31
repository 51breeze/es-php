<?php
include_once("./Base.php");
include_once("./es/core/Array.php");
include_once("./es/core/System.php");
include_once("./es/core/Object.php");
include_once("./es/core/Reflect.php");
include_once("./es/core/String.php");
include_once("./es/core/RegExp.php");
include_once("./es/core/Number.php");
include_once("./Types.php");
include_once("./es/core/Date.php");
use Base;
use Array;
use System;
use Object;
use Reflect;
use String;
use RegExp;
use Number;
use Types;
use Date;
public class StartTest extends Base{
    function __construct(){
        parent::__construct();
    }
    private $items=[];
    private $list=[];
    public function testArray(){
        $items = $this->items;
        $flag = true;
        if($flag){
            $items=$this->list;
        }
        array_push($items,1);
        array_push($items,2,3,4);
        $this->assertEquals(4,$items->length);
        $this->assertEquals($items,$this->list);
        array_push($this->items,5,6,7);
        $this->assertEquals(3,$this->items->length);
        $bb = [];
        $this->addArray($bb,9);
        $this->assertEquals(1,$bb->length);
        $_V=[];
        $this->addArray($_V,6);
        $bs = $this->ccArray();
        array_push($bs,6);
        $this->assertEquals($bs,$this->arrItems);
        $bs=[];
        $this->pushArray($bs,9);
        $this->pushArray($bs,1);
        $this->assertEquals($bs,[9,1]);
        $newBs = es\core\es_array_map($bs,function($val,$index){
            return $val;
        });
        $this->assertEquals($bs,$newBs);
        array_push($newBs,5,12,0,3,3,1);
        $dd = es\core\es_array_sort($newBs);
        $this->assertEquals([0,1,1,12,3,3,5,9],$dd);
        $this->assertEquals($dd,$newBs);
        $af = [];
        array_push($af,1,6,0,9,'a',"B","A");
        es\core\es_array_sort($af);
        $this->assertEquals([0,1,6,9,'A','B','a'],$af);
        $this->assertEquals([0,1,6,9],es\core\es_array_filter($af,function($value){
            return gettype($value) === 'number';
        }));
        $this->assertEquals([0,1,6,9,"A","B",'a',10,11,12,13,'15',[16]],es\core\es_array_concat($af,10,[11,12],13,'15',[[16]]));
        $this->assertEquals("16ABa",es\core\es_array_flat_reduce($af,function($all,$value){
            return System::addition($all,$value);
        }));
        $this->assertEquals("aBA9610",es\core\es_array_flat_reduce_right($af,function($all,$value){
            return System::addition($all,$value);
        }));
        $searchItem = 'B';
        $this->assertEquals("B",es\core\es_array_find($af,function($val){
            return $val === $searchItem;
        }));
        $this->assertEquals(6,es\core\es_array_find($af,function($val){
            return $val > 5;
        }));
        $this->assertEquals(5,es\core\es_array_find_index($af,function($val){
            return $val === 'B';
        }));
        $this->assertEquals([0,1,2,[3,4]],es\core\es_array_flat($_AR,0));
        $this->assertEquals([0,1,2,3,4],es\core\es_array_flat($_AR));
        $this->assertEquals([0,1,2,[3,4]],es\core\es_array_flat($_AR,2));
        $this->assertEquals([0,1,2,3,4],es\core\es_array_flat($_AR,3));
        $this->assertEquals([0,1,2,3,4],es\core\es_array_flat_map($_AR,function($val){
            return $val;
        }));
        $this->assertEquals([0,1,2,[[3,4]]],es\core\es_array_flat_map($_AR,function($val){
            return $val;
        }));
        $this->assertFalse(es\core\es_array_every($_AR,function($val){
            return gettype($val) === 'string';
        }));
        $this->assertTrue(es\core\es_array_every($_AR,function($val){
            return gettype($val) === 'number';
        }));
        $this->assertTrue(es\core\es_array_some($_AR,function($val){
            return gettype($val) === 'string';
        }));
        $this->assertTrue(in_array('a',$_AR));
        $this->assertEquals([0,1,2,3,4],array_keys($_AR));
        $this->assertEquals([1,2,3,'a','b'],array_values($_AR));
        $this->assertEquals([1,2,6,6,'ssss'],es\core\es_array_fill($_AR,6,2,4));
        $this->assertEquals([2,1],array_reverse($_AR));
        $months = ['Jan','March','April','June'];
        $this->assertEquals([],array_splice($months,1,0,'Feb'));
        $this->assertEquals(["Jan","Feb","March","April","June"],$months);
        $this->assertEquals(["Jan"],array_splice($months,0,1,'Feb'));
        $this->assertEquals(["Feb","Feb","March","April","June"],$months);
        $this->assertEquals("Feb, Feb, March, April, June",es\core\es_object_to_string($months));
        $this->assertEquals("Feb- Feb- March- April- June",implode('- ',$months));
        $this->assertEquals(["April","June","March","April","June"],es\core\es_array_copy_within($months,0,3,5));
        $this->assertEquals(["d","b","c","d","e"],es\core\es_array_copy_within($_AR,0,3,4));
        $this->assertTrue(es\core\es_object_has_own_property($months,2));
        $this->assertTrue(es\core\es_object_property_is_enumerable($months,2));
        $this->assertFalse(is_array(''));
        $this->assertTrue(is_array(['']));
        $ip = [];
        Reflect::apply([Reflect::class,"apply"],$ip,[0,0,2,3,5]);
        $this->assertEquals([2,3,5],$ip);
        array_splice($ip,1,1,[2,3,6,5]);
        $this->assertEquals([2,2,3,6,5,5],$ip);
        if($ip){
            $ip=$this->arrItems;
        }
        array_splice($ip,0,1,1);
        $this->assertEquals([1],$ip);
        $ds = [1,2,3];
        $_splice = System::bind("array_splice",$ds);
        $this->assertEquals([1,2],call_user_func_array($_splice,0,2));
        $this->assertEquals([3],$ds);
        $testObj = (object)[
            "name"=>66
        ];
        $_splice2 = System::bind("array_splice",$testObj);
        $_push = System::bind("array_push",$testObj);
        $s = call_user_func_array($_splice2,0,1,3,6,9);
        call_user_func_array($_push,"Jun");
        $this->assertEquals([],$s);
        $this->assertEquals((object)[
            0=>3,
            1=>6,
            2=>9,
            3=>"Jun",
            "length"=>4,
            "name"=>66
        ],$testObj);
        $s=call_user_func_array($_splice2,0,2);
        $this->assertEquals((object)[
            0=>9,
            1=>"Jun",
            "length"=>2,
            "name"=>66
        ],$testObj);
        $this->assertEquals([3,6],$s);
        $this->assertEquals(6,Reflect::apply("array_pop",$s));
        $this->assertEquals(3,array_pop($s));
    }
    public function addArray(array &$a,$b){
        array_push($a,$b);
    }
    private const arrItems=[];
    public function ccArray(){
        $b = $this->arrItems;
        return $b;
    }
    public function pushArray(array &$a,$b){
        array_push($a,$b);
    }
    public function testString(){
        $str = 'aab';
        $this->assertEquals(es\core\es_string_replace($str,'a','A'),"Aab");
        $this->assertEquals(es\core\es_string_index_of($str,'b'),2);
        $this->assertEquals(es\core\es_string_char_at($str,0),'a');
        $this->assertEquals(es\core\es_string_char_code_at($str,0),97);
        $this->assertEquals(es\core\es_string_char_code_at($str,2),98);
        $obj = ['b'];
        $obj['index']=2;
        $obj['input']='aab';
        $this->assertEquals(es\core\es_string_math($str,'b'),$obj);
        $this->assertEquals($obj['index'],2);
        $this->assertEquals("" + ($str) + "AAB",es\core\es_string_concat($str,'AAB'));
        $this->assertEquals(0,es\core\es_string_locale_compare($str,'aab'));
        $this->assertEquals(1,es\core\es_string_locale_compare($str,'aaa'));
        $this->assertEquals(-1,es\core\es_string_locale_compare($str,'aac'));
        $this->assertEquals('AAB',mb_strtoupper($str));
        $this->assertEquals('aab',mb_strtolower('AAB'));
        $this->assertEquals('AAB',trim('AAB  '));
        $this->assertEquals(['A','A','B'],explode('.','A.A.B'));
        $this->assertEquals('def',es\core\es_string_slice('abcdefg',3,6));
        $str2 = 'The quick brown fox jumps over the lazy dog.';
        $this->assertEquals('the lazy dog.',es\core\es_string_slice($str2,31));
        $this->assertEquals('quick brown fox',es\core\es_string_slice($str2,4,19));
        $this->assertEquals('dog.',es\core\es_string_slice($str2,-4));
        $this->assertEquals('lazy',es\core\es_string_slice($str2,-9,-5));
        $chinese = '中中国人民解放军';
        $this->assertEquals(8,$chinese->getLength());
        $this->assertEquals(3,es\core\es_string_index_of($chinese,"人"));
        $this->assertEquals(3,es\core\es_string_last_index_of($chinese,"人"));
        $this->assertEquals("全" + ($chinese) + "",es\core\es_string_replace($chinese,'中','全中'));
        $mixed = "中国人A民bc解De放军FFFDDdd";
        $this->assertEquals(19,$mixed->getLength());
        $this->assertEquals(12,es\core\es_string_index_of($mixed,"F"));
        $this->assertEquals(14,es\core\es_string_last_index_of($mixed,"F"));
        $this->assertEquals("中国人A民bc解De放军FFFdddd",es\core\es_string_replace($mixed,'DD','dd'));
        $this->assertEquals("民bc解",mb_substr($mixed,4,4));
        $paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
        $regex = new RegExp("/[^\w\s]/g");
        $this->assertEquals(43,es\core\es_string_search($paragraph,$regex));
        $this->assertEquals('.',$paragraph[es\core\es_string_search($paragraph,$regex)]);
        $this->setNames1("Ye Jun");
        $this->assertEquals('Ye Jun',$this->getNames1());
    }
    public function testObject(){
        $name = "Jun Ye";
        $o = (object)[
            "name"=>$name
        ];
        $this->assertEquals((object)[
            "name"=>"Jun Ye"
        ],$o);
        $this->assertEquals((object)[
            "name"=>"ssss",
            "age"=>30
        ],());
        $this->assertEquals($this,Reflect::call(StartTest::class,Reflect::call(StartTest::class,$this,"call",[]),"getObject",[]));
        $fn = [$this,"getObject"];
        $this->assertEquals($this,call_user_func($fn));
    }
    public function getObject($name=null){
        return $this;
    }
    public function testNumber(){
        $num = 5.123456;
        $this->assertEquals(5,es\core\es_number_to_precision(1));
        $num=77.1234;
        $this->assertEquals(8e+1,es\core\es_number_to_precision(1));
        $nums = 999999;
        $bf = System::bind("es\\core\\es_number_to_precision",$nums);
        $this->assertEquals(999999,call_user_func_array($bf,6));
        $df = 1.236999999;
        $bfs = System::bind("es\\core\\es_number_to_exponential",$df);
        $this->assertEquals(1.237000e+0,call_user_func_array($bfs,6));
    }
    public function testEnum(){
        $this->assertEquals(0,Types::ADDRESS);
        $this->assertEquals(1,Types::NAME);
        $this->assertEquals(5,$Type->address);
        $this->assertEquals(6,$Type->name);
    }
    public function testNewObject(){
        $date = new Date('2021/8/14 14:59:59');
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
    public function setNames1(string $val){
        $this->_names=$val;
    }
    public function getNames(){}
    public function setNames(){}
}