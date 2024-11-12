<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<references from='System' />
/**
 * @name toPrecision
 * @bind target
 */
function es_number_to_precision($target, $decimals=null){
    if( !($decimals > 0) )return strval($target);
    if(System::isObjectWraper($target)){
        $target = $target->valueOf();
    }
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
    if(System::isObjectWraper($target)){
        $target = $target->valueOf();
    }
    return floatval( number_format(floatval($target),$decimals,'.','') );
}

/**
 * @name toExponential
 * @bind target
 */
function es_number_to_exponential($target,$decimals=0){
    if(System::isObjectWraper($target)){
        $target = $target->valueOf();
    }
    return sprintf('%.'.$decimals.'e',$target);
}

/**
 * @name valueOf
 * @bind target
 */
function es_number_value_of($target){
    if(System::isObjectWraper($target)){
        return $target->valueOf();
    }
    return intval($target);
}

/**
 * @name toString
 * @bind target
 */
function es_number_to_string($target){
    return strval($target);
}