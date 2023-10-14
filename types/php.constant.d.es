declare const __FILE__:string;
declare const __DIR__:string;

declare const FILTER_SANITIZE_EMAIL:number;
declare const FILTER_SANITIZE_ENCODED:number;
declare const FILTER_SANITIZE_MAGIC_QUOTES:number;
declare const FILTER_SANITIZE_ADD_SLASHES:number;
declare const FILTER_SANITIZE_NUMBER_FLOAT:number;
declare const FILTER_SANITIZE_NUMBER_INT:number;
declare const FILTER_SANITIZE_SPECIAL_CHARS:number;
declare const FILTER_SANITIZE_FULL_SPECIAL_CHARS:number;
declare const FILTER_SANITIZE_STRING:number;
declare const FILTER_SANITIZE_STRIPPED:number;
declare const FILTER_SANITIZE_URL:number;
declare const FILTER_UNSAFE_RAW:number;

declare const FILTER_FLAG_STRIP_LOW:number;
declare const FILTER_FLAG_STRIP_HIGH:number;
declare const FILTER_FLAG_STRIP_BACKTICK:number;
declare const FILTER_FLAG_ENCODE_LOW:number;
declare const FILTER_FLAG_ENCODE_HIGH:number;

declare const FILTER_FLAG_ALLOW_FRACTION:number;
declare const FILTER_FLAG_ALLOW_THOUSAND:number;
declare const FILTER_FLAG_ALLOW_SCIENTIFIC:number;

declare const FILTER_FLAG_NO_ENCODE_QUOTES:number;
declare const FILTER_FLAG_ENCODE_AMP:number;


/**
 * Silently discard invalid code unit sequences instead of returning an empty string.
 * Using this flag is discouraged as it may have security implications.
 * @link https://php.net/manual/en/function.htmlspecialchars.php
 */
declare const ENT_IGNORE:number;
declare const STR_PAD_LEFT:number;
declare const STR_PAD_RIGHT:number;
declare const STR_PAD_BOTH:number;
declare const PATHINFO_DIRNAME:number;
declare const PATHINFO_BASENAME:number;
declare const PATHINFO_EXTENSION:number;

/**
 * @link https://php.net/manual/en/filesystem.constants.php
 */
declare const PATHINFO_FILENAME:number;
declare const PATHINFO_ALL:number;
declare const CHAR_MAX:number;
declare const LC_CTYPE:number;
declare const LC_NUMERIC:number;
declare const LC_TIME:number;
declare const LC_COLLATE:number;
declare const LC_MONETARY:number;
declare const LC_ALL:number;
declare const LC_MESSAGES:number;
declare const SEEK_SET:number;
declare const SEEK_CUR:number;
declare const SEEK_END:number;


/**
 * CASE_LOWER is used with
 * array_change_key_case and is used to convert array
 * keys to lower case. This is also the default case for
 * array_change_key_case.
 * @link https://php.net/manual/en/array.constants.php
 */
declare const CASE_LOWER:number;

/**
 * CASE_UPPER is used with
 * array_change_key_case and is used to convert array
 * keys to upper case.
 * @link https://php.net/manual/en/array.constants.php
 */
declare const CASE_UPPER:number;
declare const COUNT_NORMAL:number;
declare const COUNT_RECURSIVE:number;
declare const ASSERT_ACTIVE:number;
declare const ASSERT_CALLBACK:number;
declare const ASSERT_BAIL:number;
declare const ASSERT_WARNING:number;
declare const ASSERT_QUIET_EVAL:number;
declare const ASSERT_EXCEPTION:number;