<?php
///<references from='System' />
class Set {
    private $set = null;
    public function __construct( array $items=[] ){
        $this->set = new \Ds\Set();
        foreach($items as $item){
            $this->set->add($item);
        }
    }

    public function __get($name){
        switch( $name ){
            case "size" :
                return count( $this->set );
            default :
                throw new \Error( $name.' is not exists.');    
        }
    }

    public function clear(){
        $this->set->clear();
    }

    public function delete($value){
        $this->set->remove($value);
    }

    public function add( $value ){
        $this->set->add($value);
        return $this;
    }

    public function has( $value ){
        return $this->set->contains( $value );
    }

    public function keys(){
        return $this->values();
    }

    public function values(){
        $pairs = $this->set->toArray();
        $items = [];
        foreach($pairs as $pair){
            $items[] = $pair;
        }
        return System::getIterator( $items );
    }

    public function entries(){
        $pairs = $this->set->toArray();
        $items = [];
        foreach($pairs as $pair){
            $items[] = [$pair, $pair];
        }
        return System::getIterator( $items );
    }

    public function forEach( $callback , $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        $pairs = $this->set->toArray();
        foreach($pairs as $item){
            call_user_func($callback, $item, $item, $this);
        }
    }
}