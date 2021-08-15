<?php
require_once('com/TestInterface.php');
use \com\TestInterface;
use \PHPUnit\Framework\TestCase;
class Person extends TestCase implements TestInterface{

	/**
	* @constructor Person
	*/
	public function __construct(){
		parent::__construct();
	}

	/**
	* @property addressName
	*/
	public $addressName = 'the Person properyt "addressName"';

	/**
	* @property _name
	*/
	private $_name = '';

	/**
	* @property _type
	*/
	private $_type = null;

	/**
	* @getter target
	*/
	public function getTarget():Person{
		return $this;
	}

	/**
	* @method setType
	*/
	public function setType($a){
		return $a;
	}

	/**
	* @method method
	*/
	public function method(string $name,int $age){
		$b = ["",["1",1]];
		array_push($b,'1');
		$_V = ['1',1];
		array_push($b,$_V);
		$this->getTarget()->address();
		return "sssss";
	}

	/**
	* @getter personName
	*/
	public function getPersonName():string{
		return $this->_name;
	}

	/**
	* @setter personName
	*/
	public function setPersonName(string $val){
		$this->_name = $val;
	}

	/**
	* @method avg
	*/
	public function avg(){
	
	}

	/**
	* @method address
	*/
	private function address(){
	
	}

	/**
	* @method addressNamesss
	*/
	protected function addressNamesss(){
	
	}
}