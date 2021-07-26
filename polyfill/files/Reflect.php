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

final class Reflect{
    /**
     * 针对全局对象中的方法进行兼容
     */
    final static private function method($type){
        static $map=null;
        if( $map === null ){
            $map = [
                "function"=>function (&$target, &$name, $args=null) {
                    switch ( $name ) {
                        case "call" :
                            return  [["\\es\\core\\Reflect","call"], $args ];
                        case "apply" :
                            return  [["\\es\\core\\Reflect","apply"], $args ];
                        case "bind" :
                            return  [["\\es\\core\\System","bind"], $args ];
                    }
                    return null;
                },
                "array"=>function (&$target, &$name, $args=null){
                    switch ( $name ){
                        case "slice" :
                            return ["array_slice", $args];
                        case "indexOf" :
                            return ['es_array_search_index', array_merge( [&$target], $args) ];
                        case "splice" :
                            return ["array_splice", array_merge( [&$target], $args) ];
                        case "push" :
                            return ["array_push", array_merge( [&$target], $args) ];
                        case "shift" :
                            return ["array_shift", array_merge( [&$target], $args) ];
                        case "unshift" :
                            return ["array_unshift", array_merge( [&$target], $args) ];
                        case "pop" :
                            return ["array_unshift", [&$target] ];
                        case "length" :
                            return ["count", [&$target] ];
                        case "concat" :
                            return ['es_array_concat', [array_merge( [&$target], $args)] ];
                        case "fill" :
                            return ["array_fill", array_merge( [&$target], $args) ];
                        case "filter" :
                            return ["array_filter", array_merge( [&$target], $args) ];
                        case "forEach" :
                            return ["array_walk", array_merge( [&$target], $args) ];
                        case "join" :
                            return ["implode", array_merge($args,[&$target]) ];
                        case "unique" :
                            return ["array_unique", [&$target] ];
                        case "sort" :
                            return ["usort", array_merge( [&$target], $args) ];
                        case "map" :
                            return ["array_map", array_merge($args, [&$target] ) ];
                        case "lastIndexOf" :
                            return ['es_array_search_last_index', array_merge( [&$target], $args) ];
                        case "find" :
                            return ['es_array_find', array_merge( [&$target], $args) ];
                    }
                    return null;
                },
                "string"=>function (&$target, &$name, $args=null){
                    switch ( $name ){
                        case "length" :
                            return ["mb_strlen", [$target] ];
                        case "replace" :
                            return ["str_replace", array_merge($args,[$target])];
                        case "indexOf" :
                            return ['es_string_index', array_merge( [$target], $args) ];
                        case "lastIndexOf" :
                            return ['es_string_last_index', array_merge( [$target], $args) ];
                        case "match" :
                            return [ [$args[0],$name], [$target] ];
                        case "matchAll" :
                            return [ [$args[0],$name], [$target] ];
                        case "split" :
                            return ["explode", [$args[0],$target]];
                        case "search" :
                            return [function(&$target,&$needle){
                                if( $needle instanceof \es\core\RegExp ){
                                    return $needle->search( $target );
                                }else{
                                    return ($result = strpos($target, $needle)) !== false ? $result : -1;
                                }
                            }, array_merge( [$target], $args) ];
                        case "charAt" :
                            return ["mb_substr", [$target,$args[0],$args[0]+1] ];
                        case "charCodeAt" :
                            return ["ord", [substr($target,$args[0],$args[0]+1)]];
                        case "repeat" :
                            return ["str_repeat",  array_merge([$target], $args)];
                        case "slice" :
                            return ["substr",array_merge([$target], $args)];
                        case "substring" :
                            return ["substr",array_merge([$target], $args)];
                        case "substr" :
                            return ["substr",array_merge([$target], $args)];
                        case "toLocaleLowerCase" :
                        case "toLowerCase" :
                            return ["strtolower",[$target]];
                        case "toLocaleUpperCase" :
                        case "toUpperCase" :
                            return ["strtoupper",[$target]];
                        case "trim" :
                            return ["trim",[$target]];
                        case "trimRight" :
                            return ["rtrim",[$target]];
                        case "trimLeft" :
                            return ["ltrim",[$target]];
                        case "includes" :
                            return [function(&$target,&$needle){
                                return @strpos( $target, $needle) !== false;
                            },array_merge([$target], $args)];
                        case "concat" :
                            return ["implode",  array_merge([""], [array_merge([$target], $args)])];
                        case "padEnd" :
                            return ["str_pad", array_merge([$target], array_merge( array_pad( $args,3," " ),STR_PAD_RIGHT))];
                        case "padStart" :
                            return ["str_pad", array_merge([$target], array_merge( array_pad( $args,3," " ),STR_PAD_LEFT))];
                    }
                    return null;
                },
                "math"=>function (&$target, &$name, $args=null){
                    switch ( $name ){
                        case "random" :
                            return [function(){
                                return mt_rand(1,2147483647) / 2147483647;
                            },[]];
                        default :
                            return [$name, $args];
                    }
                    return null;
                }
            ];
        }
        return $map[ $type ] ?? null;
    }

