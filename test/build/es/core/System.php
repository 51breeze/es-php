<?php
/*
 * EaseScript
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
namespace es\core;
require_once('es/core/IIterator.php');
require_once('es/core/String.php');
require_once('es/core/Object.php');
use \es\core\IIterator;

define('NaN','NaN');
define('Infinity','Infinity');

final class IterableIterator implements IIterator{
    private $target = null;
    private $index  = 0;
    private $length = 0;
    private $isIterator = false;
    private $isObject = false;
    public function __construct( $target ){
        $this->target = $target;
        $this->isObject = is_object($target);
        $this->isIterator = System::isIterator($this->target);
    }
    public function next(){
        if( $this->isIterator ){
            return $this->target->next();
        }
        $done  = !($this->length > $this->index);
        $value = null;
        $key   = null;
        if( !$done ){
            $key   = $this->index++;
            $value = $this->isObject ? $this->target->$key : $this->target[$key];
        }
        $item  = (object)['value'=>$value, 'key'=>$key, 'done'=>$done];
        return $item;
    }
    public function rewind(){
        if( $this->isIterator ){
            $this->target->rewind();
        }else if( $this->isObject ){
            if( is_a($this->target,'\Countable') ){
                $this->length = count( $this->target );
            }else if( property_exists($this->target,'length') ){
                $this->length = $this->target->length;
            }
        }else if( is_array($this->target) ){
            $this->length = count($this->target);
        }else if( is_string($this->target) ){
            $this->length = mb_strlen($this->target);
        }
    }
}

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

    public static function print(...$args){
        $to_string = function($item)use(&$to_string){
            if( is_callable($item) || $item instanceof \Closure ){
                $reflect = new \ReflectionFunction($item);
                if( !$reflect->isClosure() ){
                    return sprintf('function %s(){[local code]}', $reflect->getName());
                }else{
                    return 'function {[local code]}';
                }
            }
            if( is_object($item) && method_exists($item,'toString') ){
                return $item->toString();
            }else if( is_array($item) ){
                $to_item_string=function($item)use(&$to_item_string,&$to_string){
                    if( is_array($item) ){
                        $a = [];
                        $p = [];
                        foreach($item as $key=>$value){
                            $value = $to_item_string($value);
                            if( is_numeric($key) ){
                                $a[] = $value;
                            }else{
                                $p[] = $key.': '.$value;
                            }
                        }
                        return '[ '.implode(', ',array_merge($a,$p)).' ]';
                    }else{
                        return $to_string($item);
                    }
                };
                return $to_item_string($item);
            }
            return json_encode( $item, JSON_UNESCAPED_UNICODE);
        };
        echo PHP_EOL,implode(" ", array_map($to_string,$args));
    }

    public static function addition($left,$right){
        if( is_numeric($left) && is_numeric($right) ){
            return $left + $right;
        }
        return $left . $right;
    }

    public static function bind($callback, &$thisArg=null, ...$rest){
        if( !is_callable($callback) ){
            throw new TypeError('callback is not callable');
        }
        $thisObject = $thisArg;
        $is_warp = false;
        $getBindThisIndex = function( $items , $comment){
            if( $comment && preg_match('/@bind\s+(\w+)/', $comment, $matching) ){
                $name = $matching[1] ?? null;
                if( $name ){
                    $len = count( $items );
                    for($i=0;$i<$len;$i++){
                        if( $items[$i]->getName() === $name){
                            return $i;
                        }
                    }
                }
            }
            return -1;
        };
        $thisIndex = null;
        if( is_array($callback) ){
            if( count($callback) === 2 ){
                if( !is_object( $callback[0] ) ){
                    $method = $callback;
                    $reflect = new \ReflectionMethod($callback[0],$callback[1]);
                    $thisIndex = $thisObject !== null ? $getBindThisIndex( $reflect->getParameters(), $reflect->getDocComment() ) : -1;
                    $is_warp = true;
                    $callback = function(...$args)use($method){
                        return call_user_func_array($method, $args);
                    };
                }else{
                    $reflect = new \ReflectionObject($callback[0]);
                    $callback = $reflect->getMethod($callback[1])->getClosure( $callback[0] );
                }
            }else{
                $callback = $callback[0];
            }
        }

        $method  =  $callback;
        if( $is_warp === false ){
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
                    return function(...$args)use( $callback, &$thisArg, &$get_args,&$rest){
                        return call_user_func_array($callback, array_merge([&$thisArg], $get_args($args), $rest) );
                    };
                }else if(is_object($thisArg)){
                    return function(...$args)use($callback, &$thisArg, &$get_args,&$rest){
                        $origin = (array)$thisArg;
                        $array = System::toArray( $origin );
                        $keys  = array_keys( $origin );
                        $result= call_user_func_array($callback, array_merge([&$array], $get_args($args), $rest) );
                        $diff = array_diff($keys, array_keys($array));
                        $props = [];
                        foreach($diff as $v){
                            if( !is_numeric($v) ){
                                $props[$v] = $thisArg->{$v};
                            }
                            unset($thisArg->{$v});
                        }
                        $count = 0;
                        foreach($array as $key=>$value){
                            if( is_numeric($key) ){
                                $count++;
                                $thisArg->{$key} = $value;
                            }
                        }
                        foreach($props as $name=>$value){
                            $thisArg->{$name} = $value;
                        }
                        $thisArg->length = $count;
                        return $result;
                    };
                }
            }
            $thisIndex = $thisObject !== null ? $getBindThisIndex( $reflect->getParameters(), $reflect->getDocComment() ) : -1;
            $method = $reflect->getClosure();
        }

        if( $thisObject && is_object($thisObject) ){
            $method = \Closure::bind($method, $thisObject);
        }

        if( count($rest) > 0 ){
            return function(...$args)use($method, $thisObject, $thisIndex, $rest){
                $args = array_merge($args,$rest);
                if( $thisIndex>=0 && $thisObject){
                    array_splice($args,$thisIndex,0,[$thisObject]);
                }
                return call_user_func_array($method, $args );
            };
        }else if( $thisIndex >= 0 ){
            return function(...$args)use($method, $thisObject, $thisIndex){
                if( $thisIndex>=0 ){
                    array_splice($args,$thisIndex,0,[$thisObject]);
                }
                return call_user_func_array($method, $args);
            };
        }
        return $method;
    }

    static function toArray( $target ){
        $array = [];
        $type = 0;
        $len  = 0;
        if( is_array( $target) ){
            $type = 1;
            $target = array_filter($target, function($key){
                return is_numeric($key);
            },ARRAY_FILTER_USE_KEY);
            $len = count($target);
        }else if( is_object($target) ){
            $type = 2;
            if( is_a($target,'\Countable') ){
                $len = count($target);
            }else{
                $len = isset($target->length) ? $target->length : 0;
            }
        }else if( is_string($target) ){
            $type = 3;
            $len = mb_strlen($target);
        }
        for($i=0;$i<$len;$i++){
            if( $type===1 ){
                $array[] = $target[ $i ];
            }else if( $type===2 ){
                $array[] = $target->{$i};
            }else if( $type===3 ){
                $array[] = mb_substr($target,$i,1);
            }
        }
        return $array;
    }

    static function isObject($target){
        return is_object($target) || is_array($target);
    }

    static function isIterator($target){
        return is_a($target, '\es\core\IIterator');
    }

    static function merge(&$target,...$args){
        $isObj = is_object($target);
        if( !($isObj || is_array($target)) ) {
            throw new TypeError('Cannot convert null to object');
        }
        $len = count($args);
        for ($index = 0; $index < $len; $index++) {
            $nextSource = $args[ $index ];
            if( System::isObject($nextSource) ) {
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

    static function getIterator( $target ){
        return System::isIterator($target) ? $target : new IterableIterator($target);
    }

    static function getDefinitionByName( $name ){
        $name = str_replace(".",'\\',$name);
        if( !class_exists( $name, true ) ){
            throw ReferenceError("is not exists ". $name );
        }
        return $name;
    }

    static function getQualifiedObjectName( $object ){
        return get_class($object);
    }
}