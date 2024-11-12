
/**
 * Start of mysqli extension stubs v.0.1
 * @link https://php.net/manual/en/book.mysqli.php
 */

 /**
 * Exception thrown if an error which can only be found on runtime occurs.
 * @link https://php.net/manual/en/class.runtimeexception.php
 */
declare class RuntimeException extends Exception{}

/**
 * mysqli_sql_exception
 */
declare class mysqli_sql_exception extends RuntimeException{
	/**
	 * The sql state with the error.
     *
     * @var string
	 */
	protected sqlstate;
    /**
     * The error code
     *
     * @var int
     */
    protected code;
}

/**
 * MySQLi Driver.
 * @link https://php.net/manual/en/class.mysqli-driver.php
 */
declare final class mysqli_driver{
	/**
	 * @var string
	 */
	public client_info;
	/**
	 * @var string
	 */
	public client_version;
	/**
	 * @var string
	 */
	public driver_version;
	/**
	 * @var string
	 */
	public embedded;
	/**
	 * @var bool
	 */
	public reconnect;
	/**
	 * @var int
	 */
	public report_mode;
}

/**
 * Represents a connection between PHP and a MySQL database.
 * @link https://php.net/manual/en/class.mysqli.php
 */
declare class mysqli  {
	/**
	 * @var int
	 */
	public affected_rows;
	/**
	 * @var string
	 */
	public client_info;
	/**
	 * @var int
	 */
	public client_version;
	/**
	 * @var int
	 */
	public connect_errno;
	/**
	 * @var string
	 */
	public connect_error;
	/**
	 * @var int
	 */
	public errno;
	/**
	 * @var string
	 */
	public error;
	/**
	 * @var int
	 */
	public field_count;
	/**
	 * @var string
	 */
	public host_info;
	/**
	 * @var string
	 */
	public info;
	/**
	 * @var int|string
	 */
	public insert_id;
	/**
	 * @var string
	 */
	public server_info;
	/**
	 * @var int
	 */
	public server_version;
	/**
	 * @var string
	 */
	public sqlstate;
	/**
	 * @var string
	 */
	public protocol_version;
	/**
	 * @var int
	 */
	public thread_id;
	/**
	 * @var int
	 */
	public warning_count;
    /**
     * @var array A list of errors, each as an associative array containing the errno, error, and sqlstate.
     * @link https://secure.php.net/manual/en/mysqli.error-list.php
     */
    public error_list;
	/**
	 * Open a new connection to the MySQL server
	 * @link https://php.net/manual/en/mysqli.construct.php
	 * @param string $hostname [optional] Can be either a host name or an IP address. Passing the NULL value or the string "localhost" to this parameter, the local host is assumed. When possible, pipes will be used instead of the TCP/IP protocol. Prepending host by p: opens a persistent connection. mysqli_change_user() is automatically called on connections opened from the connection pool. Defaults to ini_get("mysqli.default_host")
	 * @param string $username [optional] The MySQL user name. Defaults to ini_get("mysqli.default_user")
	 * @param string $password [optional] If not provided or NULL, the MySQL server will attempt to authenticate the user against those user records which have no password only. This allows one username to be used with different permissions (depending on if a password as provided or not). Defaults to ini_get("mysqli.default_pw")
	 * @param string $database [optional] If provided will specify the default database to be used when performing queries. Defaults to ""
	 * @param int $port [optional] Specifies the port number to attempt to connect to the MySQL server. Defaults to ini_get("mysqli.default_port")
	 * @param string $socket [optional] Specifies the socket or named pipe that should be used. Defaults to ini_get("mysqli.default_socket")
	 */
	constructor(hostname:any = null,username:any = null,password:any = null,database:any = null,port:any = null,socket:any = null)
	__construct (hostname:any = null,username:any = null,password:any = null,database:any = null,port:any = null,socket:any = null)
	/**
	 * Turns on or off auto-committing database modifications
	 * @link https://php.net/manual/en/mysqli.autocommit.php
	 * @param bool $enable <p>
	 * Whether to turn on auto-commit or not.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	autocommit (enable:any)
    /**
     * Starts a transaction
     * @link https://secure.php.net/manual/en/mysqli.begin-transaction.php
     * @param int $flags [optional]
     * @param string $name [optional]
     * @return bool true on success or false on failure.
     * @since 5.5
     */
    begin_transaction (flags:any = 0,name:any = null)
    /**
	 * Changes the user of the specified database connection
	 * @link https://php.net/manual/en/mysqli.change-user.php
	 * @param string $username <p>
	 * The MySQL user name.
	 * </p>
	 * @param string $password <p>
	 * The MySQL password.
	 * </p>
	 * @param string $database <p>
	 * The database to change to.
	 * </p>
	 * <p>
	 * If desired, the null value may be passed resulting in only changing
	 * the user and not selecting a database. To select a database in this
	 * case use the <b>mysqli_select_db</b> function.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	change_user(username:any,password:any,database:any)
	/**
	 * Returns the default character set for the database connection
	 * @link https://php.net/manual/en/mysqli.character-set-name.php
	 * @return string The default character set for the current connection
	 */
	character_set_name ()
	/**
     * @removed 5.4
	 */
	client_encoding ()
	/**
	 * Closes a previously opened database connection
	 * @link https://php.net/manual/en/mysqli.close.php
	 * @return bool true on success or false on failure.
	 */
	close ()
	/**
	 * Commits the current transaction
	 * @link https://php.net/manual/en/mysqli.commit.php
	 * @param int $flags A bitmask of MYSQLI_TRANS_COR_* constants.
	 * @param string $name If provided then COMMIT $name is executed.
	 * @return bool true on success or false on failure.
	 */
	commit (flags:any = -1,name:any = null)
	/**
	 * @link https://php.net/manual/en/function.mysqli-connect.php
	 * @param string $hostname [optional]
	 * @param string $username [optional]
	 * @param string $password [optional]
	 * @param string $database [optional]
	 * @param int $port [optional]
	 * @param string $socket [optional]
	 */
	connect (hostname:any = null,username:any = null,password:any = null,database:any = null,port:any = null,socket:any = null)
	/**
	 * Dump debugging information into the log
	 * @link https://php.net/manual/en/mysqli.dump-debug-info.php
	 * @return bool true on success or false on failure.
	 */
	dump_debug_info ()
	/**
	 * Performs debugging operations
	 * @link https://php.net/manual/en/mysqli.debug.php
	 * @param string $options <p>
	 * A string representing the debugging operation to perform
	 * </p>
	 * @return bool true.
	 */
	debug (options:any)
	/**
	 * Returns a character set object
	 * @link https://php.net/manual/en/mysqli.get-charset.php
	 * @return object The function returns a character set object with the following properties:
	 * <i>charset</i>
	 * <p>Character set name</p>
	 * <i>collation</i>
	 * <p>Collation name</p>
	 * <i>dir</i>
	 * <p>Directory the charset description was fetched from (?) or "" for built-in character sets</p>
	 * <i>min_length</i>
	 * <p>Minimum character length in bytes</p>
	 * <i>max_length</i>
	 * <p>Maximum character length in bytes</p>
	 * <i>number</i>
	 * <p>Internal character set number</p>
	 * <i>state</i>
	 * <p>Character set status (?)</p>
	 */
	get_charset ():object;
	/**
	 * Returns the MySQL client version as a string
	 * @link https://php.net/manual/en/mysqli.get-client-info.php
	 * @return string A string that represents the MySQL client library version
	 */
	get_client_info ():string;
	/**
	 * Returns statistics about the client connection
	 * @link https://php.net/manual/en/mysqli.get-connection-stats.php
	 * @return array|false an array with connection stats if success, false otherwise.
	 */
	get_connection_stats():array|false
	/**
	 * An undocumented function equivalent to the $server_info property
	 * @link https://php.net/manual/en/mysqli.get-server-info.php
	 * @return string A character string representing the server version.
 	 */
	get_server_info ():string;
	/**
	 * Get result of SHOW WARNINGS
	 * @link https://php.net/manual/en/mysqli.get-warnings.php
	 * @return mysqli_warning
	 */
	get_warnings ():mysqli_warning
	/**
	 * Initializes MySQLi and returns a resource for use with mysqli_real_connect()
	 * @link https://php.net/manual/en/mysqli.init.php
	 * @return mysqli an object.
	 */
	init ():object;
	/**
	 * Asks the server to kill a MySQL thread
	 * @link https://php.net/manual/en/mysqli.kill.php
	 * @param int $process_id
	 * @return bool true on success or false on failure.
	 */
	kill (process_id:any)
	/**
	 * Performs a query on the database
	 * @link https://php.net/manual/en/mysqli.multi-query.php
	 * @param string $query <p>
	 * The query, as a string.
	 * </p>
	 * <p>
	 * Data inside the query should be properly escaped.
	 * </p>
	 * @return bool false if the first statement failed.
	 * To retrieve subsequent errors from other statements you have to call
	 * <b>mysqli_next_result</b> first.
	 */
	multi_query(query:any):boolean