    /**
     * 获取对象中的方法或者属性
     */
    final static private function getReflectionMethodOrProperty( $target, $name, $accessor='',$scope=null){
        if( $target==null ){
            return null;
        }

        $reflect = null;
        if( is_string($target) ){
            $reflect = new \ReflectionClass( $target );
        } else{
            $reflect = new \ReflectionObject( $target );
        }

        $type = 0;
        $method = null;

        //在实例对象中查找
        if( $reflect->hasProperty($name) )
        {
            $type = 1;
            $method = $reflect->getProperty($name);

        }else if(  $reflect->hasMethod( $accessor.$name ) )
        {
            $type = 2;
            $name = $accessor.$name;
            $method = $reflect->getMethod( $name );

        }else if(  $reflect->hasMethod( $name ) )
        {
            $type = 3;
            $name = $name;
            $method = $reflect->getMethod( $name );
        }

        $scopeReflect = null;

        //如果指定的$target是$scope的子类，尝试在作用域中查找
        if( $type === 0 && $scope && is_subclass_of($target, $scope) )
        {
            $scopeReflect = is_string($scope) ? new \ReflectionClass($scope) : new \ReflectionObject( $scope );
            if( $scopeReflect->hasProperty($name) )
            {
                $type = 1;
                $method = $scopeReflect->getProperty($name);

            }else if(  $scopeReflect->hasMethod( $accessor.$name ) )
            {
                $type = 2;
                $name = $accessor.$name;
                $method = $scopeReflect->getMethod( $name );
            
            }else if(  $scopeReflect->hasMethod( $name ) )
            {
                $type = 3;
                $name = $name;
                $method = $scopeReflect->getMethod( $name );
            }
        }

        if( $method == null )return null;

        $accessible = $method->isPublic();
        if( $scope != null && !$accessible )
        {
            if( $scopeReflect ===null )
            {
                $scopeReflect = is_string($scope) ? new \ReflectionClass($scope) : new \ReflectionObject( $scope );
            }

            if( $method->isPrivate() && $method->class === $scopeReflect->getName() )
            {
                $method->setAccessible( true );
                $accessible = true;

            }else if( $method->isProtected() && ( $method->class === $scopeReflect->getName() || $scopeReflect->isSubclassOf( $method->class ) ) )
            {
                $method->setAccessible( true );
                $accessible=true;
            }
        }
        return $accessible ? array($type, $method, $reflect) : null;
    }

    /**
     * Reflect.construct() 方法的行为有点像 new 操作符 构造函数 ， 相当于运行 new target(...args).
     * @param target
     * @param argumentsList
     * @returns {*}
     */
    final static public function construct($scope, $target , $args=null ){
        if( class_exists($target) ){
            $reflect = new \ReflectionClass( $target );
            if( $reflect->isAbstract() ){
                throw new TypeError('Abstract class cannot be instantiated');
            }
            if ($args && is_array($args) ) {
                return $reflect->newInstanceArgs($args);
            } else {
                return $reflect->newInstance($args);
            }
        }else{
            throw new \TypeError('Not found the "'.$target.'" class.');
        }
    }

    /**
     * 调用指定的方法
     */
    final static public function apply( $target, $thisArgument=null, $argumentsList=null ){
        if( !is_callable($target) ){
            throw new TypeError('target is not callable');
        }
        if( $thisArgument !== null ){
            $target = System::bind( $target, $thisArgument);
        }
        return call_user_func_array( $target, !is_array($argumentsList) ? array() :  $argumentsList );
    }

