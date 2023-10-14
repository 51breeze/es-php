
/**
 * MongoDB Extension Stub File
 * @version 1.1.9
 * Documentation taken from https://secure.php.net/manual/en/set.mongodb.php
 * @author Anton Tuyakhov <atuyakhov@gmail.com>
 */

/**
 * Unlike the mongo extension, this extension supports both PHP and HHVM and is developed atop the » libmongoc and » libbson libraries. It provides a minimal API for core driver functionality: commands, queries, writes, connection management, and BSON serialization.
 * Userland PHP libraries that depend on this extension may provide higher level APIs, such as query builders, individual command helper methods, and GridFS. Application developers should consider using this extension in conjunction with the » MongoDB PHP library, which implements the same higher level APIs found in MongoDB drivers for other languages. This separation of concerns allows the driver to focus on essential features for which an extension implementation is paramount for performance.
 * @link https://php.net/manual/en/set.mongodb.php
 */
package MongoDB.Driver{
        
    /**
    * The MongoDB\Driver\Manager is the main entry point to the extension. It is responsible for maintaining connections to MongoDB (be it standalone server, replica set, or sharded cluster).
    * No connection to MongoDB is made upon instantiating the Manager. This means the MongoDB\Driver\Manager can always be constructed, even though one or more MongoDB servers are down.
    * Any write or query can throw connection exceptions as connections are created lazily. A MongoDB server may also become unavailable during the life time of the script. It is therefore important that all actions on the Manager to be wrapped in try/catch statements.
    * @link https://php.net/manual/en/class.mongodb-driver-manager.php
    */
    declare final class Manager{
        /**
        * Manager constructor.
        * @link https://php.net/manual/en/mongodb-driver-manager.construct.php
        * @param string $uri A mongodb:// connection URI
        * @param array $uriOptions Connection string options
        * @param array $driverOptions Any driver-specific options not included in MongoDB connection spec.
        * @throws InvalidArgumentException on argument parsing errors
        * @throws RuntimeException if the uri format is invalid
        */
        constructor(uri:any,uriOptions:array = [],driverOptions:array = [])

        /**
        * Return a ClientEncryption instance.
        * @link https://php.net/manual/en/mongodb-driver-manager.createclientencryption.php
        * @param array $options
        * @return \MongoDB\Driver\ClientEncryption
        * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors.
        * @throws \MongoDB\Driver\Exception\RuntimeException If the extension was compiled without libmongocrypt support.
        */
        createClientEncryption(options:array):MongoDB.Driver.ClientEncryption
        /**
        * Execute one or more write operations
        * @link https://php.net/manual/en/mongodb-driver-manager.executebulkwrite.php
        * @param string $namespace A fully qualified namespace (databaseName.collectionName)
        * @param BulkWrite $bulk The MongoDB\Driver\BulkWrite to execute.
        * @param array|WriteConcern $options WriteConcern type for backwards compatibility
        * @return WriteResult
        * @throws InvalidArgumentException on argument parsing errors.
        * @throws ConnectionException if connection to the server fails for other then authentication reasons
        * @throws AuthenticationException if authentication is needed and fails
        * @throws BulkWriteException on any write failure
        * @throws RuntimeException on other errors (invalid command, command arguments, ...)
        * @since 1.4.0 added $options argument
        */
        executeBulkWrite(namespace:any,bulk:BulkWrite,options:any = []):WriteResult
        /**
        * @link https://php.net/manual/en/mongodb-driver-manager.executecommand.php
        * @param string $db The name of the database on which to execute the command.
        * @param Command $command The command document.
        * @param array|ReadPreference $options ReadPreference type for backwards compatibility
        * @return Cursor
        * @throws Exception
        * @throws AuthenticationException if authentication is needed and fails
        * @throws ConnectionException if connection to the server fails for other then authentication reasons
        * @throws RuntimeException on other errors (invalid command, command arguments, ...)
        * @throws WriteException on Write Error
        * @throws WriteConcernException on Write Concern failure
        * @since 1.4.0 added $options argument
        */
        executeCommand(db:any,command:Command,options:any = []):Cursor
        /**
        * Execute a MongoDB query
        * @link https://php.net/manual/en/mongodb-driver-manager.executequery.php
        * @param string $namespace A fully qualified namespace (databaseName.collectionName)
        * @param Query $query A MongoDB\Driver\Query to execute.
        * @param array|ReadPreference $options ReadPreference type for backwards compatibility
        * @return Cursor
        * @throws Exception
        * @throws AuthenticationException if authentication is needed and fails
        * @throws ConnectionException if connection to the server fails for other then authentication reasons
        * @throws RuntimeException on other errors (invalid command, command arguments, ...)
        * @since 1.4.0 added $options argument
        */
        executeQuery(namespace:any,query:Query,options:any = []):Cursor
        /**
        * @link https://php.net/manual/en/mongodb-driver-manager.executereadcommand.php
        * @param string $db The name of the database on which to execute the command that reads.
        * @param Command $command The command document.
        * @param array $options
        * @return Cursor
        * @throws Exception
        * @throws AuthenticationException if authentication is needed and fails
        * @throws ConnectionException if connection to the server fails for other then authentication reasons
        * @throws RuntimeException on other errors (invalid command, command arguments, ...)
        * @throws WriteException on Write Error
        * @throws WriteConcernException on Write Concern failure
        * @since 1.4.0
        */
        executeReadCommand(db:any,command:Command,options:array = []):Cursor
        /**
        * @link https://php.net/manual/en/mongodb-driver-manager.executereadwritecommand.php
        * @param string $db The name of the database on which to execute the command that reads.
        * @param Command $command The command document.
        * @param array $options
        * @return Cursor
        * @throws Exception
        * @throws AuthenticationException if authentication is needed and fails
        * @throws ConnectionException if connection to the server fails for other then authentication reasons
        * @throws RuntimeException on other errors (invalid command, command arguments, ...)
        * @throws WriteException on Write Error
        * @throws WriteConcernException on Write Concern failure
        * @since 1.4.0
        */
        executeReadWriteCommand(db:any,command:Command,options:array = []):Cursor
        /**
        * @link https://php.net/manual/en/mongodb-driver-manager.executewritecommand.php
        * @param string $db The name of the database on which to execute the command that writes.
        * @param Command $command The command document.
        * @param array $options
        * @return Cursor
        * @throws Exception
        * @throws AuthenticationException if authentication is needed and fails
        * @throws ConnectionException if connection to the server fails for other then authentication reasons
        * @throws RuntimeException on other errors (invalid command, command arguments, ...)
        * @throws WriteException on Write Error
        * @throws WriteConcernException on Write Concern failure
        * @since 1.4.0
        */
        executeWriteCommand(db:any,command:Command,options:array = []):Cursor
        /**
        * Return the ReadConcern for the Manager
        * @link https://php.net/manual/en/mongodb-driver-manager.getreadconcern.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return ReadConcern
        */
        getReadConcern():ReadConcern

        /**
        * Return the ReadPreference for the Manager
        * @link https://php.net/manual/en/mongodb-driver-manager.getreadpreference.php
        * @throws InvalidArgumentException
        * @return ReadPreference
        */
        getReadPreference():ReadPreference

        /**
        * Return the servers to which this manager is connected
        * @link https://php.net/manual/en/mongodb-driver-manager.getservers.php
        * @throws InvalidArgumentException on argument parsing errors
        * @return Server[]
        */
        getServers():Server[]

        /**
        * Return the WriteConcern for the Manager
        * @link https://php.net/manual/en/mongodb-driver-manager.getwriteconcern.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return WriteConcern
        */
        getWriteConcern():WriteConcern

        /**
        * Preselect a MongoDB node based on provided readPreference. This can be useful to guarantee a command runs on a specific server when operating in a mixed version cluster.
        * https://secure.php.net/manual/en/mongodb-driver-manager.selectserver.php
        * @param ReadPreference $readPreference Optionally, a MongoDB\Driver\ReadPreference to route the command to. If none given, defaults to the Read Preferences set by the MongoDB Connection URI.
        * @throws InvalidArgumentException on argument parsing errors.
        * @throws ConnectionException if connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException if authentication is needed and fails.
        * @throws RuntimeException if a server matching the read preference could not be found.
        * @return Server
        */
        selectServer(readPreference:ReadPreference = null):Server

        /**
        * Start a new client session for use with this client
        * @param array $options
        * @return \MongoDB\Driver\Session
        * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors
        * @throws \MongoDB\Driver\Exception\RuntimeException If the session could not be created (e.g. libmongoc does not support crypto).
        * @link https://secure.php.net/manual/en/mongodb-driver-manager.startsession.php
        * @since 1.4.0
        */
        startSession(options:array = []):MongoDB.Driver.Session
    }

    /**
        * @link https://php.net/manual/en/class.mongodb-driver-server.php
        */
    declare final class Server
    {
        const TYPE_UNKNOWN = 0;
        const TYPE_STANDALONE = 1;
        const TYPE_MONGOS = 2;
        const TYPE_POSSIBLE_PRIMARY = 3;
        const TYPE_RS_PRIMARY = 4;
        const TYPE_RS_SECONDARY = 5;
        const TYPE_RS_ARBITER = 6;
        const TYPE_RS_OTHER = 7;
        const TYPE_RS_GHOST = 8;
        
        /**
        * Execute one or more write operations on this server
        * @link https://php.net/manual/en/mongodb-driver-server.executebulkwrite.php
        * @param string $namespace A fully qualified namespace (e.g. "databaseName.collectionName").
        * @param BulkWrite $zwrite The MongoDB\Driver\BulkWrite to execute.
        * @param array $options
        * @throws BulkWriteException on any write failure (e.g. write error, failure to apply a write concern).
        * @throws InvalidArgumentException on argument parsing errors.
        * @throws ConnectionException if connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException if authentication is needed and fails.
        * @throws RuntimeException on other errors.
        * @return WriteResult
        * @since 1.0.0
        */
        executeBulkWrite(namespace:any,zwrite:BulkWrite,options:any = []):WriteResult
        /**
        * Execute a database command on this server
        * @link https://php.net/manual/en/mongodb-driver-server.executecommand.php
        * @param string $db The name of the database on which to execute the command.
        * @param Command $command The MongoDB\Driver\Command to execute.
        * @param ReadPreference $readPreference Optionally, a MongoDB\Driver\ReadPreference to select the server for this operation. If none is given, the read preference from the MongoDB Connection URI will be used.
        * @throws InvalidArgumentException on argument parsing errors.
        * @throws ConnectionException if connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException if authentication is needed and fails.
        * @throws RuntimeException on other errors (e.g. invalid command, issuing a write command to a secondary).
        * @return Cursor
        * @since 1.0.0
        */
        executeCommand(db:any,command:Command,readPreference:ReadPreference = null):Cursor
        /**
        * Execute a database command that reads on this server
        * @link https://secure.php.net/manual/en/mongodb-driver-server.executereadcommand.php
        * @param string                  $db
        * @param \MongoDB\Driver\Command $command
        * @param array                   $option
        * @return Cursor
        * @throws InvalidArgumentException On argument parsing errors or  if the "session" option is used with an associated transaction in combination with a "readConcern" or "writeConcern" option.
        * @throws ConnectionException If connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException If authentication is needed and fails.
        * @throws RuntimeException On other errors (e.g. invalid command).
        * @since 1.4.0
        */
        executeReadCommand(db:any,command:Command,option:array = []):Cursor
        /**
        * Execute a database command that reads and writes on this server
        * @link https://secure.php.net/manual/en/mongodb-driver-server.executereadwritecommand.php
        * @param string                  $db
        * @param \MongoDB\Driver\Command $command
        * @param array                   $option
        * @return Cursor
        * @throws InvalidArgumentException On argument parsing errors OR if the "session" option is used with an associated transaction in combination with a "readConcern" or "writeConcern" option OR if the "session" option is used in combination with an unacknowledged write concern
        * @throws ConnectionException If connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException If authentication is needed and fails.
        * @throws RuntimeException On other errors (e.g. invalid command).
        * @since 1.4.0
        */
        executeReadWriteCommand(db:any,command:Command,option:array = []):Cursor
        /**
        * Execute a database command that writes on this server
        * @link https://secure.php.net/manual/en/mongodb-driver-server.executewritecommand.php
        * @param string                  $db
        * @param \MongoDB\Driver\Command $command
        * @param array                   $option
        * @return Cursor
        * @throws InvalidArgumentException On argument parsing errors or  if the "session" option is used with an associated transaction in combination with a "readConcern" or "writeConcern" option.
        * @throws ConnectionException If connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException If authentication is needed and fails.
        * @throws RuntimeException On other errors (e.g. invalid command).
        * @since 1.4.0
        */
        executeWriteCommand(db:any,command:Command,option:array = []):Cursor
        /**
        * Execute a database query on this server
        * @link https://php.net/manual/en/mongodb-driver-server.executequery.php
        * @param string $namespace A fully qualified namespace (e.g. "databaseName.collectionName").
        * @param Query $query The MongoDB\Driver\Query to execute.
        * @param array|ReadPreference $options
        * <table>
        * <caption><strong>options</strong></caption>
        *
        * <thead>
        * <tr>
        * <th>Option</th>
        * <th>Type</th>
        * <th>Description</th>
        * </tr>
        *
        * </thead>
        *
        * <tbody>
        *
        * <tr>
        * <td>readPreference</td>
        * <td><a href="https://php.net/manual/en/php.neclass.mongodb-driver-readpreference.php">MongoDB\Driver\ReadPreference</a></td>
        * <td>
        * <p>
        * A read preference to use for selecting a server for the operation.
        * </p>
        * </td>
        * </tr>
        * <tr>
        * <td>session</td>
        * <td><a href="https://php.net/manual/en/class.mongodb-driver-session.php">MongoDB\Driver\Session</a></td>
        * <td>
        * <p>
        * A session to associate with the operation.
        * </p>
        * </td>
        * </tr>
        * </tbody>
        * </table>
        * The third parameter is now an options array. For backwards compatibility, this parameter will still accept a MongoDB\Driver\ReadPreference object.
        * @throws InvalidArgumentException on argument parsing errors.
        * @throws ConnectionException if connection to the server fails (for reasons other than authentication).
        * @throws AuthenticationException if authentication is needed and fails.
        * @throws RuntimeException on other errors (e.g. invalid command, issuing a write command to a secondary).
        * @return Cursor
        */
        executeQuery(namespace:any,query:Query,option:any = []):Cursor
        /**
        * Returns the hostname of this server
        * @link https://php.net/manual/en/mongodb-driver-server.gethost.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return string
        */
        getHost():string
        /**
        * Returns an array of information about this server
        * @link https://php.net/manual/en/mongodb-driver-server.getinfo.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return array
        */
        getInfo():array
        /**
        * Returns the latency of this server
        * @link https://php.net/manual/en/mongodb-driver-server.getlatency.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return integer
        */
        getLatency():number
        /**
        * Returns the port on which this server is listening
        * @link https://php.net/manual/en/mongodb-driver-server.getport.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return integer
        */
        getPort():number
        /**
        * Returns an array of tags describing this server in a replica set
        * @link https://php.net/manual/en/mongodb-driver-server.gettags.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return array An array of tags used to describe this server in a replica set. The array will contain zero or more string key and value pairs.
        */
        getTags():string|number[]
        /**
        * Returns an integer denoting the type of this server
        * @link https://php.net/manual/en/mongodb-driver-server.gettype.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return integer denoting the type of this server
        */
        getType():number
        /**
        * Checks if this server is an arbiter member of a replica set
        * @link https://php.net/manual/en/mongodb-driver-server.isarbiter.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return bool
        */
        isArbiter():boolean;
        /**
        * Checks if this server is a hidden member of a replica set
        * @link https://php.net/manual/en/mongodb-driver-server.ishidden.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return bool
        */
        isHidden():boolean;
        /**
        * Checks if this server is a passive member of a replica set
        * @link https://php.net/manual/en/mongodb-driver-server.ispassive.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return bool
        */
        isPassive():boolean;
        /**
        * Checks if this server is a primary member of a replica set
        * @link https://php.net/manual/en/mongodb-driver-server.isprimary.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return bool
        */
        isPrimary():boolean;
        /**
        * Checks if this server is a secondary member of a replica set
        * @link https://php.net/manual/en/mongodb-driver-server.issecondary.php
        * @throws InvalidArgumentException on argument parsing errors.
        * @return bool
        */
        isSecondary():boolean;
    }
    /**
    * The MongoDB\Driver\Query class is a value object that represents a database query.
    * @link https://php.net/manual/en/class.mongodb-driver-query.php
    */
    declare final class Query
    {
        /**
        * Construct new Query
        * @link https://php.net/manual/en/mongodb-driver-query.construct.php
        * @param array|object $filter The search filter.
        * @param array $queryOptions
        * @throws InvalidArgumentException on argument parsing errors.
        */
        constructor(filter:any,queryOptions:array = [])
    }
    /**
    * The MongoDB\Driver\Command class is a value object that represents a database command.
    * To provide "Command Helpers" the MongoDB\Driver\Command object should be composed.
    * @link https://php.net/manual/en/class.mongodb-driver-command.php
    * @since 1.0.0
    */
    declare final class Command
    {
        /**
        * Construct new Command
        * @param array|object $document The complete command to construct
        * @param array $commandOptions Do not use this parameter to specify options described in the command's reference in the MongoDB manual.
        * @throws InvalidArgumentException on argument parsing errors.
        * @link https://secure.php.net/manual/en/mongodb-driver-command.construct.php
        * @since 1.0.0
        */
        constructor(document:any,commandOptions:array = [])
    }
    /**
        * Class ReadPreference
        * @link https://php.net/manual/en/class.mongodb-driver-readpreference.php
        */
    declare final class ReadPreference implements Serializable, Serializable
    {
        const RP_PRIMARY = 1;
        const RP_PRIMARY_PREFERRED = 5;
        const RP_SECONDARY = 2;
        const RP_SECONDARY_PREFERRED = 6;
        const RP_NEAREST = 10;
        /**
        * @since 1.7.0
        */
        const PRIMARY = 'primary';
        /**
        * @since 1.7.0
        */
        const PRIMARY_PREFERRED = 'primaryPreferred';
        /**
        * @since 1.7.0
        */
        const SECONDARY = 'secondary';
        /**
        * @since 1.7.0
        */
        const SECONDARY_PREFERRED = 'secondaryPreferred';
        /**
        * @since 1.7.0
        */
        const NEAREST = 'nearest';
        /**
        * @since 1.2.0
        */
        const NO_MAX_STALENESS = -1;
        /**
        * @since 1.2.0
        */
        const SMALLEST_MAX_STALENESS_SECONDS = 90;
        /**
        * Construct immutable ReadPreference
        * @link https://php.net/manual/en/mongodb-driver-readpreference.construct.php
        * @param string|int $mode
        * @param array|null $tagSets
        * @param array $options
        * @throws InvalidArgumentException if mode is invalid or if tagSets is provided for a primary read preference.
        */
        constructor(mode:string|int,tagSets:array = null,options:array = [])
        /**
        * Returns the ReadPreference's "hedge" option
        * @since 1.8.0
        * @link https://www.php.net/manual/en/mongodb-driver-readpreference.gethedge.php
        * @return object|null
        */
        getHedge():object|null
        /**
        * Returns the ReadPreference's "mode" option
        * @link https://php.net/manual/en/mongodb-driver-readpreference.getmode.php
        * @return integer
        */
        getMode():number;
        /**
        * Returns the ReadPreference's "mode" option as a string
        * @since 1.7.0
        * @link https://php.net/manual/en/mongodb-driver-readpreference.getmodestring.php
        * @return string
        * @throws InvalidArgumentException
        */
        getModeString():string;
        /**
        * Returns the ReadPreference's "tagSets" option
        * @link https://php.net/manual/en/mongodb-driver-readpreference.gettagsets.php
        * @return array
        */
        getTagSets():array;
        /**
        * Returns an object for BSON serialization
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-driver-readpreference.bsonserialize.php
        * @return object Returns an object for serializing the WriteConcern as BSON.
        * @throws InvalidArgumentException
        */
        bsonSerialize():object;
        /**
        * Serialize a ReadPreference
        * @since 1.7.0
        * @link https://php.net/manual/en/mongodb-driver-readpreference.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize():string;
        /**
        * Unserialize a ReadPreference
        * @since 1.7.0
        * @link https://php.net/manual/en/mongodb-driver-readpreference.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
    }
    /**
    * MongoDB\Driver\ReadConcern controls the level of isolation for read operations for replica sets and replica set shards. This option requires the WiredTiger storage engine and MongoDB 3.2 or later.
    * @link https://php.net/manual/en/class.mongodb-driver-readconcern.php
    * @since 1.1.0
    */
    declare final class ReadConcern implements Serializable, Serializable
    {
        /**
        * @since 1.2.0
        */
        const LINEARIZABLE = 'linearizable' ;
        const LOCAL = 'local' ;
        const MAJORITY = 'majority' ;
        /**
        * @since 1.4.0
        */
        const AVAILABLE = 'available' ;
        /**
        * Construct immutable ReadConcern
        * @link https://php.net/manual/en/mongodb-driver-readconcern.construct.php
        * @param string $level
        */
        constructor(level:any = null)
        /**
        * Returns the ReadConcern's "level" option
        * @link https://php.net/manual/en/mongodb-driver-readconcern.getlevel.php
        * @return string|null
        * @since 1.0.0
        */
        getLevel()
        /**
        * Returns an object for BSON serialization
        * @link https://php.net/manual/en/mongodb-driver-readconcern.bsonserialize.php
        * @return object
        * @since 1.2.0
        */
        bsonSerialize()
        /**
        * Checks if this is the default read concern
        * @link https://secure.php.net/manual/en/mongodb-driver-readconcern.isdefault.php
        * @return bool
        * @since 1.3.0
        * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors.
        */
        isDefault()
        /**
        * Serialize a ReadConcern
        * @since 1.7.0
        * @link https://php.net/manual/en/mongodb-driver-readconcern.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a ReadConcern
        * @since 1.7.0
        * @link https://php.net/manual/en/mongodb-driver-readconcern.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
    }
    /**
    * The MongoDB\Driver\Cursor class encapsulates the results of a MongoDB command or query and may be returned by MongoDB\Driver\Manager::executeCommand() or MongoDB\Driver\Manager::executeQuery(), respectively.
    * @link https://php.net/manual/en/class.mongodb-driver-cursor.php
    */
    declare final class Cursor implements CursorInterface, Iterator
    {
        /**
        * Create a new Cursor
        * MongoDB\Driver\Cursor objects are returned as the result of an executed command or query and cannot be constructed directly.
        * @link https://php.net/manual/en/mongodb-driver-cursor.construct.php
        */
        constructor()
        /**
        * Returns the current element.
        * @link https://www.php.net/manual/en/mongodb-driver-cursor.current.php
        * @return array|object
        */
        current()
        /**
        * Returns the MongoDB\Driver\CursorId associated with this cursor. A cursor ID cursor uniquely identifies the cursor on the server.
        * @link https://php.net/manual/en/mongodb-driver-cursor.getid.php
        * @return CursorId for this Cursor
        * @throws InvalidArgumentException on argument parsing errors.
        */
        getId()
        /**
        * Returns the MongoDB\Driver\Server associated with this cursor. This is the server that executed the query or command.
        * @link https://php.net/manual/en/mongodb-driver-cursor.getserver.php
        * @return Server for this Cursor
        * @throws InvalidArgumentException on argument parsing errors.
        */
        getServer()
        /**
        * Checks if a cursor is still alive
        * @link https://php.net/manual/en/mongodb-driver-cursor.isdead.php
        * @return bool
        * @throws InvalidArgumentException On argument parsing errors
        */
        isDead()
        /**
        * Returns the current result's index within the cursor.
        * @link https://www.php.net/manual/en/mongodb-driver-cursor.key.php
        * @return int
        */
        key()
        /**
        * Advances the cursor to the next result.
        * @link https://www.php.net/manual/en/mongodb-driver-cursor.next.php
        * @return void
        * @throws \MongoDB\Driver\Exception\InvalidArgumentException on argument parsing errors.
        * @throws \MongoDB\Driver\Exception\ConnectionException if connection to the server fails (for reasons other than authentication).
        * @throws \MongoDB\Driver\Exception\AuthenticationException if authentication is needed and fails.
        */
        next()
        /**
        * Rewind the cursor to the first result.
        * @link https://www.php.net/manual/en/mongodb-driver-cursor.rewind.php
        * @return void
        * @throws \MongoDB\Driver\Exception\InvalidArgumentException on argument parsing errors.
        * @throws \MongoDB\Driver\Exception\ConnectionException if connection to the server fails (for reasons other than authentication).
        * @throws \MongoDB\Driver\Exception\AuthenticationException if authentication is needed and fails.
        * @throws \MongoDB\Driver\Exception\LogicException if this method is called after the cursor has advanced beyond its first position.
        */
        rewind()
        /**
        * Sets a type map to use for BSON unserialization
        *
        * @link https://php.net/manual/en/mongodb-driver-cursor.settypemap.php
        *
        * @param array $typemap
        * @return void
        * @throws InvalidArgumentException On argument parsing errors or if a class in the type map cannot
        * be instantiated or does not implement MongoDB\BSON\Unserializable
        */
        setTypeMap(typemap:array)
        /**
        * Returns an array of all result documents for this cursor
        * @link https://php.net/manual/en/mongodb-driver-cursor.toarray.php
        * @return array
        * @throws InvalidArgumentException On argument parsing errors
        */
        toArray()
        /**
        * Checks if the current position in the cursor is valid.
        * @link https://www.php.net/manual/en/mongodb-driver-cursor.valid.php
        * @return bool
        */
        valid()
    }
    /**
    * Class CursorId
    * @link https://php.net/manual/en/class.mongodb-driver-cursorid.php
    */
    declare final class CursorId implements Serializable
    {
        /**
        * Create a new CursorId (not used)
        * CursorId objects are returned from Cursor::getId() and cannot be constructed directly.
        * @link https://php.net/manual/en/mongodb-driver-cursorid.construct.php
        * @see Cursor::getId()
        */
        constructor()
        /**
        * String representation of the cursor ID
        * @link https://php.net/manual/en/mongodb-driver-cursorid.tostring.php
        * @return string representation of the cursor ID.
        * @throws InvalidArgumentException on argument parsing errors.
        */
        __toString()
        /**
            * Serialize a CursorId
            * @since 1.7.0
            * @link https://php.net/manual/en/mongodb-driver-cursorid.serialize.php
            * @return string
            * @throws InvalidArgumentException
            */
        serialize()
        /**
            * Unserialize a CursorId
            * @since 1.7.0
            * @link https://php.net/manual/en/mongodb-driver-cursorid.unserialize.php
            * @param string $serialized
            * @return void
            * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
            * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
            */
        unserialize(serialized:any)
    }
    /**
        * The BulkWrite collects one or more write operations that should be sent to the server.
        * After adding any number of insert, update, and delete operations, the collection may be executed via Manager::executeBulkWrite().
        * Write operations may either be ordered (default) or unordered.
        * Ordered write operations are sent to the server, in the order provided, for serial execution.
        * If a write fails, any remaining operations will be aborted.
        * Unordered operations are sent to the server in an arbitrary order where they may be executed in parallel.
        * Any errors that occur are reported after all operations have been attempted.
        */
    declare final class BulkWrite implements Countable
    {
        /**
            * Create a new BulkWrite
            * Constructs a new ordered (default) or unordered BulkWrite.
            * @link https://php.net/manual/en/mongodb-driver-bulkwrite.construct.php
            * @param array $options
            * @throws InvalidArgumentException on argument parsing errors.
            */
        constructor(options:array = [])
        /**
            * Count expected roundtrips for executing the bulk
            * Returns the expected number of client-to-server roundtrips required to execute all write operations in the BulkWrite.
            * @link https://php.net/manual/en/mongodb-driver-bulkwrite.count.php
            * @return int number of expected roundtrips to execute the BulkWrite.
            * @throws InvalidArgumentException on argument parsing errors.
            */
        count()
        /**
            * Add a delete operation to the bulk
            * @link https://php.net/manual/en/mongodb-driver-bulkwrite.delete.php
            * @param array|object $filter The search filter
            * @param array $deleteOptions
            * @throws InvalidArgumentException on argument parsing errors.
            */
        delete(filter:any,deleteOptions:array = [])
        /**
            * Add an insert operation to the bulk
            * If the document did not have an _id, a MongoDB\BSON\ObjectId will be generated and returned; otherwise, no value is returned.
            * @link https://php.net/manual/en/mongodb-driver-bulkwrite.insert.php
            * @param array|object $document
            * @return mixed
            * @throws InvalidArgumentException on argument parsing errors.
            */
        insert(document:any)
        /**
            * Add an update operation to the bulk
            * @link https://php.net/manual/en/mongodb-driver-bulkwrite.update.php
            * @param array|object $filter The search filter
            * @param array|object $newObj A document containing either update operators (e.g. $set) or a replacement document (i.e. only field:value expressions)
            * @param array $updateOptions
            * @throws InvalidArgumentException on argument parsing errors.
            */
        update(filter:any,newObj:any,updateOptions:array = [])
    }
    /**
        * WriteConcern controls the acknowledgment of a write operation, specifies the level of write guarantee for Replica Sets.
        */
    declare final class WriteConcern implements Serializable, Serializable
    {
        /**
            * Majority of all the members in the set; arbiters, non-voting members, passive members, hidden members and delayed members are all included in the definition of majority write concern.
            */
        const MAJORITY = 'majority';
        /**
            * Construct immutable WriteConcern
            * @link https://php.net/manual/en/mongodb-driver-writeconcern.construct.php
            * @param string|integer $w
            * @param integer $wtimeout How long to wait (in milliseconds) for secondaries before failing.
            * @param bool $journal Wait until mongod has applied the write to the journal.
            * @throws InvalidArgumentException on argument parsing errors.
            */
        constructor(w:any,wtimeout:any = 0,journal:any = false)
        /**
            * Returns the WriteConcern's "journal" option
            * @link https://php.net/manual/en/mongodb-driver-writeconcern.getjournal.php
            * @return bool|null
            */
        getJournal()
        /**
            * Returns the WriteConcern's "w" option
            * @link https://php.net/manual/en/mongodb-driver-writeconcern.getw.php
            * @return string|int|null
            */
        getW()
        /**
            * Returns the WriteConcern's "wtimeout" option
            * @link https://php.net/manual/en/mongodb-driver-writeconcern.getwtimeout.php
            * @return int
            */
        getWtimeout()
        /**
            * Returns an object for BSON serialization
            * @since 1.2.0
            * @link https://www.php.net/manual/en/mongodb-driver-writeconcern.bsonserialize.php
            * @return object Returns an object for serializing the WriteConcern as BSON.
            * @throws InvalidArgumentException
            */
        bsonSerialize()
        /**
            * Serialize a WriteConcern
            * @since 1.7.0
            * @link https://php.net/manual/en/mongodb-driver-writeconcern.serialize.php
            * @return string
            * @throws InvalidArgumentException
            */
        serialize()
        /**
            * Unserialize a WriteConcern
            * @since 1.7.0
            * @link https://php.net/manual/en/mongodb-driver-writeconcern.unserialize.php
            * @param string $serialized
            * @return void
            * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
            * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
            */
        unserialize(serialized:any)
    }
    /**
        * The MongoDB\Driver\WriteResult class encapsulates information about an executed MongoDB\Driver\BulkWrite and may be returned by MongoDB\Driver\Manager::executeBulkWrite().
        * @link https://php.net/manual/en/class.mongodb-driver-writeresult.php
        */
    declare final class WriteResult
    {
        /**
            * Returns the number of documents deleted
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getdeletedcount.php
            * @return integer|null
            */
        getDeletedCount()
        /**
            * Returns the number of documents inserted (excluding upserts)
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getinsertedcount.php
            * @return integer|null
            */
        getInsertedCount()
        /**
            * Returns the number of documents selected for update
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getmatchedcount.php
            * @return integer|null
            */
        getMatchedCount()
        /**
            * Returns the number of existing documents updated
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getmodifiedcount.php
            * @return integer|null
            */
        getModifiedCount()
        /**
            * Returns the server associated with this write result
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getserver.php
            * @return Server
            */
        getServer()
        /**
            * Returns the number of documents inserted by an upsert
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getupsertedcount.php
            * @return integer|null
            */
        getUpsertedCount()
        /**
            * Returns an array of identifiers for upserted documents
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getupsertedids.php
            * @return array
            */
        getUpsertedIds()
        /**
            * Returns any write concern error that occurred
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getwriteconcernerror.php
            * @return WriteConcernError|null
            */
        getWriteConcernError()
        /**
            * Returns any write errors that occurred
            * @link https://php.net/manual/en/mongodb-driver-writeresult.getwriteerrors.php
            * @return WriteError[]
            */
        getWriteErrors()
        /**
            * Returns whether the write was acknowledged
            * @link https://php.net/manual/en/mongodb-driver-writeresult.isacknowledged.php
            * @return bool
            */
        isAcknowledged()
    }
    /**
        * The MongoDB\Driver\WriteError class encapsulates information about a write error and may be returned as an array element from MongoDB\Driver\WriteResult::getWriteErrors().
        */
    declare final class WriteError
    {
        /**
            * Returns the WriteError's error code
            * @link https://php.net/manual/en/mongodb-driver-writeerror.getcode.php
            * @return int
            */
        getCode()
        /**
            * Returns the index of the write operation corresponding to this WriteError
            * @link https://php.net/manual/en/mongodb-driver-writeerror.getindex.php
            * @return int
            */
        getIndex()
        /**
            * Returns additional metadata for the WriteError
            * @link https://php.net/manual/en/mongodb-driver-writeerror.getinfo.php
            * @return mixed
            */
        getInfo()
        /**
            * Returns the WriteError's error message
            * @link https://php.net/manual/en/mongodb-driver-writeerror.getmessage.php
            * @return string
            */
        getMessage()
    }
    /**
        * The MongoDB\Driver\WriteConcernError class encapsulates information about a write concern error and may be returned by MongoDB\Driver\WriteResult::getWriteConcernError().
        * @link https://php.net/manual/en/class.mongodb-driver-writeconcernerror.php
        */
    declare final class WriteConcernError
    {
        /**
            * Returns the WriteConcernError's error code
            * @link https://php.net/manual/en/mongodb-driver-writeconcernerror.getcode.php
            * @return int
            */
        getCode()
        /**
            * Returns additional metadata for the WriteConcernError
            * @link https://php.net/manual/en/mongodb-driver-writeconcernerror.getinfo.php
            * @return mixed
            */
        getInfo()
        /**
            * Returns the WriteConcernError's error message
            * @link https://php.net/manual/en/mongodb-driver-writeconcernerror.getmessage.php
            * @return string
            */
        getMessage()
    }
    /**
        * Class Session
        *
        * @link https://secure.php.net/manual/en/class.mongodb-driver-session.php
        * @since 1.4.0
        */
    declare final class Session
    {
        /**
            * @since 1.7.0
            */
        const TRANSACTION_NONE = 'none';
        /**
            * @since 1.7.0
            */
        const TRANSACTION_STARTING = 'starting';
        /**
            * @since 1.7.0
            */
        const TRANSACTION_IN_PROGRESS = 'in_progress';
        /**
            * @since 1.7.0
            */
        const TRANSACTION_COMMITTED = 'committed';
        /**
            * @since 1.7.0
            */
        const TRANSACTION_ABORTED = 'aborted';
        /**
            * Create a new Session (not used)
            * @link https://secure.php.net/manual/en/mongodb-driver-session.construct.php
            * @since 1.4.0
            */
        constructor()
        /**
            * Aborts a transaction
            * @link https://secure.php.net/manual/en/mongodb-driver-session.aborttransaction.php
            * @return void
            * @since 1.5.0
            */
        abortTransaction()
        /**
            * Advances the cluster time for this session
            * @link https://secure.php.net/manual/en/mongodb-driver-session.advanceclustertime.php
            * @param array|object $clusterTime The cluster time is a document containing a logical timestamp and server signature
            * @return void
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors
            * @since 1.4.0
            */
        advanceClusterTime(clusterTime:any)
        /**
            * Advances the operation time for this session
            * @link https://secure.php.net/manual/en/mongodb-driver-session.advanceoperationtime.php
            * @param \MongoDB\BSON\TimestampInterface $operationTime
            * @return void
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors
            * @since 1.4.0
            */
        advanceOperationTime(operationTime:MongoDB.BSON.TimestampInterface)
        /**
            * @link https://secure.php.net/manual/en/mongodb-driver-session.committransaction.php
            * @return void
            * @throws InvalidArgumentException On argument parsing errors
            * @throws CommandException If the server could not commit the transaction (e.g. due to conflicts,
            * network issues). In case the exception's MongoDB\Driver\Exception\CommandException::getResultDocument() has a "errorLabels"
            * element, and this array contains a "TransientTransactionError" or "UnUnknownTransactionCommitResult" value, it is safe to
            * re-try the whole transaction. In newer versions of the driver, MongoDB\Driver\Exception\RuntimeException::hasErrorLabel()
            * should be used to test for this situation instead.
            * @throws \MongoDB\Driver\Exception\RuntimeException If the transaction could not be committed (e.g. a transaction was not started)
            * @since 1.5.0
            */
        commitTransaction()
        /**
            * This method closes an existing session. If a transaction was associated with this session, this transaction is also aborted,
            * and all its operations are rolled back.
            *
            * @link https://secure.php.net/manual/en/mongodb-driver-session.endsession.php
            * @return void
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors
            * @since 1.5.0
            */
        endSession()
        /**
            * Returns the cluster time for this session
            * @link https://secure.php.net/manual/en/mongodb-driver-session.getclustertime.php
            * @return object|null
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.4.0
            */
        getClusterTime()
        /**
            * Returns the logical session ID for this session
            * @link https://secure.php.net/manual/en/mongodb-driver-session.getlogicalsessionid.php
            * @return object Returns the logical session ID for this session
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.4.0
            */
        getLogicalSessionId()
        /**
            * Returns the operation time for this session, or NULL if the session has no operation time
            * @link https://secure.php.net/manual/en/mongodb-driver-session.getoperationtime.php
            * @return \MongoDB\BSON\Timestamp|null
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.4.0
            */
        getOperationTime()
        /**
            * Returns the server to which this session is pinned, or NULL if the session is not pinned to any server.
            * @link https://secure.php.net/manual/en/mongodb-driver-session.getserver.php
            * @return \MongoDB\Driver\Server|null
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.6.0
            */
        getServer()
        /**
            * Returns options for the current transactions, or NULL if no transaction is running.
            * @link https://secure.php.net/manual/en/mongodb-driver-session.gettransactionoptions.php
            * @return array|null
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.7.0
            */
        getTransactionOptions()
        /**
            * Returns the current transaction state
            * @link https://secure.php.net/manual/en/mongodb-driver-session.gettransactionstate.php
            * @return string
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.7.0
            */
        getTransactionState()
        /**
            * Returns whether a multi-document transaction is in progress.
            * @link https://secure.php.net/manual/en/mongodb-driver-session.isintransaction.php
            * @return bool
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException
            * @since 1.6.0
            */
        isInTransaction()
        /**
            * Starts a transaction
            * @link https://secure.php.net/manual/en/mongodb-driver-session.starttransaction.php
            * @param array|object $options
            * @return void
            * @throws \MongoDB\Driver\Exception\InvalidArgumentException On argument parsing errors
            * @throws \MongoDB\Driver\Exception\CommandException If the the transaction could not be started because of a server-side problem (e.g. a lock could not be obtained).
            * @throws \MongoDB\Driver\Exception\RuntimeException If the the transaction could not be started (e.g. a transaction was already started).
            * @since 1.4.0
            */
        startTransaction(options:any)
    }
    /**
        * This interface is implemented by MongoDB\Driver\Cursor but may also be used for type-hinting and userland classes.
        * @link https://www.php.net/manual/en/class.mongodb-driver-cursorinterface.php
        * @since 1.6.0
        */
    declare interface CursorInterface extends Traversable
    {
        /**
            * Returns the MongoDB\Driver\CursorId associated with this cursor. A cursor ID uniquely identifies the cursor on the server.
            * @return CursorId Returns the MongoDB\Driver\CursorId for this cursor.
            * @throws InvalidArgumentException
            * @link https://www.php.net/manual/en/mongodb-driver-cursorinterface.getid.php
            */
            getId();
        /**
            * Returns the MongoDB\Driver\Server associated with this cursor.
            * This is the server that executed the MongoDB\Driver\Query or MongoDB\Driver\Command.
            * @link https://www.php.net/manual/en/mongodb-driver-cursorinterface.getserver.php
            * @return Server Returns the MongoDB\Driver\Server associated with this cursor.
            * @throws InvalidArgumentException
            */
        getServer();
        /**
            * Checks whether the cursor may have additional results available to read.
            * @link https://www.php.net/manual/en/mongodb-driver-cursorinterface.isdead.php
            * @return bool Returns TRUE if additional results are not available, and FALSE otherwise.
            * @throws InvalidArgumentException
            */
        isDead();
        /**
            * Sets a type map to use for BSON unserialization
            * @link https://www.php.net/manual/en/mongodb-driver-cursorinterface.settypemap.php
            * @param array $typemap Type map configuration.
            * @return mixed
            * @throws InvalidArgumentException
            */
        setTypeMap(typemap:array);
        /**
            * Iterates the cursor and returns its results in an array.
            * MongoDB\Driver\CursorInterface::setTypeMap() may be used to control how documents are unserialized into PHP values.
            * @return array Returns an array containing all results for this cursor.
            * @throws InvalidArgumentException
            */
        toArray();
    }
    /**
        * The MongoDB\Driver\ClientEncryption class handles creation of data keys for client-side encryption, as well as manually encrypting and decrypting values.
        * @link https://www.php.net/manual/en/class.mongodb-driver-clientencryption.php
        * @since 1.7.0
        */
    declare final class ClientEncryption
    {
        const AEAD_AES_256_CBC_HMAC_SHA_512_DETERMINISTIC = 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic';
        const AEAD_AES_256_CBC_HMAC_SHA_512_RANDOM = 'AEAD_AES_256_CBC_HMAC_SHA_512-Random';
        constructor()
        /**
            * Creates a new key document and inserts into the key vault collection.
            * @link https://www.php.net/manual/en/mongodb-driver-clientencryption.createdatakey.php
            * @param string $kmsProvider The KMS provider ("local" or "aws") that will be used to encrypt the new encryption key.
            * @param array $options [optional]
            * @return \MongoDB\BSON\Binary Returns the identifier of the new key as a MongoDB\BSON\Binary object with subtype 4 (UUID).
            * @throws InvalidArgumentException On argument parsing errors.
            * @throws EncryptionException If an error occurs while creating the data key.
            */
        createDataKey(kmsProvider:any,options:any = [])
        /**
            * Decrypts an encrypted value (BSON binary of subtype 6).
            * @link https://www.php.net/manual/en/mongodb-driver-clientencryption.decrypt.php
            * @param \MongoDB\BSON\Binary $value A MongoDB\BSON\Binary instance with subtype 6 containing the encrypted value.
            * @return mixed Returns the decrypted value
            * @throws InvalidArgumentException On argument parsing errors.
            * @throws EncryptionException If an error occurs while decrypting the value.
            */
        decrypt(value:MongoDB.BSON.Binary)
        /**
            * Encrypts a value with a given key and algorithm.
            * @link https://www.php.net/manual/en/mongodb-driver-clientencryption.encrypt.php
            * @param mixed $value The value to be encrypted. Any value that can be inserted into MongoDB can be encrypted using this method.
            * @param array $options [optional]
            * @return \MongoDB\BSON\Binary Returns the encrypted value as MongoDB\BSON\Binary object with subtype 6.
            * @throws InvalidArgumentException On argument parsing errors.
            * @throws EncryptionException If an error occurs while encrypting the value.
            */
        encrypt(value:any,options:any = [])
    }
}


/**
* @link https://php.net/manual/en/book.bson.php
*/
package MongoDB.BSON {
    
    /**
    * Converts a BSON string to its Canonical Extended JSON representation.
    * The canonical format prefers type fidelity at the expense of concise output and is most suited for producing
    * output that can be converted back to BSON without any loss of type information
    * (e.g. numeric types will remain differentiated).
    * @link https://www.php.net/manual/en/function.mongodb.bson-tocanonicalextendedjson.php
    * @param string $bson BSON value to be converted
    * @return string The converted JSON value
    * @throws UnexpectedValueException
    */
    declare function toCanonicalExtendedJSON(bson:any)
    /**
    * Converts a BSON string to its » Relaxed Extended JSON representation.
    * The relaxed format prefers use of JSON type primitives at the expense of type fidelity and is most suited for
    * producing output that can be easily consumed by web APIs and humans.
    * @link https://www.php.net/manual/en/function.mongodb.bson-torelaxedextendedjson.php
    * @param string $bson BSON value to be converted
    * @return string The converted JSON value
    * @throws UnexpectedValueException
    */
    declare function  toRelaxedExtendedJSON(bson:any)
    /**
    * Returns the BSON representation of a JSON value
    * Converts an extended JSON string to its BSON representation.
    * @link https://php.net/manual/en/function.mongodb.bson-fromjson.php
    * @param string $json JSON value to be converted.
    * @return string The serialized BSON document as a binary string.
    * @throws UnexpectedValueException if the JSON value cannot be converted to BSON (e.g. due to a syntax error).
    */
    declare function  fromJSON(json:any)
    /**
    * Returns the BSON representation of a PHP value
    * Serializes a PHP array or object (e.g. document) to its BSON representation. The returned binary string will describe a BSON document.
    * @link https://php.net/manual/en/function.mongodb.bson-fromphp.php
    * @param array|object $value PHP value to be serialized.
    * @return string The serialized BSON document as a binary string
    * @throws UnexpectedValueException if the PHP value cannot be converted to BSON.
    */
    declare function  fromPHP(value:any)
    /**
    * Returns the JSON representation of a BSON value
    * Converts a BSON string to its extended JSON representation.
    * @link https://php.net/manual/en/function.mongodb.bson-tojson.php
    * @param string $bson BSON value to be converted
    * @return string The converted JSON value.
    * @see https://docs.mongodb.org/manual/reference/mongodb-extended-json/
    * @throws UnexpectedValueException if the input did not contain exactly one BSON document
    */
    declare function  toJSON(bson:any)
    /**
    * Returns the PHP representation of a BSON value
    * Unserializes a BSON document (i.e. binary string) to its PHP representation.
    * The typeMap parameter may be used to control the PHP types used for converting BSON arrays and documents (both root and embedded).
    * @link https://php.net/manual/en/function.mongodb.bson-tophp.php
    * @param string $bson BSON value to be unserialized.
    * @param array $typeMap
    * @return object The unserialized PHP value
    * @throws UnexpectedValueException if the input did not contain exactly one BSON document.
    * @throws InvalidArgumentException if a class in the type map cannot be instantiated or does not implement MongoDB\BSON\Unserializable.
    */
    declare function  toPHP(bson:any,typeMap:array)


    /**
    * Class Binary
    * @link https://php.net/manual/en/class.mongodb-bson-binary.php
    */
    declare final class Binary implements Type, BinaryInterface, Serializable, JsonSerializable{
        const TYPE_GENERIC = 0;
        const TYPE_FUNCTION = 1;
        const TYPE_OLD_BINARY = 2;
        const TYPE_OLD_UUID = 3;
        const TYPE_UUID = 4;
        const TYPE_MD5 = 5;
        /**
        * @since 1.7.0
        */
        const TYPE_ENCRYPTED = 6;
        const TYPE_USER_DEFINED = 128;
        /**
        * Binary constructor.
        * @link https://php.net/manual/en/mongodb-bson-binary.construct.php
        * @param string $data
        * @param integer $type
        */
        constructor(data:any,type:any)
        /**
        * Returns the Binary's data
        * @link https://php.net/manual/en/mongodb-bson-binary.getdata.php
        * @return string
        */
        getData()
        /**
        * Returns the Binary's type
        * @link https://php.net/manual/en/mongodb-bson-binary.gettype.php
        * @return integer
        */
        getType()

        /**
        * Returns the Binary's data
        * @link https://www.php.net/manual/en/mongodb-bson-binary.tostring.php
        * @return string
        */
        __toString()
        /**
        * Serialize a Binary
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-binary.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a Binary
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-binary.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-binary.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * BSON type for the Decimal128 floating-point format, which supports numbers with up to 34 decimal digits (i.e. significant digits) and an exponent range of −6143 to +6144.
    * @link https://php.net/manual/en/class.mongodb-bson-decimal128.php
    */
    declare final class Decimal128 implements Type, Decimal128Interface, Serializable, JsonSerializable
    {
        /**
        * Construct a new Decimal128
        * @link https://php.net/manual/en/mongodb-bson-decimal128.construct.php
        * @param string $value A decimal string.
        */
        constructor(value:any = '')
        /**
        * Returns the string representation of this Decimal128
        * @link https://php.net/manual/en/mongodb-bson-decimal128.tostring.php
        * @return string
        */
        __toString()

        /**
        * Serialize a Decimal128
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-decimal128.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a Decimal128
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-decimal128.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-decimal128.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * Class Javascript
    * @link https://php.net/manual/en/class.mongodb-bson-javascript.php
    */
    declare final class Javascript implements Type, JavascriptInterface, Serializable, JsonSerializable
    {
        /**
        * Construct a new Javascript
        * @link https://php.net/manual/en/mongodb-bson-javascript.construct.php
        * @param string $code
        * @param array|object $scope
        */
        constructor(code:any,scope:any = [])

        /**
        * Returns the Javascript's code
        * @return string
        * @link https://secure.php.net/manual/en/mongodb-bson-javascript.getcode.php
        */
        getCode()
        /**
        * Returns the Javascript's scope document
        * @return object|null
        * @link https://secure.php.net/manual/en/mongodb-bson-javascript.getscope.php
        */
        getScope()
        /**
        * Returns the Javascript's code
        * @return string
        * @link https://secure.php.net/manual/en/mongodb-bson-javascript.tostring.php
        */
        __toString()
        /**
        * Serialize a Javascript
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-javascript.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a Javascript
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-javascript.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-javascript.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * Class MaxKey
    * @link https://php.net/manual/en/class.mongodb-bson-maxkey.php
    */
    declare final class MaxKey implements Type, MaxKeyInterface, Serializable, JsonSerializable
    {

        /**
        * Serialize a MaxKey
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-maxkey.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a MaxKey
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-maxkey.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-maxkey.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * Class MinKey
    * @link https://php.net/manual/en/class.mongodb-bson-minkey.php
    */
    declare final class MinKey implements Type, MinKeyInterface, Serializable, JsonSerializable
    {

        /**
        * Serialize a MinKey
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-minkey.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a MinKey
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-minkey.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-minkey.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * Class ObjectId
    * @link https://php.net/manual/en/class.mongodb-bson-objectid.php
    */
    declare final class ObjectId implements Type, ObjectIdInterface, Serializable, JsonSerializable
    {
        /**
        * Construct a new ObjectId
        * @link https://php.net/manual/en/mongodb-bson-objectid.construct.php
        * @param string|null $id A 24-character hexadecimal string. If not provided, the driver will generate an ObjectId.
        * @throws InvalidArgumentException if id is not a 24-character hexadecimal string.
        */
        constructor(id:any = null)
        /**
        * Returns the hexadecimal representation of this ObjectId
        * @link https://php.net/manual/en/mongodb-bson-objectid.tostring.php
        * @return string
        */
        __toString()
        /**
        * Returns the timestamp component of this ObjectId
        * @since 1.2.0
        * @link https://secure.php.net/manual/en/mongodb-bson-objectid.gettimestamp.php
        * @return int the timestamp component of this ObjectId
        */
        getTimestamp()
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://secure.php.net/manual/en/mongodb-bson-objectid.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        */
        jsonSerialize()
        /**
        * Serialize an ObjectId
        * @since 1.2.0
        * @link https://secure.php.net/manual/en/mongodb-bson-objectid.serialize.php
        * @return string the serialized representation of the object
        */
        serialize()
        /**
        * Unserialize an ObjectId
        * @since 1.2.0
        * @link https://secure.php.net/manual/en/mongodb-bson-objectid.unserialize.php
        * @return void
        */
        unserialize(serialized:any)
    }
    /**
    * Class Regex
    * @link https://php.net/manual/en/class.mongodb-bson-regex.php
    */
    declare final class Regex implements Type, RegexInterface, Serializable, JsonSerializable
    {
        /**
        * Construct a new Regex
        * @link https://php.net/manual/en/mongodb-bson-regex.construct.php
        * @param string $pattern
        * @param string $flags [optional]
        */
        constructor(pattern:any,flags:any = "")
        /**
        * Returns the Regex's flags
        * @link https://php.net/manual/en/mongodb-bson-regex.getflags.php
        */
        getFlags()
        /**
        * Returns the Regex's pattern
        * @link https://php.net/manual/en/mongodb-bson-regex.getpattern.php
        * @return string
        */
        getPattern()
        /**
        * Returns the string representation of this Regex
        * @link https://php.net/manual/en/mongodb-bson-regex.tostring.php
        * @return string
        */
        __toString()

        /**
        * Serialize a Regex
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-regex.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a Regex
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-regex.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-regex.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * Represents a BSON timestamp, which is an internal MongoDB type not intended for general date storage.
    * @link https://php.net/manual/en/class.mongodb-bson-timestamp.php
    */
    declare final class Timestamp implements TimestampInterface, Type, Serializable, JsonSerializable
    {
        /**
        * Construct a new Timestamp
        * @link https://php.net/manual/en/mongodb-bson-timestamp.construct.php
        * @param integer $increment
        * @param integer $timestamp
        */
        __construct(increment:any,timestamp:any)
        /**
        * Returns the string representation of this Timestamp
        * @link https://php.net/manual/en/mongodb-bson-timestamp.tostring.php
        * @return string
        */
        __toString()
        /**
        * Returns the increment component of this TimestampInterface
        * @link https://secure.php.net/manual/en/mongodb-bson-timestampinterface.getincrement.php
        * @return int
        * @since 1.3.0
        */
        getIncrement()
        /**
        * Returns the timestamp component of this TimestampInterface
        * @link https://secure.php.net/manual/en/mongodb-bson-timestampinterface.gettimestamp.php
        * @return int
        * @since 1.3.0
        */
        getTimestamp()
        /**
        * Serialize a Timestamp
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-timestamp.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a Timestamp
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-timestamp.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-timestamp.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * Represents a BSON date.
    * @link https://php.net/manual/en/class.mongodb-bson-utcdatetime.php
    */
    declare final class UTCDateTime implements Type, UTCDateTimeInterface,Serializable, JsonSerializable
    {
        /**
        * Construct a new UTCDateTime
        * @link https://php.net/manual/en/mongodb-bson-utcdatetime.construct.php
        * @param int|float|string|DateTimeInterface $milliseconds
        */
        constructor(milliseconds:any = null)
        /**
        * Returns the DateTime representation of this UTCDateTime
        * @link https://php.net/manual/en/mongodb-bson-utcdatetime.todatetime.php
        * @return \DateTime
        */
        toDateTime()
        /**
        * Returns the string representation of this UTCDateTime
        * @link https://php.net/manual/en/mongodb-bson-utcdatetime.tostring.php
        * @return string
        */
        __toString()
        /**
        * Serialize a UTCDateTime
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-utcdatetime.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a UTCDateTime
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-utcdatetime.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-utcdatetime.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
    }
    /**
    * BSON type for the "Undefined" type. This BSON type is deprecated, and this class can not be instantiated. It will be created
    * from a BSON undefined type while converting BSON to PHP, and can also be converted back into BSON while storing documents in the database.
    *
    * @link https://secure.php.net/manual/en/class.mongodb-bson-undefined.php
    */
    declare final class Undefined implements Type,Serializable,JsonSerializable
    {
        constructor()
        /**
        * Serialize an Undefined
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-undefined.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize an Undefined
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-undefined.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-undefined.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
        /**
        * Returns the Undefined as a string
        * @return string Returns the string representation of this Symbol.
        */
        __toString()
    }
    /**
    * BSON type for the "Symbol" type. This BSON type is deprecated, and this class can not be instantiated. It will be created from a
    * BSON symbol type while converting BSON to PHP, and can also be converted back into BSON while storing documents in the database.
    *
    * @link https://secure.php.net/manual/en/class.mongodb-bson-symbol.php
    */
    declare final class Symbol implements Type,Serializable,JsonSerializable
    {
        constructor()
        /**
        * Serialize a Symbol
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-symbol.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a Symbol
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-symbol.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @since 1.2.0
        * @link https://www.php.net/manual/en/mongodb-bson-symbol.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
        /**
        * Returns the Symbol as a string
        * @return string Returns the string representation of this Symbol.
        */
        __toString()
    }

    /**
    * BSON type for the "DbPointer" type. This BSON type is deprecated, and this class can not be instantiated. It will be created from a
    * BSON symbol type while converting BSON to PHP, and can also be converted back into BSON while storing documents in the database.
    *
    * @since 1.4.0
    * @link https://secure.php.net/manual/en/class.mongodb-bson-dbpointer.php
    */
    declare final class DbPointer implements Type,Serializable,JsonSerializable
    {
        constructor()
        /**
        * Serialize a DBPointer
        *
        * @link https://www.php.net/manual/en/mongodb-bson-dbpointer.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize a DBPointer
        *
        * @link https://www.php.net/manual/en/mongodb-bson-dbpointer.unserialize.php
        *
        * @param string $serialized
        *
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        *
        * @link https://www.php.net/manual/en/mongodb-bson-dbpointer.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
        /**
        * Returns the Symbol as a string
        *
        * @return string Returns the string representation of this Symbol.
        */
        __toString()
    }
    /**
    * BSON type for a 64-bit integer. This class cannot be instantiated and is only created during BSON decoding when a 64-bit
    * integer cannot be represented as a PHP integer on a 32-bit platform. Versions of the driver before 1.5.0 would throw an
    * exception when attempting to decode a 64-bit integer on a 32-bit platform.
    * During BSON encoding, objects of this class will convert back to a 64-bit integer type. This allows 64-bit integers to be
    * roundtripped through a 32-bit PHP environment without any loss of precision. The __toString() method allows the 64-bit integer
    * value to be accessed as a string.
    *
    * @since 1.5.0
    * @link https://secure.php.net/manual/en/class.mongodb-bson-int64.php
    */
    declare final class Int64 implements Type,Serializable, JsonSerializable
    {
        constructor()
        /**
        * Serialize an Int64
        * @link https://www.php.net/manual/en/mongodb-bson-int64.serialize.php
        * @return string
        * @throws InvalidArgumentException
        */
        serialize()
        /**
        * Unserialize an Int64
        * @link https://www.php.net/manual/en/mongodb-bson-int64.unserialize.php
        * @param string $serialized
        * @return void
        * @throws InvalidArgumentException on argument parsing errors or if the properties are invalid
        * @throws UnexpectedValueException if the properties cannot be unserialized (i.e. serialized was malformed)
        */
        unserialize(serialized:any)
        /**
        * Returns a representation that can be converted to JSON
        * @link https://www.php.net/manual/en/mongodb-bson-int64.jsonserialize.php
        * @return mixed data which can be serialized by json_encode()
        * @throws InvalidArgumentException on argument parsing errors
        */
        jsonSerialize()
        /**
        * Returns the Symbol as a string
        * @return string Returns the string representation of this Symbol.
        */
        __toString()
    }
    /**
    * This interface is implemented by MongoDB\BSON\Binary but may also be used for type-hinting and userland classes.
    * @link https://www.php.net/manual/en/class.mongodb-bson-binaryinterface.php
    */
    declare interface BinaryInterface
    {
        /**
        * @link https://www.php.net/manual/en/mongodb-bson-binaryinterface.getdata.php
        * @return string Returns the BinaryInterface's data
        */
        getData();
        /**
        * @link https://www.php.net/manual/en/mongodb-bson-binaryinterface.gettype.php
        * @return int Returns the BinaryInterface's type.
        */
        getType();
        /**
        * This method is an alias of: MongoDB\BSON\BinaryInterface::getData().
        * @link https://www.php.net/manual/en/mongodb-bson-binaryinterface.tostring.php
        * @return string Returns the BinaryInterface's data.
        */
        __toString();
    }
    /**
    * This interface is implemented by MongoDB\BSON\ObjectId but may also be used for type-hinting and userland classes.
    * @link https://www.php.net/manual/en/class.mongodb-bson-objectidinterface.php
    */
    declare interface ObjectIdInterface
    {
        /**
        * @link https://www.php.net/manual/en/mongodb-bson-objectidinterface.gettimestamp.php
        * @return int Returns the timestamp component of this ObjectIdInterface.
        */
        getTimestamp();
        /**
        * Returns the hexadecimal representation of this ObjectId
        * @link https://www.php.net/manual/en/mongodb-bson-objectid.tostring.php
        * @return string Returns the hexadecimal representation of this ObjectId
        */
        __toString();
    }
    /**
    * @link https://www.php.net/manual/en/class.mongodb-bson-regexinterface.php
    * This interface is implemented by MongoDB\BSON\Regex but may also be used for type-hinting and userland classes.
    */
    declare interface RegexInterface
    {
        /**
        * @link https://www.php.net/manual/en/mongodb-bson-regexinterface.getflags.php
        * @return string Returns the RegexInterface's flags.
        */
        getFlags();
        /**
        * @link https://www.php.net/manual/en/mongodb-bson-regexinterface.getpattern.php
        * @return string Returns the RegexInterface's pattern.
        */
        getPattern();
        /**
        * Returns the string representation of this RegexInterface
        * @link https://www.php.net/manual/en/mongodb-bson-regexinterface.tostring.php
        * @return string
        */
        __toString();
    }
    /**
    * This interface is implemented by MongoDB\BSON\UTCDateTime but may also be used for type-hinting and userland classes.
    * @link https://www.php.net/manual/en/class.mongodb-bson-utcdatetimeinterface.php
    */
    declare interface UTCDateTimeInterface
    {
        /**
        * @link https://www.php.net/manual/en/mongodb-bson-utcdatetimeinterface.todatetime.php
        * @return DateTime Returns the DateTime representation of this UTCDateTimeInterface. The returned DateTime should use the UTC time zone.
        */
        toDateTime();
        /**
        * Returns the string representation of this UTCDateTimeInterface
        * @link https://www.php.net/manual/en/mongodb-bson-utcdatetimeinterface.tostring.php
        * @return string
        */
        __toString();
    }
    /**
    * This interface is implemented by MongoDB\BSON\MaxKey but may also be used for type-hinting and userland classes.
    * @link https://www.php.net/manual/en/class.mongodb-bson-maxkeyinterface.php
    */
    declare interface MaxKeyInterface{}
    /**
    * This interface is implemented by MongoDB\BSON\MinKey but may also be used for type-hinting and userland classes.
    * @link https://www.php.net/manual/en/class.mongodb-bson-minkeyinterface.php
    */
    declare interface MinKeyInterface{}
    /**
    * This interface is implemented by MongoDB\BSON\Decimal128 but may also be used for type-hinting and userland classes.
    * @link https://www.php.net/manual/en/class.mongodb-bson-decimal128interface.php
    */
    declare interface Decimal128Interface
    {
        /**
        * Returns the string representation of this Decimal128Interface
        * @link https://www.php.net/manual/en/mongodb-bson-decimal128interface.tostring.php
        * @return string Returns the string representation of this Decimal128Interface
        */
        __toString();
    }
    /**
    * Classes may implement this interface to take advantage of automatic ODM (object document mapping) behavior in the driver.
    * @link https://php.net/manual/en/class.mongodb-bson-persistable.php
    */
    declare interface Persistable implements Unserializable, Serializable{}
    /**
    * Classes that implement this interface may return data to be serialized as a BSON array or document in lieu of the object's public properties
    * @link https://php.net/manual/en/class.mongodb-bson-serializable.php
    */
    declare interface Serializable extends Type
    {
        /**
        * Provides an array or document to serialize as BSON
        * Called during serialization of the object to BSON. The method must return an array or stdClass.
        * Root documents (e.g. a MongoDB\BSON\Serializable passed to MongoDB\BSON\fromPHP()) will always be serialized as a BSON document.
        * For field values, associative arrays and stdClass instances will be serialized as a BSON document and sequential arrays (i.e. sequential, numeric indexes starting at 0) will be serialized as a BSON array.
        * @link https://php.net/manual/en/mongodb-bson-serializable.bsonserialize.php
        * @return array|object An array or stdClass to be serialized as a BSON array or document.
        */
        bsonSerialize();
    }
    /**
    * Classes that implement this interface may be specified in a type map for unserializing BSON arrays and documents (both root and embedded).
    * @link https://php.net/manual/en/class.mongodb-bson-unserializable.php
    */
    declare interface Unserializable extends Type
    {
        /**
        * Constructs the object from a BSON array or document
        * Called during unserialization of the object from BSON.
        * The properties of the BSON array or document will be passed to the method as an array.
        * @link https://php.net/manual/en/mongodb-bson-unserializable.bsonunserialize.php
        * @param array $data Properties within the BSON array or document.
        */
        bsonUnserialize(data:array);
    }
    /**
    * Interface Type
    * @link https://php.net/manual/en/class.mongodb-bson-type.php
    */
    declare interface Type{}
    /**
    * Interface TimestampInterface
    *
    * @link https://secure.php.net/manual/en/class.mongodb-bson-timestampinterface.php
    * @since 1.3.0
    */
    declare interface TimestampInterface
    {
        /**
        * Returns the increment component of this TimestampInterface
        * @link https://secure.php.net/manual/en/mongodb-bson-timestampinterface.getincrement.php
        * @return int
        * @since 1.3.0
        */
        getIncrement();
        /**
        * Returns the timestamp component of this TimestampInterface
        * @link https://secure.php.net/manual/en/mongodb-bson-timestampinterface.gettimestamp.php
        * @return int
        * @since 1.3.0
        */
        getTimestamp();
        /**
        * Returns the string representation of this TimestampInterface
        * @link https://secure.php.net/manual/en/mongodb-bson-timestampinterface.tostring.php
        * @return string
        * @since 1.3.0
        */
        __toString();
    }
    /**
    * Interface JavascriptInterface
    *
    * @link https://secure.php.net/manual/en/class.mongodb-bson-javascriptinterface.php
    * @since 1.3.0
    */
    declare interface JavascriptInterface
    {
        /**
        * Returns the JavascriptInterface's code
        * @return string
        * @link https://secure.php.net/manual/en/mongodb-bson-javascriptinterface.getcode.php
        * @since 1.3.0
        */
        getCode();
        /**
        * Returns the JavascriptInterface's scope document
        * @return object|null
        * @link https://secure.php.net/manual/en/mongodb-bson-javascriptinterface.getscope.php
        * @since 1.3.0
        */
        getScope();
        /**
        * Returns the JavascriptInterface's code
        * @return string
        * @link https://secure.php.net/manual/en/mongodb-bson-javascriptinterface.tostring.php
        * @since 1.3.0
        */
        __toString();
    }

}

package MongoDB.Driver.Exception {

    /**
    * Thrown when the driver encounters a runtime error (e.g. internal error from » libmongoc).
    * @link https://php.net/manual/en/class.mongodb-driver-exception-runtimeexception.php
    * @since 1.0.0
    */
    declare class RuntimeException implements Exception
    {
        /**
        * @var boolean
        * @since 1.6.0
        */
        protected errorLabels;
        /**
        * Whether the given errorLabel is associated with this exception
        *
        * @param string $errorLabel
        * @since 1.6.0
        * @return bool
        */
        hasErrorLabel(errorLabel:any)
    }
    /**
    * Common interface for all driver exceptions. This may be used to catch only exceptions originating from the driver itself.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-exception.php
    */
    declare interface Exception extends Throwable{}
    /**
    * Thrown when the driver fails to authenticate with the server.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-authenticationexception.php
    * @since 1.0.0
    */
    declare class AuthenticationException extends ConnectionException implements Exception{}
    /**
    * Base class for exceptions thrown when the driver fails to establish a database connection.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-connectionexception.php
    * @since 1.0.0
    */
    declare class ConnectionException extends RuntimeException{}
    /**
    * Thrown when a driver method is given invalid arguments (e.g. invalid option types).
    * @link https://php.net/manual/en/class.mongodb-driver-exception-invalidargumentexception.php
    * @since 1.0.0
    */
    declare class InvalidArgumentException extends RuntimeException{}
    /**
    * Thrown when a command fails
    *
    * @link https://php.net/manual/en/class.mongodb-driver-exception-commandexception.php
    * @since 1.5.0
    */
    declare class CommandException extends ServerException
    {
        /**
        * Returns the result document for the failed command
        * @link https://secure.php.net/manual/en/mongodb-driver-commandexception.getresultdocument.php
        * @return object
        * @since 1.5.0
        */
        getResultDocument()
    }
    /**
    * Base class for exceptions thrown by the server. The code of this exception and its subclasses will correspond to the original
    * error code from the server.
    *
    * @link https://secure.php.net/manual/en/class.mongodb-driver-exception-serverexception.php
    * @since 1.5.0
    */
    declare class ServerException extends RuntimeException implements Exception{}
    /**
    * Base class for exceptions thrown by a failed write operation.
    * The exception encapsulates a MongoDB\Driver\WriteResult object.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-writeexception.php
    * @since 1.0.0
    */
    @abstract
    declare class WriteException extends ServerException implements Exception
    {
        /**
        * @var WriteResult associated with the failed write operation.
        */
        protected $writeResult;
        /**
        * @return WriteResult for the failed write operation
        * @since 1.0.0
        */
        getWriteResult()
    }
    declare class WriteConcernException extends RuntimeException implements Exception{}
    /**
    * Thrown when the driver encounters an unexpected value (e.g. during BSON serialization or deserialization).
    * @link https://php.net/manual/en/class.mongodb-driver-exception-unexpectedvalueexception.php
    * @since 1.0.0
    */
    declare class UnexpectedValueException implements Exception{}
    /**
    * Thrown when a bulk write operation fails.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-bulkwriteexception.php
    * @since 1.0.0
    */
    declare class BulkWriteException extends WriteException implements Exception{}
    /**
    * Thrown when the driver fails to establish a database connection within a specified time limit (e.g. connectTimeoutMS).
    * @link https://php.net/manual/en/class.mongodb-driver-exception-connectiontimeoutexception.php
    */
    declare class ConnectionTimeoutException extends ConnectionException implements Exception{}
    /**
    * Thrown when a query or command fails to complete within a specified time limit (e.g. maxTimeMS).
    * @link https://php.net/manual/en/class.mongodb-driver-exception-executiontimeoutexception.php
    */
    declare class ExecutionTimeoutException extends ServerException implements Exception{}
    /**
    * Thrown when the driver is incorrectly used (e.g. rewinding a cursor).
    * @link https://php.net/manual/en/class.mongodb-driver-exception-logicexception.php
    */
    declare class LogicException implements Exception{}
    /**
    * Thrown when the driver fails to establish an SSL connection with the server.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-sslconnectionexception.php
    */
    declare class SSLConnectionException extends ConnectionException implements Exception{}
    /**
    * Base class for exceptions thrown during client-side encryption.
    * @link https://php.net/manual/en/class.mongodb-driver-exception-encryptionexception.php
    * @since 1.7.0
    */
    declare class EncryptionException extends RuntimeException implements Exception{}
}

/**
* @link https://secure.php.net/manual/en/mongodb.monitoring.php
*/
package MongoDB.Driver.Monitoring{

    /**
    * Registers a new monitoring event subscriber with the driver.
    * Registered subscribers will be notified of monitoring events through specific methods.
    * Note: If the object is already registered, this function is a no-op.
    * @link https://secure.php.net/manual/en/function.mongodb.driver.monitoring.addsubscriber.php
    * @param Subscriber $subscriber A monitoring event subscriber object to register.
    * @return void
    * @throws \InvalidArgumentException on argument parsing errors.
    * @since 1.3.0
    */
    declare function addSubscriber(subscriber:Subscriber)
    /**
    * Unregisters an existing monitoring event subscriber from the driver.
    * Unregistered subscribers will no longer be notified of monitoring events.
    * Note: If the object is not registered, this function is a no-op.
    * @link https://secure.php.net/manual/en/function.mongodb.driver.monitoring.removesubscriber.php
    * @param Subscriber $subscriber A monitoring event subscriber object to register.
    * @throws \InvalidArgumentException on argument parsing errors.
    * @since 1.3.0
    */
    declare function  removeSubscriber(subscriber:Subscriber)


    /**
    * Base interface for event subscribers.
    * This is used for type-hinting MongoDB\Driver\Monitoring\addSubscriber() and MongoDB\Driver\Monitoring\removeSubscriber() and should not be implemented directly.
    * This interface has no methods. Its only purpose is to be the base interface for all event subscribers.
    * @link https://secure.php.net/manual/en/class.mongodb-driver-monitoring-subscriber.php
    * @since 1.3.0
    */
    declare interface Subscriber{}

    /**
    * Classes may implement this interface to register an event subscriber that is notified for each started, successful, and failed command event.
    * @see https://secure.php.net/manual/en/mongodb.tutorial.apm.php
    * @link https://secure.php.net/manual/en/class.mongodb-driver-monitoring-commandsubscriber.php
    * @since 1.3.0
    */
    declare interface CommandSubscriber extends Subscriber
    {
        /**
        * Notification method for a failed command.
        * If the subscriber has been registered with MongoDB\Driver\Monitoring\addSubscriber(), the driver will call this method when a command has failed.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsubscriber.commandfailed.php
        * @param CommandFailedEvent $event An event object encapsulating information about the failed command.
        * @return void
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        commandFailed(event:CommandFailedEvent);
        /**
        * Notification method for a started command.
        * If the subscriber has been registered with MongoDB\Driver\Monitoring\addSubscriber(), the driver will call this method when a command has started.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsubscriber.commandstarted.php
        * @param CommandStartedEvent $event An event object encapsulating information about the started command.
        * @return void
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        commandStarted(event:CommandStartedEvent);
        /**
        * Notification method for a successful command.
        * If the subscriber has been registered with MongoDB\Driver\Monitoring\addSubscriber(), the driver will call this method when a command has succeeded.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsubscriber.commandsucceeded.php
        * @param CommandSucceededEvent $event An event object encapsulating information about the successful command.
        * @return void
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        commandSucceeded(event:CommandSucceededEvent);
    }

    /**
    * Encapsulates information about a successful command.
    * @link https://secure.php.net/manual/en/class.mongodb-driver-monitoring-commandsucceededevent.php
    * @since 1.3.0
    */
    declare class CommandSucceededEvent
    {
        /**
        * Returns the command name.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsucceededevent.getcommandname.php
        * @return string The command name (e.g. "find", "aggregate").
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getCommandName():string
        /**
        * Returns the command's duration in microseconds
        * The command's duration is a calculated value that includes the time to send the message and receive the reply from the server.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsucceededevent.getdurationmicros.php
        * @return int the command's duration in microseconds.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getDurationMicros():int
        /**
        * Returns the command's operation ID.
        * The operation ID is generated by the driver and may be used to link events together such as bulk write operations, which may have been split across several commands at the protocol level.
        * Note: Since multiple commands may share the same operation ID, it is not reliable to use this value to associate event objects with each other. The request ID returned by MongoDB\Driver\Monitoring\CommandSucceededEvent::getRequestId() should be used instead.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsucceededevent.getoperationid.php
        * @return string the command's operation ID.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getOperationId():string
        /**
        * Returns the command reply document.
        * The reply document will be converted from BSON to PHP using the default deserialization rules (e.g. BSON documents will be converted to stdClass).
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsucceededevent.getreply.php
        * @return object the command reply document as a stdClass object.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getReply():object
        /**
        * Returns the command's request ID.
        * The request ID is generated by the driver and may be used to associate this CommandSucceededEvent with a previous CommandStartedEvent.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsucceededevent.getrequestid.php
        * @return string the command's request ID.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getRequestId():string
        /**
        * Returns the Server on which the command was executed.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandsucceededevent.getserver.php
        * @return \MongoDB\Driver\Server on which the command was executed.
        * @since 1.3.0
        */
        getServer():MongoDB.Driver.Server
    }
    /**
    * Encapsulates information about a failed command.
    * @link https://secure.php.net/manual/en/class.mongodb-driver-monitoring-commandfailedevent.php
    * @since 1.3.0
    */
    declare class CommandFailedEvent
    {
        /**
        * Returns the command name.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.getcommandname.php
        * @return string The command name (e.g. "find", "aggregate").
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getCommandName():string
        /**
        * Returns the command's duration in microseconds
        * The command's duration is a calculated value that includes the time to send the message and receive the reply from the server.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.getdurationmicros.php
        * @return int the command's duration in microseconds.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getDurationMicros()
        /**
        * Returns the Exception associated with the failed command
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.geterror.php
        * @return \Exception
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getError()
        /**
        * Returns the command's operation ID.
        * The operation ID is generated by the driver and may be used to link events together such as bulk write operations, which may have been split across several commands at the protocol level.
        * Note: Since multiple commands may share the same operation ID, it is not reliable to use this value to associate event objects with each other. The request ID returned by MongoDB\Driver\Monitoring\CommandSucceededEvent::getRequestId() should be used instead.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.getoperationid.php
        * @return string the command's operation ID.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getOperationId()
        /**
        * Returns the command reply document.
        * The reply document will be converted from BSON to PHP using the default deserialization rules (e.g. BSON documents will be converted to stdClass).
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.getreply.php
        * @return object the command reply document as a stdClass object.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getReply()
        /**
        * Returns the command's request ID.
        * The request ID is generated by the driver and may be used to associate this CommandSucceededEvent with a previous CommandStartedEvent.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.getrequestid.php
        * @return string the command's request ID.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getRequestId()
        /**
        * Returns the Server on which the command was executed.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandfailedevent.getserver.php
        * @return \MongoDB\Driver\Server on which the command was executed.
        * @since 1.3.0
        */
        getServer()
    }
    /**
    * Encapsulates information about a failed command.
    * @link https://secure.php.net/manual/en/class.mongodb-driver-monitoring-commandstartedevent.php
    * @since 1.3.0
    */
    declare class CommandStartedEvent
    {
        /**
        * Returns the command document
        * The reply document will be converted from BSON to PHP using the default deserialization rules (e.g. BSON documents will be converted to stdClass).
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandstartedevent.getcommand.php
        * @return object the command document as a stdClass object.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getCommand()
        /**
        * Returns the command name.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandstartedevent.getcommandname.php
        * @return string The command name (e.g. "find", "aggregate").
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getCommandName()
        /**
        * Returns the database on which the command was executed.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandstartedevent.getdatabasename.php
        * @return string the database on which the command was executed.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getDatabaseName()
        /**
        * Returns the command's operation ID.
        * The operation ID is generated by the driver and may be used to link events together such as bulk write operations, which may have been split across several commands at the protocol level.
        * Note: Since multiple commands may share the same operation ID, it is not reliable to use this value to associate event objects with each other. The request ID returned by MongoDB\Driver\Monitoring\CommandSucceededEvent::getRequestId() should be used instead.
        * @link   https://secure.php.net/manual/en/mongodb-driver-monitoring-commandstartedevent.getoperationid.php
        * @return string the command's operation ID.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getOperationId()
        /**
        * Returns the command's request ID.
        * The request ID is generated by the driver and may be used to associate this CommandSucceededEvent with a previous CommandStartedEvent.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandstartedevent.getrequestid.php
        * @return string the command's request ID.
        * @throws \InvalidArgumentException on argument parsing errors.
        * @since 1.3.0
        */
        getRequestId()
        /**
        * Returns the Server on which the command was executed.
        * @link https://secure.php.net/manual/en/mongodb-driver-monitoring-commandstartedevent.getserver.php
        * @return \MongoDB\Driver\Server on which the command was executed.
        * @since 1.3.0
        */
        getServer()
    }
}
