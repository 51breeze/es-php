<?php
///<references from='DataView' />
///<references from='TypeArrayInterface' />
class ArrayBuffer
{
    public $bytes;
    public $byteLength = 0;
    
    public function __construct(int $length) {
        $this->bytes = str_repeat("\x00", $length);
        $this->byteLength = $length;
    }

    public function slice(int $start, int $end = null): self {
        $buffer = new self(0);
        if ($start < 0) {
            $start += $this->byteLength;
        }
        if ($end !== null) {
            if ($end < 0) {
                $end += $this->byteLength;
            }
            $buffer->bytes = substr($this->bytes, $start, max(0, $end - $start));
        } else {
            $buffer->bytes = substr($this->bytes, $start);
        }
        $buffer->byteLength = strlen($buffer->bytes);
        return $buffer;
    }

    public static function isView($object): bool {
        return $object instanceof DataView || $object instanceof TypeArrayInterface;
    }

}
