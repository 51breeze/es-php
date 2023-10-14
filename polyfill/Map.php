<?php
///<references from='System' />
class Map {
    private $map = null;
    public function __construct( array $items=[] ){
        $this->map = new \Ds\Map();
        foreach($items as $key=>$item){
            if( is_array($item) && count($item) === 2 ){
                $this->map->put( $item[0], $item[1]);
            }else{
                $this->map->put( $key, $item);
            }
        }
    }

    public function __get($name){
        switch( $name ){
            case "size" :
                return count( $this->map );
            default :
                throw new \Error( $name.' is not exists.');    
        }
    }

    public function set( $key, $value ){
        $this->map->put($key, $value);
        return $this;
    }

    public function get( $key ){
        return $this->map->get($key, null);
    }

    public function clear(){
        $this->map->clear();
    }

    public function delete($key){
        $this->map->remove($key);
    }

    public function has( $key ){
        return $this->map->hasKey( $key );
    }

    public function keys(){
        $pairs = $this->map->pairs();
        $items = [];
        foreach($pairs as $pair){
            $items[] = $pair->key;
        }
        return System::getIterator( $items );
    }

    public function values(){
        $pairs = $this->map->pairs();
        $items = [];
        foreach($pairs as $pair){
            $items[] = $pair->value;
        }
        return System::getIterator( $items );
    }

    public function entries(){
        $pairs = $this->map->pairs();
        $items = [];
        foreach($pairs as $pair){
            $items[] = [$pair->key, $pair->value];
        }
        return System::getIterator( $items );
    }

    public function forEach( $callback , $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        $pairs = $this->map->pairs();
        foreach($pairs as $item){
            call_user_func($callback, $item->value, $item->key, $this);
        }
    }
}