
/**
 * Loads a php extension at runtime
 * @param string $extension_filename <p>
 * This parameter is only the filename of the
 * extension to load which also depends on your platform. For example,
 * the sockets extension (if compiled
 * as a shared module, not the default!) would be called
 * sockets.so on Unix platforms whereas it is called
 * php_sockets.dll on the Windows platform.
 * </p>
 * <p>
 * The directory where the extension is loaded from depends on your
 * platform:
 * </p>
 * <p>
 * Windows - If not explicitly set in the <i>php.ini</i>, the extension is
 * loaded from C:\php4\extensions\ (PHP 4) or
 * C:\php5\ (PHP 5) by default.
 * </p>
 * <p>
 * Unix - If not explicitly set in the <i>php.ini</i>, the default extension
 * directory depends on
 * whether PHP has been built with --enable-debug
 * or not</p>
 * @return bool <b>TRUE</b> on success or <b>FALSE</b> on failure. If the functionality of loading modules is not available
 * or has been disabled (either by setting
 * enable_dl off or by enabling safe mode
 * in <i>php.ini</i>) an <b>E_ERROR</b> is emitted
 * and execution is stopped. If <b>dl</b> fails because the
 * specified library couldn't be loaded, in addition to <b>FALSE</b> an
 * <b>E_WARNING</b> message is emitted.
 * Loads a PHP extension at runtime
 * @link https://php.net/manual/en/function.dl.php
 */
declare function dl(extension_filename:string):boolean

/**
 * Sets the process title
 * @link https://php.net/manual/en/function.cli-set-process-title.php
 * @param string $title <p>
 * The new title.
 * </p>
 * @return bool <b>TRUE</b> on success or <b>FALSE</b> on failure.
 * @since 5.5
 */
declare function cli_set_process_title(title:string):boolean

/**
 * Returns the current process title
 * @link https://php.net/manual/en/function.cli-get-process-title.php
 * @return string|null Return a string with the current process title or <b>NULL</b> on error.
 * @since 5.5
 */
declare function cli_get_process_title():string|null

/**
 * Verify that the contents of a variable is accepted by the iterable pseudo-type, i.e. that it is an array or an object implementing Traversable
 * @param mixed $value
 * @return bool
 * @since 7.1
 * @link https://php.net/manual/en/function.is-iterable.php
 */
declare function is_iterable(value:any):boolean

/**
 * Encodes an ISO-8859-1 string to UTF-8
 * @link https://php.net/manual/en/function.utf8-encode.php
 * @param string $string <p>
 * An ISO-8859-1 string.
 * </p>
 * @return string the UTF-8 translation of <i>data</i>.
 */
declare function utf8_encode(string:string): string

/**
 * Converts a string with ISO-8859-1 characters encoded with UTF-8
 * to single-byte ISO-8859-1
 * @link https://php.net/manual/en/function.utf8-decode.php
 * @param string $string <p>
 * An UTF-8 encoded string.
 * </p>
 * @return string the ISO-8859-1 translation of <i>data</i>.
 */
declare function utf8_decode(string:string): string

/**
 * Clear the most recent error
 * @link https://php.net/manual/en/function.error-clear-last.php
 * @return void
 * @since 7.0
 */
declare function error_clear_last(): void

/**
 * Get process codepage
 * @param string $kind
 * @return int
 * @since 7.1
 */
declare function sapi_windows_cp_get(kind:string): int

/**
 * Set process codepage
 * @param int $cp
 * @return bool
 * @since 7.1
 */
declare function sapi_windows_cp_set(cp:int):boolean

/**
 * Convert string from one codepage to another
 * @param int|string $in_codepage
 * @param int|string $out_codepage
 * @param string $subject
 * @return string
 * @since 7.1
 */
declare function sapi_windows_cp_conv(in_codepage:int|string,out_codepage:int|string,subject:string): string

/**
 * Indicates whether the codepage is utf-8 compatible
 * @return bool
 * @since 7.1
 */
declare function sapi_windows_cp_is_utf8():boolean

