<?php
namespace com;
interface TestInterface{
	public function getPersonName():string;
	public function setPersonName(string $val);
	public function avg();
	public function method(string $name,int $age);
}