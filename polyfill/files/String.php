<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */

namespace \es\core;
use System;

function es_string_replace($target,$value){
    $index = strpos($target, $value);
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

function es_array_normalize($target){
    return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', function($matches) {
        if(function_exists("mb_convert_encoding")) {
            return mb_convert_encoding(pack("H*", $matches[1]), "UTF-8", "UCS-2BE");
        }else{
            return iconv('UCS-2', 'UTF-8', pack('H4', $matches[1]));
        }
    },$target);
}