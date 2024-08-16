declare interface Matchers {
       
    message(): any;

    /**
        * Expect the actual value to be `===` to the expected value.
        *
        * @param expected The expected value to compare against.
        * @param expectationFailOutput
        * @example
        * expect(thing).toBe(realThing);
        */
    toBe(expected:any, expectationFailOutput?:any): boolean;

    /**
        * Expect the actual value to be equal to the expected, using deep equality comparison.
        * @param expected Expected value.
        * @param expectationFailOutput
        * @example
        * expect(bigObject).toEqual({ "foo": ['bar', 'baz'] });
        */
    toEqual(expected:any, expectationFailOutput?:any): boolean;

    /**
        * Expect the actual value to match a regular expression.
        * @param expected Value to look for in the string.
        * @example
        * expect("my string").toMatch(/string$/);
        * expect("other string").toMatch("her");
        */
    toMatch(expected: string | RegExp, expectationFailOutput?:any): boolean;

    toBeDefined(expectationFailOutput?:any): boolean;
    toBeUndefined(expectationFailOutput?:any): boolean;
    toBeNull(expectationFailOutput?:any):boolean;
    toBeNaN(): boolean;
    toBeTruthy(expectationFailOutput?:any): boolean;
    toBeFalsy(expectationFailOutput?:any): boolean;
    toBeTrue(): boolean;
    toBeFalse(): boolean;
    toHaveBeenCalled(): boolean;
    toHaveBeenCalledBefore(expected): boolean;
    toHaveBeenCalledWith(...params:any[]): boolean;
    toHaveBeenCalledOnceWith(...params:any[]): boolean;
    toHaveBeenCalledTimes(expected: number): boolean;
    toContain(expected: any, expectationFailOutput?:any): boolean;
    toBeLessThan(expected: number, expectationFailOutput?:any): boolean;
    toBeLessThanOrEqual(expected: number, expectationFailOutput?:any): boolean;
    toBeGreaterThan(expected: number, expectationFailOutput?:any): boolean;
    toBeGreaterThanOrEqual(expected: number, expectationFailOutput?:any): boolean;
    toBeCloseTo(expected: number, precision:any, expectationFailOutput?:any): boolean;
    toThrow(expected: any): boolean;
    toThrowError(expected, message:string | RegExp): boolean;
    toThrowMatching(predicate: (thrown: any) => boolean): boolean;
    toBeNegativeInfinity(expectationFailOutput?:any): boolean;
    toBePositiveInfinity(expectationFailOutput?:any): boolean;
    toBeInstanceOf(expected:class): boolean;

    /**
        * Expect the actual value to be a DOM element that has the expected class.
        * @since 3.0.0
        * @param expected The class name to test for.
        * @example
        * var el = document.createElement('div');
        * el.className = 'foo bar baz';
        * expect(el).toHaveClass('bar');
        */
    toHaveClass(expected: string, expectationFailOutput?:any): boolean;

    /**
        * Expect the actual size to be equal to the expected, using array-like
        * length or object keys size.
        * @since 3.6.0
        * @param expected The expected size
        * @example
        * array = [1,2];
        * expect(array).toHaveSize(2);
        */
    toHaveSize(expected: number): boolean;

    /**
        * Add some context for an expect.
        * @param message Additional context to show when the matcher fails
        */
    withContext(message: string): Matchers;

    /**
        * Invert the matcher following this expect.
        */
    var not: Matchers;
}


declare function it(title:string,callback:(done?:()=>void)=>void):int;

declare function expect(result:any):Matchers;

declare class jasmine {
   public static var DEFAULT_TIMEOUT_INTERVAL:int
}


