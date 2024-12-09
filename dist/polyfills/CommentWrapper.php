<?php
///<namespaces name="manifest"/>

class CommentWrapper{

    const TOP       = 'top';
    const CONSTRUCT = 'constructor';
    const METHOD    = 'method';
    const GETTER    = 'getter';
    const SETTER    = 'setter';
    const PROPERTY  = 'property';

    private $data = null;
    private $values = null;

    public function __construct(array $data=[]){
        $this->data = $data;
    }

    public function getMetadata(){
        return $this->data;
    }

    public function get(string $name, string $kind = CommentWrapper::METHOD){
        $key = $name.':'.$kind;
        return $this->data[$key] ?? null;
    }

    public function values(){
        $values = $this->values;
        if($values !== null){
            return $values;
        }
        $values = $this->forMap(function($comment, $name, $kind){
            return [
                'name'=>$name,
                'kind'=>$kind,
                'comment'=>$comment
            ];
        });
        return $this->values = $values;
    }

    public function forEach(callable $callback){
        foreach($this->data as $key=>&$value){
            list($name, $kind) = explode(':', $key, 2);
            call_user_func($callback, $value, $name, $kind);
        }
        unset($value);
    }

    public function forMap(callable $callback){
        $items = [];
        foreach($this->data as $key=>&$value){
            list($name, $kind) = explode(':', $key, 2);
            array_push($items, call_user_func($callback, $value, $name, $kind));
        }
        unset($value);
        return $items;
    }
}