	/**
	 * Check if there are any more query results from a multi query
	 * @link https://php.net/manual/en/mysqli.more-results.php
	 * @return bool true on success or false on failure.
	 */
	more_results ()
	/**
	 * Prepare next result from multi_query
	 * @link https://php.net/manual/en/mysqli.next-result.php
	 * @return bool true on success or false on failure.
	 */
	next_result ()
	/**
	 * Set options
	 * @link https://php.net/manual/en/mysqli.options.php
	 * @param int $option <p>
	 * The option that you want to set. It can be one of the following values:
	 * <table>
	 * Valid options
	 * <tr valign="top">
	 * <td>Name</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_OPT_CONNECT_TIMEOUT</b></td>
	 * <td>connection timeout in seconds (supported on Windows with TCP/IP since PHP 5.3.1)</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_OPT_LOCAL_INFILE</b></td>
	 * <td>enable/disable use of LOAD LOCAL INFILE</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_INIT_COMMAND</b></td>
	 * <td>command to execute after when connecting to MySQL server</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_READ_DEFAULT_FILE</b></td>
	 * <td>
	 * Read options from named option file instead of my.cnf
	 * </td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_READ_DEFAULT_GROUP</b></td>
	 * <td>
	 * Read options from the named group from my.cnf
	 * or the file specified with <b>MYSQL_READ_DEFAULT_FILE</b>
	 * </td>
	 * </tr>
     * <tr valign="top">
     * <td><b>MYSQLI_SERVER_PUBLIC_KEY</b></td>
     * <td>
     * RSA public key file used with the SHA-256 based authentication.
     * </td>
     * </tr>
	 * </table>
	 * </p>
	 * @param mixed $value <p>
	 * The value for the option.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	options (option:any,value:any)
	/**
	 * Pings a server connection, or tries to reconnect if the connection has gone down
	 * @link https://php.net/manual/en/mysqli.ping.php
	 * @return bool true on success or false on failure.
	 */
	ping ()
	/**
	 * Prepare an SQL statement for execution
	 * @link https://php.net/manual/en/mysqli.prepare.php
	 * @param string $query <p>
	 * The query, as a string.
	 * </p>
	 * <p>
	 * You should not add a terminating semicolon or \g
	 * to the statement.
	 * </p>
	 * <p>
	 * This parameter can include one or more parameter markers in the SQL
	 * statement by embedding question mark (?) characters
	 * at the appropriate positions.
	 * </p>
	 * <p>
	 * The markers are legal only in certain places in SQL statements.
	 * For example, they are allowed in the VALUES()
	 * list of an INSERT statement (to specify column
	 * values for a row), or in a comparison with a column in a
	 * WHERE clause to specify a comparison value.
	 * </p>
	 * <p>
	 * However, they are not allowed for identifiers (such as table or
	 * column names), in the select list that names the columns to be
	 * returned by a SELECT statement, or to specify both
	 * operands of a binary operator such as the = equal
	 * sign. The latter restriction is necessary because it would be
	 * impossible to determine the parameter type. It's not allowed to
	 * compare marker with NULL by
	 * ? IS NULL too. In general, parameters are legal
	 * only in Data Manipulation Language (DML) statements, and not in Data
	 * Definition Language (DDL) statements.
	 * </p>
	 * @return mysqli_stmt|false <b>mysqli_prepare</b> returns a statement object or false if an error occurred.
	 */
	prepare (query:any)
	/**
	 * Performs a query on the database
	 * @link https://php.net/manual/en/mysqli.query.php
	 * @param string $query <p>
	 * The query string.
	 * </p>
	 * <p>
	 * Data inside the query should be properly escaped.
	 * </p>
	 * @param int $result_mode [optional] <p>
	 * Either the constant <b>MYSQLI_USE_RESULT</b> or
	 * <b>MYSQLI_STORE_RESULT</b> depending on the desired
	 * behavior. By default, <b>MYSQLI_STORE_RESULT</b> is used.
	 * </p>
	 * <p>
	 * If you use <b>MYSQLI_USE_RESULT</b> all subsequent calls
	 * will return error Commands out of sync unless you
	 * call <b>mysqli_free_result</b>
	 * </p>
	 * <p>
	 * With <b>MYSQLI_ASYNC</b> (available with mysqlnd), it is
	 * possible to perform query asynchronously.
	 * <b>mysqli_poll</b> is then used to get results from such
	 * queries.
	 * </p>
	 * @return mysqli_result|boolean For successful SELECT, SHOW, DESCRIBE or
	 * EXPLAIN queries <b>mysqli_query</b> will return
	 * a <b>mysqli_result</b> object. For other successful queries <b>mysqli_query</b> will
	 * return true and false on failure.
	 */
	query (query:any,result_mode:any = MYSQLI_STORE_RESULT)
	/**
	 * Opens a connection to a mysql server
	 * @link https://php.net/manual/en/mysqli.real-connect.php
	 * @param string $hostname [optional] <p>
	 * Can be either a host name or an IP address. Passing the null value
	 * or the string "localhost" to this parameter, the local host is
	 * assumed. When possible, pipes will be used instead of the TCP/IP
	 * protocol.
	 * </p>
	 * @param string $username [optional] <p>
	 * The MySQL user name.
	 * </p>
	 * @param string $password [optional] <p>
	 * If provided or null, the MySQL server will attempt to authenticate
	 * the user against those user records which have no password only. This
	 * allows one username to be used with different permissions (depending
	 * on if a password as provided or not).
	 * </p>
	 * @param string $database [optional] <p>
	 * If provided will specify the default database to be used when
	 * performing queries.
	 * </p>
	 * @param int $port [optional] <p>
	 * Specifies the port number to attempt to connect to the MySQL server.
	 * </p>
	 * @param string $socket [optional] <p>
	 * Specifies the socket or named pipe that should be used.
	 * </p>
	 * <p>
	 * Specifying the <i>socket</i> parameter will not
	 * explicitly determine the type of connection to be used when
	 * connecting to the MySQL server. How the connection is made to the
	 * MySQL database is determined by the <i>host</i>
	 * parameter.
	 * </p>
	 * @param int $flags [optional] <p>
	 * With the parameter <i>flags</i> you can set different
	 * connection options:
	 * </p>
	 * <table>
	 * Supported flags
	 * <tr valign="top">
	 * <td>Name</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_CLIENT_COMPRESS</b></td>
	 * <td>Use compression protocol</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_CLIENT_FOUND_ROWS</b></td>
	 * <td>return number of matched rows, not the number of affected rows</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_CLIENT_IGNORE_SPACE</b></td>
	 * <td>Allow spaces after function names. Makes all function names reserved words.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_CLIENT_INTERACTIVE</b></td>
	 * <td>
	 * Allow interactive_timeout seconds (instead of
	 * wait_timeout seconds) of inactivity before closing the connection
	 * </td>
	 * </tr>
	 * <tr valign="top">
	 * <td><b>MYSQLI_CLIENT_SSL</b></td>
	 * <td>Use SSL (encryption)</td>
	 * </tr>
	 * </table>
	 * <p>
	 * For security reasons the <b>MULTI_STATEMENT</b> flag is
	 * not supported in PHP. If you want to execute multiple queries use the
	 * <b>mysqli_multi_query</b> function.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	real_connect (hostname:any = null,username:any = null,password:any = null,database:any = null,port:any = null,socket:any = null,flags:any = null)
	/**
	 * Escapes special characters in a string for use in an SQL statement, taking into account the current charset of the connection
	 * @link https://php.net/manual/en/mysqli.real-escape-string.php
	 * @param string $string <p>
	 * The string to be escaped.
	 * </p>
	 * <p>
	 * Characters encoded are NUL (ASCII 0), \n, \r, \, ', ", and
	 * Control-Z.
	 * </p>
	 * @return string an escaped string.
	 */
	real_escape_string (string:any)
	/**
	 * Poll connections
	 * @link https://php.net/manual/en/mysqli.poll.php
	 * @param array &$read <p>
	 * </p>
	 * @param array &$error <p>
	 * </p>
	 * @param array &$reject <p>
	 * </p>
	 * @param int $seconds <p>
	 * Number of seconds to wait, must be non-negative.
	 * </p>
	 * @param int $microseconds [optional] <p>
	 * Number of microseconds to wait, must be non-negative.
	 * </p>
	 * @return int|false number of ready connections in success, false otherwise.
	 */
	static poll(read:RMD<array> ,error:RMD<array> ,reject:RMD<array> ,seconds:any,microseconds:any = 0)
	/**
	 * Get result from async query
	 * @link https://php.net/manual/en/mysqli.reap-async-query.php
	 * @return mysqli_result|false mysqli_result in success, false otherwise.
	 */
	reap_async_query()
	/**
	 * Escapes special characters in a string for use in an SQL statement, taking into account the current charset of the connection
	 * @param string $string The string to be escaped.
	 * Characters encoded are NUL (ASCII 0), \n, \r, \, ', ", and Control-Z.
	 * @return string
	 * @link https://secure.php.net/manual/en/mysqli.real-escape-string.php
	 */
	escape_string(string:any)
	/**
	 * Execute an SQL query
	 * @link https://php.net/manual/en/mysqli.real-query.php
	 * @param string $query <p>
	 * The query, as a string.
	 * </p>
	 * <p>
	 * Data inside the query should be properly escaped.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	real_query(query:any)
    /**
     * Execute an SQL query
     * @link https://php.net/manual/en/mysqli.release-savepoint.php
     * @param string $name
     * @return bool Returns TRUE on success or FALSE on failure.
     * @since 5.5
     */
    release_savepoint (name:any)
	/**
	 * Rolls back current transaction
	 * @link https://php.net/manual/en/mysqli.rollback.php
	 * @param int $flags [optional] A bitmask of MYSQLI_TRANS_COR_* constants.
	 * @param string $name [optional] If provided then ROLLBACK $name is executed.
	 * @return bool true on success or false on failure.
	 * @since 5.5 Added flags and name parameters.
	 */
	rollback (flags:any = 0,name:any = null)
    /**
     * Set a named transaction savepoint
     * @link https://secure.php.net/manual/en/mysqli.savepoint.php
     * @param string $name
     * @return bool Returns TRUE on success or FALSE on failure.
     * @since 5.5
     */
    savepoint (name:any)
	/**
	 * Selects the default database for database queries
	 * @link https://php.net/manual/en/mysqli.select-db.php
	 * @param string $database <p>
	 * The database name.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	select_db (database:any)
	/**
	 * Sets the default client character set
	 * @link https://php.net/manual/en/mysqli.set-charset.php
	 * @param string $charset <p>
	 * The charset to be set as default.
	 * </p>
	 * @return bool true on success or false on failure..5
	 */
	set_charset (charset:any)
	/**
	 * @link https://php.net/manual/en/function.mysqli-set-opt
	 * @param int   $option
	 * @param mixed $value
	 */
	set_opt (option:any,value:any)
	/**
	 * Used for establishing secure connections using SSL
	 * @link https://secure.php.net/manual/en/mysqli.ssl-set.php
	 * @param string $key <p>
	 * The path name to the key file.
	 * </p>
	 * @param string $certificate <p>
	 * The path name to the certificate file.
	 * </p>
	 * @param string $ca_certificate <p>
	 * The path name to the certificate authority file.
	 * </p>
	 * @param string $ca_path <p>
	 * The pathname to a directory that contains trusted SSL CA certificates in PEM format.
	 * </p>
	 * @param string $cipher_algos <p>
	 * A list of allowable ciphers to use for SSL encryption.
	 * </p>
	 * @return bool This function always returns TRUE value.
	 */
	ssl_set(key:any ,certificate:any ,ca_certificate:any ,ca_path:any ,cipher_algos:any)
	/**
	 * Gets the current system status
	 * @link https://php.net/manual/en/mysqli.stat.php
	 * @return string|false A string describing the server status. false if an error occurred.
	 */
	stat ()
	/**
	 * Initializes a statement and returns an object for use with mysqli_stmt_prepare
	 * @link https://php.net/manual/en/mysqli.stmt-init.php
	 * @return mysqli_stmt an object.
	 */
	stmt_init ()
	/**
	 * Transfers a result set from the last query
	 * @link https://php.net/manual/en/mysqli.store-result.php
     * @param int $mode [optional] The option that you want to set
	 * @return mysqli_result|false a buffered result object or false if an error occurred.
	 * </p>
	 * <p>
	 * <b>mysqli_store_result</b> returns false in case the query
	 * didn't return a result set (if the query was, for example an INSERT
	 * statement). This function also returns false if the reading of the
	 * result set failed. You can check if you have got an error by checking
	 * if <b>mysqli_error</b> doesn't return an empty string, if
	 * <b>mysqli_errno</b> returns a non zero value, or if
	 * <b>mysqli_field_count</b> returns a non zero value.
	 * Also possible reason for this function returning false after
	 * successful call to <b>mysqli_query</b> can be too large
	 * result set (memory for it cannot be allocated). If
	 * <b>mysqli_field_count</b> returns a non-zero value, the
	 * statement should have produced a non-empty result set.
	 */
	store_result (mode:any = null)
	/**
	 * Returns whether thread safety is given or not
	 * @link https://php.net/manual/en/mysqli.thread-safe.php
	 * @return bool true if the client library is thread-safe, otherwise false.
	 */
	thread_safe ()
	/**
	 * Initiate a result set retrieval
	 * @link https://php.net/manual/en/mysqli.use-result.php
	 * @return mysqli_result|false an unbuffered result object or false if an error occurred.
	 */
	use_result ()
	/**
	 * @link https://php.net/manual/en/mysqli.refresh
	 * @param int $flags MYSQLI_REFRESH_*
	 * @return bool TRUE if the refresh was a success, otherwise FALSE
	 * @since 5.3
	 */
	refresh (flags:any)
}

