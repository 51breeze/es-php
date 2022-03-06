<?php
/*
 * EaseScript
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
namespace es\core;
require_once('es/core/Number.php');
require_once('es/core/String.php');
interface IIterator{
    public function next();
    public function rewind();
}