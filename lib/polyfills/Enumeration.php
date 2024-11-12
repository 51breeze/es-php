<?php
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
abstract class Enumeration implements \JsonSerializable
{
    private $value = null;
    private $name = null;

    public function __construct($name, $value){
        $this->value = $value;
        $this->name = $name;
    }

    public function __get(string $key){
        return $this->{$key} ?? null;
    }

    public function label(){
        return $this->name;
    }

    public function jsonSerialize(){
        return $this->value;
    }

    public function __toString(){
        return $this->value;
    }

    private static function properties(): array{
        try {
            static $records = [];
            $key = static::class;
            if (isset($records[$key])){
                return $records[$key];
            }
            $obj = new \ReflectionClass($key);
            return $records[$key] = $obj->getConstants();
        } catch (\Throwable $e){
            return [];
        }
    }

    public static function keys(): array{
        static $records = [];
        $key = static::class;
        if(isset($records[$key])){
            return $records[$key];
        }
        return $records[$key] = array_keys(static::properties());
    }

    public static function values(): array{
        return array_map(function($key){
            return static::getInstance($key);
        },static::keys());
    }

    public static function has(string $key): bool{
        return array_key_exists($key, static::properties());
    }

    public static function valueOf($value){
        if(is_object($value)){
            if(is_a($value, static::class)){
                return $value;
            }
            return null;
        }
        $properties = static::properties();
        if(array_key_exists($value, $properties)){
            return static::getInstance($value);
        }else{
            $key = array_search($value, $properties);
            if($key){
                return static::getInstance($key);
            }
        }
        return null;
    }

    public static function keyOf($value){
        if(is_object($value) && is_a($value, static::class) ){
            return $value->name;
        }
        $properties = static::properties();
        return array_search($value, $properties) ?: null;
    }

    public static function labelOf($value){
        $obj = static::valueOf($value);
        if($obj){
            return $obj->label();
        }
        return null;
    }

    private static function getRecords(){
        static $instances = [];
        $key = static::class;
        if(isset($instances[$key])){
            return $instances[$key];
        }
        return $instances[$key]=[];
    }

    private static function getInstance(string $key){
        $records = static::getRecords();
        if(isset($records[$key])){
            return $records[$key];
        }
        $properties = static::properties();
        if(isset($properties[$key])){
            $obj = new static($key, $properties[$key]);
            $records[$key] = $obj;
            return $obj;
        }else{
            return $records[$key] = null;
        }
    }
}