/**
 * Represents one or more MySQL warnings.
 * @link https://php.net/manual/en/class.mysqli-warning.php
 */
declare final class mysqli_warning  {
	/**
	 * @var string
	 */
	public message;
	/**
	 * @var string
	 */
	public sqlstate;
	/**
	 * @var int
	 */
	public errno;

	/**
	 * Move to the next warning
	 * @link https://php.net/manual/en/mysqli-warning.next.php
	 * @return bool True if it successfully moved to the next warning
	 */
	next():boolean
}

/**
 * Represents the result set obtained from a query against the database.
 * Implements Traversable since 5.4
 * @link https://php.net/manual/en/class.mysqli-result.php
 */
declare class mysqli_result implements IteratorAggregate
{
	/**
	 * @var int
	 */
	public current_field;
	/**
	 * @var int
	 */
	public field_count;
	/**
	 * @var array
	 */
	public lengths;
	/**
	 * @var int
	 */
	public num_rows;
	/**
	 * @var mixed
	 */
	public type;
	/**
	 * Constructor (no docs available)
     * @param object $mysql [optional]
     * @param int $result_mode [optional]
	 */
	constructor (mysql:any = null,result_mode:any = 0)
	__construct (mysql:any = null,result_mode:any = 0)
	/**
	 * Frees the memory associated with a result
	 * @return void
	 * @link https://php.net/manual/en/mysqli-result.free.php
 	 */
	close ()
	/**
	 * Frees the memory associated with a result
	 * @link https://php.net/manual/en/mysqli-result.free.php
	 * @return void
	 */
	free ()
	/**
	 * Adjusts the result pointer to an arbitrary row in the result
	 * @link https://php.net/manual/en/mysqli-result.data-seek.php
	 * @param int $offset <p>
	 * The field offset. Must be between zero and the total number of rows
	 * minus one (0..<b>mysqli_num_rows</b> - 1).
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	data_seek (offset:any)
	/**
	 * Returns the next field in the result set
	 * @link https://php.net/manual/en/mysqli-result.fetch-field.php
	 * @return object|false an object which contains field definition information or false
	 * if no field information is available.
	 * </p>
	 * <p>
	 * <table>
	 * Object properties
	 * <tr valign="top">
	 * <td>Property</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>name</td>
	 * <td>The name of the column</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>orgname</td>
	 * <td>Original column name if an alias was specified</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>table</td>
	 * <td>The name of the table this field belongs to (if not calculated)</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>orgtable</td>
	 * <td>Original table name if an alias was specified</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>def</td>
	 * <td>Reserved for default value, currently always ""</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>db</td>
	 * <td>Database (since PHP 5.3.6)</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>catalog</td>
	 * <td>The catalog name, always "def" (since PHP 5.3.6)</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>max_length</td>
	 * <td>The maximum width of the field for the result set.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>length</td>
	 * <td>The width of the field, as specified in the table definition.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>charsetnr</td>
	 * <td>The character set number for the field.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>flags</td>
	 * <td>An integer representing the bit-flags for the field.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>type</td>
	 * <td>The data type used for this field</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>decimals</td>
	 * <td>The number of decimals used (for integer fields)</td>
	 * </tr>
	 * </table>
	 */
	fetch_field ()
	/**
	 * Returns an array of objects representing the fields in a result set
	 * @link https://php.net/manual/en/mysqli-result.fetch-fields.php
	 * @return array an array of objects which contains field definition information or
	 * false if no field information is available.
	 * </p>
	 * <p>
	 * <table>
	 * Object properties
	 * <tr valign="top">
	 * <td>Property</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>name</td>
	 * <td>The name of the column</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>orgname</td>
	 * <td>Original column name if an alias was specified</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>table</td>
	 * <td>The name of the table this field belongs to (if not calculated)</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>orgtable</td>
	 * <td>Original table name if an alias was specified</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>def</td>
	 * <td>The default value for this field, represented as a string</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>max_length</td>
	 * <td>The maximum width of the field for the result set.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>length</td>
	 * <td>The width of the field, as specified in the table definition.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>charsetnr</td>
	 * <td>The character set number for the field.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>flags</td>
	 * <td>An integer representing the bit-flags for the field.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>type</td>
	 * <td>The data type used for this field</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>decimals</td>
	 * <td>The number of decimals used (for integer fields)</td>
	 * </tr>
	 * </table>
	 */
	fetch_fields ()
	/**
	 * Fetch meta-data for a single field
	 * @link https://php.net/manual/en/mysqli-result.fetch-field-direct.php
	 * @param int $index <p>
	 * The field number. This value must be in the range from
	 * 0 to number of fields - 1.
	 * </p>
	 * @return object|false an object which contains field definition information or false
	 * if no field information for specified fieldnr is
	 * available.
	 * </p>
	 * <p>
	 * <table>
	 * Object attributes
	 * <tr valign="top">
	 * <td>Attribute</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>name</td>
	 * <td>The name of the column</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>orgname</td>
	 * <td>Original column name if an alias was specified</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>table</td>
	 * <td>The name of the table this field belongs to (if not calculated)</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>orgtable</td>
	 * <td>Original table name if an alias was specified</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>def</td>
	 * <td>The default value for this field, represented as a string</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>max_length</td>
	 * <td>The maximum width of the field for the result set.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>length</td>
	 * <td>The width of the field, as specified in the table definition.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>charsetnr</td>
	 * <td>The character set number for the field.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>flags</td>
	 * <td>An integer representing the bit-flags for the field.</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>type</td>
	 * <td>The data type used for this field</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>decimals</td>
	 * <td>The number of decimals used (for integer fields)</td>
	 * </tr>
	 * </table>
	 */
	fetch_field_direct (index:any)
	/**
	 * Fetches all result rows as an associative array, a numeric array, or both
	 * @link https://php.net/manual/en/mysqli-result.fetch-all.php
	 * @param int $mode [optional] <p>
	 * This optional parameter is a constant indicating what type of array
	 * should be produced from the current row data. The possible values for
	 * this parameter are the constants MYSQLI_ASSOC,
	 * MYSQLI_NUM, or MYSQLI_BOTH.
	 * </p>
	 * @return mixed an array of associative or numeric arrays holding result rows.
	 */
	fetch_all (mode:any = MYSQLI_NUM)
	/**
	 * Fetch a result row as an associative, a numeric array, or both
	 * @link https://php.net/manual/en/mysqli-result.fetch-array.php
	 * @param int $mode [optional] <p>
	 * This optional parameter is a constant indicating what type of array
	 * should be produced from the current row data. The possible values for
	 * this parameter are the constants <b>MYSQLI_ASSOC</b>,
	 * <b>MYSQLI_NUM</b>, or <b>MYSQLI_BOTH</b>.
	 * </p>
	 * <p>
	 * By using the <b>MYSQLI_ASSOC</b> constant this function
	 * will behave identically to the <b>mysqli_fetch_assoc</b>,
	 * while <b>MYSQLI_NUM</b> will behave identically to the
	 * <b>mysqli_fetch_row</b> function. The final option
	 * <b>MYSQLI_BOTH</b> will create a single array with the
	 * attributes of both.
	 * </p>
	 * @return mixed an array of strings that corresponds to the fetched row or null if there
	 * are no more rows in resultset.
	 */
	fetch_array (mode:any = MYSQLI_BOTH)
	/**
	 * Fetch a result row as an associative array
	 * @link https://php.net/manual/en/mysqli-result.fetch-assoc.php
	 * @return array|null an associative array of strings representing the fetched row in the result
	 * set, where each key in the array represents the name of one of the result
	 * set's columns or null if there are no more rows in resultset.
	 * </p>
	 * <p>
	 * If two or more columns of the result have the same field names, the last
	 * column will take precedence. To access the other column(s) of the same
	 * name, you either need to access the result with numeric indices by using
	 * <b>mysqli_fetch_row</b> or add alias names.
	 */
	fetch_assoc ()
	/**
	 * Returns the current row of a result set as an object
	 * @link https://php.net/manual/en/mysqli-result.fetch-object.php
	 * @param string $class [optional] <p>
	 * The name of the class to instantiate, set the properties of and return.
	 * If not specified, a <b>stdClass</b> object is returned.
	 * </p>
	 * @param null|array $constructor_args [optional] <p>
	 * An optional array of parameters to pass to the constructor
	 * for <i>class_name</i> objects.
	 * </p>
	 * @return stdClass|object an object with string properties that corresponds to the fetched
	 * row or null if there are no more rows in resultset.
	 */
	fetch_object (className:any = 'stdClass',constructor_args:array = null)
	/**
	 * Get a result row as an enumerated array
	 * @link https://php.net/manual/en/mysqli-result.fetch-row.php
	 * @return array|null mysqli_fetch_row returns an array of strings that corresponds to the fetched row
	 * or null if there are no more rows in result set.
	 */
	fetch_row ()
	/**
	 * Set result pointer to a specified field offset
	 * @link https://php.net/manual/en/mysqli-result.field-seek.php
	 * @param int $index <p>
	 * The field number. This value must be in the range from
	 * 0 to number of fields - 1.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	field_seek (index:any)
	/**
	 * Frees the memory associated with a result
	 * @return void
	 * @link https://php.net/manual/en/mysqli-result.free.php
	 */
	free_result ()
    /**
     * @since 8.0
     * @return Traversable
     */
    getIterator():Traversable
}

/**
 * Represents a prepared statement.
 * @link https://php.net/manual/en/class.mysqli-stmt.php
 */