package PHPUnit.Framework{

    declare class TestCase{
       assertEquals(expected:any, actual:any, message?:string);
       assertNotEquals(expected:any, actual:any, message?:string);
       assertAttributeEquals(expected:any, actual:any, message?:string);
       assertAttributeNotEquals(expected:any, actual:any, message?:string);
       assertArrayHasKey(key:string | number, array:[], message?:string );
       assertClassHasAttribute(attributeName:string, className:string, message?:string );
       assertArraySubset(subset:[], array:[], strict?:boolean, message?:string);
       assertClassHasStaticAttribute(attributeName:string, className:string, message?:string );
       assertContains(needle:any, haystack:[] | Iterator<any>, message?:string, ignoreCase:boolean=false );
       assertNotContains(needle:any, haystack:[] |  Iterator<any>, message?:string, ignoreCase:boolean=false );
       assertAttributeContains(needle:any, haystack:[] |  Iterator<any>, message?:string, ignoreCase:boolean=false );
       assertAttributeNotContains(needle:any, haystack:[] |  Iterator<any>, message?:string, ignoreCase:boolean=false );
       assertContainsOnly(type:string, haystack:[] |  Iterator<any>, isNativeType?:boolean ,message?:string );
       assertNotContainsOnly(type:string, haystack:[] |  Iterator<any>, isNativeType?:boolean ,message?:string );
       assertAttributeContainsOnly(type:string, haystack:[] |  Iterator<any>, isNativeType?:boolean ,message?:string );
       assertAttributeNotContainsOnly(type:string, haystack:[] |  Iterator<any>, isNativeType?:boolean ,message?:string );
       assertContainsOnlyInstancesOf(classname:string, haystack:[], message?:string );
       assertCount(expectedCount:number, haystack:any, message?:string );
       assertDirectoryExists(directory:string, message?:string );
       assertDirectoryNotExists(directory:string, message?:string );
       assertDirectoryIsReadable(directory:string, message?:string );
       assertDirectoryNotIsReadable(directory:string, message?:string );
       assertDirectoryIsWritable(directory:string, message?:string );
       assertDirectoryNotIsWritable(directory:string, message?:string );
       assertEmpty(actual:any, message?:string);
       assertNotEmpty(actual:any, message?:string);
       assertAttributeEmpty(actual:any, message?:string);
       assertAttributeNotEmpty(actual:any, message?:string);
       assertFalse(condition:boolean, message?:string);
       assertNotFalse(condition:boolean, message?:string);
       assertFileEquals(expected:string , actual:string, message?:string);
       assertFileNotEquals(expected:string , actual:string, message?:string);
       assertFileExists(filename:string , message?:string);
       assertFileNotExists(filename:string , message?:string);
       assertFileIsReadable(filename:string , message?:string);
       assertFileNotIsReadable(filename:string , message?:string);
       assertFileIsWritable(filename:string , message?:string);
       assertFileNotIsWritable(filename:string , message?:string);
       assertGreaterThan(expected:any ,actual:any, message?:string);
       assertAttributeGreaterThan(expected:any ,actual:any, message?:string);
       assertGreaterThanOrEqual(expected:any ,actual:any, message?:string);
       assertAttributeGreaterThanOrEqual(expected:any ,actual:any, message?:string);
       assertInfinite(variable:any , message?:string);
       assertFinite(variable:any , message?:string);
       assertInstanceOf(expected:any , actual:any, message?:string);
       assertNotInstanceOf(expected:any , actual:any, message?:string);
       assertAttributeInstanceOf(expected:any , actual:any, message?:string);
       assertAttributeNotInstanceOf(expected:any , actual:any, message?:string);
       assertInternalType(expected:any , actual:any, message?:string);
       assertNotInternalType(expected:any , actual:any, message?:string);
       assertAttributeInternalType(expected:any , actual:any, message?:string);
       assertAttributeNotInternalType(expected:any , actual:any, message?:string);
       assertIsReadable(filename:string ,  message?:string);
       assertNotIsReadable(filename:string ,  message?:string);
       assertIsWritable(filename:string ,  message?:string);
       assertNotIsWritable(filename:string ,  message?:string);
       assertJsonFileEqualsJsonFile(expectedFile:any ,actualFile:any, message?:string);
       assertJsonStringEqualsJsonFile(expectedFile:string ,actualJson:string, message?:string);
       assertJsonStringEqualsJsonString(expectedJson:string ,actualJson:string, message?:string);
       assertLessThan(expected:any ,actual:string, message?:string);
       assertAttributeLessThan(expected:any ,actual:string, message?:string);
       assertLessThanOrEqual(expected:any ,actual:string, message?:string);
       assertAttributeLessThanOrEqual(expected:any ,actual:string, message?:string);
       assertNan(variable:any, message?:string);
       assertNull(variable:any, message?:string);
       assertNotNull(variable:any, message?:string);
       assertObjectHasAttribute(attributeName:string, object:object, message?:string);
       assertObjectNotHasAttribute(attributeName:string, object:object, message?:string);
       assertRegExp(pattern:string, target:string, message?:string);
       assertNotRegExp(pattern:string, target:string, message?:string);
       assertStringMatchesFormat(format:string, target:string, message?:string);
       assertStringNotMatchesFormat(format:string, target:string, message?:string);
       assertStringMatchesFormatFile(formatFile:string, target:string, message?:string);
       assertStringNotMatchesFormatFile(formatFile:string, target:string, message?:string);
       assertSame(expected:any, actual:any, message?:string);
       assertNotSame(expected:any, actual:any, message?:string);
       assertAttributeSame(expected:any, actual:any, message?:string);
       assertAttributeNotSame(expected:any, actual:any, message?:string);
       assertStringEndsWith(suffix:string, actual:string, message?:string);
       assertStringEndsNotWith(suffix:string, actual:string, message?:string);
       assertStringEqualsFile(expectedFile:string, actualString:string, message?:string);
       assertStringNotEqualsFile(expectedFile:string, actualString:string, message?:string);
       assertStringStartsWith(prefix:string, target:string, message?:string);
       assertStringStartsNotWith(prefix:string, target:string, message?:string);
       assertThat(value:any, constraint:any, message?:string);
       assertTrue(condition:boolean, message?:string);
       assertNotTrue(condition:boolean, message?:string);
   }
}

