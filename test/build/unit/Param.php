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
    public function getList(object $_s,array $_s){
        $_s=$_s ?: new \stdClass()$name1000=$_s->name1000$age=$_s->age ?? 9$_s=$_s ?: []$index=$_s[]$id=$_s[1] ?? 20
        $args = [$index,$id];
        $this->assertEquals($args,$this->call(...$args));
        return $name1000;
    }
    public function call($i,$b){
        return [$i,$b];
    }
    public function ave($age){
        return $age;
    }
}