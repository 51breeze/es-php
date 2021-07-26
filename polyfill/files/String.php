<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
////[namespace]
////[require]
////[reference]

function es_string_index($target,$value){
    $index = mb_strpos($target, $value);
    return $index === false ? -1 : $index;
}

function es_string_last_index($target,$value){
    $index = mb_strrpos($target, $value);
    return $index === false ? -1 : $index;
}

function es_string_substring($target,$start=0, $end=null){
    $len = mb_strlen($target);
    if( $end === null ){
        $end = mb_strlen($len);
    }
    $start = is_numeric( $start ) ? min($len,max($start,0)) : 0;
    $end = is_numeric( $end ) ? min($len,max($end,0)) : 0;
    if($start > $end){
        return mb_substr($target, $end, $start);
    }
    return mb_substr($target,$start, $end);
}

function es_string_slice($target, $start=0, $end=null){
    $len = mb_strlen($target);
    if( $end === null ){
        $end =  $len;
    }
    if( $end < 0 ){
        $end = $len + $end;
    }
    if( $start < 0 ){
        $start = $len + $start;
    }
    $start = max( min($start,$len), 0);
    $end = max( min($end,$len), 0);
    return mb_substr($target, $start, $end-$start);
}

function es_string_normalize($target){
    return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', function($matches) {
        if(function_exists("mb_convert_encoding")) {
            return mb_convert_encoding(pack("H*", $matches[1]), "UTF-8", "UCS-2BE");
        }else{
            return iconv('UCS-2', 'UTF-8', pack('H4', $matches[1]));
        }
    },$target);
}

function es_string_replace($target,$search,$replacement=''){
    if( $search instanceof \es\core\RegExp ){
        return $search->replace($target, $replacement);
    }else {
        $index = mb_strpos($target,$search);
        if( $index === false )return $target;
        $left = mb_substr($target, 0, $index);
        $right = mb_substr($target, $index+mb_strlen($search) );
        if( is_callable($replacement) ){
            return $left . $replacement( $search, $index, $target ) . $right;
        }
        return $left . $replacement . $right;
    }
}

function es_string_replace_all($target,$search,$replacement=''){
    if( $search instanceof \es\core\RegExp ){
        return $search->replaceAll($target, $replacement);
    }else if(is_callable($replacement)) {
        $regExp = new \es\core\RegExp( $search );
        return $regExp->replaceAll($target, $replacement);
    }else{
        return str_replace($search, $replacement, $target);
    }
}