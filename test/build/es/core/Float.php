<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
namespace es\core;
require_once('es/core/Number.php');

/**
 * @name toPrecision
 * @bind target
 */
function es_number_to_precision($target, $decimals=null){
    if( !($decimals > 0) )return strval($target);
    $result = sprintf('%.'.($decimals-1).'e',$target);
    if( strlen(strval(round($target))) >  $decimals){
        return $result;
    }
    return strval(floatval($result));
}

/**
 * @name toFixed
 * @bind target
 */
function es_number_to_fixed($target,$decimals=0){
    return floatval( number_format($target,$decimals,'.','') );
}

/**
 * @name toExponential
 * @bind target
 */
function es_number_to_exponential($target,$decimals=0){
    return sprintf('%.'.$decimals.'e',$target);
}

/**
 * @name valueOf
 * @bind target
 */
function es_number_value_of($target){
    return intval($target);
}

/**
 * @name toString
 * @bind target
 */
function es_number_to_string($target){
    return strval($target);
}