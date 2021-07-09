<?php 

class RegExp {

    public $global = false;
    public $ignoreCase = false;
    public $lastIndex = 0;
    public $multiline = false;
    public $source    = null;
    private $flags = null;

    public function __construct($pattern, $flags=null){
        $this->source = $pattern;
        if( $flags && is_string($flags) ){
            $this->global = strpos($flags,'g') !== false || strpos($flags,'y') !== false;
            $this->multiline = strpos($flags,'m') !== false;
            $this->ignoreCase = strpos($flags,'i') !== false;
        }
        $this->flags = $flags;
    }

    private function getPattern(){
        $pattern = '/'.$this->source.'/';
        $flags   = $this->flags;
        return $flags ? $pattern.str_replace('g','',$flags) : $pattern;
    }

    public function test( $value ){
       return !!preg_match( $this->pattern, $value );
    }

    public function exec( $value ){
        $pattern = $this->getPattern();
        $matches = null;
        $result = preg_match( $pattern, $value, $matches, $this->lastIndex, PREG_OFFSET_CAPTURE );
        if( $result && $matches ){
            if( $this->global ){
                $this->lastIndex = isset($matches[0][0]) ? mb_strlen($matches[0][0] ) : 0;
            }
            $index = $matches[1][1] ?? 0;
            $result = new ArrayObject( array_map(function($item){
                return  $item[0];
            },$matches) );
            $result->index = $index;
            $result->input = $value;
            return $result;
        }
        return null;
    }

    public function match( $value ){

        $pattern = $this->getPattern();
        $matches = null;
        $result = $this->global ? preg_match_all( $pattern, $value, $matches, $this->lastIndex, PREG_OFFSET_CAPTURE) : 
                                  preg_match( $pattern, $value, $matches, $this->lastIndex, PREG_OFFSET_CAPTURE );
        if( $result && $matches ){
            $index = $matches[1][1] ?? 0;
            $result = new ArrayObject( array_map(function($item){
                return  $item[0];
            },$matches) );
            $result->index = $index;
            $result->input = $value;
            return $result;
        }
        return null;
    }

    public function matchAll( $value ){

        $pattern = $this->getPattern();
        $matches = null;
        $result = preg_match_all( $pattern, $value, $matches, $this->lastIndex, PREG_OFFSET_CAPTURE);
        if( $result && $matches ){
            $index = $matches[1][1] ?? 0;
            $result = new ArrayObject( array_map(function($item){
                return  $item[0];
            },$matches) );
            $result->index = $index;
            $result->input = $value;
            return $result;
        }
        return null;
    }


    public function replace( $value, $replacement){
        $pattern = $this->getPattern();
        $limit = $this->global ? -1 : 1;
        $result = is_callable($replacement) ? 
        preg_replace_callback($pattern, function($matches){
            return call_user_func_array( $replacement, $matches);
        }, $value, $limit) : preg_replace($pattern, $replacement, $value, $limit);
        return $result === null ? $value : $result;
    }

    public function replaceAll( $value, $replacement){
        $this->global = true;
        return $this->replace( $value, $replacement);
    }

    public function search( $value ){
        $pattern = $this->getPattern();
        $matches = null;
        $result = preg_match( $pattern, $value, $matches, $this->lastIndex, PREG_OFFSET_CAPTURE );
        return $matches[1][1] ?? -1;
    }

    public function toString(){
        $pattern = '/'.$this->source.'/';
        $flags   = $this->flags;
        $pattern = $flags ? $pattern.$flags : $pattern;
        return $pattern;
    }

}