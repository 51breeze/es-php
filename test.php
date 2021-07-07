<?php

$f = function(){
    $a =[];
    return [];
};

$a =  $f();
array_push($a , 1);
array_push($a , "6666");
array_push($a , "99999");



$aa = [
    99,
    "name",
    [9888]
];



array_push( $a , ...$aa);

print_r( $a  );









