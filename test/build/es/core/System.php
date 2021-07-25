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
        }else if( $obj === NaN ){
            return 'number';
        }else if( $obj instanceof \es\core\RegExp ){
            return 'regexp';
        }
        return gettype($obj);
    }

    public static function bind($callback,$thisArg=null, ...$rest )
    {
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
                        $thisArg  = $callback[0];
                    }
                }

                if ($reflect->hasMethod($callback[1])) 
                {
                    $method = $reflect->getMethod($callback[1]);
                    $method = is_string($callback[0]) ? $method->getClosure() : $method->getClosure($callback[0]);
                    if( $thisArg )
                    {
                        $method = \Closure::bind($method, $thisArg);
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
        if( is_callable($callback) )
        {
            $reflect = new \ReflectionFunction($callback);
            $method = $thisArg ? \Closure::bind( $reflect->getClosure() , $thisArg) : $reflect->getClosure();
            if( count($rest) > 0 )
            {
                return function()use( $method, $rest )
                {
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