<?php
namespace com;
require_once('es/core/Number.php');
require_once('es/core/String.php');
interface TestInterface{
	public function getPersonName():string;
	public function setPersonName(string $val);
	public function avg($a);
	public function method(string $name,int $age);
}