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

/**
 * @name Object.Assign
 */
function es_object_assign($target, ...$args){
    $isObj = is_object($target);
    if( !($isObj || is_array($target)) ) {
        throw new TypeError('Cannot convert null to object');
    }
    $len = count($args);
    for ($index = 0; $index < $len; $index++) {
        $nextSource = $args[ $index ];
        if( is_array($nextSource) || is_object($nextSource) ) {
            foreach ($nextSource as $key => $value) {
                if( $isObj ){
                    $target->{$key} = $value; 
                }else{
                    $target[$key] = $value;
                }
            }
        }
    }
    return $target;
}


/**
 * @name Object.keys
 */
function es_object_keys($target){
    return array_keys( (array)$target );
}


/**
 * @name Object.values
 */
function es_object_values($target){
    return array_values( (array)$target );
}

/**
 * @name propertyIsEnumerable
 * @bind target
 */
function es_object_property_is_enumerable($target, $name){
    return property_exists($target, $name);
}

/**
 * @name hasOwnProperty
 * @bind target
 */
function es_object_has_own_property($target, $name){
    return property_exists($target, $name);
}

/**
 * @name valueOf
 * @bind target
 */
function es_object_value_of($target){
    return array_values( (array)$target );
}

/**
 * @name toString
 * @bind target
 */
function es_object_to_string($target){
    if( is_object($target) ){
        return sprintf('[object %s]', get_class($target));
    }else if( is_array($target) ){
        return implode(',', $target);
    }
    return json_encode($target);
}