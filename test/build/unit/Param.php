<?php
namespace unit;
require_once( __DIR__.'./../es/core/Number.php' );
use \PHPUnit\Framework\TestCase;
/**
* @class Param
* @inherit \PHPUnit\Framework\TestCase
*/
class Param extends TestCase{

	/**
	* @method start
	*/
	public function start(){
		$en=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$en[$en->name1000=6]='name1000';
		$en[$en->age=7]='age';
		$t=new \ArrayObject([], \ArrayObject::STD_PROP_LIST | \ArrayObject::ARRAY_AS_PROPS);
		$t[$t->name='A']='name';
		$t[$t->A='c']='A';
		$this->assertEquals(7,$en->age);
		$this->assertEquals('A',$t->name);
		$this->assertEquals(6,$this->getList($en,[9,5]));
		$this->ave(2.3660);
	}

	/**
	* @method getList
	*/
	public function getList(object $_s,array $_s1){
		$_s = $_s ?: new \stdClass;
		$_s1 = $_s1 ?: [];
		$name1000 = $_s->name1000;
		$age = $_s->age ?? 9;
		$index = $_s1[0];
		$id = $_s1[1] ?? 20;
		$args = [$index,$id];
		$this->assertEquals($args,$this->call(...$args));
		return $name1000;
	}

	/**
	* @method call
	*/
	public function call($i,$b){
		return [$i,$b];
	}

	/**
	* @method ave
	*/
	public function ave($age){
		return $age;
	}
}