<?php
///<namespaces name="web" />

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

function withCtx(\Closure $fn){
    
}