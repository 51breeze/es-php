<?php
///<references from='System' />
class WeakMap {
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

    public function set( $key, $value ){
        $this->map->put($key, $value);
    }

    public function get( $key ){
        return $this->map->get($key, null);
    }

    public function delete($key){
        $this->map->remove($key);
    }

    public function has( $key ){
        return $this->map->hasKey( $key );
    }
}