<?php
namespace com;
interface TestInterface{
	public function getName():string;
	public function setName(string $val);
	public function avg();
	public function method(string $name,int $age);
}