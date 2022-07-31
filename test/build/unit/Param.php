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
    public function getList(object $_s0,array $_s1){
        $_s0=$_s0 ?: new \stdClass();
        $name1000=$_s0->name1000 ?? null;
        $age=$_s0->age ?? 9;
        $_s1=$_s1 ?: [];
        $index=$_s1[0] ?? null;
        $id=$_s1[1] ?? 20;
        $args = [$index,$id];
        $this->assertEquals($args,$this->call(...$args));
        return $name1000;
    }
    public function & call($i,$b){
        return [$i,$b];
    }
    public function ave($age){
        return $age;
    }
}