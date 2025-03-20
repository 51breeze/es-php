<?php
///<namespaces name="web.components" />

class Component{

    private $props;
    private $slots = [];

    public function __construct(array $props = []){
        $this->props = $props;
    }

    public function setSlots(array $slots){
        $this->slots = $slots;
    }

    public function getSlots(){
        return $this->slots;
    }

    public function renderSlot(string $name){

    }

    public function onInitialized(){

    }

    public function render(){
        return null;
    }
   
    protected function forceUpdate(){

    }

    protected function provide(string $name, $provider){
        
    }

    protected function inject(string $name, string $from, $defaultValue){

    }

    public function onErrorCaptured(\Exception $e){
       throw $e;
    }

    public function getAttribute(string $name){
        if($name==="slots"){
            return $this->slots;
        }
        return $this->props[$name] ?? null;
    }
}