declare class mysqli_stmt  {
	/**
	 * @var int
	 */
	public affected_rows;
	/**
	 * @var int
	 */
	public insert_id;
	/**
	 * @var int
	 */
	public num_rows;
	/**
	 * @var int
	 */
	public param_count;
	/**
	 * @var int
	 */
	public field_count;
	/**
	 * @var int
	 */
	public errno;
	/**
	 * @var string
	 */
	public error;
	/**
	 * @var array
	 */
	public error_list;
	/**
	 * @var string
	 */
	public sqlstate;
	/**
	 * @var string
	 */
	public id;
	/**
	 * mysqli_stmt constructor
	 * @param mysqli $mysql
	 * @param string $query [optional]
	 */
	constructor (mysql:any,query:any)
	__construct (mysql:any,query:any):this
	/**
	 * Used to get the current value of a statement attribute
	 * @link https://php.net/manual/en/mysqli-stmt.attr-get.php
	 * @param int $attribute <p>
	 * The attribute that you want to get.
	 * </p>
	 * @return int|false false if the attribute is not found, otherwise returns the value of the attribute.
	 */
	attr_get (attribute:any)
	/**
	 * Used to modify the behavior of a prepared statement
	 * @link https://php.net/manual/en/mysqli-stmt.attr-set.php
	 * @param int $attribute <p>
	 * The attribute that you want to set. It can have one of the following values:
	 * <table>
	 * Attribute values
	 * <tr valign="top">
	 * <td>Character</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>MYSQLI_STMT_ATTR_UPDATE_MAX_LENGTH</td>
	 * <td>
	 * If set to 1, causes <b>mysqli_stmt_store_result</b> to
	 * update the metadata MYSQL_FIELD->max_length value.
	 * </td>
	 * </tr>
	 * <tr valign="top">
	 * <td>MYSQLI_STMT_ATTR_CURSOR_TYPE</td>
	 * <td>
	 * Type of cursor to open for statement when <b>mysqli_stmt_execute</b>
	 * is invoked. <i>mode</i> can be MYSQLI_CURSOR_TYPE_NO_CURSOR
	 * (the default) or MYSQLI_CURSOR_TYPE_READ_ONLY.
	 * </td>
	 * </tr>
	 * <tr valign="top">
	 * <td>MYSQLI_STMT_ATTR_PREFETCH_ROWS</td>
	 * <td>
	 * Number of rows to fetch from server at a time when using a cursor.
	 * <i>mode</i> can be in the range from 1 to the maximum
	 * value of unsigned long. The default is 1.
	 * </td>
	 * </tr>
	 * </table>
	 * </p>
	 * <p>
	 * If you use the MYSQLI_STMT_ATTR_CURSOR_TYPE option with
	 * MYSQLI_CURSOR_TYPE_READ_ONLY, a cursor is opened for the
	 * statement when you invoke <b>mysqli_stmt_execute</b>. If there
	 * is already an open cursor from a previous <b>mysqli_stmt_execute</b> call,
	 * it closes the cursor before opening a new one. <b>mysqli_stmt_reset</b>
	 * also closes any open cursor before preparing the statement for re-execution.
	 * <b>mysqli_stmt_free_result</b> closes any open cursor.
	 * </p>
	 * <p>
	 * If you open a cursor for a prepared statement, <b>mysqli_stmt_store_result</b>
	 * is unnecessary.
	 * </p>
	 * @param int $value <p>The value to assign to the attribute.</p>
	 * @return bool
	 */
	attr_set (attribute:any,value:any)
	/**
	 * Binds variables to a prepared statement as parameters
	 * @link https://php.net/manual/en/mysqli-stmt.bind-param.php
	 * @param string $types <p>
	 * A string that contains one or more characters which specify the types
	 * for the corresponding bind variables:
	 * <table>
	 * Type specification chars
	 * <tr valign="top">
	 * <td>Character</td>
	 * <td>Description</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>i</td>
	 * <td>corresponding variable has type integer</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>d</td>
	 * <td>corresponding variable has type double</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>s</td>
	 * <td>corresponding variable has type string</td>
	 * </tr>
	 * <tr valign="top">
	 * <td>b</td>
	 * <td>corresponding variable is a blob and will be sent in packets</td>
	 * </tr>
	 * </table>
	 * </p>
	 * @param mixed &$var1 <p>
	 * The number of variables and length of string
	 * types must match the parameters in the statement.
	 * </p>
	 * @param mixed &...$_ [optional]
	 * @return bool true on success or false on failure.
	 */
	bind_param (types:any,var1:RMD<any>, ...args:RMD<any>[] )
	/**
	 * Binds variables to a prepared statement for result storage
	 * @link https://php.net/manual/en/mysqli-stmt.bind-result.php
	 * @param mixed &$var1 The variable to be bound.
	 * @param mixed &...$_ The variables to be bound.
	 * @return bool true on success or false on failure.
	 */
	bind_result (var1:RMD<any>, ...args:RMD<any>[])
	/**
	 * Closes a prepared statement
	 * @link https://php.net/manual/en/mysqli-stmt.close.php
	 * @return bool true on success or false on failure.
	 */
	close ()
	/**
	 * Seeks to an arbitrary row in statement result set
	 * @link https://php.net/manual/en/mysqli-stmt.data-seek.php
	 * @param int $offset <p>
	 * Must be between zero and the total number of rows minus one (0..
	 * <b>mysqli_stmt_num_rows</b> - 1).
	 * </p>
	 * @return void
	 */
	data_seek (offset:any)
	/**
	 * Executes a prepared Query
	 * @link https://php.net/manual/en/mysqli-stmt.execute.php
	 * @return bool true on success or false on failure.
	 */
	execute ()
	/**
	 * Fetch results from a prepared statement into the bound variables
	 * @link https://php.net/manual/en/mysqli-stmt.fetch.php
	 * @return bool|null
	 */
	fetch ()
	/**
	 * Get result of SHOW WARNINGS
	 * @link https://php.net/manual/en/mysqli-stmt.get-warnings.php
	 * @return object
	 */
	get_warnings ()
	/**
	 * Returns result set metadata from a prepared statement
	 * @link https://php.net/manual/en/mysqli-stmt.result-metadata.php
	 * @return mysqli_result|false a result object or false if an error occurred.
	 */
	result_metadata ()
	/**
	 * Check if there are more query results from a multiple query
	 * @link https://php.net/manual/en/mysqli-stmt.more-results.php
	 * @return bool
	 */
	more_results ()
	/**
	 * Reads the next result from a multiple query
	 * @link https://php.net/manual/en/mysqli-stmt.next-result.php
	 * @return bool
	 */
	next_result ()
	/**
	 * Return the number of rows in statements result set
	 * @link https://php.net/manual/en/mysqli-stmt.num-rows.php
	 * @return int An integer representing the number of rows in result set.
	 */
	num_rows ()
	/**
	 * Send data in blocks
	 * @link https://php.net/manual/en/mysqli-stmt.send-long-data.php
	 * @param int $param_num <p>
	 * Indicates which parameter to associate the data with. Parameters are
	 * numbered beginning with 0.
	 * </p>
	 * @param string $data <p>
	 * A string containing data to be sent.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	send_long_data (param_num:any,data:any)
	/**
	 * No documentation available
     * @removed 5.4
	 */
    	stmt ()
	/**
	 * Frees stored result memory for the given statement handle
	 * @link https://php.net/manual/en/mysqli-stmt.free-result.php
	 * @return void
	 */
	free_result ()
	/**
	 * Resets a prepared statement
	 * @link https://php.net/manual/en/mysqli-stmt.reset.php
	 * @return bool true on success or false on failure.
	 */
	reset ()
	/**
	 * Prepare an SQL statement for execution
	 * @link https://php.net/manual/en/mysqli-stmt.prepare.php
	 * @param string $query <p>
	 * The query, as a string. It must consist of a single SQL statement.
	 * </p>
	 * <p>
	 * You can include one or more parameter markers in the SQL statement by
	 * embedding question mark (?) characters at the
	 * appropriate positions.
	 * </p>
	 * <p>
	 * You should not add a terminating semicolon or \g
	 * to the statement.
	 * </p>
	 * <p>
	 * The markers are legal only in certain places in SQL statements.
	 * For example, they are allowed in the VALUES() list of an INSERT statement
	 * (to specify column values for a row), or in a comparison with a column in
	 * a WHERE clause to specify a comparison value.
	 * </p>
	 * <p>
	 * However, they are not allowed for identifiers (such as table or column names),
	 * in the select list that names the columns to be returned by a SELECT statement),
	 * or to specify both operands of a binary operator such as the =
	 * equal sign. The latter restriction is necessary because it would be impossible
	 * to determine the parameter type. In general, parameters are legal only in Data
	 * Manipulation Language (DML) statements, and not in Data Definition Language
	 * (DDL) statements.
	 * </p>
	 * @return bool true on success or false on failure.
	 */
	prepare (query:any)
	/**
	 * Transfers a result set from a prepared statement
	 * @link https://php.net/manual/en/mysqli-stmt.store-result.php
	 * @return bool true on success or false on failure.
	 */
	store_result ()
	/**
	 * Gets a result set from a prepared statement
	 * @link https://php.net/manual/en/mysqli-stmt.get-result.php
	 * @return mysqli_result|false Returns a resultset or FALSE on failure
 	 */
	get_result ()
}

/**
 * Gets the number of affected rows in a previous MySQL operation
 * @link https://secure.php.net/manual/en/mysqli.affected-rows.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string|int An integer greater than zero indicates the number of rows affected or retrieved.
 * Zero indicates that no records where updated for an UPDATE statement,
 * no rows matched the WHERE clause in the query or that no query has yet been executed. -1 indicates that the query returned an error.
 */
declare function mysqli_affected_rows(mysql:mysqli): string|int

/**
 * Turns on or off auto-committing database modifications
 * @link https://secure.php.net/manual/en/mysqli.autocommit.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param bool $enable Whether to turn on auto-commit or not.
 * @return bool
 */
declare function mysqli_autocommit(mysql:mysqli,enable:boolean):boolean

/**
 * Starts a transaction
 * @link https://secure.php.net/manual/en/mysqli.begin-transaction.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $flags [optional]
 * @param string|null $name [optional]
 * @return bool true on success or false on failure.
 * @since 5.5
 */
declare function mysqli_begin_transaction(mysql:mysqli,flags:int = 0,name?:string):boolean

/**
 * Changes the user of the specified database connection
 * @link https://php.net/manual/en/mysqli.change-user.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $username The MySQL user name.
 * @param string $password The MySQL password.
 * @param string|null $database The database to change to. If desired, the NULL value may be passed resulting in only changing the user and not selecting a database.
 * @return bool
 */
declare function mysqli_change_user(mysql:mysqli,username:string,password:string,database?:string):boolean

/**
 * Returns the default character set for the database connection
 * @link https://php.net/manual/en/mysqli.character-set-name.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string The default character set for the current connection
 */
declare function mysqli_character_set_name(mysql:mysqli): string

/**
 * Closes a previously opened database connection
 * @link https://php.net/manual/en/mysqli.close.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return bool
 */
declare function mysqli_close(mysql:mysqli):boolean

/**
 * Commits the current transaction
 * @link https://php.net/manual/en/mysqli.commit.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $flags [optional] A bitmask of MYSQLI_TRANS_COR_* constants
 * @param string|null $name [optional] If provided then COMMITname is executed
 * @return bool
 */
declare function mysqli_commit(mysql:mysqli,flags:int = -1,name?:string):boolean

/**
 * Open a new connection to the MySQL server
 * Alias of <b>mysqli::__construct</b>
 * @link https://php.net/manual/en/mysqli.construct.php
 * @param string|null $hostname Can be either a host name or an IP address. Passing the NULL value or the string "localhost" to this parameter, the local host is assumed. When possible, pipes will be used instead of the TCP/IP protocol.
 * @param string|null $username The MySQL user name.
 * @param string|null $password If not provided or NULL, the MySQL server will attempt to authenticate the user against those user records which have no password only.
 * @param string|null $database If provided will specify the default database to be used when performing queries.
 * @param int|null $port Specifies the port number to attempt to connect to the MySQL server.
 * @param string|null $socket Specifies the socket or named pipe that should be used.
 * @return mysqli|false|null object which represents the connection to a MySQL Server or false if an error occurred.
 */
