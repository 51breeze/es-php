<?php
///<references from='System' />
class WeakSet {
    private $set = null;
    public function __construct( array $items=[] ){
        $this->set = new \Ds\Set();
        foreach($items as $item){
            $this->set->add($item);
        }
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
}