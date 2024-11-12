<?php
///<references from='ArrayBuffer' />
///<references from='System' />
abstract class TypeArrayInterface implements \ArrayAccess
{
    public $byteLength = 0;
    public $byteOffset = 0;
    public $length = 0;
    public $buffer = null;

    static public function from(){

    }

    static public function  of(){

    }

    public function __construct($buffer, int $byteOffset = 0, int $length = null) {
        if (is_int($buffer)) {
            $this->byteLength = static::BYTES_PER_ELEMENT * $buffer;
            $this->length = $buffer;
            $this->buffer = new ArrayBuffer($this->byteLength);
        } else if (is_array($buffer)) {
            $this->length = count($buffer);
            $this->byteLength = $this->length * static::BYTES_PER_ELEMENT;
            $this->buffer = new ArrayBuffer($this->byteLength);
            $this->set($buffer);
        }else if( $buffer instanceof TypeArrayInterface) {
            $this->buffer = $buffer->buffer->slice(0);
            $this->byteLength = $buffer->byteLength;
            $this->byteOffset = $buffer->byteOffset;
            $this->length = $buffer->length;
        }else if ($buffer instanceof ArrayBuffer) {
            $this->buffer = $buffer;
            $this->byteOffset = $byteOffset;
            $this->byteLength = $buffer->byteLength;
            if ( $byteOffset % static::BYTES_PER_ELEMENT !== 0) {
                throw new \InvalidArgumentException("the byteOffset of ".static::class." should be a multiple of ".static::BYTES_PER_ELEMENT );
            }else if ( $byteOffset >= $buffer->byteLength) {
                throw new \InvalidArgumentException("Start byteOffset ".$byteOffset." is outside the bounds of the buffer ");
            }
            if ($length !== null) {
                $len = $byteOffset + $length * static::BYTES_PER_ELEMENT;
                if ($len > $buffer->byteLength) {
                    throw new \InvalidArgumentException("Invaild length");
                }
                $this->length = $length;
            } else {
                if (($buffer->byteLength - $byteOffset) % static::BYTES_PER_ELEMENT !== 0) {
                    throw new \InvalidArgumentException("The length of the " . ArrayBuffer::class . " minus the byteOffset must be a multiple of the element size");
                }
                $this->length = $this->byteLength / static::BYTES_PER_ELEMENT;
            }
        } else {
            throw new \InvalidArgumentException("Integer, " . static::class . " or " . ArrayBuffer::clsss . " expected for first parameter, " . gettype($buffer) . " given");
        }
       
    }

    public function offsetExists($offset): bool {
        if (!is_int($offset)) {
            throw new \InvalidArgumentException("Only integer offsets accepted");
        }
        return (0 <= $offset && $offset < $this->length);
    }
    
    public function offsetUnset($offset) {
        throw new \Exception("unset() cannot be used on " . static::class);
    }
    
    public function offsetGet($offset) {
        if (!is_int($offset)) {
            throw new \InvalidArgumentException("Only integer offsets accepted");
        }
        if ($offset >= $this->length || $offset < 0) {
            throw new \InvalidArgumentException("The offset cannot be outside the array bounds");
        }

        $bytes = &$this->buffer->bytes;
        $substr = substr($bytes, $this->byteOffset + $offset * static::BYTES_PER_ELEMENT, static::BYTES_PER_ELEMENT);
        $value = unpack(static::ELEMENT_PACK_CODE . 'value/', $substr);
        return $value['value'];
    }

    public function offsetSet($offset, $value) {
        if (!is_int($offset)) {
            throw new \InvalidArgumentException("Only integer offsets accepted");
        }
        if (!is_int($value) && !is_float($value)) {
            throw new \InvalidArgumentException("Value must be an integer or a float");
        }
        if ($offset >= $this->length || $offset < 0) {
            throw new \InvalidArgumentException("The offset cannot be outside the array bounds");
        }

        $packed = pack(static::ELEMENT_PACK_CODE, $value);
        $bytes = &$this->buffer->bytes;
        for ($i = 0; $i < static::BYTES_PER_ELEMENT; $i++) {
            $bytes[$this->byteOffset + $offset * static::BYTES_PER_ELEMENT + $i] = $packed[$i];
        }
    }

    public function __set($name, $value){
        if(is_numeric($name)){
            $this->offsetSet((int)$name, $value);
        }else{
            $this[$name] = $value;
        }
    }

