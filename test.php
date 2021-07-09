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

}

$obj = new MyClass();


echo json_encode( new MyClass );


$obj->push(1,2,3);


echo print_r( $obj->list, true );


echo get_class( (object)[] );

echo "\r\n";


echo json_encode( (object)$obj->list,true ) ,   json_encode($obj), json_encode(false),  json_encode('lll') ;


echo "\r\n";

$fn = function(){
    echo "====";
};





echo gettype( $fn );





