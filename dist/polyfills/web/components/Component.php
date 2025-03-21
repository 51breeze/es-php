<?php
///<namespaces name="web.components" />
class Component{

    private $props;
    private $slots = [];
    private $refs = [];

    public function __construct($props){
        $this->props = $props ?: [];
    }

    public function getProps($name){
        if($name){
            return $this->props[$name] ?? null;
        }
        return $this->props;
    }

    public function setSlots(array $slots){
        $this->slots = $slots;
    }

    public function getSlots(){
        return $this->slots;
    }

    public function onInitialized(){

    }

    public function onBeforeMount(){
        
    }

    public function onMounted(){

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

    public function setRefNode(string $name, $value, $isArray=false){
        if($isArray){
            $exists = $this->refs[$name] ?? null;
            if($exists){
                if(is_array($exists)){
                    array_push($exists, $value);
                    $this->refs[$name] = $exists;
                }else{
                    $this->refs[$name] = [$exists, $value];
                }
            }else{
                $this->refs[$name] = [$value];
            }
        }else{
            $this->refs[$name] = $value;
        }
    }

    public function setRef(string $name, $value, $isArray=false){
        if(!$value)return;
        if($isArray){
            $exists = $this->refs[$name] ?? null;
            if($exists){
                if(is_array($exists)){
                    array_push($exists, $value);
                    $this->refs[$name] = $exists;
                }else{
                    $this->refs[$name] = [$exists, $value];
                }
            }else{
                $this->refs[$name] = [$value];
            }
        }else if(is_string($name)){
            $this->refs[$name] = $value;
        }
    }

    public function getRef(string $name){
        return $this->refs[$name] ?? null;
    }
}