declare function require_once( $name );

declare function spl_autoload_register(callback: (name:string)=>void, throwError?:boolean,  prepend?:boolean);


declare interface HTMLElement extends Node{
    
}


declare interface Node{
    
}

declare interface NodeConfig{
    type:string
    attr:{[key:string]:any}
    children:NodeChildType[]
}

declare type NodeChildType = (NodeConfig|number|string)[];



package PHPMailer{

    declare class PHPMailer{
        constructor(opt?:any);

        const CHARSET_ASCII = 'us-ascii';
        const CHARSET_ISO88591 = 'iso-8859-1';
        const CHARSET_UTF8 = 'utf-8';

        const CONTENT_TYPE_PLAINTEXT = 'text/plain';
        const CONTENT_TYPE_TEXT_CALENDAR = 'text/calendar';
        const CONTENT_TYPE_TEXT_HTML = 'text/html';
        const CONTENT_TYPE_MULTIPART_ALTERNATIVE = 'multipart/alternative';
        const CONTENT_TYPE_MULTIPART_MIXED = 'multipart/mixed';
        const CONTENT_TYPE_MULTIPART_RELATED = 'multipart/related';

        const ENCODING_7BIT = '7bit';
        const ENCODING_8BIT = '8bit';
        const ENCODING_BASE64 = 'base64';
        const ENCODING_BINARY = 'binary';
        const ENCODING_QUOTED_PRINTABLE = 'quoted-printable';

        const ENCRYPTION_STARTTLS = 'tls';
        const ENCRYPTION_SMTPS = 'ssl';

        const ICAL_METHOD_REQUEST = 'REQUEST';
        const ICAL_METHOD_PUBLISH = 'PUBLISH';
        const ICAL_METHOD_REPLY = 'REPLY';
        const ICAL_METHOD_ADD = 'ADD';
        const ICAL_METHOD_CANCEL = 'CANCEL';
        const ICAL_METHOD_REFRESH = 'REFRESH';
        const ICAL_METHOD_COUNTER = 'COUNTER';
        const ICAL_METHOD_DECLINECOUNTER = 'DECLINECOUNTER';

        /**
        * Email priority.
        * Options: null (default), 1 = High, 3 = Normal, 5 = low.
        * When null, the header is not set at all.
        *
        * @var int|null
        */
        public Priority;

        /**
        * The character set of the message.
        *
        * @var string
        */
        public CharSet:string;

        /**
        * The MIME Content-type of the message.
        *
        * @var string
        */
        public ContentType:string;

        /**
        * The message encoding.
        * Options: "8bit", "7bit", "binary", "base64", and "quoted-printable".
        *
        * @var string
        */
        public Encoding:string;

        /**
        * Holds the most recent mailer error message.
        *
        * @var string
        */
        public ErrorInfo = '';

        /**
        * The From email address for the message.
        *
        * @var string
        */
        public From = '';

        /**
        * The From name of the message.
        *
        * @var string
        */
        public FromName = '';

        /**
        * The envelope sender of the message.
        * This will usually be turned into a Return-Path header by the receiver,
        * and is the address that bounces will be sent to.
        * If not empty, will be passed via `-f` to sendmail or as the 'MAIL FROM' value over SMTP.
        *
        * @var string
        */
        public Sender = '';

        /**
        * The Subject of the message.
        *
        * @var string
        */
        public Subject = '';

        /**
        * An HTML or plain text message body.
        * If HTML then call isHTML(true).
        *
        * @var string
        */
        public Body = '';

        /**
        * The plain-text message body.
        * This body can be read by mail clients that do not have HTML email
        * capability such as mutt & Eudora.
        * Clients that can read HTML will view the normal Body.
        *
        * @var string
        */
        public AltBody = '';


        public Mailer = 'mail';

        /**
        * The path to the sendmail program.
        *
        * @var string
        */
        public Sendmail = '/usr/sbin/sendmail';

        /**
        * Whether mail() uses a fully sendmail-compatible MTA.
        * One which supports sendmail's "-oi -f" options.
        *
        * @var bool
        */
        public UseSendmailOptions = true;

        /**
        * The email address that a reading confirmation should be sent to, also known as read receipt.
        *
        * @var string
        */
        public ConfirmReadingTo = '';

        /**
        * The hostname to use in the Message-ID header and as default HELO string.
        * If empty, PHPMailer attempts to find one with, in order,
        * $_SERVER['SERVER_NAME'], gethostname(), php_uname('n'), or the value
        * 'localhost.localdomain'.
        *
        * @see PHPMailer::$Helo
        *
        * @var string
        */
        public Hostname = '';

        /**
        * An ID to be used in the Message-ID header.
        * If empty, a unique id will be generated.
        * You can set your own, but it must be in the format "<id@domain>",
        * as defined in RFC5322 section 3.6.4 or it will be ignored.
        *
        * @see https://tools.ietf.org/html/rfc5322#section-3.6.4
        *
        * @var string
        */
        public MessageID = '';

        /**
        * The message Date to be used in the Date header.
        * If empty, the current date will be added.
        *
        * @var string
        */
        public MessageDate = '';

        /**
        * SMTP hosts.
        * Either a single hostname or multiple semicolon-delimited hostnames.
        * You can also specify a different port
        * for each host by using this format: [hostname:port]
        * (e.g. "smtp1.example.com:25;smtp2.example.com").
        * You can also specify encryption type, for example:
        * (e.g. "tls://smtp1.example.com:587;ssl://smtp2.example.com:465").
        * Hosts will be tried in order.
        *
        * @var string
        */
        public Host = 'localhost';

        /**
        * The default SMTP server port.
        *
        * @var int
        */
        public Port = 25;

        /**
        * The SMTP HELO/EHLO name used for the SMTP connection.
        * Default is $Hostname. If $Hostname is empty, PHPMailer attempts to find
        * one with the same method described above for $Hostname.
        *
        * @see PHPMailer::$Hostname
        *
        * @var string
        */
        public Helo = '';

        /**
        * What kind of encryption to use on the SMTP connection.
        * Options: '', static::ENCRYPTION_STARTTLS, or static::ENCRYPTION_SMTPS.
        *
        * @var string
        */
        public SMTPSecure = '';

        /**
        * Whether to enable TLS encryption automatically if a server supports it,
        * even if `SMTPSecure` is not set to 'tls'.
        * Be aware that in PHP >= 5.6 this requires that the server's certificates are valid.
        *
        * @var bool
        */
        public SMTPAutoTLS = true;

        /**
        * Whether to use SMTP authentication.
        * Uses the Username and Password properties.
        *
        * @see PHPMailer::$Username
        * @see PHPMailer::$Password
        *
        * @var bool
        */
        public SMTPAuth = false;

        /**
        * Options array passed to stream_context_create when connecting via SMTP.
        *
        * @var array
        */
        public SMTPOptions = [];

        /**
        * SMTP username.
        *
        * @var string
        */
        public Username = '';

        /**
        * SMTP password.
        *
        * @var string
        */
        public Password = '';

        /**
        * SMTP authentication type. Options are CRAM-MD5, LOGIN, PLAIN, XOAUTH2.
        * If not specified, the first one from that list that the server supports will be selected.
        *
        * @var string
        */
        public AuthType = '';


        /**
        * An iCal message part body.
        * Only supported in simple alt or alt_inline message types
        * To generate iCal event structures, use classes like EasyPeasyICS or iCalcreator.
        *
        * @see http://sprain.ch/blog/downloads/php-class-easypeasyics-create-ical-files-with-php/
        * @see http://kigkonsult.se/iCalcreator/
        *
        * @var string
        */
        public Ical = '';



        /**
        * The SMTP server timeout in seconds.
        * Default of 5 minutes (300sec) is from RFC2821 section 4.5.3.2.
        *
        * @var int
        */
        public Timeout = 300;

        /**
        * Comma separated list of DSN notifications
        * 'NEVER' under no circumstances a DSN must be returned to the sender.
        *         If you use NEVER all other notifications will be ignored.
        * 'SUCCESS' will notify you when your mail has arrived at its destination.
        * 'FAILURE' will arrive if an error occurred during delivery.
        * 'DELAY'   will notify you if there is an unusual delay in delivery, but the actual
        *           delivery's outcome (success or failure) is not yet decided.
        *
        * @see https://tools.ietf.org/html/rfc3461 See section 4.1 for more information about NOTIFY
        */
        public dsn = '';

        /**
        * SMTP class debug output mode.
        * Debug output level.
        * Options:
        * @see SMTP::DEBUG_OFF: No output
        * @see SMTP::DEBUG_CLIENT: Client messages
        * @see SMTP::DEBUG_SERVER: Client and server messages
        * @see SMTP::DEBUG_CONNECTION: As SERVER plus connection status
        * @see SMTP::DEBUG_LOWLEVEL: Noisy, low-level data output, rarely needed
        *
        * @see SMTP::$do_debug
        *
        * @var int
        */
        public SMTPDebug = 0;

        /**
        * How to handle debug output.
        * Options:
        * * `echo` Output plain-text as-is, appropriate for CLI
        * * `html` Output escaped, line breaks converted to `<br>`, appropriate for browser output
        * * `error_log` Output to error log as configured in php.ini
        * By default PHPMailer will use `echo` if run from a `cli` or `cli-server` SAPI, `html` otherwise.
        * Alternatively, you can provide a callable expecting two params: a message string and the debug level:
        *
        * ```php
        * $mail->Debugoutput = function($str, $level) {echo "debug level $level; message: $str";};
        * ```
        *
        * Alternatively, you can pass in an instance of a PSR-3 compatible logger, though only `debug`
        * level output is used:
        *
        * ```php
        * $mail->Debugoutput = new myPsr3Logger;
        * ```
        *
        * @see SMTP::$Debugoutput
        *
        * @var string|callable|\Psr\Log\LoggerInterface
        */
        public Debugoutput = 'echo';

        /**
        * Whether to keep the SMTP connection open after each message.
        * If this is set to true then the connection will remain open after a send,
        * and closing the connection will require an explicit call to smtpClose().
        * It's a good idea to use this if you are sending multiple messages as it reduces overhead.
        * See the mailing list example for how to use it.
        *
        * @var bool
        */
        public SMTPKeepAlive = false;

        /**
        * Whether to split multiple to addresses into multiple messages
        * or send them all in one message.
        * Only supported in `mail` and `sendmail` transports, not in SMTP.
        *
        * @var bool
        *
        * @deprecated 6.0.0 PHPMailer isn't a mailing list manager!
        */
        public SingleTo = false;



        /**
        * Whether to generate VERP addresses on send.
        * Only applicable when sending via SMTP.
        *
        * @see https://en.wikipedia.org/wiki/Variable_envelope_return_path
        * @see http://www.postfix.org/VERP_README.html Postfix VERP info
        *
        * @var bool
        */
        public do_verp = false;

        /**
        * Whether to allow sending messages with an empty body.
        *
        * @var bool
        */
        public AllowEmpty = false;

        /**
        * DKIM selector.
        *
        * @var string
        */
        public DKIM_selector = '';

        /**
        * DKIM Identity.
        * Usually the email address used as the source of the email.
        *
        * @var string
        */
        public DKIM_identity = '';

        /**
        * DKIM passphrase.
        * Used if your key is encrypted.
        *
        * @var string
        */
        public DKIM_passphrase = '';

        /**
        * DKIM signing domain name.
        *
        * @example 'example.com'
        *
        * @var string
        */
        public DKIM_domain = '';

        /**
        * DKIM Copy header field values for diagnostic use.
        *
        * @var bool
        */
        public DKIM_copyHeaderFields = true;

        /**
        * DKIM Extra signing headers.
        *
        * @example ['List-Unsubscribe', 'List-Help']
        *
        * @var array
        */
        public DKIM_extraHeaders = [];

        /**
        * DKIM private key file path.
        *
        * @var string
        */
        public DKIM_private = '';

        /**
        * DKIM private key string.
        *
        * If set, takes precedence over `$DKIM_private`.
        *
        * @var string
        */
        public DKIM_private_string = '';

        /**
        * Callback Action function name.
        *
        * The function that handles the result of the send email action.
        * It is called out by send() for each email sent.
        *
        * Value can be any php callable: http://www.php.net/is_callable
        *
        * Parameters:
        *   bool $result        result of the send action
        *   array   $to            email addresses of the recipients
        *   array   $cc            cc email addresses
        *   array   $bcc           bcc email addresses
        *   string  $subject       the subject
        *   string  $body          the email body
        *   string  $from          email address of sender
        *   string  $extra         extra information of possible use
        *                          "smtp_transaction_id' => last smtp transaction id
        *
        * @var string
        */
        public action_function = '';

        /**
        * What to put in the X-Mailer header.
        * Options: An empty string for PHPMailer default, whitespace/null for none, or a string to use.
        *
        * @var string|null
        */
        public XMailer = '';

        /**
        * Which validator to use by default when validating email addresses.
        * May be a callable to inject your own validator, but there are several built-in validators.
        * The default validator uses PHP's FILTER_VALIDATE_EMAIL filter_var option.
        *
        * @see PHPMailer::validateAddress()
        *
        * @var string|callable
        */
        public static validator = 'php';

        /**
        * Sets message type to HTML or plain.
        *
        * @param bool $isHtml True for HTML mode
        */
        isHTML(isHtml:boolean):void;

        /**
        * Send messages using SMTP.
        */
        isSMTP():void;

        /**
        * Send messages using PHP's mail() function.
        */
        isMail():void;


        /**
        * Send messages using $Sendmail.
        */
        isSendmail():void;

        /**
        * Send messages using qmail.
        */
        isQmail():void;

        /**
        * Add a "To" address.
        *
        * @param string $address The email address to send to
        * @param string $name
        *
        * @throws Exception
        *
        * @return bool true on success, false if address already used or invalid in some way
        */
        addAddress(address:string, name?:string):void

        /**
        * Add a "CC" address.
        *
        * @param string $address The email address to send to
        * @param string $name
        *
        * @throws Exception
        *
        * @return bool true on success, false if address already used or invalid in some way
        */
        addCC(address:string, name?:string):void

        /**
        * Add a "BCC" address.
        *
        * @param string $address The email address to send to
        * @param string $name
        *
        * @throws Exception
        *
        * @return bool true on success, false if address already used or invalid in some way
        */
        addBCC(address:string, name?:string):void

        /**
        * Add a "Reply-To" address.
        *
        * @param string $address The email address to reply to
        * @param string $name
        *
        * @throws Exception
        *
        * @return bool true on success, false if address already used or invalid in some way
        */
        addReplyTo(address:string, name?:string):void


        /**
        * Set the boundaries to use for delimiting MIME parts.
        * If you override this, ensure you set all 3 boundaries to unique values.
        * The default boundaries include a "=_" sequence which cannot occur in quoted-printable bodies,
        * as suggested by https://www.rfc-editor.org/rfc/rfc2045#section-6.7
        *
        * @return void
        */
        setBoundaries():void

        /**
        * Parse and validate a string containing one or more RFC822-style comma-separated email addresses
        * of the form "display name <address>" into an array of name/address pairs.
        * Uses the imap_rfc822_parse_adrlist function if the IMAP extension is available.
        * Note that quotes in the name part are removed.
        *
        * @see http://www.andrew.cmu.edu/user/agreen1/testing/mrbs/web/Mail/RFC822.php A more careful implementation
        *
        * @param string $addrstr The address list string
        * @param bool   $useimap Whether to use the IMAP extension to parse the list
        * @param string $charset The charset to use when decoding the address list string.
        *
        * @return array
        */
        static parseAddresses(addrstr:string, useimap?:boolean, charset?:string):any[]


        /**
        * Set the From and FromName properties.
        *
        * @param string $address
        * @param string $name
        * @param bool   $auto    Whether to also set the Sender address, defaults to true
        *
        * @throws Exception
        *
        * @return bool
        */
        setFrom(address:string, name?:string,auto?:boolean):boolean


        /**
        * Return the Message-ID header of the last email.
        * Technically this is the value from the last time the headers were created,
        * but it's also the message ID of the last sent message except in
        * pathological cases.
        *
        * @return string
        */
        getLastMessageID():string

        /**
        * Check that a string looks like an email address.
        * Validation patterns supported:
        * * `auto` Pick best pattern automatically;
        * * `pcre8` Use the squiloople.com pattern, requires PCRE > 8.0;
        * * `pcre` Use old PCRE implementation;
        * * `php` Use PHP built-in FILTER_VALIDATE_EMAIL;
        * * `html5` Use the pattern given by the HTML5 spec for 'email' type form input elements.
        * * `noregex` Don't use a regex: super fast, really dumb.
        * Alternatively you may pass in a callable to inject your own validator, for example:
        *
        * ```php
        * PHPMailer::validateAddress('user@example.com', function($address) {
        *     return (strpos($address, '@') !== false);
        * });
        * ```
        *
        * You can also set the PHPMailer::$validator static to a callable, allowing built-in methods to use your validator.
        *
        * @param string          $address       The email address to check
        * @param string|callable $patternselect Which pattern to use
        *
        * @return bool
        */
        static validateAddress(address:string, patternselect?):boolean;


        /**
        * Tells whether IDNs (Internationalized Domain Names) are supported or not. This requires the
        * `intl` and `mbstring` PHP extensions.
        *
        * @return bool `true` if required functions for IDN support are present
        */
        static idnSupported():boolean;

        /**
        * Converts IDN in given email address to its ASCII form, also known as punycode, if possible.
        * Important: Address must be passed in same encoding as currently set in PHPMailer::$CharSet.
        * This function silently returns unmodified address if:
        * - No conversion is necessary (i.e. domain name is not an IDN, or is already in ASCII form)
        * - Conversion to punycode is impossible (e.g. required PHP functions are not available)
        *   or fails for any reason (e.g. domain contains characters not allowed in an IDN).
        *
        * @see PHPMailer::$CharSet
        *
        * @param string $address The email address to convert
        *
        * @return string The encoded address in ASCII form
        */
        punyencodeAddress(address:string):string


        /**
        * Create a message and send it.
        * Uses the sending method specified by $Mailer.
        *
        * @throws Exception
        *
        * @return bool false on error - See the ErrorInfo property for details of the error
        */
        send():boolean;


        /**
        * Prepare a message for sending.
        *
        * @throws Exception
        *
        * @return bool
        */
        preSend():boolean;

        /**
        * Actually send a message via the selected mechanism.
        *
        * @throws Exception
        *
        * @return bool
        */
        postSend():boolean;


        /**
        * Close the active SMTP session if one exists.
        */
        smtpClose():void


        /**
        * Set the language for error messages.
        * The default language is English.
        *
        * @param string $langcode  ISO 639-1 2-character language code (e.g. French is "fr")
        *                          Optionally, the language code can be enhanced with a 4-character
        *                          script annotation and/or a 2-character country annotation.
        * @param string $lang_path Path to the language file directory, with trailing separator (slash)
        *                          Do not set this from user input!
        *
        * @return bool Returns true if the requested language was loaded, false otherwise.
        */
    setLanguage(langcode:string, lang_path?:string):boolean

        /**
        * Get the array of strings for the current language.
        *
        * @return array
        */
        getTranslations():any[]


        /**
        * Create recipient headers.
        *
        * @param string $type
        * @param array  $addr An array of recipients,
        *                     where each recipient is a 2-element indexed array with element 0 containing an address
        *                     and element 1 containing a name, like:
        *                     [['joe@example.com', 'Joe User'], ['zoe@example.com', 'Zoe User']]
        *
        * @return string
        */
        addrAppend(type:string, addr:string[][]):string;

        /**
        * Format an address for use in a message header.
        *
        * @param array $addr A 2-element indexed array, element 0 containing an address, element 1 containing a name like
        *                    ['joe@example.com', 'Joe User']
        *
        * @return string
        */
        addrFormat(addr:string[][]):string


        /**
        * Word-wrap message.
        * For use with mailers that do not automatically perform wrapping
        * and for quoted-printable encoded messages.
        * Original written by philippe.
        *
        * @param string $message The message to wrap
        * @param int    $length  The line length to wrap to
        * @param bool   $qp_mode Whether to run in Quoted-Printable mode
        *
        * @return string
        */
        wrapText(message:string, length:number, qp_mode?:boolean):string


        /**
        * Find the last character boundary prior to $maxLength in a utf-8
        * quoted-printable encoded string.
        * Original written by Colin Brown.
        *
        * @param string $encodedText utf-8 QP text
        * @param int    $maxLength   Find the last character boundary prior to this length
        *
        * @return int
        */
        utf8CharBoundary(encodedText:string, maxLength?:number):number;


        /**
        * Apply word wrapping to the message body.
        * Wraps the message body to the number of chars set in the WordWrap property.
        * You should only do this to plain-text bodies as wrapping HTML tags may break them.
        * This is called automatically by createBody(), so you don't need to call it yourself.
        */
        setWordWrap():void

        /**
        * Assemble message headers.
        *
        * @return string The assembled headers
        */
        createHeader():string;


        /**
        * Get the message MIME type headers.
        *
        * @return string
        */
    getMailMIME():string


        /**
        * Returns the whole MIME message.
        * Includes complete headers and body.
        * Only valid post preSend().
        *
        * @see PHPMailer::preSend()
        *
        * @return string
        */
    getSentMIMEMessage():string


        /**
        * Assemble the message body.
        * Returns an empty string on failure.
        *
        * @throws Exception
        *
        * @return string The assembled message body
        */
        createBody():string

        /**
        * Get the boundaries that this message will use
        * @return array
        */
        getBoundaries():any[]

    }


    declare interface Exception extends Error{

        /**
        * Prettify error message output.
        *
        * @return string
        */
        errorMessage();
    }


    declare class SMTP{

    }


    declare class POP3{
        
    }

}