    /**
     * 调用指定对象中的方法
     */
    final static public function call( $scope, &$target, $name=null, array $args=null, $thisArg=null){
        $type = null;
        if( is_string($target) ){
            $type = "string";
        }else if( is_array($target) ){
            $type = "array";
        }

        if( $type ){
            $fn = Reflect::method( $type );
            if( $fn ){
                $args = $args ?: [];
                $method = $fn($target, $name, $args);
                if( $method ){
                    return call_user_func_array($method[0], $method[1]);
                }
            }
        }

        if( is_callable($target) && $name==null ){
            return Reflect::apply($target, $thisArg, $args);
        }

        if( !is_object($target) ){
            throw new \Exception( 'target is non-object');
        }

        $desc =  self::getReflectionMethodOrProperty($target, $name,'',$scope);
        if( $desc ){
            list($type, $method) = $desc;
            $desc = false;
            if( $type===2 ){
                $thisArg = $thisArg==null && !is_string($target) ? $target : $thisArg;
                if( $thisArg != null && $thisArg !== $target ){
                    $fn = \Closure::bind( $method->getClosure($thisArg), $thisArg );
                    return $args==null ? $fn() : call_user_func_array($fn, $args);
                }
                return $args==null ? $method->invoke( $thisArg ) : $method->invokeArgs( $thisArg , $args );
            }
        }
        if( $desc==false ){
            return $target->__call($name, $args==null ? [] : $args );
        }
        throw new \Exception( $name." method is not accessible");
    }

    /**
     * 获取指定对象中的属性值
     */
    final static public function get( $scope, $target, $name, $thisArg=null ){
        if( is_array($target) ){
            if ( is_string($name) ){
                switch ($name) {
                    case 'length' :
                        return count($target);
                }
            }
            return isset($target[$name]) ? $target[$name] : null;
        }

        if ( is_string($target) ){
            switch ($name) {
                case 'length' :
                    return strlen( $target );
            }
        }

        $desc =  self::getReflectionMethodOrProperty($target, $name,'get', $scope);
        if( $desc ){
            list($type, $method) = $desc;
            if( $type === 3 ){
                return $method->getClosure($target);
            }

            if( $type===2 ){
                $thisArg = $thisArg==null ? $target : $thisArg;
                if( $thisArg !== $target ){
                    $fn = \Closure::bind( $method->getClosure($target), $thisArg );
                    return $fn();
                }
                return $method->invoke( $thisArg );
            }else{
                return $method->getValue($target);
            }
        }
        if( !is_object($target) ){
            throw new \Exception( 'target is non-object');
        }
        return $target->__get($name);
    }

    /**
     * 设置指定对象中的属性值
     */
    final static public function set($scope,&$target, $name, $value, $thisArg=null){
        if( is_array($target) ){
            if ( is_string($name) ){
                switch ($name){
                    case 'length' :
                        return count($target);
                }
            }
            return $target[$name] = $value;
        }

        $desc =  self::getReflectionMethodOrProperty($target, $name,'set', $scope);
        if( $desc ){
            list($type, $method) = $desc;
            $desc = false;
            if( $type===2 ){
                $thisArg = $thisArg==null ? $target : $thisArg;
                if( $thisArg!==$target )
                {
                    $fn = \Closure::bind( $method->getClosure($target), $thisArg );
                    return $fn( $value );
                }
                $method->invoke( $thisArg , $value );
                return $value;

            }else{
                $method->setValue($target, $value);
                return $value;
            }
        }
        if( !is_object($target) ){
            throw new \Exception( 'target is non-object');
        }
        $target->__set($name,$value);
        return $value;
    }

    /**
     * 指定对象中的属性值是否存在
     */
    final static public function has($scope, $target, $name){
        return !!self::getReflectionMethodOrProperty($target, $name,'get', $scope);
    }

    /**
     * 对指定对象中的属性做增量操作
     */
    final static public function incre($scope, &$target, $propertyKey, $flag=true){
        $val = \Reflect::get($scope,$target, $propertyKey, null );
        $ret = $val+1;
        \Reflect::set($scope,$target, $propertyKey, $ret , null);
        return $flag ? $val : $ret;
    }

    /**
     * 对指定对象中的属性做减量操作
     */
    final static public function decre($scope, &$target, $propertyKey, $flag=true){
        $val = \Reflect::get($scope,$target, $propertyKey, null);
        $ret = $val-1;
        \Reflect::set($scope,$target, $propertyKey, $ret , null);
        return $flag ? $val : $ret;
    }
}