<?php
namespace com;
require_once( __DIR__.'./../es/core/Number.php' );
require_once( __DIR__.'./../es/core/String.php' );
interface TestInterface{
	public function getPersonName():string;
	public function setPersonName(string $val);
	public function avg($a);
	public function method(string $name,int $age);
}