<?php

class MyClass{


    private $oo = 123;
    public  $name = "9999";

    public $list = [];

    public function method(){

    }

    public function push( ...$items ){
       $a = &$this->list;

        array_push($a , ...$items);

    }

    public function &getList(){
        $a = $this->list;
        return $this->list;
    }

}

$obj = new MyClass();

$a = &$obj->list;
array_push($a , 1,2,3);

$aa = ($r = &$a);


$dd = $obj->list;

array_push($r , 9,2,3);
$aa = $r;

switch( $aa ){

    case $r : 
        var_dump( $r === $aa );

}
print_r(  $r );

print_r(  $aa );







