<?php
///<references from='ArrayBuffer' />
class DataView
{
    protected $byteOffset = 0;
    protected $byteLength = 0;
    protected $buffer = null;

    private static function isLittleEndian(): bool {
        static $littleEndian = NULL;
        if (is_null($littleEndian)) {
            $testBytes = pack("S", 1);
            if ($testBytes[0] === "\x01") {
                $littleEndian = TRUE;
            } else if ($testBytes[1] === "\x01") {
                $littleEndian = false;
            } else {
                throw new \RuntimeException("Could not determine machine endianness; short 1 encoded as " . \bin2hex($testBytes));
            }
        }
        return $littleEndian;
    }

    public function __construct(ArrayBuffer $buffer, int $byteOffset = 0, int $byteLength = null) {

        if ($byteOffset < 0 || $byteOffset >= $buffer->byteLength) {
            throw new \Exception("byteOffset is out range");
        }
        $this->byteOffset = $byteOffset;
        $this->buffer = $buffer;
        if ($byteLength !== null) {
            if ( $byteLength < 0 || $byteOffset + $byteLength >= $this->buffer->byteLength) {
                throw new \Exception("The byteLength is out range" );
            }
            $this->byteLength = $byteLength;
        } else {
            $this->byteLength = $this->buffer->byteLength - $this->byteOffset;
        }
    }

    private function get(int $byteOffset, int $size, string $format, bool $isLittleEndian = false) {
        if ($byteOffset < 0) {
            throw new \InvalidArgumentException("\$byteOffset must be non-negative");
        }

        if ($this->byteOffset + $byteOffset + $size > $this->buffer->byteLength) {
            throw new \Exception("The \$byteOffset cannot reference an area beyond the end of the " . ArrayBuffer::class);
        }

        $bytes = &$this->buffer->bytes;
        $substr = substr($bytes, $this->byteOffset + $byteOffset, $size);
        if ( !$isLittleEndian ) {
            $substr = strrev($substr);
        }

        $value = unpack($format . 'value/', $substr);
        return $value['value'];
    }

    private function set(int $byteOffset, string $format, $value, bool $isLittleEndian = false) {
        if ($byteOffset < 0) {
            throw new \InvalidArgumentException("\$byteOffset must be non-negative");
        }

        $packed = pack($format, $value);

        if (!$isLittleEndian) {
            $packed = strrev($packed);
        }

        if ($this->byteOffset + $byteOffset + strlen($packed) > $this->buffer->byteLength) {
            throw new \Exception("The \$byteOffset cannot reference an area beyond the end of the " . ArrayBuffer::class);
        }

        $bytes = &$this->buffer->bytes;
        for ($i = 0; $i < strlen($packed); $i++) {
            $bytes[$this->byteOffset + $byteOffset + $i] = $packed[$i];
        }
    }

    public function getInt8(int $byteOffset): int {
        return $this->get($byteOffset, 1, 'c');
    }

    public function getUint8(int $byteOffset): int {
        return $this->get($byteOffset, 1, 'C');
    }

    public function getInt16(int $byteOffset, bool $littleEndian = false): int {
        $unsigned = $this->getUint16($byteOffset, $littleEndian);
        if ($unsigned >= (1 << 15)) {
            $unsigned -= 1 << 16;
        }
        return $unsigned;
    }

    public function getUint16(int $byteOffset, bool $littleEndian = false): int {
        return $this->get($byteOffset, 2, $littleEndian ? 'v' : 'n');
    }
    
    public function getInt32(int $byteOffset, bool $littleEndian = false): int {
        $unsigned = $this->getUint32($byteOffset, $littleEndian);
        if ($unsigned >= (1 << 31)) {
            $unsigned -= 1 << 32;
        }
        return $unsigned;
    }

    public function getUint32(int $byteOffset, bool $littleEndian = false): int {
        return $this->get($byteOffset, 4, $littleEndian ? 'V' : 'N');
    }

    public function getFloat32(int $byteOffset, bool $littleEndian = false): float {
        return $this->get($byteOffset, 4, 'f', $littleEndian !== self::isLittleEndian());
    }

    public function getFloat64(int $byteOffset, bool $littleEndian = false): float {
        return $this->get($byteOffset, 8, 'd', $littleEndian !== self::isLittleEndian());
    }

    public function setInt8(int $byteOffset, int $value) {
        $this->set($byteOffset, 'c', $value);
    }

    public function setUint8(int $byteOffset, int $value) {
        $this->set($byteOffset, 'C', $value);
    }

    public function setInt16(int $byteOffset, int $value, bool $littleEndian = false) {
        $signed = ($value < 0) ? $value + (1 << 16) : 0;
        $this->setUint16($byteOffset, $signed, $littleEndian);
    }

    public function setUint16(int $byteOffset, int $value, bool $littleEndian = false) {
        $this->set($byteOffset, $littleEndian ? 'v' : 'n', $value);
    }

    public function setInt32(int $byteOffset, int $value, bool $littleEndian = false) {
        $signed = ($value < 0) ? $value + (1 << 32) : 0;
        $this->setUint32($byteOffset, $signed, $littleEndian);
    }

    public function setUint32(int $byteOffset, int $value, bool $littleEndian = false) {
        $this->set($byteOffset, $littleEndian ? 'V' : 'N', $value);
    }

    public function setFloat32(int $byteOffset, float $value, bool $littleEndian = false) {
        $this->set($byteOffset, 'f', $value, $littleEndian !== self::isLittleEndian());
    }

    public function setFloat64(int $byteOffset, float $value, bool $littleEndian = false) {
        $this->set($byteOffset, 'd', $value, $littleEndian !== self::isLittleEndian());
    }
}
