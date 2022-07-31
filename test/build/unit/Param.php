<?php
public class Param{
    function __construct(){}
    public function start(){
        $this->assertEquals(7,$en->age);
        $this->assertEquals('A',$t->name);
        $b = $en->age;
        $this->assertEquals(6,$this->getList($en,[9,5]));
        $this->ave(2.3660);
    }
    public function getList({name1000=>name1000,age=>$age=9},[$index,$id=20]){
        $args = [$index,$id];
        $this->assertEquals($args,$this->call(...$args));
        return name1000;
    }
    public function call($i,$b){
        return [$i,$b];
    }
    public function ave($age){
        return $age;
    }
}