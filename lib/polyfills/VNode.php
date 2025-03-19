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

function renderToString(VNode $vnode){
    $type = $vnode->type;
    if(is_a($type, Component::class)){
        try{
            $type->onInitialized();
            $node = $type->render();
            if($node){
                if(is_array($node)){
                   return implode('', array_map(renderToString, $node));
                }else if(is_string($node)){
                    return $node;
                }
                return renderToString($node);
            }
        }catch(\Exception $e){
            $type->onErrorCaptured($e);
        }
        return '';
    }
    $attrs = $vnode->attrs;
    $children = $vnode->children;
    $props = [];
    if($attrs){
        $create = function($attrs,$delimiter='=')use(&$create){
            $props = [];
            foreach($attrs as $key=>$value){
                if(System::typeof($value) === 'object'){
                    $value=implode('',$create($value,':'));
                }
                if($delimiter === '='){
                    array_push($props,($key) . '="' . (strval($value)) . '"');
                }else{
                    array_push($props,($key) . ':' . (strval($value)));
                }
            }
            return $props;
        };
        $props = $create($attrs);
    }
    $children = array_map(function($child){
        $type = System::typeof($child);
        if($type === 'number' || $type === 'string'){
            return $child;
        }else{
            return renderToString($child);
        }
    },$children);
    if(count($props) > 0){
        return '<' . ($type) . ' ' . (implode(' ',$props)) . '>' . (implode('',$children)) . '</' . ($type) . '>';
    }
    return '<' . ($type) . '>' . (implode('',$children)) . '</' . ($type) . '>';
}

function createVNode($type, array $attrs, array $children){
    if(is_string($type)){
        return new Node($type,$attrs,$children);
    }else{
        return new $type($attrs);
    }
}