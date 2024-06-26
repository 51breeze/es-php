
/**
 * Add two arbitrary precision numbers
 * @link https://php.net/manual/en/function.bcadd.php
 * @param string $num1 <p>
 * The left operand, as a string.
 * </p>
 * @param string $num2 <p>
 * The right operand, as a string.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string The sum of the two operands, as a string.
 */
declare function bcadd(num1:string,num2:string,scale?:int = 0): string

/**
 * Subtract one arbitrary precision number from another
 * @link https://php.net/manual/en/function.bcsub.php
 * @param string $num1 <p>
 * The left operand, as a string.
 * </p>
 * @param string $num2 <p>
 * The right operand, as a string.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string The result of the subtraction, as a string.
 */
declare function bcsub(num1:string,num2:string,scale?:int = 0): string

/**
 * Multiply two arbitrary precision numbers
 * @link https://php.net/manual/en/function.bcmul.php
 * @param string $num1 <p>
 * The left operand, as a string.
 * </p>
 * @param string $num2 <p>
 * The right operand, as a string.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string the result as a string.
 */
declare function bcmul(num1:string,num2:string,scale?:int = 0): string

/**
 * Divide two arbitrary precision numbers
 * @link https://php.net/manual/en/function.bcdiv.php
 * @param string $num1 <p>
 * The dividend, as a string.
 * </p>
 * @param string $num2 <p>
 * The divisor, as a string.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string|null the result of the division as a string, or <b>NULL</b> if
 * <i>divisor</i> is 0.
 */
declare function bcdiv(num1:string,num2:string):string|null

/**
 * Divide two arbitrary precision numbers
 * @link https://php.net/manual/en/function.bcdiv.php
 * @param string $num1 <p>
 * The dividend, as a string.
 * </p>
 * @param string $num2 <p>
 * The divisor, as a string.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string the result of the division as a string.
 * @throws \DivisionByZeroError if <i>divisor</i> is 0. Available since PHP 8.0.
 */
declare function bcdiv(num1:string,num2:string,scale:int): string

/**
 * Get modulus of an arbitrary precision number
 * @link https://php.net/manual/en/function.bcmod.php
 * @param string $num1 <p>
 * The dividend, as a string. Since PHP 7.2, the divided is no longer truncated to an integer.
 * </p>
 * @param string $num2 <p>
 * The divisor, as a string. Since PHP 7.2, the divisor is no longer truncated to an integer.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set. Available since PHP 7.2.
 * </p>
 * @return string|null the modulus as a string, or <b>NULL</b> if
 * <i>divisor</i> is 0.
 */
declare function bcmod(num1:string,num2:string):string|null

/**
 * Get modulus of an arbitrary precision number
 * @link https://php.net/manual/en/function.bcmod.php
 * @param string $num1 <p>
 * The dividend, as a string. Since PHP 7.2, the divided is no longer truncated to an integer.
 * </p>
 * @param string $num2 <p>
 * The divisor, as a string. Since PHP 7.2, the divisor is no longer truncated to an integer.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set. Available since PHP 7.2.
 * </p>
 * @return string the modulus as a string.
 * @throws \DivisionByZeroError if <i>divisor</i> is 0. Available since PHP 8.0.
 */
declare function bcmod(num1:string,num2:string,scale:int): string

/**
 * Raise an arbitrary precision number to another
 * @link https://php.net/manual/en/function.bcpow.php
 * @param string $num <p>
 * The base, as a string.
 * </p>
 * @param string $exponent <p>
 * The exponent, as a string. If the exponent is non-integral, it is truncated.
 * The valid range of the exponent is platform specific, but is at least
 * -2147483648 to 2147483647.
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string the result as a string.
 */
declare function bcpow(num:string,exponent:string,scale?:int = 0): string

/**
 * Get the square root of an arbitrary precision number
 * @link https://php.net/manual/en/function.bcsqrt.php
 * @param string $num <p>
 * The operand, as a string.
 * </p>
 * @param int|null $scale [optional]
 * @return string|null the square root as a string, or <b>NULL</b> if
 * <i>operand</i> is negative.
 */
declare function bcsqrt(num:string,scale?:int):string|null

/**
 * Set default scale parameter for all bc math functions
 * @link https://php.net/manual/en/function.bcscale.php
 * @param int $scale
 * @return int|boolean
 */
declare function bcscale(scale:int):int|boolean

/**
 * Set default scale parameter for all bc math functions
 * @link https://php.net/manual/en/function.bcscale.php
 * @param int|null $scale
 * @return int Returns the old scale when used as setter. Otherwise the current scale is returned.
 */
declare function bcscale(): int

/**
 * Compare two arbitrary precision numbers
 * @link https://php.net/manual/en/function.bccomp.php
 * @param string $num1 <p>
 * The left operand, as a string.
 * </p>
 * @param string $num2 <p>
 * The right operand, as a string.
 * </p>
 * @param int|null $scale [optional] <p>
 * The optional <i>scale</i> parameter is used to set the
 * number of digits after the decimal place which will be used in the
 * comparison.
 * </p>
 * @return int 0 if the two operands are equal, 1 if the
 * <i>left_operand</i> is larger than the
 * <i>right_operand</i>, -1 otherwise.
 */
declare function bccomp(num1:string,num2:string,scale?:int = 0): int

/**
 * Raise an arbitrary precision number to another, reduced by a specified modulus
 * @link https://php.net/manual/en/function.bcpowmod.php
 * @param string $num <p>
 * The base, as an integral string (i.e. the scale has to be zero).
 * </p>
 * @param string $exponent <p>
 * The exponent, as an non-negative, integral string (i.e. the scale has to be
 * zero).
 * </p>
 * @param string $modulus <p>
 * The modulus, as an integral string (i.e. the scale has to be zero).
 * </p>
 * @param int|null $scale [optional] <p>
 * This optional parameter is used to set the number of digits after the
 * decimal place in the result. If omitted, it will default to the scale
 * set globally with the {@link bcscale()} function, or fallback to 0 if
 * this has not been set.
 * </p>
 * @return string|null the result as a string, or <b>NULL</b> if <i>modulus</i>
 * is 0 or <i>exponent</i> is negative.
 */
declare function bcpowmod(num:string,exponent:string,modulus:string,scale?:int = 0):string|null