    public function __get($name){
        if(is_numeric($name)){
            return $this->offsetGet((int)$name);
        }else{
            return $this[$name];
        }
    }

    public function set($object, int $offset = 0) {
        if ($object instanceof TypeArrayInterface) {
            $length = $object->length;
        } else if (is_array($object)) {
            $length = count($object);
        } else {
            throw new \InvalidArgumentException("The 'object' param expected is Array or " .  static::class . ", " . gettype($object) . " given");
        }
        for ($i = 0; $i < $length; $i++) {
            $this[$offset+$i] = $object[$i];
        }
    }

    public function subarray(int $begin, int $end = null): self {
        if ($begin < 0)$begin += $this->length;
        $begin = max(0, $begin);
        if( $end === null) $end= $this->length;
        if ($end < 0)$end += $this->length;
        $end = min($this->length, $end);
        $length = max($end - $begin, 0);
        return new static($this->buffer, $this->byteOffset + static::BYTES_PER_ELEMENT * $begin, $length);
    }

    public function at( int $index ){
        if( $index >= 0 && $index < $this->length ){
            return $this[ $index ];
        }
        return null;
    }

    public function copyWithin(int $target, int $begin=0, int $end=null){
        if ($begin < 0)$begin += $this->length;
        $begin = max(0, $begin);
        if( $end === null) $end= $this->length;
        if ($end < 0)$end += $this->length;
        $end = min($this->length, $end);
        $length = max($end - $begin, 0);
        $copies = [];
        for($i=0;$i<$length;$i++){
            $copies[] = $this[$begin+$i];
        }
        $startAt = $target;
        if ($startAt < 0) {
            $startAt += $this->length;
        }
        $startAt = min( max(0, $startAt), $this->length);
        for($b=0;$b<$length;$b++){
            $this[$startAt+$b] = $copies[$b];
        }
        return $this;
    }

    public function entries(){
        $bytes = [];
        for($i=0;$i<$this->length;$i++){
            $bytes[] = [$i, $this[$i]];
        }
        return System::getIterator( $bytes );
    }

    public function every($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        for($i=0;$i<$this->length;$i++){
            if( !call_user_func($callback, $this[$i], $i, $this) ){
                return false;
            }
        }
        return true;
    }

    public function some($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        $flag = true;
        for($i=0;$i<$this->length;$i++){
            $flag = false;
            if( call_user_func($callback, $this[$i], $i, $this) ){
                return true;
            }
        }
        return $flag;
    }

    public function fill($value, int $begin=0, int $end=null){
        if ($begin < 0)$begin += $this->length;
        $begin = max(0, $begin);
        if( $end === null) $end= $this->length;
        if ($end < 0)$end += $this->length;
        $end = min($this->length, $end);
        $length = max($end - $begin, 0);
        for($i=0;$i<$length;$i++){
            $this[$begin+$i]=$value;
        }
        return $this;
    }

    public function filter($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        $bytes = [];
        for($i=0;$i<$this->length;$i++){
            $elem = $this[$i];
            if( call_user_func($callback, $elem, $i, $this) ){
                $bytes[] =  $elem;
            }
        }
        $len = count($bytes);
        $newObject = new static( $len );
        for($pos=0;$pos<$len;$pos++){
            $newObject[$pos] = $bytes[$pos];
        }
        unset($bytes);
        return $newObject;
    }

    public function find($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        for($i=0;$i<$this->length;$i++){
            $elem = $this[$i];
            if( call_user_func($callback, $elem, $i, $this) ){
                return  $elem;
            }
        }
        return null;
    }

    public function findIndex($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        for($i=0;$i<$this->length;$i++){
            if( call_user_func($callback, $this[$i], $i, $this) ){
                return $i;
            }
        }
        return -1;
    }

    public function findLast($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        for($i=$this->length-1;$i>=0;$i--){
            $elem = $this[$i];
            if( call_user_func($callback, $elem, $i, $this) ){
                return  $elem;
            }
        }
        return null;
    }

    public function findLastIndex($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        for($i=$this->length-1;$i>=0;$i--){
            if( call_user_func($callback, $this[$i], $i, $this) ){
                return $i;
            }
        }
        return -1;
    }

    public function forEach($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        for($i=0;$i<$this->length;$i++){
            call_user_func($callback, $this[$i], $i, $this);
        }
        return $this;
    }
   