/**
 * Get or set VT100 support for the specified stream associated to an output buffer of a Windows console.
 *
 * At startup, PHP tries to enable the VT100 feature of the STDOUT/STDERR streams.
 * By the way, if those streams are redirected to a file, the VT100 features may not be enabled.
 *
 * If VT100 support is enabled, it is possible to use control sequences as they are known from the VT100 terminal.
 * They allow the modification of the terminal's output. On Windows these sequences are called Console Virtual Terminal Sequences.
 * @link https://php.net/manual/en/function.sapi-windows-vt100-support.php
 * @param resource $stream
 * @param bool $enable [optional]<p>
 *
 * If <i>enable</i> is omitted, the function returns TRUE if the stream stream has VT100 control codes enabled, FALSE otherwise.
 *
 * If <i>enable</i> is specified, the function will try to enable or disable the VT100 features of the stream stream.
 * If the feature has been successfully enabled (or disabled), the function will return TRUE, or FALSE otherwise.
 * </p>
 * @return bool If <i>enable</i> is not specified: returns TRUE if the VT100 feature is enabled, FALSE otherwise.
 * If <i>enable</i> is specified: Returns TRUE on success or FALSE on failure.
 * @since 7.2
 */
declare function sapi_windows_vt100_support(stream:any,enable:boolean):boolean

/**
 * Set or remove a CTRL event handler.
 *
 * @link https://www.php.net/manual/en/function.sapi-windows-set-ctrl-handler.php
 * @param callable $callable
 * @param bool $add [optional]
 * @return bool <b>TRUE</b> on success or <b>FALSE</b> on failure.
 * @since 7.4
 */
declare function sapi_windows_set_ctrl_handler(callback:(...args)=>void,add:boolean = true):boolean

/**
 * Send a CTRL event to another process.
 *
 * @link https://www.php.net/manual/en/function.sapi-windows-generate-ctrl-event.php
 * @param int $event
 * @param int $pid [optional]
 * @return bool <b>TRUE</b> on success or <b>FALSE</b> on failure.
 * @since 7.4
 */
declare function sapi_windows_generate_ctrl_event(event:int,pid:int = 0):boolean

/**
 * The full path and filename of the file. If used inside an include,
 * the name of the included file is returned.
 * Since PHP 4.0.2, <b>__FILE__</b> always contains an
 * absolute path with symlinks resolved whereas in older versions it contained relative path
 * under some circumstances.
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __FILE__= '';

/**
 * The current line number of the file.
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __LINE__= 0;

/**
 * The class name. (Added in PHP 4.3.0) As of PHP 5 this constant
 * returns the class name as it was declared (case-sensitive). In PHP
 * 4 its value is always lowercased. The class name includes the namespace
 * it was declared in (e.g. Foo\Bar).
 * Note that as of PHP 5.4 __CLASS__ works also in traits. When used
 * in a trait method, __CLASS__ is the name of the class the trait
 * is used in.
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __CLASS__= '';

/**
 * The function name. (Added in PHP 4.3.0) As of PHP 5 this constant
 * returns the function name as it was declared (case-sensitive). In
 * PHP 4 its value is always lowercased.
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __FUNCTION__= '';

/**
 * The class method name. (Added in PHP 5.0.0) The method name is
 * returned as it was declared (case-sensitive).
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __METHOD__= '';

/**
 * The trait name. (Added in PHP 5.4.0) As of PHP 5.4 this constant
 * returns the trait as it was declared (case-sensitive). The trait name includes the namespace
 * it was declared in (e.g. Foo\Bar).
 * @since 5.4
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __TRAIT__= '';

/**
 * The directory of the file. If used inside an include,
 * the directory of the included file is returned. This is equivalent
 * to `dirname(__FILE__)`. This directory name
 * does not have a trailing slash unless it is the root directory.
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __DIR__= '';

/**
 * The name of the current namespace (case-sensitive). This constant
 * is defined in compile-time (Added in PHP 5.3.0).
 * @link https://php.net/manual/en/language.constants.predefined.php
 */
declare const __NAMESPACE__= '';


declare function require(path:string):any;
declare function require_once(path:string):any;
declare function include(path:string):any;
declare function include_once(path:string):any;