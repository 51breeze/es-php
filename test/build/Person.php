<?php
include_once("./com/TestInterface.php");
use TestInterface;
public class Person implements TestInterface{
    public function __construct(){
        parent::__construct();
    }
    public $addressName="the Person properyt \"addressName\"";
    private $_name='';
    private $_type=null;
    public function getTarget(){
        return $this;
    }
    public function setType($a){
        $this->_type=$a;
        return $a;
    }
    public function method($name,$age){
        $str = ["a","1"];
        $b = ["",["1",1]];
        $cc = [1];
        $x = [1,1,'2222',(object)[]];
        array_push($b,'1');
        array_push($b,['1',1]);
        $c = -1968;
        $bs = 22.366;
        $bssd = -22.366;
        $this->getTarget()->address();
        $this->getPersonName();
        return "sssss";
    }
    public function getPersonName(){
        return $this->_name;
    }
    public function setPersonName($val){
        $this->_name=$val;
    }
    public function avg($a){}
    private function address(){}
    protected function addressNamesss(){}
}