    public function includes($searchElement,$fromIndex=0){
        $len = $this->length;
        $i = min(max(0,$fromIndex),$len);
        for(;$i<$len;$i++){
            if( $this[$i] === $searchElement ){
                return true;
            }
        }
        return false;
    }

    public function indexOf($searchElement,$fromIndex=0){
        $len = $this->length;
        $i = min(max(0,$fromIndex),$len);
        for(;$i<$len;$i++){
            if( $this[$i] === $searchElement ){
                return $i;
            }
        }
        return -1;
    }

    public function join($separator=','){
        $bytes = [];
        $len = $this->length;
        for($i=0;$i<$len;$i++){
            $bytes[] = $this[$i];
        }
        return implode($separator, $bytes);
    }

    public function keys(){
        $bytes = [];
        for($i=0;$i<$this->length;$i++){
            $bytes[] = $i;
        }
        return System::getIterator( $bytes );
    }

    public function lastIndexOf($searchElement,$fromIndex=null){
        $len = $this->length;
        if($fromIndex===null)$fromIndex = $len;
        $i = min(max(0,$fromIndex),$len);
        for(;$i>0;){
            if( $this[--$i] === $searchElement ){
                return $i;
            }
        }
        return -1;
    }

    public function map($callback, $thisArg=null){
        $callback = $thisArg ? System::bind( $callback, $thisArg) : $callback;
        $bytes = [];
        $len = $this->length;
        for($i=0;$i<$len;$i++){
            $bytes[] = call_user_func($callback,$this[$i], $i, $this);
        }
        $newObject = new static( $len );
        for($pos=0;$pos<$len;$pos++){
            $newObject[$pos] = $bytes[$pos];
        }
        unset($bytes);
        return $newObject;
    }
   
    public function reduce($callback, $initialValue=null){
        $len = $this->length;
        $accumulator = $initialValue;
        for($i=0;$i<$len;$i++){
            if( $accumulator !== null ){
                $accumulator = call_user_func($callback, $accumulator, $this[$i], $i, $this);
            }else{
                $accumulator = $this[$i];
            }
        }
        return $accumulator;
    }

    public function reduceRight($callback, $initialValue=null){
        $i = $this->length;
        $accumulator = $initialValue;
        for(;$i>0;){
            $i--;
            if( $accumulator !== null ){
                $accumulator = call_user_func($callback, $accumulator, $this[$i], $i, $this);
            }else{
                $accumulator = $this[$i];
            }
        }
        return $accumulator;
    }

    public function reverse(){
        $bytes = [];
        $len = $this->length;
        for($i=0;$i<$len;$i++){
            $bytes[] = $this[$i];
        }
        for($i=0;$i<$len;$i++){
            $at = $len-$i;
            $this[$i] = $bytes[$at-1];
        }
        unset($bytes);
        return $this;
    }

    public function slice(int $begin=0, int $end=null){
        $bytes = [];
        if ($begin < 0)$begin += $this->length;
        $begin = max(0, $begin);
        if( $end === null) $end= $this->length;
        if ($end < 0)$end += $this->length;
        $end = min($this->length, $end);
        $length = max($end - $begin, 0);
        for($i=0;$i<$length;$i++){
            $bytes[] = $this[$i];
        }
        $newObject = new static( $length );
        for($i=0;$i<$length;$i++){
            $newObject[$i] = $bytes[$i];
        }
        return $newObject;
    }

    public function sort( $callback =null ){
        $bytes = [];
        $len = $this->length;
        for($i=0;$i<$len;$i++){
            $bytes[] = $this[$i];
        }
        if( $callback !== null && is_callable($callback) ){
            usort($bytes, $callback);
        }else{
            sort($bytes);
        }
        for($i=0;$i<$len;$i++){
            $this[$i] = $bytes[$i];
        }
        unset($bytes);
        return $this;
    }

    public function values(){
        $bytes = [];
        for($i=0;$i<$this->length;$i++){
            $bytes[] = $this[$i];
        }
        return System::getIterator( $bytes );
    }

    public function toLocaleString(){
        return $this->toString();
    }

    public function toString(){
        $bytes = [];
        for($i=0;$i<$this->length;$i++){
            $bytes[] = $this[$i];
        }
        return '['.implode(', ', $bytes).']';
    }
}