declare function mysqli_connect(hostname?:string = null,username?:string = null,password?:string = null,database?:string = null,port?:int = null,socket?:string = null): mysqli|false|null

/**
 * Returns the error code from last connect call
 * @link https://php.net/manual/en/mysqli.connect-errno.php
 * @return int Last error code number from the last call to mysqli_connect(). Zero means no error occurred.
 */
declare function mysqli_connect_errno(): int

/**
 * Returns a string description of the last connect error
 * @link https://php.net/manual/en/mysqli.connect-error.php
 * @return string|null Last error message string from the last call to mysqli_connect().
 */
declare function mysqli_connect_error():string|null

/**
 * Adjusts the result pointer to an arbitrary row in the result
 * @link https://php.net/manual/en/mysqli-result.data-seek.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @param int $offset
 * @return bool Returns TRUE on success or FALSE on failure.
 */
declare function mysqli_data_seek(result:mysqli_result,offset:int):boolean

/**
 * Dump debugging information into the log
 * @link https://php.net/manual/en/mysqli.dump-debug-info.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return bool
 */
declare function mysqli_dump_debug_info(mysql:mysqli):boolean

/**
 * Performs debugging operations using the Fred Fish debugging library.
 * @link https://php.net/manual/en/mysqli.debug.php
 * @param string $options
 * @return bool
 */
declare function mysqli_debug(options:string):boolean

/**
 * Returns the error code for the most recent function call
 * @link https://php.net/manual/en/mysqli.errno.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int An error code value for the last call, if it failed. zero means no error occurred.
 */
declare function mysqli_errno(mysql:mysqli): int

/**
 * Returns a list of errors from the last command executed
 * @link https://php.net/manual/en/mysqli.error-list.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return array A list of errors, each as an associative array containing the errno, error, and sqlstate.
 * @since 5.4
 */
declare function mysqli_error_list(mysql:mysqli): array

/**
 * Returns a list of errors from the last statement executed
 * @link https://secure.php.net/manual/en/mysqli-stmt.error-list.php
 * @param mysqli_stmt $statement A statement identifier returned by mysqli_stmt_init().
 * @return array A list of errors, each as an associative array containing the errno, error, and sqlstate.
 * @since 5.4
 */
declare function mysqli_stmt_error_list(statement:mysqli_stmt): array

/**
 * Returns a string description of the last error
 * @link https://secure.php.net/manual/en/mysqli.error.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string
 */
declare function mysqli_error(mysql:mysqli): string

/**
 * Executes a prepared Query
 * @link https://php.net/manual/en/mysqli-stmt.execute.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_stmt_execute(statement:mysqli_stmt):boolean

/**
 * Executes a prepared Query
 * Alias for <b>mysqli_stmt_execute</b>
 * @link https://php.net/manual/en/function.mysqli-execute.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_execute(statement:mysqli_stmt):boolean

/**
 * Returns the next field in the result set
 * @link https://secure.php.net/manual/en/mysqli-result.fetch-field.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return object|false Returns an object which contains field definition information or FALSE if no field information is available.
 */
declare function mysqli_fetch_field(result:mysqli_result): object|false

/**
 * Returns an array of objects representing the fields in a result set
 * @link https://secure.php.net/manual/en/mysqli-result.fetch-fields.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return array|false Returns an array of objects which contains field definition information or FALSE if no field information is available.
 */
declare function mysqli_fetch_fields(result:mysqli_result)

/**
 * Fetch meta-data for a single field
 * @link https://secure.php.net/manual/en/mysqli-result.fetch-field-direct.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @param int $index The field number. This value must be in the range from 0 to number of fields - 1.
 * @return object|false Returns an object which contains field definition information or FALSE if no field information for specified fieldnr is available.
 */
declare function mysqli_fetch_field_direct(result:mysqli_result,index:int): object|false

/**
 * Returns the lengths of the columns of the current row in the result set
 * @link https://php.net/manual/en/mysqli-result.lengths.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return int[]|false An array of integers representing the size of each column (not including any terminating null characters). FALSE if an error occurred.
 */
declare function mysqli_fetch_lengths(result:mysqli_result): array|false

/**
 * Fetches all result rows as an associative array, a numeric array, or both.
 * Available only with mysqlnd.
 * @link https://php.net/manual/en/mysqli-result.fetch-all.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @param int $mode
 * @return array Returns an array of associative or numeric arrays holding result rows.
 */
declare function mysqli_fetch_all(result:mysqli_result,mode:int = MYSQLI_NUM): array

/**
 * Fetch a result row as an associative, a numeric array, or both.
 * @link https://php.net/manual/en/mysqli-result.fetch-array.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @param int $mode
 * @return array|false|null
 */
declare function mysqli_fetch_array(result:mysqli_result,mode:int = MYSQLI_BOTH): array|false|null

/**
 * Fetch a result row as an associative array
 * @link https://php.net/manual/en/mysqli-result.fetch-assoc.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return string[]|null|false Returns an associative array of strings representing the fetched row in the result set,
 * where each key in the array represents the name of one of the result set's columns or NULL if there are no more rows in resultset.
 * If two or more columns of the result have the same field names, the last column will take precedence.
 * To access the other column(s) of the same name,
 * you either need to access the result with numeric indices by using mysqli_fetch_row() or add alias names.
 */
declare function mysqli_fetch_assoc(result:mysqli_result): array|null|false

/**
 * Returns the current row of a result set as an object.
 * @link https://php.net/manual/en/mysqli-result.fetch-object.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @param string $class The name of the class to instantiate, set the properties of and return. If not specified, a stdClass object is returned.
 * @param array $constructor_args [optional] An optional array of parameters to pass to the constructor for class_name objects.
 * @return object|null|false Returns an object with string properties that corresponds to the fetched row or NULL if there are no more rows in resultset.
 * If two or more columns of the result have the same field names, the last column will take precedence.
 * To access the other column(s) of the same name,
 * you either need to access the result with numeric indices by using mysqli_fetch_row() or add alias names.
 */
declare function mysqli_fetch_object(result:mysqli_result,className:string = 'stdClass',constructor_args:array = []): object|null|false

/**
 * Get a result row as an enumerated array
 * @link https://php.net/manual/en/mysqli-result.fetch-row.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return array|null|false mysqli_fetch_row returns an array of strings that corresponds to the fetched row
 * or null if there are no more rows in result set.
 * @link https://php.net/manual/en/mysqli-result.fetch-row.php
 */
declare function mysqli_fetch_row(result:mysqli_result): array|false|null

/**
 * Returns the number of columns for the most recent query
 * @link https://php.net/manual/en/mysqli.field-count.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int An integer representing the number of fields in a result set.
 */
declare function mysqli_field_count(mysql:mysqli): int

/**
 * Set result pointer to a specified field offset
 * @link https://php.net/manual/en/mysqli-result.field-seek.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @param int $index The field number. This value must be in the range from 0 to number of fields - 1.
 * @return bool
 */
declare function mysqli_field_seek(result:mysqli_result,index:int):boolean

/**
 * Get current field offset of a result pointer
 * @link https://php.net/manual/en/mysqli-result.current-field.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return int
 */
declare function mysqli_field_tell(result:mysqli_result): int

/**
 * Frees the memory associated with a result
 * @link https://php.net/manual/en/mysqli-result.free.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return void
 */
declare function mysqli_free_result(result:mysqli_result): void

/**
 * Returns client Zval cache statistics
 * Available only with mysqlnd.
 * @link https://php.net/manual/en/function.mysqli-get-cache-stats.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return array|false an array with client Zval cache stats if success, false otherwise.
 * @removed 5.4
 */
declare function mysqli_get_cache_stats(mysql:mysqli)

/**
 * Returns statistics about the client connection
 * @link https://php.net/manual/en/mysqli.get-connection-stats.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return array|false an array with connection stats if successful, FALSE otherwise.
 */
declare function mysqli_get_connection_stats(mysql:mysqli)

/**
 * Returns client per-process statistics
 * @link https://php.net/manual/en/function.mysqli-get-client-stats.php
 * @return array|false an array with client stats if success, false otherwise.
 */
declare function mysqli_get_client_stats()

/**
 * Returns a character set object
 * @link https://php.net/manual/en/mysqli.get-charset.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return object|null
 */
declare function mysqli_get_charset(mysql:mysqli):object|null

/**
 * Get MySQL client info
 * @link https://php.net/manual/en/mysqli.get-client-info.php
 * @param mysqli|null $mysql [optional] A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string|null A string that represents the MySQL client library version
 */
declare function mysqli_get_client_info(mysql?:mysqli):string|null

/**
 * Returns the MySQL client version as an integer
 * @link https://php.net/manual/en/mysqli.get-client-version.php
 * @return int
 */
declare function mysqli_get_client_version(): int

/**
 * Returns a string representing the type of connection used
 * @link https://php.net/manual/en/mysqli.get-host-info.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string A character string representing the server hostname and the connection type.
 */
declare function mysqli_get_host_info(mysql:mysqli): string

/**
 * Return information about open and cached links
 * @link https://php.net/manual/en/function.mysqli-get-links-stats.php
 * @return array mysqli_get_links_stats() returns an associative array with three elements, keyed as follows:
 * <dl>
 * <dt>
 * <code>total</code></dt>
 * <dd>
 * <p>
 * An integer indicating the total number of open links in
 * any state.
 * </p>
 * </dd>
 *
 * <dt>
 * <code>active_plinks</code></dt>
 * <dd>
 * <p>
 * An integer representing the number of active persistent
 * connections.
 * </p>
 * </dd>
 *
 * <dt>
 * <code>cached_plinks</code></dt>
 * <dd>
 * <p>
 * An integer representing the number of inactive persistent
 * connections.
 * </p>
 * </dd>
 *
 * </dl>
 * @since 5.6
 */
declare function mysqli_get_links_stats(): array

/**
 * Returns the version of the MySQL protocol used
 * @link https://php.net/manual/en/mysqli.get-proto-info.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int Returns an integer representing the protocol version
 */
declare function mysqli_get_proto_info(mysql:mysqli): int

/**
 * Returns the version of the MySQL server
 * @link https://php.net/manual/en/mysqli.get-server-info.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string A character string representing the server version.
 */
declare function mysqli_get_server_info(mysql:mysqli): string

/**
 * Returns the version of the MySQL server as an integer
 * @link https://php.net/manual/en/mysqli.get-server-version.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int An integer representing the server version.
 * The form of this version number is main_version * 10000 + minor_version * 100 + sub_version (i.e. version 4.1.0 is 40100).
 */
declare function mysqli_get_server_version(mysql:mysqli): int

/**
 * Get result of SHOW WARNINGS
 * @link https://php.net/manual/en/mysqli.get-warnings.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return mysqli_warning|false
 */
