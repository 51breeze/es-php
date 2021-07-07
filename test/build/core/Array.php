<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */

namespace \es\core;
use System;

function es_array_filter($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    return array_filter($array,function($value,$key)use(&$array,&$callback){
        return $callback($value,$key,$array);
    },ARRAY_FILTER_USE_BOTH);
}

function es_array_find_index($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    foreach( $array as $key=>$value){
       if( $callback($value,$key,$array) ){
           return $key;
       }
    }
    return -1;
}

function es_array_find($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    foreach( $array as $key=>$value){
       if( $callback($value,$key,$array) ){
           return $value;
       }
    }
    return null;
}

function es_array_every($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    foreach( $array as $key=>$value){
       if( !$callback($value,$key,$array) ){
           return false;
       }
    }
    return true;
}

function es_array_some($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    foreach( $array as $key=>$value){
       if( $callback($value,$key,$array) ){
           return true;
       }
    }
    return false;
}

function es_array_map($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    return array_map(function($value,$key)use(&$array,&$callback){
        $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
        return $callback($value,$key,$array);
    },$array);
}

function es_array_search_index($array, $value){
    $result = array_search($value,$array);
    return $result === false ? -1 : $result;
}

function es_array_concat($array, ...$items){
    array_push($array, ...$items);
    return $array;
}

function es_array_fill($array, $value, $start=0, $end=0){
    $len = count($array);
    $start = $start < 0 ? max($start+$len, 0) : min($start,$len);
    $end   = $end < 0 ?  max($end+$len, 0) : min($end,$len);
    while ($start < $end) {
        $array[ $start ] = $value;
        $start++;
    }
    return $array;
}

function es_array_foreach($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    array_walk($array,$callback,$array);
}

function es_array_flat($array, $depth=1){
    return es_array_reduce($array, function($all, $val){
        $result = (array)(is_array($val) ? es_array_flat($val, $depth - 1) : $val);
        array_push($all, ...$result);
        return $all;
    },[]);
}

function es_array_flat_map($array, $callback, $thisArg=null){
    $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;
    return es_array_reduce( $array, function($all, $val, $index, $array){
        $result = (array)$callback($val,$index,$array);
        array_push($all, ...$result);
        return $all;
    },[]);
}

function es_array_reduce($array, $callback, $initial=null){
    $len = count( $array );
    $k = 0;
    $value = $initial;
    if ( $initial === null ) {
      while ( $k < $len && !isset( $array[$k] ) ) {
         $k++;
      }
      if ( $k >= $len) {
        throw new \TypeError( 'Reduce of empty array with no initial value' );
      }
      $value = $array[ $k++ ];
    }

    while ($k < $len) {
      if ( isset( $array[ $k ] ) ) {
        $value = $callback( $value, $array[$k], $k, $array);
      }
      $k++;
    }
    return $value;
}

function es_array_reduce_right($array, $callback, $initial=null){
    $len = count( $array );
    $k = $len-1;
    $value = $initial;
    if ( $initial === null ) {
        while ( $k >= 0 && !isset( $array[$k] ) ) {
            $k--;
        }
        if ( $k < 0 ) {
            throw new \TypeError( 'Reduce of empty array with no initial value' );
        }
        $value = $array[ $k-- ];
    }

    while ($k >= 0) {
        if ( isset( $array[ $k ] ) ) {
            $value = $callback( $value, $array[$k], $k, $array);
        }
        $k--;
    }
    return $value;
}

function es_array_sort($array, $callback){
    if( is_callable($callback) ){
        usort($array, $callback);
        return $array;
    }
    sort( $array, SORT_STRING);
    return $array;
}

function es_array_new( ...$args ){
    if( count($args) === 1 && is_numeric($args[0]) ){
        return array_fill(0, $args[0], null);
    }
    return array_slice((array)$args,0);
}
