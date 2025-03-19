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
    if(is_string($vnode)){
        return $vnode;
    }else if(is_a($vnode, Component::class)){
        try{
            $vnode->onInitialized();
            $node = $vnode->render();
            if($node){
                if(is_array($node)){
                   return implode('', array_map(renderToString, $node));
                }else if(is_string($node)){
                    return $node;
                }
                return renderToString($node);
            }
        }catch(\Exception $e){
            $vnode->onErrorCaptured($e);
        }
        return '';
    }
    if(!is_a($vnode, VNode::class)){
        var_dump($vnode);
        return '';
    }
    $type = $vnode->type;
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
            if(is_array($child)){
                return implode('', array_map(renderToString, $child));
            }
            return renderToString($child);
        }
    },$children);
    if(count($props) > 0){
        return '<' . ($type) . ' ' . (implode(' ',$props)) . '>' . (implode('',$children)) . '</' . ($type) . '>';
    }
    return '<' . ($type) . '>' . (implode('',$children)) . '</' . ($type) . '>';
}

function createVNode($type, $attrs=null, $children=null){
    if(is_string($type)){
        return new Node($type,$attrs ?: [], $children ?: []);
    }else{
        return new $type($attrs?:[]);
    }
}