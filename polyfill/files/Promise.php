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

class Promise{

    static public function all(){
    }
    static public function race(){
    }
    static public function any(){
    }
    static public function allSettled(){
    }
    static public function reject(){
    }
    static public function resolve(){
    }

    private $executor = null;
    public function __construct( $executor ){
        $this->executor = $executor;
    }

    public function then( $callback ){
    }

    public function catch( $callback ){
    }

    public function finally( $callback ){
    }

    public function execute(){}
}