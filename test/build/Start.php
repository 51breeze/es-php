<?php
use \PHPUnit\Framework\TestCase;
class Start extends TestCase{
	public function __construct(){
		parent::__construct();
	}
	private $items = [];
	private $list = [];
	public function testArray(){
		$items = &$this->items;
		array_push($items,1);
		array_push($items,2,3,4);
		$this->assertEquals(4,count($items),"error");
		$this->assertEquals($items,$this->items,"error");
	}
}