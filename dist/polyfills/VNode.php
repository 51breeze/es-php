<?php
///<references from='web.components.Component' />

interface VNode {}

class Node implements VNode{
    public $type;
    public $attrs;
    public $children;
    public function __construct($type,$attrs,$children){
        $this->type = $type;
        $this->attrs = $attrs;
        $this->children = $children;
    }
}

function renderToString($vnode){
    static $render = null;
    static $make = null;
    if($make===null){
        $make = function($attrs,$delimiter='=')use(&$make){
            $props = [];
            if(!$attrs)return $props;
            foreach($attrs as $key=>$value){
                if(System::typeof($value) === 'object'){
                    $value=implode('',$make($value,':'));
                }
                if($delimiter === '='){
                    array_push($props,($key) . '="' . (strval($value)) . '"');
                }else{
                    array_push($props,($key) . ':' . (strval($value)));
                }
            }
            return $props;
        };
    }
    if($render===null){
        $render = function($vnode)use(&$render, &$make){
            if(is_string($vnode)){
                return $vnode;
            }else if(is_a($vnode, Component::class)){
                try{
                    $vnode->onInitialized();
                    $node = $vnode->render();
                    if($node){
                        return $render($node);
                    }
                }catch(\Exception $e){
                    $vnode->onErrorCaptured($e);
                }
                return '';
            }else if(is_array($vnode)){
                return implode('', array_map($render, $vnode));
            }else if(is_a($vnode, VNode::class)){
                $type = $vnode->type;
                $children = $vnode->children;
                $props = $make($vnode->attrs);
                
                $children = array_map(function($child)use(&$render){
                    $type = System::typeof($child);
                    if($type === 'number' || $type === 'string'){
                        return $child;
                    }else{
                        return $render($child);
                    }
                },$children);
                if(count($props) > 0){
                    return '<' . ($type) . ' ' . (implode(' ',$props)) . '>' . (implode('',$children)) . '</' . ($type) . '>';
                }
                return '<' . ($type) . '>' . (implode('',$children)) . '</' . ($type) . '>';
            }else{
                throw new \Exception( "'".gettype($vnode)."' is not support");
            }
        };
    }

    return $render($vnode);
}

function createVNode($type, $attrs=null, $children=null){
    if(class_exists($type, false)){
        $com = new $type($attrs ?? []);
        if($children){
            $com->setSlots($children);
        }
        return $com;
    }
    return new Node($type, $attrs ?: [], $children ?: []);
}