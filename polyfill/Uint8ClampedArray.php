<?php
///<references from='TypeArrayInterface' />
class Uint8ClampedArray extends TypeArrayInterface
{
    const BYTES_PER_ELEMENT = 1;
    const ELEMENT_PACK_CODE = 'C';

    public function offsetSet($offset, $value) {
        if (is_int($value) || is_float($value)) {
            $value = max(0, min($value, 255));
        }
        return parent::offsetSet($offset, $value);
    }
}
