<?php 

class RegExp {

    private $pattern = null;
    private $global = false;
    public  $lastIndex = 0;
    public function __construct($pattern, $global=false){
        $this->pattern = $pattern;
        $this->global = $global;
    }

    public function test( $value ){
       return !!preg_match( $this->pattern, $value );
    }

    public function exec( $value ){
        if( $this->global ){
            $matches = null;
            preg_match( $this->pattern, $value, $matches, $this->lastIndex, PREG_OFFSET_CAPTURE );
            if( $matches ){
                $index = $matches[1][1] ?? 0;
                $result = new ArrayObject( array_map(function($item){
                    return  $item[0];
                },$matches) );
                $result->index = $index;
                $result->input = $value;
                return $result;
            }
        }
        return !!preg_match( $this->pattern, $value );
    }

}