declare function mysqli_get_warnings(mysql:mysqli): mysqli_warning|false

/**
 * Initializes MySQLi and returns a resource for use with mysqli_real_connect()
 * @link https://php.net/manual/en/mysqli.init.php
 * @return mysqli|false
 * @see mysqli_real_connect()
 */
declare function mysqli_init(): mysqli|false

/**
 * Retrieves information about the most recently executed query
 * @link https://php.net/manual/en/mysqli.info.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string|null A character string representing additional information about the most recently executed query.
 */
declare function mysqli_info(mysql:mysqli):string|null

/**
 * Returns the auto generated id used in the last query
 * @link https://php.net/manual/en/mysqli.insert-id.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int|string The value of the AUTO_INCREMENT field that was updated by the previous query. Returns zero if there was no previous query on the connection or if the query did not update an AUTO_INCREMENT value.
 * If the number is greater than maximal int value, mysqli_insert_id() will return a string.
 */
declare function mysqli_insert_id(mysql:mysqli): string|int

/**
 * Asks the server to kill a MySQL thread
 * @link https://php.net/manual/en/mysqli.kill.php
 * @see mysqli_thread_id()
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $process_id
 * @return bool
 */
declare function mysqli_kill(mysql:mysqli,process_id:int):boolean

/**
 * Unsets user defined handler for load local infile command
 * @link https://php.net/manual/en/mysqli.set-local-infile-default.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return void
 */
declare function mysqli_set_local_infile_default(mysql:mysqli)

/**
 * Set callback function for LOAD DATA LOCAL INFILE command
 * @link https://php.net/manual/en/mysqli.set-local-infile-handler.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param callable $read_func
 * @return bool
 */
declare function mysqli_set_local_infile_handler(mysql:mysqli,read_func:(...args)=>any):boolean

/**
 * Check if there are any more query results from a multi query
 * @link https://php.net/manual/en/mysqli.more-results.php
 * @see mysqli_multi_query()
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return bool
 */
declare function mysqli_more_results(mysql:mysqli):boolean

/**
 * Performs a query on the database
 * @link https://php.net/manual/en/mysqli.multi-query.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $query One or more queries which are separated by semicolons.
 * @return bool Returns FALSE if the first statement failed. To retrieve subsequent errors from other statements you have to call mysqli_next_result() first.
 */
declare function mysqli_multi_query(mysql:mysqli,query:string):boolean

/**
 * Prepare next result from multi_query
 * @link https://php.net/manual/en/mysqli.next-result.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return bool
 */
declare function mysqli_next_result(mysql:mysqli):boolean

/**
 * Get the number of fields in a result
 * @link https://php.net/manual/en/mysqli-result.field-count.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return int
 */
declare function mysqli_num_fields(result:mysqli_result): int

/**
 * Gets the number of rows in a result
 * @link https://php.net/manual/en/mysqli-result.num-rows.php
 * @param mysqli_result $result A result set identifier returned by mysqli_query(),
 * mysqli_store_result() or mysqli_use_result().
 * @return string|int Returns number of rows in the result set.
 */
declare function mysqli_num_rows(result:mysqli_result): string|int

/**
 * Set options
 * @link https://php.net/manual/en/mysqli.options.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $option
 * @param mixed $value
 * @return bool
 */
declare function mysqli_options(mysql:mysqli,option:int,value:any):boolean

/**
 * Pings a server connection, or tries to reconnect if the connection has gone down
 * @link https://php.net/manual/en/mysqli.ping.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return bool
 */
declare function mysqli_ping(mysql:mysqli):boolean

/**
 * Poll connections
 * @link https://php.net/manual/en/mysqli.poll.php
 * @param array|null &$read
 * @param array|null &$error
 * @param array &$reject
 * @param int $seconds
 * @param int $microseconds [optional]
 * @return int|false number of ready connections upon success, FALSE otherwise.
 */
declare function mysqli_poll(read?:RMD<array>,error?:RMD<array>,reject:RMD<array>,seconds:int,microseconds:int = 0): int|false

/**
 * Prepare an SQL statement for execution
 * @link https://php.net/manual/en/mysqli.prepare.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $query
 * @return mysqli_stmt|false A statement object or FALSE if an error occurred.
 */
declare function mysqli_prepare(mysql:mysqli,query:string): mysqli_stmt|false

/**
 * Enables or disables internal report functions
 * @link https://php.net/manual/en/function.mysqli-report.php
 * @param int $flags <p>
 * <table>
 * Supported flags
 * <tr valign="top">
 * <td>Name</td>
 * <td>Description</td>
 * </tr>
 * <tr valign="top">
 * <td><b>MYSQLI_REPORT_OFF</b></td>
 * <td>Turns reporting off</td>
 * </tr>
 * <tr valign="top">
 * <td><b>MYSQLI_REPORT_ERROR</b></td>
 * <td>Report errors from mysqli function calls</td>
 * </tr>
 * <tr valign="top">
 * <td><b>MYSQLI_REPORT_STRICT</b></td>
 * <td>
 * Throw <b>mysqli_sql_exception</b> for errors
 * instead of warnings
 * </td>
 * </tr>
 * <tr valign="top">
 * <td><b>MYSQLI_REPORT_INDEX</b></td>
 * <td>Report if no index or bad index was used in a query</td>
 * </tr>
 * <tr valign="top">
 * <td><b>MYSQLI_REPORT_ALL</b></td>
 * <td>Set all options (report all)</td>
 * </tr>
 * </table>
 * </p>
 * @return bool
 */
declare function mysqli_report(flags:int):boolean

/**
 * Performs a query on the database
 * @link https://php.net/manual/en/mysqli.query.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $query An SQL query
 * @param int $result_mode
 * @return mysqli_result|boolean
 * For successful SELECT, SHOW, DESCRIBE or EXPLAIN queries, mysqli_query() will return a mysqli_result object.
 * For other successful queries mysqli_query() will return TRUE.
 * Returns FALSE on failure.
 */
declare function mysqli_query(mysql:mysqli,query:string,result_mode:int = MYSQLI_STORE_RESULT): mysqli_result|boolean

/**
 * Opens a connection to a mysql server
 * @link https://php.net/manual/en/mysqli.real-connect.php
 * @see mysqli_connect()
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string|null $hostname [optional]
 * @param string|null $username [optional]
 * @param string|null $password [optional]
 * @param string|null $database [optional]
 * @param int|null $port [optional]
 * @param string|null $socket [optional]
 * @param int $flags [optional]
 * @return bool
 */
declare function mysqli_real_connect(mysql:mysqli,hostname?:string,username?:string,password?:string,database?:string,port?:int,socket?:string,flags:int):boolean

/**
 * Escapes special characters in a string for use in an SQL statement, taking into account the current charset of the connection
 * @link https://php.net/manual/en/mysqli.real-escape-string.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $string The string to be escaped. Characters encoded are NUL (ASCII 0), \n, \r, \, ', ", and Control-Z.
 * @return string
 */
declare function mysqli_real_escape_string(mysql:mysqli,string:string): string

/**
 * Execute an SQL query
 * @link https://php.net/manual/en/mysqli.real-query.php
 * @see mysqli_field_count()
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $query
 * @return bool
 */
declare function mysqli_real_query(mysql:mysqli,query:string):boolean

/**
 * Get result from async query
 * Available only with mysqlnd.
 * @link https://php.net/manual/en/mysqli.reap-async-query.php
 * @see mysqli_poll()
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return mysqli_result|boolean mysqli_result in success, FALSE otherwise.
 */
declare function mysqli_reap_async_query(mysql:mysqli): mysqli_result|boolean

/**
 * Removes the named savepoint from the set of savepoints of the current transaction
 * @link https://secure.php.net/manual/en/mysqli.release-savepoint.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $name
 * @return bool Returns TRUE on success or FALSE on failure.
 * @since 5.5
 */
declare function mysqli_release_savepoint(mysql:mysqli,name:string):boolean

/**
 * Rolls back current transaction
 * @link https://php.net/manual/en/mysqli.rollback.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $flags [optional] A bitmask of MYSQLI_TRANS_COR_* constants
 * @param string|null $name [optional] If provided then ROLLBACKname is executed
 * @return bool
 */
declare function mysqli_rollback(mysql:mysqli,flags:int = 0,name?:string):boolean

/**
 * Set a named transaction savepoint
 * @link https://secure.php.net/manual/en/mysqli.savepoint.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $name
 * @return bool Returns TRUE on success or FALSE on failure.
 * @since 5.5
 */
declare function mysqli_savepoint(mysql:mysqli,name:string):boolean

/**
 * Selects the default database for database queries
 * @link https://php.net/manual/en/mysqli.select-db.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $database
 * @return bool
 */
declare function mysqli_select_db(mysql:mysqli,database:string):boolean

/**
 * Sets the default client character set
 * @link https://php.net/manual/en/mysqli.set-charset.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $charset
 * @return bool
 */
declare function mysqli_set_charset(mysql:mysqli,charset:string):boolean

/**
 * Returns the total number of rows changed, deleted, or inserted by the last executed statement
 * @link https://php.net/manual/en/mysqli-stmt.affected-rows.php
 * @param mysqli_stmt $statement
 * @return int|string If the number of affected rows is greater than maximal PHP int value, the number of affected rows will be returned as a string value.
 */
declare function mysqli_stmt_affected_rows(statement:mysqli_stmt): string|int

/**
 * Used to get the current value of a statement attribute
 * @link https://php.net/manual/en/mysqli-stmt.attr-get.php
 * @param mysqli_stmt $statement
 * @param int $attribute
 * @return int|false Returns FALSE if the attribute is not found, otherwise returns the value of the attribute.
 */
declare function mysqli_stmt_attr_get(statement:mysqli_stmt,attribute:int): false|int

/**
 * Used to modify the behavior of a prepared statement
 * @link https://php.net/manual/en/mysqli-stmt.attr-set.php
 * @param mysqli_stmt $statement
 * @param int $attribute
 * @param int $value
 * @return bool
 */
declare function mysqli_stmt_attr_set(statement:mysqli_stmt,attribute:int,value:int):boolean

/**
 * Returns the number of fields in the given statement
 * @link https://php.net/manual/en/mysqli-stmt.field-count.php
 * @param mysqli_stmt $statement
 * @return int
 */
declare function mysqli_stmt_field_count(statement:mysqli_stmt): int

/**
 * Initializes a statement and returns an object for use with mysqli_stmt_prepare
 * @link https://php.net/manual/en/mysqli.stmt-init.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return mysqli_stmt|false
 */
declare function mysqli_stmt_init(mysql:mysqli): mysqli_stmt|false

/**
 * Prepare an SQL statement for execution
 * @link https://php.net/manual/en/mysqli-stmt.prepare.php
 * @param mysqli_stmt $statement
 * @param string $query
 * @return bool
 */
declare function mysqli_stmt_prepare(statement:mysqli_stmt,query:string):boolean

/**
 * Returns result set metadata from a prepared statement
 * @link https://php.net/manual/en/mysqli-stmt.result-metadata.php
 * @param mysqli_stmt $statement
 * @return mysqli_result|false Returns a result object or FALSE if an error occurred
 */
