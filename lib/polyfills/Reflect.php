<?php
/*
 * EaseScript
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<references from='System' />
///<references from='Map' />
final class Reflect{

    const KIND_CLASS=1;
    const KIND_INTERFACE=2;
    const KIND_ENUM=4;
    const KIND_STRUCT=8;
    const KIND_VAR=16;
    const KIND_CONST=32;
    const KIND_METHOD=64;
    const KIND_ACCESSOR=128;
    const KIND_ENUM_PROPERTY=256;
    const KIND_STRUCT_COLUMN=512;
    const MODIFIER_STATIC=1024;
    const MODIFIER_PUBLIC=2048;
    const MODIFIER_PROTECTED=4096;
    const MODIFIER_PRIVATE=8192;
    const MODIFIER_ABSTRACT=16384;
    const MODIFIER_FINAL=32768;
    const MODIFIER_OPTIONAL=65536;

    /**
     * 针对全局对象中的方法进行兼容
     */
    final static private function method($type){
        static $map=null;
        if( $map === null ){
            $map = [
                "function"=>function (&$target, &$name, $args=[]) {
                    switch ( $name ) {
                        case "call" :
                        case "apply" :
                            return  [["Reflect","apply"], $args ];
                        case "bind" :
                            return  [["System","bind"], $args ];
                    }
                    return null;
                },
                "array"=>function (&$target, &$name, $args=[]){
                    if( $target ==='Array' ){
                        switch( $name ){
                            case 'from' :
                                return [['System','toArray'], $args ];
                            case 'of'  :   
                                return ['es_array_new', $args ];
                            case 'isArray'  :   
                                return ['is_array', $args ];
                        }
                        return null;
                    }
                    switch ( $name ){
                        case "slice" :
                            return ["array_slice", array_merge( [&$target], $args) ];
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
                            return ["array_pop", [&$target] ];
                        case "length" :
                            return ["count", [&$target], 2];
                        case "concat" :
                            return ['es_array_concat', [array_merge( [&$target], $args)] ];
                        case "fill" :
                            return ["array_fill", array_merge( [&$target], $args) ];
                        case "filter" :
                            return ["es_array_filter", array_merge( [&$target], $args) ];
                        case "forEach" :
                            return ["es_array_foreach", array_merge( [&$target], $args) ];
                        case "join" :
                            return ["implode", array_merge($args,[&$target]) ];
                        case "unique" :
                            return ["array_unique", [&$target] ];
                        case "sort" :
                            return ["es_array_sort", array_merge( [&$target], $args) ];
                        case "map" :
                            return ["es_array_map", array_merge([&$target],$args) ];
                        case "lastIndexOf" :
                            return ['es_array_search_last_index', array_merge( [&$target], $args) ];
                        case "find" :
                            return ['es_array_find', array_merge( [&$target], $args) ];
                        case "includes" :
                            return ['in_array', array_merge($args, [&$target]) ];
                        case "entries" :
                        case "values" :
                            return ['array_values', [&$target] ];
                        case "every" :
                            return ['es_array_every', array_merge( [&$target], $args)];
                        case "some" :
                            return ['es_array_some', array_merge( [&$target], $args)];
                        case "fill" :
                            return ['es_array_fill', array_merge( [&$target], $args)];
                        case "flat" :
                            return ['es_array_flat', array_merge( [&$target], $args)];
                        case "flatMap" :
                            return ['es_array_flat_map', array_merge( [&$target], $args)];
                        case "reduce" :
                            return ['es_array_reduce', array_merge( [&$target], $args)];
                        case "reduceRight" :
                            return ['es_array_reduce_right', array_merge( [&$target], $args)];
                        case "keys" :
                            return ['array_keys', [&$target]];
                        case "reverse" :
                            return ['array_reverse',  [&$target]];
                        case "copyWithin" :
                            return ['es_array_copy_within',  [&$target]];
                        case "hasOwnProperty" :
                        case "propertyIsEnumerable" :
                            return ['array_key_exists',  array_merge($args,[&$target])];
                        case "toLocaleString" :
                        case "toString" :
                            return ['implode',  [', ',&$target]];
                        case "valueOf" :
                            return [function()use(&$target){return $target;},[]];
                    }
                    return null;
                },
                "string"=>function (&$target, &$name, $args=[]){
                    switch ( $name ){
                        case "length" :
                            return ["mb_strlen", [$target], 2];
                        case "replace" :
                            return ["es_string_replace", array_merge([$target],$args)];
                        case "replaceAll" :
                            return ["es_string_replace_all", array_merge([$target],$args)];
                        case "indexOf" :
                            return ['es_string_index', array_merge( [$target], $args) ];
                        case "lastIndexOf" :
                            return ['es_string_last_index', array_merge( [$target], $args) ];
                        case "match" :
                        case "matchAll" :
                        case "search" :
                            if( System::typeof( $args[0] ) ==='regexp' ){
                                return [ [$args[0],$name], [$target] ];
                            }else{
                                $classRegExp = System::getCoreSystemNamespace('RegExp');
                                return [ [new $classRegExp($args[0]),$name], [$target] ];
                            }
                        case "split" :
                            return ["explode", [$args[0],$target]];
                        case "charAt" :
                            return ["mb_substr", [$target,$args[0],$args[0]+1] ];
                        case "charCodeAt" :
                            return ["ord", [mb_substr($target,$args[0],$args[0]+1)]];
                        case "repeat" :
                            return ["str_repeat",  array_merge([$target], $args)];
                        case "slice" :
                            return ["es_string_slice",array_merge([$target], $args)];
                        case "substring" :
                            return ["es_string_substring",array_merge([$target], $args)];
                        case "substr" :
                            return ["mb_substr",array_merge([$target], $args)];
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
                        case "startsWith" :
                            return ["es_string_starts_with",array_merge([$target], $args)];
                        case "endsWith" :
                            return ["es_string_ends_with",array_merge([$target], $args)];
                        case "includes" :
                            return [function($target,$needle){
                                return @strpos( $target, $needle) !== false;
                            },array_merge([$target], $args)];
                        case "concat" :
                            return ["implode",  array_merge([""], array_merge([$target], $args))];
                        case "padEnd" :
                            return ["str_pad", array_merge([$target], array_merge( array_pad( $args,3," " ), [STR_PAD_RIGHT] ))];
                        case "padStart" :
                            return ["str_pad", array_merge([$target], array_merge( array_pad( $args,3," " ), [STR_PAD_LEFT] ))];
                        case "valueOf" :
                        case "toString" :
                            return ['strval', [$target]];
                        case "propertyIsEnumerable" :
                        case "hasOwnProperty" :
                            return ['isset', array_merge([$target],$args) ];
                    }
                    return null;
                },
                "math"=>function (&$target, &$name, $args=null){
                    $callback = function($val){return $val;};
                    switch ( $name ){
                        case "E" :
                            return [$callback,[2.718281828459045]];
                        case "LN10" :
                            return [$callback,[2.302585092994046]];
                        case "LN2" :
                            return [$callback,[0.6931471805599453]];
                        case "LOG2E" :
                            return [$callback,[1.4426950408889634]];
                        case "LOG10E" :
                            return [$callback,[0.4342944819032518]];
                        case "PI" :
                            return [$callback,[3.141592653589793]];
                        case "SQRT1_2" :
                            return [$callback,[0.7071067811865476]];
                        case "SQRT2" :
                            return [$callback,[1.4142135623730951]];
                        case "abs" :
                        case "acos" :
                        case "asin" :
                        case "atan" :
                        case "atan2" :
                        case "ceil" :
                        case "cos" :
                        case "exp" :
                        case "log" :
                        case "max" :
                        case "min" :
                        case "pow" :
                        case "sin" :
                        case "sqrt" :
                        case "tan" :
                        case "round" :    
                        case "floor" :
                            return [$name, [$args[0]]];
                        case "random" :
                            return [function(){
                                return mt_rand(1,2147483647) / 2147483647;
                            },[]];
                       
                    }
                    return null;
                },
                "number"=>function (&$target, &$name, $args=null){
                    $callback = function($val){return $val;};
                    switch ( $name ){
                        case "toFixed" :
                            return ['es_number_to_fixed', [$target, $args[0]]];
                        case "toExponential" :
                            return ['es_number_to_exponential', [$target, $args[0]]];
                       
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
    final static private function getReflectionMethodOrProperty( $target, $name, $accessor='',$scope=null, $isCall=false){
        if(is_null($target)){
            return null;
        }

        $reflect = null;
        if( is_string($target) ){
            $reflect = new \ReflectionClass( $target );
        } else{
            $reflect = new \ReflectionObject( $target );
        }

        $name = strval($name);
        $type = 0;
        $method = null;

        if($isCall){
            if($reflect->hasMethod( $name ) ){
                $type = 3;
                $name = $name;
                $method = $reflect->getMethod( $name );
            }
        }

        //在实例对象中查找
        if(!$method){
            if( $reflect->hasProperty($name) ){
                $type = 1;
                $method = $reflect->getProperty($name);
            }else if( $accessor && $reflect->hasMethod( $accessor.$name ) ){
                $type = 2;
                $name = $accessor.$name;
                $method = $reflect->getMethod( $name );
            }else if( $reflect->hasMethod( $name ) ){
                $type = 3;
                $name = $name;
                $method = $reflect->getMethod( $name );
            }
        }

        $scopeReflect = null;

        //如果指定的$target是$scope的子类，尝试在作用域中查找
        if( $type === 0 && $scope && is_subclass_of($target, $scope) ){
            $scopeReflect = is_string($scope) ? new \ReflectionClass($scope) : new \ReflectionObject( $scope );
            if( $scopeReflect->hasProperty($name) ){
                $type = 1;
                $method = $scopeReflect->getProperty($name);
            }else if( $accessor && $scopeReflect->hasMethod( $accessor.$name ) ){
                $type = 2;
                $name = $accessor.$name;
                $method = $scopeReflect->getMethod( $name );
            }else if( $scopeReflect->hasMethod( $name ) ){
                $type = 3;
                $name = $name;
                $method = $scopeReflect->getMethod( $name );
            }
        }

        if( $method === null )return null;
        $accessible = $method->isPublic();
        if( $scope != null && !$accessible ){
            if( $scopeReflect ===null ){
                $scopeReflect = is_string($scope) ? new \ReflectionClass($scope) : new \ReflectionObject( $scope );
            }
            if( $method->isPrivate() && $method->class === $scopeReflect->getName() ){
                $method->setAccessible( true );
                $accessible = true;
            }else if( $method->isProtected() && ( $method->class === $scopeReflect->getName() || $scopeReflect->isSubclassOf( $method->class ) ) ){
                $method->setAccessible( true );
                $accessible=true;
            }
        }
        return array($type, $method, $accessible, $reflect);
    }

    /**
     * Reflect.construct() 方法的行为有点像 new 操作符 构造函数 ， 相当于运行 new target(...args).
     * @param target
     * @param argumentsList
     * @returns {*}
     */
    final static public function construct($target, $args=null ){
        if($target ==='String' || $target==='Boolean' || $target==='Object' || $target==='Number'){
            return System::newObjectWraper($args[0] ?? null, strtolower($target));
        }else if($target==='Array'){
            if(!is_array($args))$args = [];
            if( count($args) === 1 && is_numeric($args[0]) ){
                return array_fill(0, $args[0], null);
            }
            return array_slice((array)$args,0);
        }
        $exists = class_exists($target);
        if(!$exists){
            $target = System::getCoreSystemNamespace($target);
            $exists = class_exists($target);
        }
        if($exists){
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
    final static public function apply( $target, &$thisArg=null, array $argumentsList=[] ){
        if( !is_callable($target) ){
            throw new \TypeError('target is not callable');
        }
        if( $thisArg !== null ){
            $target = System::bind($target, $thisArg);
        }
        return call_user_func_array( $target, !is_array($argumentsList) ? array() :  $argumentsList );
    }

    final static public function invoke($target){
        if( !is_callable($target) ){
            throw new \TypeError('target is not callable');
        }
        $len = func_num_args();
        if($len>1){
            return call_user_func_array($target, array_slice(func_get_args(),1));
        }
        return call_user_func($target);
    }

    /**
     * 调用指定对象中的方法
     */
    final static public function call( $scope, &$target, $name=null, array $args=[], $thisArg=null, $isStatic=false){
        $type_name = gettype($target);
        if($isStatic===true){
            if( $target ==='Array' ){
                $type_name = 'array';
            }else if( $target ==='Math' ){
                $type_name = 'math';
            }
        }
        if($type_name ==="integer" || $type_name ==="double"){
            $type_name = 'number';
        }
        switch ($type_name) {
            case 'string' :
            case 'array' :
            case 'math' :   
            case 'number' :
                if( $type_name==='array' && isset($target[$name])){
                    return call_user_func_array($target[$name], $args);
                }
                $object = self::method( $type_name );
                if( $object ){
                    $method_array = $object($target, $name, $args);
                    if( $method_array ){
                        @list($method,$args,$type) = $method_array;
                        if( $type !== 2 ){
                            if( substr($method,0,3) ==='es_' ){
                                $method = System::getCoreSystemNamespace( $method );
                            }
                            return call_user_func_array( $method, $args);
                        }
                        throw new \Error( $name." is not callable.");
                    }
                }
                throw new \Error( $name." method is not exists.");
        }

        if($name===null){
            return Reflect::apply($target, $thisArg, $args);
        }

        if(!$target || !is_object($target) ){
            throw new \Error( 'target is non-object');
        }

        $desc = self::getReflectionMethodOrProperty($target, $name,'',$scope, true);
        if( $desc ){
            $thisArg = $thisArg==null && !is_string($target) ? $target : $thisArg;
            list($type, $method, $accessible) = $desc;
            if( !$accessible ){
                throw new \Error( $name." method is not accessible");
            }
            if($type===1){
                $value = $method->getValue($target);
                if(is_callable($value)){
                    $fn = $value;
                    if( $thisArg != null && $thisArg !== $target ){
                        $ref = new \ReflectionFunction($value);
                        $fn = \Closure::bind($ref->getClosure(), $thisArg); 
                    }
                    return call_user_func_array($fn, $args);
                }else{
                    throw new \Error( $name." property is not callable");
                }
            }else if( $type===3 ){
                if( $thisArg != null && $thisArg !== $target ){
                    $fn = \Closure::bind( $method->getClosure($thisArg), $thisArg );
                    return call_user_func_array($fn, $args);
                }
                return !$args ? $method->invoke( $thisArg ) : $method->invokeArgs( $thisArg , $args );
            }
        }

        if(method_exists($target, '__call')){
            return $target->__call($name, $args);
        }
        throw new \Error( $name." method is not exists.");
    }

    final static public function tryCall( $scope, &$target, $name=null, array $args=[], $thisArg=null, $isStatic=false){
        try{
            if(!$target)return null;
            return self::call( $scope, $target, $name, $args, $thisArg, $isStatic);
        }catch(\Error $e){
            return null;
        }
    }

    /**
     * 获取指定对象中的属性值
     */
    final static public function get( $scope, $target, $name, $thisArg=null, $isStatic=false){
        if(is_null($target))return null;
        $type_name = gettype($target);
        if($isStatic===true){
            if( $target ==='Array' ){
                $type_name = 'array';
            }else if( $target ==='Math' ){
                $type_name = 'math';
            }
        }
        if($type_name ==="integer" || $type_name ==="double"){
            $type_name = 'number';
        }
        switch ($type_name) {
            case 'string' :
            case 'array' :
            case 'math' :
            case 'number' :
                if( isset( $target[$name] ) ){
                    return $target[$name];
                }else{
                    $object = self::method( $type_name );
                    if( $object ){
                        $method_array = $object($target,$name, []);
                        if( $method_array ){
                            @list($method,$args,$type) = $method_array;
                            if( $type === 2 ){
                                return call_user_func_array($method, $args);
                            }else{
                                if( substr($method,0,3) ==='es_' ){
                                    $method = System::getCoreSystemNamespace( $method );
                                }
                            }
                            return (new \ReflectionFunction($method))->getClosure();
                        }
                    }
                }
                return null;
        }

        if( !is_object($target) ){
            throw new \Error( 'target is non-object');
        }

        $desc = self::getReflectionMethodOrProperty($target, $name,'get', $scope);
        if( $desc ){
            list($type, $method, $accessible) = $desc;
            if( !$accessible ){
                throw new \Error( $name." is not accessible");
            }
            if( $type === 3 ){
                return $method->getClosure($target);
            }else if( $type===2 ){
                $thisArg = $thisArg==null ? $target : $thisArg;
                if( $thisArg !== $target ){
                    $fn = \Closure::bind( $method->getClosure($target), $thisArg );
                    return $fn();
                }
                return $method->invoke( $thisArg );
            }else if($type===1){
                return $method->getValue($target);
            }
        }else{
            if(is_a($target, \ArrayAccess::class)) {
                return $target[$name];
            }else{
                if(method_exists($target, '__get') ){
                    return $target->__get($name);
                }
                return $target->{$name};
            }
        }
        return null;
    }

    /**
     * 设置指定对象中的属性值
     */
    final static public function set($scope, &$target, $name, $value, $thisArg=null, $isStatic=false){
        if(is_null($target)){
            throw new \Error( 'target is null object');
        }
        $type_name = gettype($target);
        switch ($type_name) {
            case 'array' :
                return $target[ $name ]=$value;
            case 'object' :
                if( $target instanceof \stdClass){
                    return $target->$name=$value;
                }
        }

        if( !is_object($target) ){
            throw new \Error( 'target is non-object');
        }

        $desc =  self::getReflectionMethodOrProperty($target, $name,'set', $scope);
        if( $desc ){
            list($type, $method, $accessible) = $desc;
            if( !$accessible ){
                throw new \Error( $name." is not accessible");
            }
            if( $type===2 ){
                $thisArg = $thisArg==null ? $target : $thisArg;
                if( $thisArg!==$target ){
                    $fn = \Closure::bind( $method->getClosure($target), $thisArg);
                    return $fn( $value );
                }
                $method->invoke( $thisArg , $value );
                return $value;
            }else if($type === 1){
                $method->setValue($target, $value);
                return $value;
            }
            throw new \Error( $name." is not writeable.");
        }else{
            if(is_a($target, \ArrayAccess::class)) {
                return $target[$name] = $value;
            }else{
                if(method_exists($target, '__set') ){
                    return $target->__set($name, $value);
                }
                return $target->{$name} = $value;
            }
        }
    }

    /**
     * 指定对象中的属性(或者方法)成员是否存在
     */
    final static public function has($target, $name){
        if(gettype($target)==='array') {
            if(array_key_exists($name, $target))return true;
            $fn = self::method('array');
            return !!$fn($target, $name, []);
        }
        if(is_object($target)){
            if(!$target)return false;
            if(property_exists($target,$name))return true;
        }
        return !!static::getReflectionMethodOrProperty($target, $name,'get', null);
    }

    /**
     * 对指定对象中的属性做增量操作
     */
    final static public function incre($scope, &$target, $propertyKey, $flag=false){
        $val = static::get($scope,$target, $propertyKey, null );
        $ret = $val+1;
        static::set($scope,$target, $propertyKey, $ret , null);
        return !$flag ? $val : $ret;
    }

    /**
     * 对指定对象中的属性做减量操作
     */
    final static public function decre($scope, &$target, $propertyKey, $flag=false){
        $val = static::get($scope,$target, $propertyKey, null);
        $ret = $val-1;
        static::set($scope,$target, $propertyKey, $ret , null);
        return !$flag ? $val : $ret;
    }

    final static public function getDescriptor($object, $propertyKey=null, $mode=null){
        static $instances = null;
        if(!$object)return null;
        if($instances === null){
            $instances = new Map();
        }
        $key = $object;
        $exists = $instances->get($key);
        if($exists){
            return $exists;
        }
        $descriptor = new \ReflectionClass($object);
        $properties = $descriptor->getProperties();
        $methods = $descriptor->getMethods();
        $constants =  $descriptor->getConstants();
        $members = [];
        $make = function($items)use(&$members, $object, $descriptor){
            foreach($items as $item){
                $member = MemberDescriptor::create($item->getName(), $item, $object, $descriptor);
                array_push($members, $member);
            }
        };
        $make($properties);
        $make($methods);
        $constantReflections = [];
        foreach($constants as $key=>$value){
            $constant = new \ReflectionClassConstant($descriptor->getName(), $key);
            array_push($constantReflections, $constant);
        }
        $make($constantReflections);
        $desc = ClassDescriptor::create($object, $descriptor, $members);
        $instances->set($key, $desc);
        return $desc;
    }
}


class ClassDescriptor{
    static function create($target, $descriptor, $members){
        return new ClassDescriptor($target, $descriptor, $members);
    }
    private $target = null;
    private $descriptor = null;
    private $members = null;
    private $label = 'class';
    private $mode = 0;
    public function __construct($target, \ReflectionClass $descriptor, array $members = []){
        $this->target = $target;
        $this->descriptor = $descriptor;
        $this->members = $members;
    }

    private $commentLines = null;
    public function parseComments(){
        if($this->commentLines===null){
            $comments = $this->descriptor->getDocComment();
            $result = [];
            if($comments){
                $lines = preg_split('/[\r\n]+/', $comments);
                for($i=0;$i<count($lines);$i++){
                    $line = preg_replace('/^([\*\s\t\/]+)|([\*\s\t\/]+)$/',"",$lines[$i]);
                    $line = trim($line);
                    array_push($result, $line);
                }
            }
            $this->commentLines = $result;
        }
        return $this->commentLines;
    }

    private function hasAnnotation($annotName){
        $lines = $this->parseComments();
        for($i=0;$i<count($lines);$i++){
            $line = $lines[$i];
            if(stripos($line, $annotName) === 0){
               return true;
            }
        }
        return false; 
    }

    public function getIsClassDescriptor(){
        return true;
    }
    public function getMode(){
        $mode = $this->mode;
        if($mode===0){
            if($this->isClass())$mode |= Reflect::KIND_CLASS;
            if($this->isInterface())$mode |= Reflect::KIND_INTERFACE;
            if($this->isEnum())$mode |= Reflect::KIND_ENUM;
            if($this->isStatic())$mode |= Reflect::MODIFIER_STATIC;
            if($this->isPublic())$mode |= Reflect::MODIFIER_PUBLIC;
            if($this->isFinal())$mode |= Reflect::MODIFIER_FINAL;
            if($this->isAbsract())$mode |= Reflect::MODIFIER_ABSTRACT;
            if($this->isStruct())$mode |= Reflect::KIND_STRUCT;
            $this->mode = $mode;
        }
        return $this->mode;
    }
    public function getDescriptor(){
        return $this->descriptor;
    }
    public function getClassModule(){
        return $this->target;
    }
    public function getLabel(){
        if($this->isEnum()){
            return 'enum';
        }else if($this->isInterface()){
            return 'interface';
        }else if($this->isStruct()){
            return 'struct';
        }
        return $this->label;
    }
    public function getClassName(){
        return $this->descriptor->getShortName();
    }
    public function getNamespace(){
        return $this->descriptor->getNamespaceName();
    }
    public function getFullName(){
        return $this->descriptor->getName();
    }
    public function getImplements(){
        return $this->descriptor->getInterfaces();
    }
    public function getInherit(){
        return $this->descriptor->getExtensionName()||null;
    }
    public function getMembers(){
        return $this->members;
    }
    public function getPermission(){
        if($this->descriptor->isInternal()){
            return 'internal';
        }
        return 'public';
    }
    public function getMemberDescriptor($name, $isStatic=false){
        $isStatic = !!$isStatic;
        foreach($this->members as $member){
            if($member->isStatic()===$isStatic){
                $key = $member->getKey();
                if($key === $name){
                    return $member;
                }else if($member->isAccessor()){
                    if(stripos($key, 'get'+$name) !==false){
                        return $member;
                    }else if(stripos($key, 'set'+$name) !==false){
                        return $member;
                    }
                }
            }
        }
        return null;
    }
    public function isPrivatePropertyKey($key){
        return false;
    }
    public function isPrivate(){
        return false;
    }
    public function isProtected(){
        return false;
    }
    public function isPublic(){
        return !$this->descriptor->isInternal();
    }
    public function isStatic(){
        return !$this->descriptor->isInstantiable() && !$this->isAbsract() && !$this->isInterface();
    }
    public function isFinal(){
        return $this->descriptor->isFinal();
    }
    public function isAbsract(){
        return $this->descriptor->isAbstract();
    }
    public function isDynamic(){
        return true;
    }
    public function isClass(){
        return !($this->descriptor->isInterface() || $this->isEnum() || $this->isStruct());
    }
    public function isInterface(){
        return $this->descriptor->isInterface();
    }
    public function isEnum(){
        return $this->descriptor->isEnum() || is_a($this->target, System::getCoreSystemNamespace('Enumeration'));
    }
    public function isStruct(){
        return $this->hasAnnotation('@StructTable');
    }
}

class MemberDescriptor{
    static function create($key, $descriptor, $target, $owner=null, $privateKey=null){
        static $createdMemberDescriptors = null;
        if($createdMemberDescriptors === null){
            $createdMemberDescriptors = new Map();
        }
        $exists = $createdMemberDescriptors->get($descriptor);
        if($exists)return $exists;
        $desc = new MemberDescriptor($key, $descriptor, $target, $owner, $privateKey);
        $createdMemberDescriptors->set($descriptor, $desc);
        return $desc;
    }

    private $key = null;
    private $descriptor = null;
    private $owner = null;
    private $privateKey = null;
    private $mode = 0;
    private $label='property';
    private $accessor = '';
    private $target = null;

    function __construct($key, $descriptor, $target, $owner, $privateKey=null){
        $this->key = $key;
        $this->descriptor = $descriptor;
        $this->owner = $owner;
        $this->target = $target;
        $this->privateKey = $privateKey;
        if(is_a($descriptor, \ReflectionProperty::class)){
            if($this->isPublic() && $this->hasAnnotation("@StructColumn")){
                $this->label = 'column';
                $this->mode |= Reflect::KIND_STRUCT_COLUMN;
            }else{
                $this->label = 'property';
                $this->mode |= Reflect::KIND_VAR;
            }
        }else if(is_a($descriptor, \ReflectionMethod ::class)){
            $this->label = 'method';
            $this->mode |= Reflect::KIND_METHOD;
            $hasGet = strpos($key, 'get') !== false;
            $hasSet = !$hasGet ? strpos($key, 'set') !== false : false;
            if($hasGet || $hasSet){
                $num = $descriptor->getNumberOfParameters();
                if($hasGet && $num===0 || $hasSet && $num===1){
                    $code = ord($key[3]);
                    if($code>=65 && $code<=90){
                        $this->accessor = $hasGet ? 'get' : 'set';
                        $this->label = 'accessor';
                        $this->mode ^= Reflect::KIND_METHOD;
                        $this->mode |= Reflect::KIND_ACCESSOR;
                    }
                }
            }
        }else if(is_a($descriptor, \ReflectionClassConstant::class)){
            if($descriptor->isEnumCase()){
                $this->label = 'enumProperty';
                $this->mode |= Reflect::KIND_STRUCT_COLUMN;
            }else if($descriptor->isPublic() && is_a($target, System::getCoreSystemNamespace('Enumeration'))){
                $this->label = 'enumProperty';
                $this->mode |= Reflect::KIND_STRUCT_COLUMN;
            }else{
                $this->label = 'property';
                $this->mode |= Reflect::KIND_CONST;
            }
        }
    }

    private $commentLines = null;
    public function parseComments(){
        if($this->commentLines===null){
            $comments = $this->descriptor->getDocComment();
            $result = [];
            if($comments){
                $lines = preg_split('/[\r\n]+/', $comments);
                for($i=0;$i<count($lines);$i++){
                    $line = preg_replace('/^([\*\s\t\/]+)|([\*\s\t\/]+)$/',"",$lines[$i]);
                    $line = trim($line);
                    if($line){
                        array_push($result, $line);
                    }
                }
            }
            $this->commentLines = $result;
        }
        return $this->commentLines;
    }

    private function hasAnnotation($annotName){
        $lines = $this->parseComments();
        for($i=0;$i<count($lines);$i++){
            $line = $lines[$i];
            if(stripos($line, $annotName) === 0){
               return true;
            }
        }
        return false; 
    }

    public function getIsMemberDescriptor(){
        return true;
    }
    public function getMode(){
        return $this->mode;
    }
    public function getDescriptor(){
        return $this->descriptor;
    }
    public function getKey(){
        return $this->key;
    }
    public function getOwner(){
        return $this->owner->getName();
    }
    public function getLabel(){
        return $this->label;
    }
    public function getGetter(){
        if($this->accessor === 'get'){
            return $this->descriptor->getClosure();
        }
        return null;
    }
    public function getSetter(){
        if($this->accessor === 'set'){
            return $this->descriptor->getClosure();
        }
        return null;
    }
    public function getValue(){
        return $this->descriptor->getValue();
    }
    public function getWritable(){
        return $this->label = 'property' && !($this->mode & Reflect::KIND_CONST) && !$this->descriptor->isReadOnly();
    }
    public function getConfigurable(){
        return false;
    }
    public function getEnumerable(){
        return $this->label = 'property' && !$this->descriptor->isReadOnly();
    }
    public function getPermission(){
        if($this->isPrivate()){
            return 'private';
        }else if($this->isProtected()){
            return 'protected';
        }
        return 'public';
    }
    public function getPrivateKey(){
        return null;
    }
    public function isPrivate(){
        return $this->descriptor->isPrivate();
    }
    public function isProtected(){
        return $this->descriptor->isProtected();
    }
    public function isPublic(){
        return $this->descriptor->isPublic();
    }
    public function isStatic(){
        return $this->descriptor->isStatic();
    }
    public function isFinal(){
        return $this->descriptor->isFinal();
    }
    public function isAbsract(){
        return $this->descriptor->isAbstract();
    }
    public function isMethod(){
        return $this->label === 'method';
    }
    public function isOptional(){
        return $this->hasAnnotation("@Optional");
    }
    public function isAccessor(){
        return $this->label === 'accessor';
    }
    public function isProperty(){
        return $this->label === 'property';
    }
    public function isEnumProperty(){
        return $this->label === 'enumProperty';
    }
    public function isColumn(){
        return $this->label === 'column';
    }
    public function isClassMember(){
        return true;
    }
    public function invokeMethod(object $thisArg, ...$args){
        if($this->label === 'method'){
            return $this->descriptor->invoke($thisArg, ...$args);
        }else{
            throw new \Exception("The '".$this->getKey()."' property is not method");
        }
    }
    public function invokeGetter(object $thisArg){
        if($this->accessor === 'get'){
            return $this->descriptor->invoke($thisArg);
        }else{
            throw new \Exception("The '".$this->getKey()."' property is not getter");  
        }
    }
    public function invokeSetter(object $thisArg, $value){
        if($this->accessor === 'set'){
            $this->descriptor->invoke($thisArg, $value);
        }else{
            throw new \Exception("The '".$this->getKey()."' property is not setter");
        }
    }
    public function setPropertyValue($value){
        $this->descriptor->setAccessible(true);
        if($this->isStatic()){
            $this->descriptor->setValue(null, $value);
        }else{
            $this->descriptor->setValue($this->target, $value);
        }
    }
    public function getPropertyValue(){
        $this->descriptor->setAccessible(true);
        if($this->isStatic()){
            return $this->descriptor->getValue();
        }else{
            return $this->descriptor->getValue($this->target);
        }
    }
}