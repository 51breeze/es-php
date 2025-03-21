<?php
///<namespaces name="web" />
///<references from='System' />
///<references from='web.VNode' />
///<references from='web.components.Component' />

class __RCT{
    public static $currentRenderInstance = null;
    public static function makeAttrs($attrs,$delimiter='='){
        $props = [];
        if(!$attrs)return $props;
        foreach($attrs as $key=>$value){
            if($key==='ref')continue;
            if(System::typeof($value) === 'object'){
                $value=implode('',self::makeAttrs($value,':'));
            }
            if($delimiter === '='){
                array_push($props,($key) . '="' . (strval($value)) . '"');
            }else{
                array_push($props,($key) . ':' . (strval($value)));
            }
        }
        return $props;
    }
    public static function toString($vnode){
        if(is_null($vnode))return '';
        if(is_scalar($vnode)){
            return $vnode;
        }else if(is_array($vnode)){
            return implode('', array_map([self::class, 'toString'], $vnode));
        }else if(is_a($vnode, VNode::class)){
            $type = $vnode->type;
            $children = $vnode->children;
            $props = self::makeAttrs($vnode->attrs);
            $children = array_map([self::class, 'toString'],$children);
            if($type==='text'){
                return $children;
            }else if($type==='comment'){
                return '<--'.$children.'-->';
            }
            if(count($props) > 0){
                return '<' . ($type) . ' ' . (implode(' ',$props)) . '>' . (implode('',$children)) . '</' . ($type) . '>';
            }
            return '<' . ($type) . '>' . (implode('',$children)) . '</' . ($type) . '>';
        }else if(is_a($vnode, Component::class)){
            try{
                self::$currentRenderInstance = $vnode;
                $vnode->onInitialized();
                $vnode->onBeforeMount();
                $node = $vnode->render();
                $vnode->onMounted();
                if($node){
                    return self::toString($node);
                }
            }catch(\Exception $e){
                $vnode->onErrorCaptured($e);
                return $e->getMessage();
            }
            return '';
        }else{
            throw new \Exception( "'".gettype($vnode)."' is not support");
        }
    }
}

function renderSlot(array $slots, string $name, $props = []){
    $slot = $slots[$name] ?? null;
    if($slot){
        if(is_callable($slot)){
            return call_user_func($slot, $props);
        }
        return $slot;
    }
    return null;
}

function normalizeClass(){
    
}

function renderToString($vnode){
    return __RCT::toString($vnode);
}

function createComponent($type, $attrs=null, $children=null){
    $com = new $type($attrs ?? []);
    if($children){
        $com->setSlots($children);
    }
    $ref = $com->getProps('ref');
    if($ref){
        $currentRenderInstance = __RCT::$currentRenderInstance;
        if($currentRenderInstance){
            if(is_array($ref) && count($ref)===2){
                $currentRenderInstance->setRef($ref[0], $com, $ref[1]);
            }else{
                $currentRenderInstance->setRef($ref, $com);
            }
        }
    }
    return $com;
}

function createTextVNode($text){
    return new VNode('text', [],  [$text]);
}

function createCommentVNode($text){
    return new VNode('comment', [],  [$text]);
}

function createVNode($type, $attrs=null, $children=null){
    $node = new VNode($type, $attrs ?: [], $children ?: []);
    $ref = $node->attrs['ref'] ?? null;
    if($ref){
        $currentRenderInstance = __RCT::$currentRenderInstance;
        if($currentRenderInstance){
            if(is_array($ref) && count($ref)===2){
                $currentRenderInstance->setRef($ref[0], $node, $ref[1]);
            }else{
                $currentRenderInstance->setRef($ref, $node);
            }
        }
    }
    return $node;
}