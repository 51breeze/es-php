<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
namespace es\core;

/**
 * es_number_to_precision
 * @reference $_bindThisObject_
 */
function es_number_to_precision($__bindThisObject__, $decimals=null){
    if( !($decimals > 0) )return strval($__bindThisObject__);
    $result = sprintf('%.'.($decimals-1).'e',$__bindThisObject__);
    if( strlen(strval(round($__bindThisObject__))) >  $decimals){
        return $result;
    }
    return strval(floatval($result));
}