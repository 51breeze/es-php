
/**
 * <b>SessionHandlerInterface</b> is an interface which defines
 * a prototype for creating a custom session handler.
 * In order to pass a custom session handler to
 * session_set_save_handler() using its OOP invocation,
 * the class must implement this interface.
 * @link https://php.net/manual/en/class.sessionhandlerinterface.php
 * @since 5.4
 */
declare interface SessionHandlerInterface {
	/**
	 * Close the session
	 * @link https://php.net/manual/en/sessionhandlerinterface.close.php
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	close();
	/**
	 * Destroy a session
	 * @link https://php.net/manual/en/sessionhandlerinterface.destroy.php
	 * @param string $id The session ID being destroyed.
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	destroy(id:any);
	/**
	 * Cleanup old sessions
	 * @link https://php.net/manual/en/sessionhandlerinterface.gc.php
	 * @param int $max_lifetime <p>
	 * Sessions that have not updated for
	 * the last maxlifetime seconds will be removed.
	 * </p>
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	gc(max_lifetime:any);
	/**
	 * Initialize session
	 * @link https://php.net/manual/en/sessionhandlerinterface.open.php
	 * @param string $path The path where to store/retrieve the session.
	 * @param string $name The session name.
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	open(path:any,name:any);
	/**
	 * Read session data
	 * @link https://php.net/manual/en/sessionhandlerinterface.read.php
	 * @param string $id The session id to read data for.
	 * @return string <p>
	 * Returns an encoded string of the read data.
	 * If nothing was read, it must return an empty string.
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	read(id:any);
	/**
	 * Write session data
	 * @link https://php.net/manual/en/sessionhandlerinterface.write.php
	 * @param string $id The session id.
	 * @param string $data <p>
	 * The encoded session data. This data is the
	 * result of the PHP internally encoding
	 * the $_SESSION superglobal to a serialized
	 * string and passing it as this parameter.
	 * Please note sessions use an alternative serialization method.
	 * </p>
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	write(id:any,data:any);
}

/**
 * <b>SessionIdInterface</b>
 * @link https://php.net/manual/en/class.sessionidinterface.php
 * @since 5.5.1
 */
declare interface SessionIdInterface {
    /**
     * Create session ID
     * @link https://php.net/manual/en/sessionidinterface.create-sid.php
     * @return string
     */
    create_sid();
}

/**
 * <b>SessionUpdateTimestampHandlerInterface</b> is an interface which
 * defines a prototype for updating the life time of an existing session.
 * In order to use the lazy_write option must be enabled and a custom session
 * handler must implement this interface.
 * @since 7.0
 */
declare interface SessionUpdateTimestampHandlerInterface {
    /**
     * Validate session id
     * @param string $id The session id
     * @return bool <p>
     * Note this value is returned internally to PHP for processing.
     * </p>
     */
    validateId(id:any);
    /**
     * Update timestamp of a session
     * @param string $id The session id
     * @param string $data <p>
     * The encoded session data. This data is the
     * result of the PHP internally encoding
     * the $_SESSION superglobal to a serialized
     * string and passing it as this parameter.
     * Please note sessions use an alternative serialization method.
     * </p>
     * @return bool
     */
    updateTimestamp(id:any,data:any);
}

/**
 * <b>SessionHandler</b> a special class that can
 * be used to expose the current internal PHP session
 * save handler by inheritance. There are six methods
 * which wrap the six internal session save handler
 * callbacks (open, close, read, write, destroy and gc).
 * By default, this class will wrap whatever internal
 * save handler is set as as defined by the
 * session.save_handler configuration directive which is usually
 * files by default. Other internal session save handlers are provided by
 * PHP extensions such as SQLite (as sqlite),
 * Memcache (as memcache), and Memcached (as memcached).
 * @link https://php.net/manual/en/class.reflectionzendextension.php
 * @since 5.4
 */
declare class SessionHandler implements SessionHandlerInterface, SessionIdInterface
{
	/**
	 * Close the session
	 * @link https://php.net/manual/en/sessionhandler.close.php
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	close()
    /**
     * Return a new session ID
     * @link https://php.net/manual/en/sessionhandler.create-sid.php
     * @return string <p>A session ID valid for the default session handler.</p>
     * @since 5.5.1
     */
	create_sid()
	/**
	 * Destroy a session
	 * @link https://php.net/manual/en/sessionhandler.destroy.php
	 * @param string $id The session ID being destroyed.
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	destroy(id:any)
	/**
	 * Cleanup old sessions
	 * @link https://php.net/manual/en/sessionhandler.gc.php
	 * @param int $max_lifetime <p>
	 * Sessions that have not updated for
	 * the last maxlifetime seconds will be removed.
	 * </p>
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	gc(max_lifetime:any)
	/**
	 * Initialize session
	 * @link https://php.net/manual/en/sessionhandler.open.php
	 * @param string $path The path where to store/retrieve the session.
	 * @param string $name The session name.
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	open(path:any,name:any)
	/**
	 * Read session data
	 * @link https://php.net/manual/en/sessionhandler.read.php
	 * @param string $id The session id to read data for.
	 * @return string <p>
	 * Returns an encoded string of the read data.
	 * If nothing was read, it must return an empty string.
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	read(id:any)
	/**
	 * Write session data
	 * @link https://php.net/manual/en/sessionhandler.write.php
	 * @param string $id The session id.
	 * @param string $data <p>
	 * The encoded session data. This data is the
	 * result of the PHP internally encoding
	 * the $_SESSION superglobal to a serialized
	 * string and passing it as this parameter.
	 * Please note sessions use an alternative serialization method.
	 * </p>
	 * @return bool <p>
	 * The return value (usually TRUE on success, FALSE on failure).
	 * Note this value is returned internally to PHP for processing.
	 * </p>
	 * @since 5.4
	 */
	write(id:any,data:any)
    /**
     * Validate session id
     * @param string $session_id The session id
     * @return bool <p>
     * Note this value is returned internally to PHP for processing.
     * </p>
     */
    validateId(session_id:any)
    /**
     * Update timestamp of a session
     * @param string $session_id The session id
     * @param string $session_data <p>
     * The encoded session data. This data is the
     * result of the PHP internally encoding
     * the $_SESSION superglobal to a serialized
     * string and passing it as this parameter.
     * Please note sessions use an alternative serialization method.
     * </p>
     * @return bool
     */
    updateTimestamp(session_id:any,session_data:any)
}
