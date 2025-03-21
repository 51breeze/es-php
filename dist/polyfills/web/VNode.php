<?php
///<namespaces name="web" />
class VNode{
    public $type;
    public $attrs;
    public $children;
    public function __construct($type,$attrs,$children){
        $this->type = $type;
        $this->attrs = $attrs;
        $this->children = $children;
    }
}