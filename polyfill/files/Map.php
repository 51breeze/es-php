<?php
/*
 * EaseScript
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
////[namespace]
////[require]
////[reference]

class Map {
    private $dataset = [];
    public function __construct()
    {
    }

    public function __get($name){
        switch( $name ){
            case "size" :
                return count( $this->dataset );
            default :
                throw new \Error( $name.' is not exists.');    
        }
    }

    private function getItemByKey( $key )
    {
        foreach( $this->dataset as &$item ){
            if( $item[0] === $key ){
                return $item;
            }
        }
        return null;
    }

    public function set( $key, &$value )
    {
        $item = $this->getItemByKey( $key );
        if( $item )
        {
            $item[1] = $value;
        }else{
            array_push($this->dataset,[$key, &$value]);
        }
    }

    public function get( $key )
    {
        $item =  $this->getItemByKey( $key );
        return $item ? $item[1] : null;
    }

    public function clear()
    {
        unset( $this->dataset );
        $this->dataset = [];
    }

    public function has( $key ){
        return !!$this->getItemByKey( $key );
    }

    public function keys(){
        return array_map(function($item){ 
            return $item[0];
        }, $this->dataset );
    }

    public function values(){
        return array_map(function($item){ 
            return $item[1];
        }, $this->dataset );
    }

    public function entries(){
        return $this->dataset;
    }

    public function forEach( $callback , $thisArg=null){
        $thisArg = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        foreach( $this->dataset as $item){
            call_user_func($callback, $item[1], $item[0], $this);
        }
    }

}