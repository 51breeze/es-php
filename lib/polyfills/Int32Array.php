<?php
///<references from='TypeArrayInterface' />
class Int32Array extends TypeArrayInterface
{
    const BYTES_PER_ELEMENT = 4;
    const ELEMENT_PACK_CODE = 'l';
}