declare function mysqli_stmt_result_metadata(statement:mysqli_stmt): mysqli_result|false

/**
 * Send data in blocks
 * @link https://php.net/manual/en/mysqli-stmt.send-long-data.php
 * @param mysqli_stmt $statement
 * @param int $param_num
 * @param string $data
 * @return bool
 */
declare function mysqli_stmt_send_long_data(statement:mysqli_stmt,param_num:int,data:string):boolean

/**
 * Binds variables to a prepared statement as parameters
 * @link https://php.net/manual/en/mysqli-stmt.bind-param.php
 * @param mysqli_stmt $statement A statement identifier returned by mysqli_stmt_init()
 * @param string $types <p>
 * A string that contains one or more characters which specify the types
 * for the corresponding bind variables:
 * <table>
 * Type specification chars
 * <tr valign="top">
 * <td>Character</td>
 * <td>Description</td>
 * </tr>
 * <tr valign="top">
 * <td>i</td>
 * <td>corresponding variable has type integer</td>
 * </tr>
 * <tr valign="top">
 * <td>d</td>
 * <td>corresponding variable has type double</td>
 * </tr>
 * <tr valign="top">
 * <td>s</td>
 * <td>corresponding variable has type string</td>
 * </tr>
 * <tr valign="top">
 * <td>b</td>
 * <td>corresponding variable is a blob and will be sent in packets</td>
 * </tr>
 * </table>
 * </p>
 * @param mixed &$var1 <p>
 * The number of variables and length of string
 * types must match the parameters in the statement.
 * </p>
 * @param mixed &...$_ [optional]
 * @return bool true on success or false on failure.
 */
declare function mysqli_stmt_bind_param(statement:mysqli_stmt,types:string,var1:RMD<any>,...args:RMD<any>[]):boolean

/**
 * Binds variables to a prepared statement for result storage
 * @link https://php.net/manual/en/mysqli-stmt.bind-result.php
 * @param mysqli_stmt $statement Statement
 * @param mixed &$var1 The variable to be bound.
 * @param mixed &...$_ The variables to be bound.
 * @return bool
 */
declare function mysqli_stmt_bind_result(statement:mysqli_stmt,var1:RMD<any>, ...args:RMD<any>[]):boolean

/**
 * Fetch results from a prepared statement into the bound variables
 * @link https://php.net/manual/en/mysqli-stmt.fetch.php
 * @param mysqli_stmt $statement
 * @return bool|null
 */
declare function mysqli_stmt_fetch(statement:mysqli_stmt):boolean|null

/**
 * Frees stored result memory for the given statement handle
 * @link https://php.net/manual/en/mysqli-stmt.free-result.php
 * @param mysqli_stmt $statement
 * @return void
 */
declare function mysqli_stmt_free_result(statement:mysqli_stmt): void

/**
 * Gets a result set from a prepared statement
 * @link https://php.net/manual/en/mysqli-stmt.get-result.php
 * @param mysqli_stmt $statement
 * @return mysqli_result|false Returns a resultset or FALSE on failure.
 */
declare function mysqli_stmt_get_result(statement:mysqli_stmt): mysqli_result|false

/**
 * Get result of SHOW WARNINGS
 * @link https://php.net/manual/en/mysqli-stmt.get-warnings.php
 * @param mysqli_stmt $statement
 * @return mysqli_warning|false (not documented, but it's probably a mysqli_warning object)
 */
declare function mysqli_stmt_get_warnings(statement:mysqli_stmt): mysqli_warning|false

/**
 * Get the ID generated from the previous INSERT operation
 * @link https://php.net/manual/en/mysqli-stmt.insert-id.php
 * @param mysqli_stmt $statement
 * @return string|int
 */
declare function mysqli_stmt_insert_id(statement:mysqli_stmt): string|int

/**
 * Resets a prepared statement
 * @link https://php.net/manual/en/mysqli-stmt.reset.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_stmt_reset(statement:mysqli_stmt):boolean

/**
 * Returns the number of parameter for the given statement
 * @link https://php.net/manual/en/mysqli-stmt.param-count.php
 * @param mysqli_stmt $statement
 * @return int
 */
declare function mysqli_stmt_param_count(statement:mysqli_stmt): int

/**
 * Returns the SQLSTATE error from previous MySQL operation
 * @link https://php.net/manual/en/mysqli.sqlstate.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string Returns a string containing the SQLSTATE error code for the last error. The error code consists of five characters. '00000' means no error.
 */
declare function mysqli_sqlstate(mysql:mysqli): string

/**
 * Gets the current system status
 * @link https://php.net/manual/en/mysqli.stat.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string|false A string describing the server status. FALSE if an error occurred.
 */
declare function mysqli_stat(mysql:mysqli): string|false

/**
 * Used for establishing secure connections using SSL
 * @link https://secure.php.net/manual/en/mysqli.ssl-set.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $key The path name to the key file
 * @param string $certificate The path name to the certificate file
 * @param string $ca_certificate The path name to the certificate authority file
 * @param string $ca_path The pathname to a directory that contains trusted SSL CA certificates in PEM format
 * @param string $cipher_algos A list of allowable ciphers to use for SSL encryption
 * @return bool This function always returns TRUE value.
 */
declare function mysqli_ssl_set(mysql:mysqli,key:string ,certificate:string ,ca_certificate:string ,ca_path:string ,cipher_algos:string):boolean

/**
 * Closes a prepared statement
 * @link https://php.net/manual/en/mysqli-stmt.close.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_stmt_close(statement:mysqli_stmt):boolean

/**
 * Seeks to an arbitrary row in statement result set
 * @link https://php.net/manual/en/mysqli-stmt.data-seek.php
 * @param mysqli_stmt $statement
 * @param int $offset
 * @return void
 */
declare function mysqli_stmt_data_seek(statement:mysqli_stmt,offset:int): void

/**
 * Returns the error code for the most recent statement call
 * @link https://php.net/manual/en/mysqli-stmt.errno.php
 * @param mysqli_stmt $statement
 * @return int
 */
declare function mysqli_stmt_errno(statement:mysqli_stmt): int

/**
 * Returns a string description for last statement error
 * @link https://php.net/manual/en/mysqli-stmt.error.php
 * @param mysqli_stmt $statement
 * @return string
 */
declare function mysqli_stmt_error(statement:mysqli_stmt): string

/**
 * Check if there are more query results from a multiple query
 * @link https://php.net/manual/en/mysqli-stmt.more-results.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_stmt_more_results(statement:mysqli_stmt):boolean

/**
 * Reads the next result from a multiple query
 * @link https://php.net/manual/en/mysqli-stmt.next-result.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_stmt_next_result(statement:mysqli_stmt):boolean

/**
 * Return the number of rows in statements result set
 * @link https://php.net/manual/en/mysqli-stmt.num-rows.php
 * @param mysqli_stmt $statement
 * @return string|int
 */
declare function mysqli_stmt_num_rows(statement:mysqli_stmt): string|int

/**
 * Returns SQLSTATE error from previous statement operation
 * @link https://php.net/manual/en/mysqli-stmt.sqlstate.php
 * @param mysqli_stmt $statement
 * @return string Returns a string containing the SQLSTATE error code for the last error. The error code consists of five characters. '00000' means no error.
 */
declare function mysqli_stmt_sqlstate(statement:mysqli_stmt): string

/**
 * Transfers a result set from a prepared statement
 * @link https://php.net/manual/en/mysqli-stmt.store-result.php
 * @param mysqli_stmt $statement
 * @return bool
 */
declare function mysqli_stmt_store_result(statement:mysqli_stmt):boolean

/**
 * Transfers a result set from the last query
 * @link https://php.net/manual/en/mysqli.store-result.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $mode [optional] The option that you want to set
 * @return mysqli_result|false
 */
declare function mysqli_store_result(mysql:mysqli,mode:int): mysqli_result|false

/**
 * Returns the thread ID for the current connection
 * @link https://php.net/manual/en/mysqli.thread-id.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int Returns the Thread ID for the current connection.
 */
declare function mysqli_thread_id(mysql:mysqli): int

/**
 * Returns whether thread safety is given or not
 * @link https://php.net/manual/en/mysqli.thread-safe.php
 * @return bool
 */
declare function mysqli_thread_safe():boolean

/**
 * Initiate a result set retrieval
 * @link https://php.net/manual/en/mysqli.use-result.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return mysqli_result|false
 */
declare function mysqli_use_result(mysql:mysqli): mysqli_result|false

/**
 * Returns the number of warnings from the last query for the given link
 * @link https://php.net/manual/en/mysqli.warning-count.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return int
 */
declare function mysqli_warning_count(mysql:mysqli): int

/**
 * Flushes tables or caches, or resets the replication server information
 * @link https://php.net/manual/en/mysqli.refresh.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $flags
 * @return bool
 */
declare function mysqli_refresh(mysql:mysqli,flags:int):boolean

/**
 * Alias for <b>mysqli_stmt_bind_param</b>
 * @link https://php.net/manual/en/function.mysqli-bind-param.php
 * @param mysqli_stmt $statement
 * @param string $types
 * @removed 5.4
 */
declare function mysqli_bind_param(statement:mysqli_stmt,types:string)

/**
 * Alias for <b>mysqli_stmt_bind_result</b>
 * @link https://php.net/manual/en/function.mysqli-bind-result.php
 * @param mysqli_stmt $statement
 * @param string $types
 * @param mixed &$var1
 * @removed 5.4
 */
declare function mysqli_bind_result(statement:mysqli_stmt,types:string,var1:RMD<any>)

/**
 * Alias of <b>mysqli_character_set_name</b>
 * @link https://php.net/manual/en/function.mysqli-client-encoding.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @return string
 * @removed 5.4
 */
declare function mysqli_client_encoding(mysql:mysqli): string

/**
 * Alias of <b>mysqli_real_escape_string</b>
 * @link https://php.net/manual/en/function.mysqli-escape-string.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param string $string The string to be escaped
 * @return string
 */
declare function mysqli_escape_string(mysql:mysqli,string:string): string

/**
 * Alias for <b>mysqli_stmt_fetch</b>
 * @link https://php.net/manual/en/function.mysqli-fetch.php
 * @param mysqli_stmt $statement
 * @return bool
 * @removed 5.4
 */
declare function mysqli_fetch(statement:mysqli_stmt):boolean

/**
 * Alias for <b>mysqli_stmt_param_count</b>
 * @link https://php.net/manual/en/function.mysqli-param-count.php
 * @param mysqli_stmt $statement
 * @return int
 * @removed 5.4
 */
declare function mysqli_param_count(statement:mysqli_stmt): int

/**
 * Alias for <b>mysqli_stmt_result_metadata</b>
 * @link https://php.net/manual/en/function.mysqli-get-metadata.php
 * @param mysqli_stmt $statement
 * @return mysqli_result|false Returns a result object or FALSE if an error occurred
 * @removed 5.4
 */
declare function mysqli_get_metadata(statement:mysqli_stmt): false|mysqli_result

