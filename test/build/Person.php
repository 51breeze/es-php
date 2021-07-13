<?php
use \com\TestInterface;
class Person implements \com\TestInterface{
	public function __construct(string $name){
		$this->_name = $name;
	}
	public $addressName = 'the Person properyt "addressName"';
	private $_name = '';
	private $_type = null;
	public function getTarget():Person{
		return $this;
	}
	public function setType($a){
		$this->_type = $a;
		return $a;
	}
	public function method(string $name,int $age){
		$str = ["a","1"];
		$b = ["",["1",1]];
		$cc = [1];
		$x = [1,1,'2222',(object)[]];
		array_push($b,'1');
		$b = $b;
		array_push($b,['1',1]);
		$b = $b;
		$c = -1968;
		$bs = 22.366;
		$bss = 22.366;
		$bssd = -22.366;
		$this->getTarget()->address();
		return "sssss";
	}
	public function getName():string{
		return $this->_name;
	}
	public function setName(string $val):string{
		$this->_name = $val;
	}
	public function avg(){
	
	}
	private function address(){
	
	}
	protected function addressNamesss(){
	
	}
}