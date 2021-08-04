<?php
/*
 * EaseScript
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
namespace es\core;

define('NaN','NaN');

final class System
{
    public static function typeof( $obj ){
        if( is_callable( $obj ) ){
            return 'function';
        }else if( $obj === NaN || is_numeric($obj) ){
            return 'number';
        }else if( $obj instanceof \es\core\RegExp ){
            return 'regexp';
        }
        return gettype($obj);
    }

    public static function addition($left,$right){
        if( is_numeric($left) && is_numeric($right) ){
            return $left + $right;
        }
        return $left . $right;
    }

    public static function bind($callback, &$thisArg=null, ...$rest )
    {
        $thisObject = $thisArg;
        if( is_array($callback) )
        {
            if( count($callback) === 2 )
            {
                $reflect = null;
                if( is_string($callback[0]) )
                {
                    $reflect = new \ReflectionClass($callback[0]);
                }else
                {
                    $reflect = new \ReflectionObject($callback[0]);
                    if( !$thisArg )
                    {
                        $thisObject  = $callback[0];
                    }
                }

                if ($reflect->hasMethod($callback[1])) 
                {
                    $method = $reflect->getMethod($callback[1]);
                    $method = is_string($callback[0]) ? $method->getClosure() : $method->getClosure($callback[0]);
                    if( $thisObject )
                    {
                        $method = \Closure::bind($method, $thisObject);
                    }
                    if( count($rest) > 0 )
                    {
                        return function()use( $method, $rest )
                        {
                            return call_user_func_array( $method, $rest );
                        };
                    }
                    return $method;
                }
            }else
            {
                $callback = $callback[0];
            }
        }
        if( is_callable($callback) ){
            $reflect = new \ReflectionFunction($callback);
            $is_array_method = false !== stripos( $reflect->getName(), 'array_');
            if( $is_array_method ){
                $get_args=function( $args )use(&$reflect){
                    if( $reflect->getName() ==="array_splice" && count($args) > 3 ){
                        $g = array_slice($args, 2);
                        $args = array_slice($args,0,2);
                        array_push($args, $g );
                    }
                    return $args;
                };
                if( is_array($thisArg) ){
                    return function(...$args)use( $callback, &$thisArg, &$get_args ){
                        return call_user_func_array($callback, array_merge([&$thisArg], $get_args($args) ) );
                    };
                }else if(is_object($thisArg)){
                    return function(...$args)use($callback, &$thisArg, &$get_args){
                        $array = (array)$thisArg;
                        $keys  = array_keys( $array );
                        $result= call_user_func_array($callback, array_merge([&$array], $get_args($args) ) );
                        $diff = array_diff($keys, array_keys($array));
                        $len = count($diff);
                        for($i=0;$i<$len;$i++){
                            unset( $thisArg->{$diff[$i]} );
                        }
                        foreach($array as $key=>$value){
                            $thisArg->{$key} = $value;
                        }
                        return $thisArg;
                    };
                }
            }
            $method = $thisObject ? \Closure::bind( $reflect->getClosure(), $thisObject) : $reflect->getClosure();
            if( count($rest) > 0 ){
                return function()use( $method, $rest ){
                    return call_user_func_array( $method, $rest );
                };
            }
            return $method;
        }
        throw new TypeError('callback is not callable');
    }

    static function getDefinitionByName( $name )
    {
        $name = str_replace(".",'\\',$name);
        if( !class_exists( $name, true ) )
        {
            throw ReferenceError("is not exists ". $name );
        }
        return $name;
    }

    static function getQualifiedObjectName( $object )
    {
        return get_class($object);
    }

    static function propertyIsEnumerable($object, $name){
        
    }

    static function hasOwnProperty(){
        
    }
}