/**
 * Alias for <b>mysqli_stmt_send_long_data</b>
 * @link https://php.net/manual/en/function.mysqli-send-long-data.php
 * @param mysqli_stmt $statement
 * @param int $param_num
 * @param string $data
 * @return bool
 * @removed 5.4
 */
declare function mysqli_send_long_data(statement:mysqli_stmt,param_num:int,data:string):boolean

/**
 * Alias of <b>mysqli_options</b>
 * @link https://php.net/manual/en/function.mysqli-set-opt.php
 * @param mysqli $mysql A link identifier returned by mysqli_connect() or mysqli_init()
 * @param int $option
 * @param mixed $value
 * @return bool
 */
declare function mysqli_set_opt(mysql:mysqli,option:int,value:any):boolean

/**
 * <p>
 * Read options from the named group from my.cnf
 * or the file specified with <b>MYSQLI_READ_DEFAULT_FILE</b>
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_READ_DEFAULT_GROUP= 5;

/**
 * <p>
 * Read options from the named option file instead of from my.cnf
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_READ_DEFAULT_FILE= 4;

/**
 * <p>
 * Connect timeout in seconds
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_OPT_CONNECT_TIMEOUT= 0;

/**
 * <p>
 * Enables command LOAD LOCAL INFILE
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_OPT_LOCAL_INFILE= 8;

/**
 * <p>
 * RSA public key file used with the SHA-256 based authentication.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_SERVER_PUBLIC_KEY= 35;

/**
 * <p>
 * Command to execute when connecting to MySQL server. Will automatically be re-executed when reconnecting.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_INIT_COMMAND= 3;
declare const MYSQLI_OPT_NET_CMD_BUFFER_SIZE= 202;
declare const MYSQLI_OPT_NET_READ_BUFFER_SIZE= 203;
declare const MYSQLI_OPT_INT_AND_FLOAT_NATIVE= 201;

/**
 * <p>
 * Use SSL (encrypted protocol). This option should not be set by application programs;
 * it is set internally in the MySQL client library
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CLIENT_SSL= 2048;

/**
 * <p>
 * Use compression protocol
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CLIENT_COMPRESS= 32;

/**
 * <p>
 * Allow interactive_timeout seconds
 * (instead of wait_timeout seconds) of inactivity before
 * closing the connection. The client's session
 * wait_timeout variable will be set to
 * the value of the session interactive_timeout variable.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CLIENT_INTERACTIVE= 1024;

/**
 * <p>
 * Allow spaces after function names. Makes all functions names reserved words.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CLIENT_IGNORE_SPACE= 256;

/**
 * <p>
 * Don't allow the db_name.tbl_name.col_name syntax.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CLIENT_NO_SCHEMA= 16;
declare const MYSQLI_CLIENT_FOUND_ROWS= 2;

/**
 * <p>
 * For using buffered resultsets
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_STORE_RESULT= 0;

/**
 * <p>
 * For using unbuffered resultsets
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_USE_RESULT= 1;
declare const MYSQLI_ASYNC= 8;

/**
 * <p>
 * Columns are returned into the array having the fieldname as the array index.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_ASSOC= 1;

/**
 * <p>
 * Columns are returned into the array having an enumerated index.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_NUM= 2;

/**
 * <p>
 * Columns are returned into the array having both a numerical index and the fieldname as the associative index.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_BOTH= 3;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_STMT_ATTR_UPDATE_MAX_LENGTH= 0;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_STMT_ATTR_CURSOR_TYPE= 1;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CURSOR_TYPE_NO_CURSOR= 0;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CURSOR_TYPE_READ_ONLY= 1;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CURSOR_TYPE_FOR_UPDATE= 2;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_CURSOR_TYPE_SCROLLABLE= 4;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_STMT_ATTR_PREFETCH_ROWS= 2;

/**
 * <p>
 * Indicates that a field is defined as NOT NULL
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_NOT_NULL_FLAG= 1;

/**
 * <p>
 * Field is part of a primary index
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_PRI_KEY_FLAG= 2;

/**
 * <p>
 * Field is part of a unique index.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_UNIQUE_KEY_FLAG= 4;

/**
 * <p>
 * Field is part of an index.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_MULTIPLE_KEY_FLAG= 8;

/**
 * <p>
 * Field is defined as BLOB
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_BLOB_FLAG= 16;

/**
 * <p>
 * Field is defined as UNSIGNED
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_UNSIGNED_FLAG= 32;

/**
 * <p>
 * Field is defined as ZEROFILL
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_ZEROFILL_FLAG= 64;

/**
 * <p>
 * Field is defined as AUTO_INCREMENT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_AUTO_INCREMENT_FLAG= 512;

/**
 * <p>
 * Field is defined as TIMESTAMP
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TIMESTAMP_FLAG= 1024;

/**
 * <p>
 * Field is defined as SET
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_SET_FLAG= 2048;

/**
 * <p>
 * Field is defined as NUMERIC
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_NUM_FLAG= 32768;

/**
 * <p>
 * Field is part of an multi-index
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_PART_KEY_FLAG= 16384;

/**
 * <p>
 * Field is part of GROUP BY
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_GROUP_FLAG= 32768;

/**
 * <p>
 * Field is defined as ENUM. Available since PHP 5.3.0.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_ENUM_FLAG= 256;
declare const MYSQLI_BINARY_FLAG= 128;
declare const MYSQLI_NO_DEFAULT_VALUE_FLAG= 4096;
declare const MYSQLI_ON_UPDATE_NOW_FLAG= 8192;
declare const MYSQLI_TRANS_START_READ_ONLY= 4;
declare const MYSQLI_TRANS_START_READ_WRITE= 2;
declare const MYSQLI_TRANS_START_WITH_CONSISTENT_SNAPSHOT= 1;
/**
 * <p>
 * Field is defined as DECIMAL
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_DECIMAL= 0;

/**
 * <p>
 * Field is defined as TINYINT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_TINY= 1;

/**
 * <p>
 * Field is defined as SMALLINT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_SHORT= 2;

/**
 * <p>
 * Field is defined as INT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_LONG= 3;

/**
 * <p>
 * Field is defined as FLOAT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_FLOAT= 4;

/**
 * <p>
 * Field is defined as DOUBLE
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_DOUBLE= 5;

/**
 * <p>
 * Field is defined as DEFAULT NULL
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_NULL= 6;

/**
 * <p>
 * Field is defined as TIMESTAMP
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_TIMESTAMP= 7;

/**
 * <p>
 * Field is defined as BIGINT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_LONGLONG= 8;

/**
 * <p>
 * Field is defined as MEDIUMINT
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_INT24= 9;

/**
 * <p>
 * Field is defined as DATE
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_DATE= 10;

/**
 * <p>
 * Field is defined as TIME
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_TIME= 11;

/**
 * <p>
 * Field is defined as DATETIME
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_DATETIME= 12;

/**
 * <p>
 * Field is defined as YEAR
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_YEAR= 13;

/**
 * <p>
 * Field is defined as DATE
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_NEWDATE= 14;

/**
 * <p>
 * Field is defined as ENUM
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_ENUM= 247;

/**
 * <p>
 * Field is defined as SET
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_SET= 248;

/**
 * <p>
 * Field is defined as TINYBLOB
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_TINY_BLOB= 249;

/**
 * <p>
 * Field is defined as MEDIUMBLOB
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_MEDIUM_BLOB= 250;

/**
 * <p>
 * Field is defined as LONGBLOB
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_LONG_BLOB= 251;

/**
 * <p>
 * Field is defined as BLOB
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_BLOB= 252;

/**
 * <p>
 * Field is defined as VARCHAR
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_VAR_STRING= 253;

/**
 * <p>
 * Field is defined as STRING
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_STRING= 254;

/**
 * <p>
 * Field is defined as CHAR
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_CHAR= 1;

/**
 * <p>
 * Field is defined as INTERVAL
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_INTERVAL= 247;

/**
 * <p>
 * Field is defined as GEOMETRY
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_GEOMETRY= 255;

/**
 * <p>
 * Precision math DECIMAL or NUMERIC field (MySQL 5.0.3 and up)
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_NEWDECIMAL= 246;

/**
 * <p>
 * Field is defined as BIT (MySQL 5.0.3 and up)
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_TYPE_BIT= 16;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_SET_CHARSET_NAME= 7;

/**
 * <p>
 * No more data available for bind variable
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_NO_DATA= 100;

/**
 * <p>
 * Data truncation occurred. Available since PHP 5.1.0 and MySQL 5.0.5.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_DATA_TRUNCATED= 101;

/**
 * <p>
 * Report if no index or bad index was used in a query.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REPORT_INDEX= 4;

/**
 * <p>
 * Report errors from mysqli function calls.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REPORT_ERROR= 1;

/**
 * <p>
 * Throw a mysqli_sql_exception for errors instead of warnings.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REPORT_STRICT= 2;

/**
 * <p>
 * Set all options on (report all).
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REPORT_ALL= 255;

/**
 * <p>
 * Turns reporting off.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REPORT_OFF= 0;

/**
 * <p>
 * Is set to 1 if <b>mysqli_debug</b> functionality is enabled.
 * </p>
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_DEBUG_TRACE_ENABLED= 0;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_SERVER_QUERY_NO_GOOD_INDEX_USED= 16;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_SERVER_QUERY_NO_INDEX_USED= 32;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_GRANT= 1;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_LOG= 2;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_TABLES= 4;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_HOSTS= 8;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_STATUS= 16;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_THREADS= 32;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_SLAVE= 64;

/**
 * @link https://php.net/manual/en/mysqli.constants.php
 */
declare const MYSQLI_REFRESH_MASTER= 128;
declare const MYSQLI_SERVER_QUERY_WAS_SLOW= 2048;
declare const MYSQLI_REFRESH_BACKUP_LOG= 2097152;
// End of mysqli v.0.1

/** @link https://php.net/manual/en/mysqli.constants.php */
declare const MYSQLI_OPT_SSL_VERIFY_SERVER_CERT= 21;
/** @link https://php.net/manual/en/mysqli.constants.php */
declare const MYSQLI_SET_CHARSET_DIR= 6;
/** @link https://php.net/manual/en/mysqli.constants.php */
declare const MYSQLI_SERVER_PS_OUT_PARAMS= 4096;
declare const MYSQLI_CLIENT_SSL_VERIFY_SERVER_CERT= 1073741824;
declare const MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT= 64;
declare const MYSQLI_CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS= 4194304;
declare const MYSQLI_OPT_CAN_HANDLE_EXPIRED_PASSWORDS= 37;
declare const MYSQLI_OPT_READ_TIMEOUT= 11;
declare const MYSQLI_STORE_RESULT_COPY_DATA= 16;
declare const MYSQLI_TYPE_JSON= 245;
declare const MYSQLI_TRANS_COR_AND_CHAIN= 1;
declare const MYSQLI_TRANS_COR_AND_NO_CHAIN= 2;
declare const MYSQLI_TRANS_COR_RELEASE= 4;
declare const MYSQLI_TRANS_COR_NO_RELEASE= 8;
