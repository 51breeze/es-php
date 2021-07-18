<?php
use \com\TestInterface;
class Person implements TestInterface{
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
		return $a;
	}
	public function method(string $name,int $age){
		$b = ["",["1",1]];
		array_push($b,'1');
		array_push($b,['1',1]);
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