
/**
 * Helper autocomplete for php redis cluster extension.
 * Based on the phpredis-phpdoc by Max Kamashev (https://github.com/ukko/phpredis-phpdoc)
 *
 * @author Tommy Zheng <tommy@vlv.pw>
 * @link   https://github.com/zgb7mtr/phpredis_cluster_phpdoc
 *
 * @method mixed eval(script:any,args:any = array(),numKeys:any = 0)
 *
 */
declare class RedisCluster {
    const AFTER = 'after';
    const BEFORE = 'before';
    /**
     * Options
     */
    const OPT_SERIALIZER = 1;
    const OPT_PREFIX = 2;
    const OPT_READ_TIMEOUT = 3;
    const OPT_SCAN = 4;
    const OPT_SLAVE_FAILOVER = 5;
    /**
     * Cluster options
     */
    const FAILOVER_NONE = 0;
    const FAILOVER_ERROR = 1;
    const FAILOVER_DISTRIBUTE = 2;
    const FAILOVER_DISTRIBUTE_SLAVES = 3;
    /**
     * SCAN options
     */
    const SCAN_NORETRY = 0;
    const SCAN_RETRY = 1;
    /**
     * Serializers
     */
    const SERIALIZER_NONE = 0;
    const SERIALIZER_PHP = 1;
    const SERIALIZER_IGBINARY = 2;
    const SERIALIZER_MSGPACK = 3;
    const SERIALIZER_JSON = 4;
    /**
     * Multi
     */
    const ATOMIC = 0;
    const MULTI = 1;
    const PIPELINE = 2;
    /**
     * Type
     */
    const REDIS_NOT_FOUND = 0;
    const REDIS_STRING = 1;
    const REDIS_SET = 2;
    const REDIS_LIST = 3;
    const REDIS_ZSET = 4;
    const REDIS_HASH = 5;
    /**
     * Creates a Redis Cluster client
     *
     * @param string|null   $name
     * @param array         $seeds
     * @param float         $timeout
     * @param float         $readTimeout
     * @param bool          $persistent
     * @param string|null   $auth
     * @throws RedisClusterException
     *
     * @example
     * <pre>
     * // Declaring a cluster with an array of seeds
     * $redisCluster = new RedisCluster(null,['127.0.0.1:6379']);
     *
     * // Loading a cluster configuration by name
     * // In order to load a named array, one must first define the seed nodes in redis.ini.
     * // The following lines would define the cluster 'mycluster', and be loaded automatically by phpredis.
     *
     * // # In redis.ini
     * // redis.clusters.seeds = "mycluster[]=localhost:7000&test[]=localhost:7001"
     * // redis.clusters.timeout = "mycluster=5"
     * // redis.clusters.read_timeout = "mycluster=10"
     *
     * //Then, this cluster can be loaded by doing the following
     *
     * $redisClusterPro = new RedisCluster('mycluster');
     * $redisClusterDev = new RedisCluster('test');
     * </pre>
     */
    constructor(name:any,seeds:any,timeout:any = null,readTimeout:any = null,persistent:any = false,auth:any = null)
    __construct(name:any,seeds:any,timeout:any = null,readTimeout:any = null,persistent:any = false,auth:any = null):this
    /**
     * Disconnects from the Redis instance, except when pconnect is used.
     */
    close()
    /**
     * Get the value related to the specified key
     *
     * @param   string $key
     *
     * @return  string|false If key didn't exist, FALSE is returned. Otherwise, the value related to this key is
     *                       returned.
     *
     * @link    https://redis.io/commands/get
     * @example
     * <pre>
     * $redisCluster->get('key');
     * </pre>
     */
    get(key:any)
    /**
     * Set the string value in argument as value of the key.
     *
     * @since    If you're using Redis >= 2.6.12, you can pass extended options as explained in example
     *
     * @param   string    $key
     * @param   string    $value
     * @param   int|array $timeout If you pass an integer, phpredis will redirect to SETEX, and will try to use Redis
     *                             >= 2.6.12 extended options if you pass an array with valid values.
     *
     * @return  bool TRUE if the command is successful.
     *
     * @link     https://redis.io/commands/set
     * @example
     * <pre>
     * // Simple key -> value set
     * $redisCluster->set('key', 'value');
     *
     * // Will redirect, and actually make an SETEX call
     * $redisCluster->set('key','value', 10);
     *
     * // Will set the key, if it doesn't exist, with a ttl of 10 seconds
     * $redisCluster->set('key', 'value', Array('nx', 'ex'=>10));
     *
     * // Will set a key, if it does exist, with a ttl of 1000 milliseconds
     * $redisCluster->set('key', 'value', Array('xx', 'px'=>1000));
     * </pre>
     */
    set(key:any,value:any,timeout:any = null)
    /**
     * Returns the values of all specified keys.
     *
     * For every key that does not hold a string value or does not exist,
     * the special value false is returned. Because of this, the operation never fails.
     *
     * @param array $array
     *
     * @return array
     *
     * @link https://redis.io/commands/mget
     * @example
     * <pre>
     * $redisCluster->del('x', 'y', 'z', 'h');    // remove x y z
     * $redisCluster->mset(array('x' => 'a', 'y' => 'b', 'z' => 'c'));
     * $redisCluster->hset('h', 'field', 'value');
     * var_dump(redisCluster:any->mget(array('x', 'y', 'z', 'h')));
     * // Output:
     * // array(3) {
     * // [0]=>
     * // string(1) "a"
     * // [1]=>
     * // string(1) "b"
     * // [2]=>
     * // string(1) "c"
     * // [3]=>
     * // bool(false)
     * // }
     * </pre>
     */
    mget(array:array)
    /**
     * Sets multiple key-value pairs in one atomic command.
     * MSETNX only returns TRUE if all the keys were set (see SETNX).
     *
     * @param   array $array Pairs: array(key => value, ...)
     *
     * @return  bool    TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/mset
     * @example
     * <pre>
     * $redisCluster->mset(array('key0' => 'value0', 'key1' => 'value1'));
     * var_dump(redisCluster:any->get('key0'));
     * var_dump(redisCluster:any->get('key1'));
     * // Output:
     * // string(6) "value0"
     * // string(6) "value1"
     * </pre>
     */
    mset(array:array)
    /**
     * @see     mset()
     *
     * @param   array $array
     *
     * @return  int 1 (if the keys were set) or 0 (no key was set)
     * @link    https://redis.io/commands/msetnx
     */
    msetnx(array:array)
    /**
     * Remove specified keys.
     *
     * @param int|string|array $key1 An array of keys, or an undefined number of parameters, each a key: key1 key2 key3
     *                            ... keyN
     * @param int|string ...$otherKeys
     *
     * @return int Number of keys deleted.
     * @link    https://redis.io/commands/del
     * @example
     * <pre>
     * $redisCluster->set('key1', 'val1');
     * $redisCluster->set('key2', 'val2');
     * $redisCluster->set('key3', 'val3');
     * $redisCluster->set('key4', 'val4');
     * $redisCluster->del('key1', 'key2');          // return 2
     * $redisCluster->del(array('key3', 'key4'));   // return 2
     * </pre>
     */
    del(key1:any, ...otherKeys:any[])
    /**
     * Set the string value in argument as value of the key, with a time to live.
     *
     * @param   string $key
     * @param   int    $ttl
     * @param   string $value
     *
     * @return  bool   TRUE if the command is successful.
     * @link    https://redis.io/commands/setex
     * @example
     * <pre>
     * $redisCluster->setex('key', 3600, 'value'); // sets key → value, with 1h TTL.
     * </pre>
     */
    setex(key:any,ttl:any,value:any)
    /**
     * PSETEX works exactly like SETEX with the sole difference that the expire time is specified in milliseconds
     * instead of seconds.
     *
     * @param   string $key
     * @param   int    $ttl
     * @param   string $value
     *
     * @return  bool   TRUE if the command is successful.
     * @link    https://redis.io/commands/psetex
     * @example
     * <pre>
     * $redisCluster->psetex('key', 1000, 'value'); // sets key → value, with 1s TTL.
     * </pre>
     */
    psetex(key:any,ttl:any,value:any)
    /**
     * Set the string value in argument as value of the key if the key doesn't already exist in the database.
     *
     * @param   string $key
     * @param   string $value
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/setnx
     * @example
     * <pre>
     * $redisCluster->setnx('key', 'value');   // return TRUE
     * $redisCluster->setnx('key', 'value');   // return FALSE
     * </pre>
     */
    setnx(key:any,value:any)
    /**
     * Sets a value and returns the previous entry at that key.
     *
     * @param   string $key
     * @param   string $value
     *
     * @return  string  A string, the previous value located at this key.
     * @link    https://redis.io/commands/getset
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $exValue = $redisCluster->getSet('x', 'lol');   // return '42', replaces x by 'lol'
     * $newValue = $redisCluster->get('x');            // return 'lol'
     * </pre>
     */
    getSet(key:any,value:any)
    /**
     * Verify if the specified key exists.
     *
     * @param   string $key
     *
     * @return  bool If the key exists, return TRUE, otherwise return FALSE.
     * @link    https://redis.io/commands/exists
     * @example
     * <pre>
     * $redisCluster->set('key', 'value');
     * $redisCluster->exists('key');               //  TRUE
     * $redisCluster->exists('NonExistingKey');    // FALSE
     * </pre>
     */
    exists(key:any)
    /**
     * Returns the keys that match a certain pattern.
     *
     * @param   string $pattern pattern, using '*' as a wildcard.
     *
     * @return  array   of STRING: The keys that match a certain pattern.
     * @link    https://redis.io/commands/keys
     * @example
     * <pre>
     * $allKeys = $redisCluster->keys('*');   // all keys will match this.
     * $keyWithUserPrefix = $redisCluster->keys('user*');
     * </pre>
     */
    keys(pattern:any)
    /**
     * Returns the type of data pointed by a given key.
     *
     * @param   string $key
     *
     * @return  int
     *
     * Depending on the type of the data pointed by the key,
     * this method will return the following value:
     * - string: RedisCluster::REDIS_STRING
     * - set:   RedisCluster::REDIS_SET
     * - list:  RedisCluster::REDIS_LIST
     * - zset:  RedisCluster::REDIS_ZSET
     * - hash:  RedisCluster::REDIS_HASH
     * - other: RedisCluster::REDIS_NOT_FOUND
     * @link    https://redis.io/commands/type
     * @example $redisCluster->type('key');
     */
    type(key:any)
    /**
     * Returns and removes the first element of the list.
     *
     * @param   string $key
     *
     * @return  string|false if command executed successfully BOOL FALSE in case of failure (empty list)
     * @link    https://redis.io/commands/lpop
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');
     * var_dump(redisCluster:any->lRange('key1', 0, -1) );
     * // Output:
     * // array(3) {
     * //   [0]=> string(1) "A"
     * //   [1]=> string(1) "B"
     * //   [2]=> string(1) "C"
     * // }
     * $redisCluster->lPop('key1');
     * var_dump(redisCluster:any->lRange('key1', 0, -1) );
     * // Output:
     * // array(2) {
     * //   [0]=> string(1) "B"
     * //   [1]=> string(1) "C"
     * // }
     * </pre>
     */
    lPop(key:any)
    /**
     * Returns and removes the last element of the list.
     *
     * @param   string $key
     *
     * @return  string|false if command executed successfully BOOL FALSE in case of failure (empty list)
     * @link    https://redis.io/commands/rpop
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');
     * var_dump(redisCluster:any->lRange('key1', 0, -1) );
     * // Output:
     * // array(3) {
     * //   [0]=> string(1) "A"
     * //   [1]=> string(1) "B"
     * //   [2]=> string(1) "C"
     * // }
     * $redisCluster->rPop('key1');
     * var_dump(redisCluster:any->lRange('key1', 0, -1) );
     * // Output:
     * // array(2) {
     * //   [0]=> string(1) "A"
     * //   [1]=> string(1) "B"
     * // }
     * </pre>
     */
    rPop(key:any)
    /**
     * Set the list at index with the new value.
     *
     * @param string $key
     * @param int    $index
     * @param string $value
     *
     * @return bool TRUE if the new value is setted. FALSE if the index is out of range, or data type identified by key
     * is not a list.
     * @link    https://redis.io/commands/lset
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');  // key1 => [ 'A', 'B', 'C' ]
     * $redisCluster->lGet('key1', 0);     // 'A'
     * $redisCluster->lSet('key1', 0, 'X');
     * $redisCluster->lGet('key1', 0);     // 'X'
     * </pre>
     */
    lSet(key:any,index:any,value:any)
    /**
     * Removes and returns a random element from the set value at Key.
     *
     * @param   string $key
     *
     * @return  string  "popped" value
     * bool FALSE if set identified by key is empty or doesn't exist.
     * @link    https://redis.io/commands/spop
     * @example
     * <pre>
     * $redisCluster->sAdd('key1' , 'set1');
     * $redisCluster->sAdd('key1' , 'set2');
     * $redisCluster->sAdd('key1' , 'set3');
     * var_dump(redisCluster:any->sMembers('key1'));// 'key1' => {'set3', 'set1', 'set2'}
     * $redisCluster->sPop('key1');// 'set1'
     * var_dump(redisCluster:any->sMembers('key1'));// 'key1' => {'set3', 'set2'}
     * $redisCluster->sPop('key1');// 'set3',
     * var_dump(redisCluster:any->sMembers('key1'));// 'key1' => {'set2'}
     * </pre>
     */
    sPop(key:any)
    /**
     * Adds the string values to the head (left) of the list. Creates the list if the key didn't exist.
     * If the key exists and is not a list, FALSE is returned.
     *
     * @param   string $key
     * @param   string $value1 String, value to push in key
     * @param   string $value2 Optional
     * @param   string $valueN Optional
     *
     * @return  int|false    The new length of the list in case of success, FALSE in case of Failure.
     * @link    https://redis.io/commands/lpush
     * @example
     * <pre>
     * $redisCluster->lPush('l', 'v1', 'v2', 'v3', 'v4')   // int(4)
     * var_dump(redisCluster:any->lRange('l', 0, -1) );
     * //// Output:
     * // array(4) {
     * //   [0]=> string(2) "v4"
     * //   [1]=> string(2) "v3"
     * //   [2]=> string(2) "v2"
     * //   [3]=> string(2) "v1"
     * // }
     * </pre>
     */
    lPush(key:any,value1:any,value2:any = null,valueN:any = null)
    /**
     * Adds the string values to the tail (right) of the list. Creates the list if the key didn't exist.
     * If the key exists and is not a list, FALSE is returned.
     *
     * @param   string $key
     * @param   string $value1 String, value to push in key
     * @param   string $value2 Optional
     * @param   string $valueN Optional
     *
     * @return  int|false     The new length of the list in case of success, FALSE in case of Failure.
     * @link    https://redis.io/commands/rpush
     * @example
     * <pre>
     * $redisCluster->rPush('r', 'v1', 'v2', 'v3', 'v4');    // int(4)
     * var_dump(redisCluster:any->lRange('r', 0, -1) );
     * //// Output:
     * // array(4) {
     * //   [0]=> string(2) "v1"
     * //   [1]=> string(2) "v2"
     * //   [2]=> string(2) "v3"
     * //   [3]=> string(2) "v4"
     * // }
     * </pre>
     */
    rPush(key:any,value1:any,value2:any = null,valueN:any = null)
    /**
     * BLPOP is a blocking list pop primitive.
     * It is the blocking version of LPOP because it blocks the connection when
     * there are no elements to pop from any of the given lists.
     * An element is popped from the head of the first list that is non-empty,
     * with the given keys being checked in the order that they are given.
     *
     * @param array $keys    Array containing the keys of the lists
     *                       Or STRING Key1 STRING Key2 STRING Key3 ... STRING Keyn
     * @param int   $timeout Timeout
     *
     * @return  array array('listName', 'element')
     * @link    https://redis.io/commands/blpop
     * @example
     * <pre>
     * // Non blocking feature
     * $redisCluster->lPush('key1', 'A');
     * $redisCluster->del('key2');
     *
     * $redisCluster->blPop('key1', 'key2', 10); // array('key1', 'A')
     * // OR
     * $redisCluster->blPop(array('key1', 'key2'), 10); // array('key1', 'A')
     *
     * $redisCluster->brPop('key1', 'key2', 10); // array('key1', 'A')
     * // OR
     * $redisCluster->brPop(array('key1', 'key2'), 10); // array('key1', 'A')
     *
     * // Blocking feature
     *
     * // process 1
     * $redisCluster->del('key1');
     * $redisCluster->blPop('key1', 10);
     * // blocking for 10 seconds
     *
     * // process 2
     * $redisCluster->lPush('key1', 'A');
     *
     * // process 1
     * // array('key1', 'A') is returned
     * </pre>
     */
    blPop(keys:array,timeout:any)
    /**
     * BRPOP is a blocking list pop primitive.
     * It is the blocking version of RPOP because it blocks the connection when
     * there are no elements to pop from any of the given lists.
     * An element is popped from the tail of the first list that is non-empty,
     * with the given keys being checked in the order that they are given.
     * See the BLPOP documentation(https://redis.io/commands/blpop) for the exact semantics,
     * since BRPOP is identical to BLPOP with the only difference being that
     * it pops elements from the tail of a list instead of popping from the head.
     *
     * @param array $keys    Array containing the keys of the lists
     *                       Or STRING Key1 STRING Key2 STRING Key3 ... STRING Keyn
     * @param int   $timeout Timeout
     *
     * @return  array array('listName', 'element')
     * @link    https://redis.io/commands/brpop
     * @example
     * <pre>
     * // Non blocking feature
     * $redisCluster->lPush('key1', 'A');
     * $redisCluster->del('key2');
     *
     * $redisCluster->blPop('key1', 'key2', 10); // array('key1', 'A')
     * // OR
     * $redisCluster->blPop(array('key1', 'key2'), 10); // array('key1', 'A')
     *
     * $redisCluster->brPop('key1', 'key2', 10); // array('key1', 'A')
     * // OR
     * $redisCluster->brPop(array('key1', 'key2'), 10); // array('key1', 'A')
     *
     * // Blocking feature
     *
     * // process 1
     * $redisCluster->del('key1');
     * $redisCluster->blPop('key1', 10);
     * // blocking for 10 seconds
     *
     * // process 2
     * $redisCluster->lPush('key1', 'A');
     *
     * // process 1
     * // array('key1', 'A') is returned
     * </pre>
     */
    brPop(keys:array,timeout:any)
    /**
     * Adds the string value to the tail (right) of the list if the ist exists. FALSE in case of Failure.
     *
     * @param   string $key
     * @param   string $value String, value to push in key
     *
     * @return  int|false     The new length of the list in case of success, FALSE in case of Failure.
     * @link    https://redis.io/commands/rpushx
     * @example
     * <pre>
     * $redisCluster->del('key1');
     * $redisCluster->rPushx('key1', 'A'); // returns 0
     * $redisCluster->rPush('key1', 'A'); // returns 1
     * $redisCluster->rPushx('key1', 'B'); // returns 2
     * $redisCluster->rPushx('key1', 'C'); // returns 3
     * // key1 now points to the following list: [ 'A', 'B', 'C' ]
     * </pre>
     */
    rPushx(key:any,value:any)
    /**
     * Adds the string value to the head (left) of the list if the list exists.
     *
     * @param   string $key
     * @param   string $value String, value to push in key
     *
     * @return  int|false     The new length of the list in case of success, FALSE in case of Failure.
     * @link    https://redis.io/commands/lpushx
     * @example
     * <pre>
     * $redisCluster->del('key1');
     * $redisCluster->lPushx('key1', 'A');     // returns 0
     * $redisCluster->lPush('key1', 'A');      // returns 1
     * $redisCluster->lPushx('key1', 'B');     // returns 2
     * $redisCluster->lPushx('key1', 'C');     // returns 3
     * // key1 now points to the following list: [ 'C', 'B', 'A' ]
     * </pre>
     */
    lPushx(key:any,value:any)
    /**
     * Insert value in the list before or after the pivot value. the parameter options
     * specify the position of the insert (before or after). If the list didn't exists,
     * or the pivot didn't exists, the value is not inserted.
     *
     * @param   string $key
     * @param   int    $position RedisCluster::BEFORE | RedisCluster::AFTER
     * @param   string $pivot
     * @param   string $value
     *
     * @return  int     The number of the elements in the list, -1 if the pivot didn't exists.
     * @link    https://redis.io/commands/linsert
     * @example
     * <pre>
     * $redisCluster->del('key1');
     * $redisCluster->lInsert('key1', RedisCluster::AFTER, 'A', 'X');    // 0
     *
     * $redisCluster->lPush('key1', 'A');
     * $redisCluster->lPush('key1', 'B');
     * $redisCluster->lPush('key1', 'C');
     *
     * $redisCluster->lInsert('key1', RedisCluster::BEFORE, 'C', 'X');   // 4
     * $redisCluster->lRange('key1', 0, -1);                      // array('X', 'C', 'B', 'A')
     *
     * $redisCluster->lInsert('key1', RedisCluster::AFTER, 'C', 'Y');    // 5
     * $redisCluster->lRange('key1', 0, -1);                      // array('X', 'C', 'Y', 'B', 'A')
     *
     * $redisCluster->lInsert('key1', RedisCluster::AFTER, 'W', 'value'); // -1
     * </pre>
     */
    lInsert(key:any,position:any,pivot:any,value:any)
    /**
     * Return the specified element of the list stored at the specified key.
     * 0 the first element, 1 the second ... -1 the last element, -2 the penultimate ...
     * Return FALSE in case of a bad index or a key that doesn't point to a list.
     *
     * @param string $key
     * @param int    $index
     *
     * @return string|false the element at this index
     * Bool FALSE if the key identifies a non-string data type, or no value corresponds to this index in the list Key.
     * @link    https://redis.io/commands/lindex
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');  // key1 => [ 'A', 'B', 'C' ]
     * $redisCluster->lGet('key1', 0);     // 'A'
     * $redisCluster->lGet('key1', -1);    // 'C'
     * $redisCluster->lGet('key1', 10);    // `FALSE`
     * </pre>
     */
    lIndex(key:any,index:any)
    /**
     * Removes the first count occurrences of the value element from the list.
     * If count is zero, all the matching elements are removed. If count is negative,
     * elements are removed from tail to head.
     *
     * @param   string $key
     * @param   string $value
     * @param   int    $count
     *
     * @return  int     the number of elements to remove
     * bool FALSE if the value identified by key is not a list.
     * @link    https://redis.io/commands/lrem
     * @example
     * <pre>
     * $redisCluster->lPush('key1', 'A');
     * $redisCluster->lPush('key1', 'B');
     * $redisCluster->lPush('key1', 'C');
     * $redisCluster->lPush('key1', 'A');
     * $redisCluster->lPush('key1', 'A');
     *
     * $redisCluster->lRange('key1', 0, -1);   // array('A', 'A', 'C', 'B', 'A')
     * $redisCluster->lRem('key1', 'A', 2);    // 2
     * $redisCluster->lRange('key1', 0, -1);   // array('C', 'B', 'A')
     * </pre>
     */
    lRem(key:any,value:any,count:any)
    /**
     * A blocking version of rpoplpush, with an integral timeout in the third parameter.
     *
     * @param   string $srcKey
     * @param   string $dstKey
     * @param   int    $timeout
     *
     * @return  string|false  The element that was moved in case of success, FALSE in case of timeout.
     * @link    https://redis.io/commands/brpoplpush
     */
    brpoplpush(srcKey:any,dstKey:any,timeout:any)
    /**
     * Pops a value from the tail of a list, and pushes it to the front of another list.
     * Also return this value.
     *
     * @since   redis >= 1.2
     *
     * @param   string $srcKey
     * @param   string $dstKey
     *
     * @return  string|false  The element that was moved in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/rpoplpush
     * @example
     * <pre>
     * $redisCluster->del('x', 'y');
     *
     * $redisCluster->lPush('x', 'abc');
     * $redisCluster->lPush('x', 'def');
     * $redisCluster->lPush('y', '123');
     * $redisCluster->lPush('y', '456');
     *
     * // move the last of x to the front of y.
     * var_dump(redisCluster:any->rpoplpush('x', 'y'));
     * var_dump(redisCluster:any->lRange('x', 0, -1));
     * var_dump(redisCluster:any->lRange('y', 0, -1));
     *
     * ////Output:
     * //
     * //string(3) "abc"
     * //array(1) {
     * //  [0]=>
     * //  string(3) "def"
     * //}
     * //array(3) {
     * //  [0]=>
     * //  string(3) "abc"
     * //  [1]=>
     * //  string(3) "456"
     * //  [2]=>
     * //  string(3) "123"
     * //}
     * </pre>
     */
    rpoplpush(srcKey:any,dstKey:any)
    /**
     * Returns the size of a list identified by Key. If the list didn't exist or is empty,
     * the command returns 0. If the data type identified by Key is not a list, the command return FALSE.
     *
     * @param   string $key
     *
     * @return  int     The size of the list identified by Key exists.
     * bool FALSE if the data type identified by Key is not list
     * @link    https://redis.io/commands/llen
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');  // key1 => [ 'A', 'B', 'C' ]
     * $redisCluster->lLen('key1');       // 3
     * $redisCluster->rPop('key1');
     * $redisCluster->lLen('key1');       // 2
     * </pre>
     */
    lLen(key:any)
    /**
     * Returns the set cardinality (number of elements) of the set stored at key.
     *
     * @param   string $key
     *
     * @return  int   the cardinality (number of elements) of the set, or 0 if key does not exist.
     * @link    https://redis.io/commands/scard
     * @example
     * <pre>
     * $redisCluster->sAdd('key1' , 'set1');
     * $redisCluster->sAdd('key1' , 'set2');
     * $redisCluster->sAdd('key1' , 'set3');   // 'key1' => {'set1', 'set2', 'set3'}
     * $redisCluster->sCard('key1');           // 3
     * $redisCluster->sCard('keyX');           // 0
     * </pre>
     */
    sCard(key:any)
    /**
     * Returns all the members of the set value stored at key.
     * This has the same effect as running SINTER with one argument key.
     *
     * @param   string $key
     *
     * @return  array   All elements of the set.
     * @link    https://redis.io/commands/smembers
     * @example
     * <pre>
     * $redisCluster->del('s');
     * $redisCluster->sAdd('s', 'a');
     * $redisCluster->sAdd('s', 'b');
     * $redisCluster->sAdd('s', 'a');
     * $redisCluster->sAdd('s', 'c');
     * var_dump(redisCluster:any->sMembers('s'));
     *
     * ////Output:
     * //
     * //array(3) {
     * //  [0]=>
     * //  string(1) "b"
     * //  [1]=>
     * //  string(1) "c"
     * //  [2]=>
     * //  string(1) "a"
     * //}
     * // The order is random and corresponds to redis' own internal representation of the set structure.
     * </pre>
     */
    sMembers(key:any)
    /**
     * Returns if member is a member of the set stored at key.
     *
     * @param   string $key
     * @param   string $value
     *
     * @return  bool    TRUE if value is a member of the set at key key, FALSE otherwise.
     * @link    https://redis.io/commands/sismember
     * @example
     * <pre>
     * $redisCluster->sAdd('key1' , 'set1');
     * $redisCluster->sAdd('key1' , 'set2');
     * $redisCluster->sAdd('key1' , 'set3'); // 'key1' => {'set1', 'set2', 'set3'}
     *
     * $redisCluster->sIsMember('key1', 'set1'); // TRUE
     * $redisCluster->sIsMember('key1', 'setX'); // FALSE
     * </pre>
     */
    sIsMember(key:any,value:any)
    /**
     * Adds a values to the set value stored at key.
     * If this value is already in the set, FALSE is returned.
     *
     * @param   string $key    Required key
     * @param   string $value1 Required value
     * @param   string $value2 Optional value
     * @param   string $valueN Optional value
     *
     * @return  int|false     The number of elements added to the set
     * @link    https://redis.io/commands/sadd
     * @example
     * <pre>
     * $redisCluster->sAdd('k', 'v1');                // int(1)
     * $redisCluster->sAdd('k', 'v1', 'v2', 'v3');    // int(2)
     * </pre>
     */
    sAdd(key:any,value1:any,value2:any = null,valueN:any = null)
    /**
     * Adds a values to the set value stored at key.
     * If this value is already in the set, FALSE is returned.
     *
     * @param   string $key Required key
     * @param   array  $valueArray
     *
     * @return  int|false     The number of elements added to the set
     * @example
     * <pre>
     * $redisCluster->sAddArray('k', ['v1', 'v2', 'v3']);
     * //This is a feature in php only. Same as $redisCluster->sAdd('k', 'v1', 'v2', 'v3');
     * </pre>
     */
    sAddArray(key:any,valueArray:array)
    /**
     * Removes the specified members from the set value stored at key.
     *
     * @param   string $key
     * @param   string $member1
     * @param   string $member2
     * @param   string $memberN
     *
     * @return  int     The number of elements removed from the set.
     * @link    https://redis.io/commands/srem
     * @example
     * <pre>
     * var_dump(redisCluster:any->sAdd('k', 'v1', 'v2', 'v3') );    // int(3)
     * var_dump(redisCluster:any->sRem('k', 'v2', 'v3') );          // int(2)
     * var_dump(redisCluster:any->sMembers('k') );
     * //// Output:
     * // array(1) {
     * //   [0]=> string(2) "v1"
     * // }
     * </pre>
     */
    sRem(key:any,member1:any,member2:any = null,memberN:any = null)
    /**
     * Performs the union between N sets and returns it.
     *
     * @param   string $key1 Any number of keys corresponding to sets in redis.
     * @param   string $key2 ...
     * @param   string $keyN ...
     *
     * @return  array   of strings: The union of all these sets.
     * @link    https://redis.io/commands/sunionstore
     * @example
     * <pre>
     * $redisCluster->del('s0', 's1', 's2');
     *
     * $redisCluster->sAdd('s0', '1');
     * $redisCluster->sAdd('s0', '2');
     * $redisCluster->sAdd('s1', '3');
     * $redisCluster->sAdd('s1', '1');
     * $redisCluster->sAdd('s2', '3');
     * $redisCluster->sAdd('s2', '4');
     *
     * var_dump(redisCluster:any->sUnion('s0', 's1', 's2'));
     *
     * //// Output:
     * //
     * //array(4) {
     * //  [0]=>
     * //  string(1) "3"
     * //  [1]=>
     * //  string(1) "4"
     * //  [2]=>
     * //  string(1) "1"
     * //  [3]=>
     * //  string(1) "2"
     * //}
     * </pre>
     */
    sUnion(key1:any,key2:any,keyN:any = null)
    /**
     * Performs the same action as sUnion, but stores the result in the first key
     *
     * @param   string $dstKey the key to store the diff into.
     * @param   string $key1   Any number of keys corresponding to sets in redis.
     * @param   string $key2   ...
     * @param   string $keyN   ...
     *
     * @return  int     Any number of keys corresponding to sets in redis.
     * @link    https://redis.io/commands/sunionstore
     * @example
     * <pre>
     * $redisCluster->del('s0', 's1', 's2');
     *
     * $redisCluster->sAdd('s0', '1');
     * $redisCluster->sAdd('s0', '2');
     * $redisCluster->sAdd('s1', '3');
     * $redisCluster->sAdd('s1', '1');
     * $redisCluster->sAdd('s2', '3');
     * $redisCluster->sAdd('s2', '4');
     *
     * var_dump(redisCluster:any->sUnionStore('dst', 's0', 's1', 's2'));
     * var_dump(redisCluster:any->sMembers('dst'));
     *
     * //// Output:
     * //
     * //int(4)
     * //array(4) {
     * //  [0]=>
     * //  string(1) "3"
     * //  [1]=>
     * //  string(1) "4"
     * //  [2]=>
     * //  string(1) "1"
     * //  [3]=>
     * //  string(1) "2"
     * //}
     * </pre>
     */
    sUnionStore(dstKey:any,key1:any,key2:any,keyN:any = null)
    /**
     * Returns the members of a set resulting from the intersection of all the sets
     * held at the specified keys. If just a single key is specified, then this command
     * produces the members of this set. If one of the keys is missing, FALSE is returned.
     *
     * @param   string $key1 keys identifying the different sets on which we will apply the intersection.
     * @param   string $key2 ...
     * @param   string $keyN ...
     *
     * @return  array contain the result of the intersection between those keys.
     * If the intersection between the different sets is empty, the return value will be empty array.
     * @link    https://redis.io/commands/sinterstore
     * @example
     * <pre>
     * $redisCluster->sAdd('key1', 'val1');
     * $redisCluster->sAdd('key1', 'val2');
     * $redisCluster->sAdd('key1', 'val3');
     * $redisCluster->sAdd('key1', 'val4');
     *
     * $redisCluster->sAdd('key2', 'val3');
     * $redisCluster->sAdd('key2', 'val4');
     *
     * $redisCluster->sAdd('key3', 'val3');
     * $redisCluster->sAdd('key3', 'val4');
     *
     * var_dump(redisCluster:any->sInter('key1', 'key2', 'key3'));
     *
     * // Output:
     * //
     * //array(2) {
     * //  [0]=>
     * //  string(4) "val4"
     * //  [1]=>
     * //  string(4) "val3"
     * //}
     * </pre>
     */
    sInter(key1:any,key2:any,keyN:any = null)
    /**
     * Performs a sInter command and stores the result in a new set.
     *
     * @param   string $dstKey the key to store the diff into.
     * @param   string $key1   are intersected as in sInter.
     * @param   string $key2   ...
     * @param   string $keyN   ...
     *
     * @return  int|false    The cardinality of the resulting set, or FALSE in case of a missing key.
     * @link    https://redis.io/commands/sinterstore
     * @example
     * <pre>
     * $redisCluster->sAdd('key1', 'val1');
     * $redisCluster->sAdd('key1', 'val2');
     * $redisCluster->sAdd('key1', 'val3');
     * $redisCluster->sAdd('key1', 'val4');
     *
     * $redisCluster->sAdd('key2', 'val3');
     * $redisCluster->sAdd('key2', 'val4');
     *
     * $redisCluster->sAdd('key3', 'val3');
     * $redisCluster->sAdd('key3', 'val4');
     *
     * var_dump(redisCluster:any->sInterStore('output', 'key1', 'key2', 'key3'));
     * var_dump(redisCluster:any->sMembers('output'));
     *
     * //// Output:
     * //
     * //int(2)
     * //array(2) {
     * //  [0]=>
     * //  string(4) "val4"
     * //  [1]=>
     * //  string(4) "val3"
     * //}
     * </pre>
     */
    sInterStore(dstKey:any,key1:any,key2:any,keyN:any = null)
    /**
     * Performs the difference between N sets and returns it.
     *
     * @param   string $key1 Any number of keys corresponding to sets in redis.
     * @param   string $key2 ...
     * @param   string $keyN ...
     *
     * @return  array   of strings: The difference of the first set will all the others.
     * @link    https://redis.io/commands/sdiff
     * @example
     * <pre>
     * $redisCluster->del('s0', 's1', 's2');
     *
     * $redisCluster->sAdd('s0', '1');
     * $redisCluster->sAdd('s0', '2');
     * $redisCluster->sAdd('s0', '3');
     * $redisCluster->sAdd('s0', '4');
     *
     * $redisCluster->sAdd('s1', '1');
     * $redisCluster->sAdd('s2', '3');
     *
     * var_dump(redisCluster:any->sDiff('s0', 's1', 's2'));
     *
     * //// Output:
     * //
     * //array(2) {
     * //  [0]=>
     * //  string(1) "4"
     * //  [1]=>
     * //  string(1) "2"
     * //}
     * </pre>
     */
    sDiff(key1:any,key2:any,keyN:any = null)
    /**
     * Performs the same action as sDiff, but stores the result in the first key
     *
     * @param   string $dstKey the key to store the diff into.
     * @param   string $key1   Any number of keys corresponding to sets in redis
     * @param   string $key2   ...
     * @param   string $keyN   ...
     *
     * @return  int|false    The cardinality of the resulting set, or FALSE in case of a missing key.
     * @link    https://redis.io/commands/sdiffstore
     * @example
     * <pre>
     * $redisCluster->del('s0', 's1', 's2');
     *
     * $redisCluster->sAdd('s0', '1');
     * $redisCluster->sAdd('s0', '2');
     * $redisCluster->sAdd('s0', '3');
     * $redisCluster->sAdd('s0', '4');
     *
     * $redisCluster->sAdd('s1', '1');
     * $redisCluster->sAdd('s2', '3');
     *
     * var_dump(redisCluster:any->sDiffStore('dst', 's0', 's1', 's2'));
     * var_dump(redisCluster:any->sMembers('dst'));
     *
     * //// Output:
     * //
     * //int(2)
     * //array(2) {
     * //  [0]=>
     * //  string(1) "4"
     * //  [1]=>
     * //  string(1) "2"
     * //}
     * </pre>
     */
    sDiffStore(dstKey:any,key1:any,key2:any,keyN:any = null)
    /**
     * Returns a random element(s) from the set value at Key, without removing it.
     *
     * @param   string $key
     * @param   int    $count [optional]
     *
     * @return  string|array  value(s) from the set
     * bool FALSE if set identified by key is empty or doesn't exist and count argument isn't passed.
     * @link    https://redis.io/commands/srandmember
     * @example
     * <pre>
     * $redisCluster->sAdd('key1' , 'one');
     * $redisCluster->sAdd('key1' , 'two');
     * $redisCluster->sAdd('key1' , 'three');              // 'key1' => {'one', 'two', 'three'}
     *
     * var_dump(redisCluster:any->sRandMember('key1') );     // 'key1' => {'one', 'two', 'three'}
     *
     * // string(5) "three"
     *
     * var_dump(redisCluster:any->sRandMember('key1', 2) );  // 'key1' => {'one', 'two', 'three'}
     *
     * // array(2) {
     * //   [0]=> string(2) "one"
     * //   [1]=> string(2) "three"
     * // }
     * </pre>
     */
    sRandMember(key:any,count:any = null)
    /**
     * Get the length of a string value.
     *
     * @param   string $key
     *
     * @return  int
     * @link    https://redis.io/commands/strlen
     * @example
     * <pre>
     * $redisCluster->set('key', 'value');
     * $redisCluster->strlen('key'); // 5
     * </pre>
     */
    strlen(key:any)
    /**
     * Remove the expiration timer from a key.
     *
     * @param   string $key
     *
     * @return  bool   TRUE if a timeout was removed, FALSE if the key didn’t exist or didn’t have an expiration timer.
     * @link    https://redis.io/commands/persist
     * @example $redisCluster->persist('key');
     */
    persist(key:any)
    /**
     * Returns the remaining time to live of a key that has a timeout.
     * This introspection capability allows a Redis client to check how many seconds a given key will continue to be
     * part of the dataset. In Redis 2.6 or older the command returns -1 if the key does not exist or if the key exist
     * but has no associated expire. Starting with Redis 2.8 the return value in case of error changed: Returns -2 if
     * the key does not exist. Returns -1 if the key exists but has no associated expire.
     *
     * @param   string $key
     *
     * @return  int    the time left to live in seconds.
     * @link    https://redis.io/commands/ttl
     * @example $redisCluster->ttl('key');
     */
    ttl(key:any)
    /**
     * Returns the remaining time to live of a key that has an expire set,
     * with the sole difference that TTL returns the amount of remaining time in seconds while PTTL returns it in
     * milliseconds. In Redis 2.6 or older the command returns -1 if the key does not exist or if the key exist but has
     * no associated expire. Starting with Redis 2.8 the return value in case of error changed: Returns -2 if the key
     * does not exist. Returns -1 if the key exists but has no associated expire.
     *
     * @param   string $key
     *
     * @return  int     the time left to live in milliseconds.
     * @link    https://redis.io/commands/pttl
     * @example $redisCluster->pttl('key');
     */
    pttl(key:any)
    /**
     * Returns the cardinality of an ordered set.
     *
     * @param   string $key
     *
     * @return  int     the set's cardinality
     * @link    https://redis.io/commands/zsize
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 0, 'val0');
     * $redisCluster->zAdd('key', 2, 'val2');
     * $redisCluster->zAdd('key', 10, 'val10');
     * $redisCluster->zCard('key');            // 3
     * </pre>
     */
    zCard(key:any)
    /**
     * Returns the number of elements of the sorted set stored at the specified key which have
     * scores in the range [start,end]. Adding a parenthesis before start or end excludes it
     * from the range. +inf and -inf are also valid limits.
     *
     * @param   string $key
     * @param   string $start
     * @param   string $end
     *
     * @return  int     the size of a corresponding zRangeByScore.
     * @link    https://redis.io/commands/zcount
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 0, 'val0');
     * $redisCluster->zAdd('key', 2, 'val2');
     * $redisCluster->zAdd('key', 10, 'val10');
     * $redisCluster->zCount('key', 0, 3); // 2, corresponding to array('val0', 'val2')
     * </pre>
     */
    zCount(key:any,start:any,end:any)
    /**
     * Deletes the elements of the sorted set stored at the specified key which have scores in the range [start,end].
     *
     * @param   string       $key
     * @param   float|string $start double or "+inf" or "-inf" string
     * @param   float|string $end   double or "+inf" or "-inf" string
     *
     * @return  int             The number of values deleted from the sorted set
     * @link    https://redis.io/commands/zremrangebyscore
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 0, 'val0');
     * $redisCluster->zAdd('key', 2, 'val2');
     * $redisCluster->zAdd('key', 10, 'val10');
     * $redisCluster->zRemRangeByScore('key', 0, 3); // 2
     * </pre>
     */
    zRemRangeByScore(key:any,start:any,end:any)
    /**
     * Returns the score of a given member in the specified sorted set.
     *
     * @param   string $key
     * @param   string $member
     *
     * @return  float
     * @link    https://redis.io/commands/zscore
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 2.5, 'val2');
     * $redisCluster->zScore('key', 'val2'); // 2.5
     * </pre>
     */
    zScore(key:any,member:any)
    /**
     * Adds the specified member with a given score to the sorted set stored at key.
     *
     * @param   string $key    Required key
     * @param   float  $score1 Required score
     * @param   string $value1 Required value
     * @param   float  $score2 Optional score
     * @param   string $value2 Optional value
     * @param   float  $scoreN Optional score
     * @param   string $valueN Optional value
     *
     * @return  int     Number of values added
     * @link    https://redis.io/commands/zadd
     * @example
     * <pre>
     * $redisCluster->zAdd('z', 1, 'v2', 2, 'v2', 3, 'v3', 4, 'v4' );  // int(3)
     * $redisCluster->zRem('z', 'v2', 'v3');                           // int(2)
     * var_dump(redisCluster:any->zRange('z', 0, -1) );
     *
     * //// Output:
     * // array(1) {
     * //   [0]=> string(2) "v4"
     * // }
     * </pre>
     */
    zAdd(key:any,score1:any,value1:any,score2:any = null,value2:any = null,scoreN:any = null,valueN:any = null)
    /**
     * Increments the score of a member from a sorted set by a given amount.
     *
     * @param   string $key
     * @param   float  $value (double) value that will be added to the member's score
     * @param   string $member
     *
     * @return  float   the new value
     * @link    https://redis.io/commands/zincrby
     * @example
     * <pre>
     * $redisCluster->del('key');
     * $redisCluster->zIncrBy('key', 2.5, 'member1');// key or member1 didn't exist, so member1's score is to 0 ;
     *                                              //before the increment and now has the value 2.5
     * $redisCluster->zIncrBy('key', 1, 'member1');    // 3.5
     * </pre>
     */
    zIncrBy(key:any,value:any,member:any)
    /**
     * Returns the length of a hash, in number of items
     *
     * @param   string $key
     *
     * @return  int|false     the number of items in a hash, FALSE if the key doesn't exist or isn't a hash.
     * @link    https://redis.io/commands/hlen
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hSet('h', 'key1', 'hello');
     * $redisCluster->hSet('h', 'key2', 'plop');
     * $redisCluster->hLen('h'); // returns 2
     * </pre>
     */
    hLen(key:any)
    /**
     * Returns the keys in a hash, as an array of strings.
     *
     * @param   string $key
     *
     * @return  array   An array of elements, the keys of the hash. This works like PHP's array_keys().
     * @link    https://redis.io/commands/hkeys
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hSet('h', 'a', 'x');
     * $redisCluster->hSet('h', 'b', 'y');
     * $redisCluster->hSet('h', 'c', 'z');
     * $redisCluster->hSet('h', 'd', 't');
     * var_dump(redisCluster:any->hKeys('h'));
     *
     * //// Output:
     * //
     * // array(4) {
     * // [0]=>
     * // string(1) "a"
     * // [1]=>
     * // string(1) "b"
     * // [2]=>
     * // string(1) "c"
     * // [3]=>
     * // string(1) "d"
     * // }
     * // The order is random and corresponds to redis' own internal representation of the set structure.
     * </pre>
     */
    hKeys(key:any)
    /**
     * Returns the values in a hash, as an array of strings.
     *
     * @param   string $key
     *
     * @return  array   An array of elements, the values of the hash. This works like PHP's array_values().
     * @link    https://redis.io/commands/hvals
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hSet('h', 'a', 'x');
     * $redisCluster->hSet('h', 'b', 'y');
     * $redisCluster->hSet('h', 'c', 'z');
     * $redisCluster->hSet('h', 'd', 't');
     * var_dump(redisCluster:any->hVals('h'));
     *
     * //// Output:
     * //
     * // array(4) {
     * //   [0]=>
     * //   string(1) "x"
     * //   [1]=>
     * //   string(1) "y"
     * //   [2]=>
     * //   string(1) "z"
     * //   [3]=>
     * //   string(1) "t"
     * // }
     * // The order is random and corresponds to redis' own internal representation of the set structure.
     * </pre>
     */
    hVals(key:any)
    /**
     * Gets a value from the hash stored at key.
     * If the hash table doesn't exist, or the key doesn't exist, FALSE is returned.
     *
     * @param   string $key
     * @param   string $hashKey
     *
     * @return  string|false  The value, if the command executed successfully BOOL FALSE in case of failure
     * @link    https://redis.io/commands/hget
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hSet('h', 'a', 'x');
     * $redisCluster->hGet('h', 'a'); // 'X'
     * </pre>
     */
    hGet(key:any,hashKey:any)
    /**
     * Returns the whole hash, as an array of strings indexed by strings.
     *
     * @param   string $key
     *
     * @return  array   An array of elements, the contents of the hash.
     * @link    https://redis.io/commands/hgetall
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hSet('h', 'a', 'x');
     * $redisCluster->hSet('h', 'b', 'y');
     * $redisCluster->hSet('h', 'c', 'z');
     * $redisCluster->hSet('h', 'd', 't');
     * var_dump(redisCluster:any->hGetAll('h'));
     *
     * //// Output:
     * //
     * // array(4) {
     * //   ["a"]=>
     * //   string(1) "x"
     * //   ["b"]=>
     * //   string(1) "y"
     * //   ["c"]=>
     * //   string(1) "z"
     * //   ["d"]=>
     * //   string(1) "t"
     * // }
     * // The order is random and corresponds to redis' own internal representation of the set structure.
     * </pre>
     */
    hGetAll(key:any)
    /**
     * Verify if the specified member exists in a key.
     *
     * @param   string $key
     * @param   string $hashKey
     *
     * @return  bool   If the member exists in the hash table, return TRUE, otherwise return FALSE.
     * @link    https://redis.io/commands/hexists
     * @example
     * <pre>
     * $redisCluster->hSet('h', 'a', 'x');
     * $redisCluster->hExists('h', 'a');               //  TRUE
     * $redisCluster->hExists('h', 'NonExistingKey');  // FALSE
     * </pre>
     */
    hExists(key:any,hashKey:any)
    /**
     * Increments the value of a member from a hash by a given amount.
     *
     * @param   string $key
     * @param   string $hashKey
     * @param   int    $value (integer) value that will be added to the member's value
     *
     * @return  int     the new value
     * @link    https://redis.io/commands/hincrby
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hIncrBy('h', 'x', 2); // returns 2: h[x] = 2 now.
     * $redisCluster->hIncrBy('h', 'x', 1); // h[x] ← 2 + 1. Returns 3
     * </pre>
     */
    hIncrBy(key:any,hashKey:any,value:any)
    /**
     * Adds a value to the hash stored at key. If this value is already in the hash, FALSE is returned.
     *
     * @param string $key
     * @param string $hashKey
     * @param string $value
     *
     * @return int
     * 1 if value didn't exist and was added successfully,
     * 0 if the value was already present and was replaced, FALSE if there was an error.
     * @link    https://redis.io/commands/hset
     * @example
     * <pre>
     * $redisCluster->del('h')
     * $redisCluster->hSet('h', 'key1', 'hello');  // 1, 'key1' => 'hello' in the hash at "h"
     * $redisCluster->hGet('h', 'key1');           // returns "hello"
     *
     * $redisCluster->hSet('h', 'key1', 'plop');   // 0, value was replaced.
     * $redisCluster->hGet('h', 'key1');           // returns "plop"
     * </pre>
     */
    hSet(key:any,hashKey:any,value:any)
    /**
     * Adds a value to the hash stored at key only if this field isn't already in the hash.
     *
     * @param   string $key
     * @param   string $hashKey
     * @param   string $value
     *
     * @return  bool    TRUE if the field was set, FALSE if it was already present.
     * @link    https://redis.io/commands/hsetnx
     * @example
     * <pre>
     * $redisCluster->del('h')
     * $redisCluster->hSetNx('h', 'key1', 'hello'); // TRUE, 'key1' => 'hello' in the hash at "h"
     * $redisCluster->hSetNx('h', 'key1', 'world'); // FALSE, 'key1' => 'hello' in the hash at "h". No change since the
     * field wasn't replaced.
     * </pre>
     */
    hSetNx(key:any,hashKey:any,value:any)
    /**
     * Retrieve the values associated to the specified fields in the hash.
     *
     * @param   string $key
     * @param   array  $hashKeys
     *
     * @return  array   Array An array of elements, the values of the specified fields in the hash,
     * with the hash keys as array keys.
     * @link    https://redis.io/commands/hmget
     * @example
     * <pre>
     * $redisCluster->del('h');
     * $redisCluster->hSet('h', 'field1', 'value1');
     * $redisCluster->hSet('h', 'field2', 'value2');
     * $redisCluster->hMGet('h', array('field1', 'field2')); // returns array('field1' => 'value1', 'field2' =>
     * 'value2')
     * </pre>
     */
    hMGet(key:any,hashKeys:any)
    /**
     * Fills in a whole hash. Non-string values are converted to string, using the standard (string) cast.
     * NULL values are stored as empty strings
     *
     * @param   string $key
     * @param   array  $hashKeys key → value array
     *
     * @return  bool
     * @link    https://redis.io/commands/hmset
     * @example
     * <pre>
     * $redisCluster->del('user:1');
     * $redisCluster->hMSet('user:1', array('name' => 'Joe', 'salary' => 2000));
     * $redisCluster->hIncrBy('user:1', 'salary', 100); // Joe earns 100 more now.
     * </pre>
     */
    hMSet(key:any,hashKeys:any)
    /**
     * Removes a values from the hash stored at key.
     * If the hash table doesn't exist, or the key doesn't exist, FALSE is returned.
     *
     * @param   string $key
     * @param   string $hashKey1
     * @param   string $hashKey2
     * @param   string $hashKeyN
     *
     * @return  int     Number of deleted fields
     * @link    https://redis.io/commands/hdel
     * @example
     * <pre>
     * $redisCluster->hMSet('h',
     *               array(
     *                    'f1' => 'v1',
     *                    'f2' => 'v2',
     *                    'f3' => 'v3',
     *                    'f4' => 'v4',
     *               ));
     *
     * var_dump(redisCluster:any->hDel('h', 'f1') );        // int(1)
     * var_dump(redisCluster:any->hDel('h', 'f2', 'f3') );  // int(2)
     *
     * var_dump(redisCluster:any->hGetAll('h') );
     *
     * //// Output:
     * //
     * //  array(1) {
     * //    ["f4"]=> string(2) "v4"
     * //  }
     * </pre>
     */
    hDel(key:any,hashKey1:any,hashKey2:any = null,hashKeyN:any = null)
    /**
     * Increment the float value of a hash field by the given amount
     *
     * @param   string $key
     * @param   string $field
     * @param   float  $increment
     *
     * @return  float
     * @link    https://redis.io/commands/hincrbyfloat
     * @example
     * <pre>
     * $redisCluster->hset('h', 'float', 3);
     * $redisCluster->hset('h', 'int',   3);
     * var_dump(redisCluster:any->hIncrByFloat('h', 'float', 1.5) ); // float(4.5)
     *
     * var_dump(redisCluster:any->hGetAll('h') );
     *
     * //// Output:
     * //
     * // array(2) {
     * //   ["float"]=>
     * //   string(3) "4.5"
     * //   ["int"]=>
     * //   string(1) "3"
     * // }
     * </pre>
     */
    hIncrByFloat(key:any,field:any,increment:any)
    /**
     * Dump a key out of a redis database, the value of which can later be passed into redis using the RESTORE command.
     * The data that comes out of DUMP is a binary representation of the key as Redis stores it.
     *
     * @param   string $key
     *
     * @return  string|false  The Redis encoded value of the key, or FALSE if the key doesn't exist
     * @link    https://redis.io/commands/dump
     * @example
     * <pre>
     * $redisCluster->set('foo', 'bar');
     * $val = $redisCluster->dump('foo'); // $val will be the Redis encoded key value
     * </pre>
     */
    dump(key:any)
    /**
     * Returns the rank of a given member in the specified sorted set, starting at 0 for the item
     * with the smallest score. zRevRank starts at 0 for the item with the largest score.
     *
     * @param   string $key
     * @param   string $member
     *
     * @return  int     the item's score.
     * @link    https://redis.io/commands/zrank
     * @example
     * <pre>
     * $redisCluster->del('z');
     * $redisCluster->zAdd('key', 1, 'one');
     * $redisCluster->zAdd('key', 2, 'two');
     * $redisCluster->zRank('key', 'one');     // 0
     * $redisCluster->zRank('key', 'two');     // 1
     * $redisCluster->zRevRank('key', 'one');  // 1
     * $redisCluster->zRevRank('key', 'two');  // 0
     * </pre>
     */
    zRank(key:any,member:any)
    /**
     * @see    zRank()
     *
     * @param  string $key
     * @param  string $member
     *
     * @return int    the item's score
     * @link   https://redis.io/commands/zrevrank
     */
    zRevRank(key:any,member:any)
    /**
     * Increment the number stored at key by one.
     *
     * @param   string $key
     *
     * @return  int    the new value
     * @link    https://redis.io/commands/incr
     * @example
     * <pre>
     * $redisCluster->incr('key1'); // key1 didn't exists, set to 0 before the increment and now has the value 1
     * $redisCluster->incr('key1'); // 2
     * $redisCluster->incr('key1'); // 3
     * $redisCluster->incr('key1'); // 4
     * </pre>
     */
    incr(key:any)
    /**
     * Decrement the number stored at key by one.
     *
     * @param   string $key
     *
     * @return  int    the new value
     * @link    https://redis.io/commands/decr
     * @example
     * <pre>
     * $redisCluster->decr('key1'); // key1 didn't exists, set to 0 before the increment and now has the value -1
     * $redisCluster->decr('key1'); // -2
     * $redisCluster->decr('key1'); // -3
     * </pre>
     */
    decr(key:any)
    /**
     * Increment the number stored at key by one. If the second argument is filled, it will be used as the integer
     * value of the increment.
     *
     * @param   string $key   key
     * @param   int    $value value that will be added to key (only for incrBy)
     *
     * @return  int         the new value
     * @link    https://redis.io/commands/incrby
     * @example
     * <pre>
     * $redisCluster->incr('key1');        // key1 didn't exists, set to 0 before the increment and now has the value 1
     * $redisCluster->incr('key1');        // 2
     * $redisCluster->incr('key1');        // 3
     * $redisCluster->incr('key1');        // 4
     * $redisCluster->incrBy('key1', 10);  // 14
     * </pre>
     */
    incrBy(key:any,value:any)
    /**
     * Decrement the number stored at key by one. If the second argument is filled, it will be used as the integer
     * value of the decrement.
     *
     * @param   string $key
     * @param   int    $value that will be subtracted to key (only for decrBy)
     *
     * @return  int       the new value
     * @link    https://redis.io/commands/decrby
     * @example
     * <pre>
     * $redisCluster->decr('key1');        // key1 didn't exists, set to 0 before the increment and now has the value -1
     * $redisCluster->decr('key1');        // -2
     * $redisCluster->decr('key1');        // -3
     * $redisCluster->decrBy('key1', 10);  // -13
     * </pre>
     */
    decrBy(key:any,value:any)
    /**
     * Increment the float value of a key by the given amount
     *
     * @param   string $key
     * @param   float  $increment
     *
     * @return  float
     * @link    https://redis.io/commands/incrbyfloat
     * @example
     * <pre>
     * $redisCluster->set('x', 3);
     * var_dump(redisCluster:any->incrByFloat('x', 1.5) );   // float(4.5)
     *
     * var_dump(redisCluster:any->get('x') );                // string(3) "4.5"
     * </pre>
     */
    incrByFloat(key:any,increment:any)
    /**
     * Sets an expiration date (a timeout) on an item.
     *
     * @param   string $key The key that will disappear.
     * @param   int    $ttl The key's remaining Time To Live, in seconds.
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/expire
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $redisCluster->expire('x', 3);  // x will disappear in 3 seconds.
     * sleep(5);                    // wait 5 seconds
     * $redisCluster->get('x');            // will return `FALSE`, as 'x' has expired.
     * </pre>
     */
    expire(key:any,ttl:any)
    /**
     * Sets an expiration date (a timeout in milliseconds) on an item.
     *
     * @param   string $key The key that will disappear.
     * @param   int    $ttl The key's remaining Time To Live, in milliseconds.
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/pexpire
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $redisCluster->pExpire('x', 11500); // x will disappear in 11500 milliseconds.
     * $redisCluster->ttl('x');            // 12
     * $redisCluster->pttl('x');           // 11500
     * </pre>
     */
    pExpire(key:any,ttl:any)
    /**
     * Sets an expiration date (a timestamp) on an item.
     *
     * @param   string $key       The key that will disappear.
     * @param   int    $timestamp Unix timestamp. The key's date of death, in seconds from Epoch time.
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/expireat
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $now = time();               // current timestamp
     * $redisCluster->expireAt('x',now:any + 3); // x will disappear in 3 seconds.
     * sleep(5);                        // wait 5 seconds
     * $redisCluster->get('x');                // will return `FALSE`, as 'x' has expired.
     * </pre>
     */
    expireAt(key:any,timestamp:any)
    /**
     * Sets an expiration date (a timestamp) on an item. Requires a timestamp in milliseconds
     *
     * @param   string $key       The key that will disappear.
     * @param   int    $timestamp Unix timestamp. The key's date of death, in seconds from Epoch time.
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/pexpireat
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $redisCluster->pExpireAt('x', 1555555555005);
     * $redisCluster->ttl('x');                       // 218270121
     * $redisCluster->pttl('x');                      // 218270120575
     * </pre>
     */
    pExpireAt(key:any,timestamp:any)
    /**
     * Append specified string to the string stored in specified key.
     *
     * @param   string $key
     * @param   string $value
     *
     * @return  int    Size of the value after the append
     * @link    https://redis.io/commands/append
     * @example
     * <pre>
     * $redisCluster->set('key', 'value1');
     * $redisCluster->append('key', 'value2'); // 12
     * $redisCluster->get('key');              // 'value1value2'
     * </pre>
     */
    append(key:any,value:any)
    /**
     * Return a single bit out of a larger string
     *
     * @param   string $key
     * @param   int    $offset
     *
     * @return  int    the bit value (0 or 1)
     * @link    https://redis.io/commands/getbit
     * @example
     * <pre>
     * $redisCluster->set('key', "\x7f");  // this is 0111 1111
     * $redisCluster->getBit('key', 0);    // 0
     * $redisCluster->getBit('key', 1);    // 1
     * </pre>
     */
    getBit(key:any,offset:any)
    /**
     * Changes a single bit of a string.
     *
     * @param   string   $key
     * @param   int      $offset
     * @param   bool|int $value bool or int (1 or 0)
     *
     * @return  int    0 or 1, the value of the bit before it was set.
     * @link    https://redis.io/commands/setbit
     * @example
     * <pre>
     * $redisCluster->set('key', "*");     // ord("*") = 42 = 0x2f = "0010 1010"
     * $redisCluster->setBit('key', 5, 1); // returns 0
     * $redisCluster->setBit('key', 7, 1); // returns 0
     * $redisCluster->get('key');          // chr(0x2f) = "/" = b("0010 1111")
     * </pre>
     */
    setBit(key:any,offset:any,value:any)
    /**
     * Bitwise operation on multiple keys.
     *
     * @param   string $operation either "AND", "OR", "NOT", "XOR"
     * @param   string $retKey    return key
     * @param   string $key1
     * @param   string $key2
     * @param   string $key3
     *
     * @return  int     The size of the string stored in the destination key.
     * @link    https://redis.io/commands/bitop
     * @example
     * <pre>
     * $redisCluster->set('bit1', '1'); // 11 0001
     * $redisCluster->set('bit2', '2'); // 11 0010
     *
     * $redisCluster->bitOp('AND', 'bit', 'bit1', 'bit2'); // bit = 110000
     * $redisCluster->bitOp('OR',  'bit', 'bit1', 'bit2'); // bit = 110011
     * $redisCluster->bitOp('NOT', 'bit', 'bit1', 'bit2'); // bit = 110011
     * $redisCluster->bitOp('XOR', 'bit', 'bit1', 'bit2'); // bit = 11
     * </pre>
     */
    bitOp(operation:any,retKey:any,key1:any,key2:any,key3:any = null)
    /**
     * Return the position of the first bit set to 1 or 0 in a string. The position is returned, thinking of the
     * string as an array of bits from left to right, where the first byte's most significant bit is at position 0,
     * the second byte's most significant bit is at position 8, and so forth.
     *
     * @param   string $key
     * @param   int    $bit
     * @param   int    $start
     * @param   int    $end
     *
     * @return  int     The command returns the position of the first bit set to 1 or 0 according to the request.
     *                  If we look for set bits (the bit argument is 1) and the string is empty or composed of just
     *                  zero bytes, -1 is returned. If we look for clear bits (the bit argument is 0) and the string
     *                  only contains bit set to 1, the function returns the first bit not part of the string on the
     *                  right. So if the string is three bytes set to the value 0xff the command BITPOS key 0 will
     *                  return 24, since up to bit 23 all the bits are 1. Basically, the function considers the right
     *                  of the string as padded with zeros if you look for clear bits and specify no range or the
     *                  start argument only. However, this behavior changes if you are looking for clear bits and
     *                  specify a range with both start and end. If no clear bit is found in the specified range, the
     *                  function returns -1 as the user specified a clear range and there are no 0 bits in that range.
     * @link    https://redis.io/commands/bitpos
     * @example
     * <pre>
     * $redisCluster->set('key', '\xff\xff');
     * $redisCluster->bitpos('key', 1); // int(0)
     * $redisCluster->bitpos('key', 1, 1); // int(8)
     * $redisCluster->bitpos('key', 1, 3); // int(-1)
     * $redisCluster->bitpos('key', 0); // int(16)
     * $redisCluster->bitpos('key', 0, 1); // int(16)
     * $redisCluster->bitpos('key', 0, 1, 5); // int(-1)
     * </pre>
     */
    bitpos(key:any,bit:any,start:any = 0,end:any = null)
    /**
     * Count bits in a string.
     *
     * @param   string $key
     *
     * @return  int     The number of bits set to 1 in the value behind the input key.
     * @link    https://redis.io/commands/bitcount
     * @example
     * <pre>
     * $redisCluster->set('bit', '345'); // // 11 0011  0011 0100  0011 0101
     * var_dump(redisCluster:any->bitCount('bit', 0, 0) ); // int(4)
     * var_dump(redisCluster:any->bitCount('bit', 1, 1) ); // int(3)
     * var_dump(redisCluster:any->bitCount('bit', 2, 2) ); // int(4)
     * var_dump(redisCluster:any->bitCount('bit', 0, 2) ); // int(11)
     * </pre>
     */
    bitCount(key:any)
    /**
     * @see     lIndex()
     *
     * @param   string $key
     * @param   int    $index
     *
     * @link    https://redis.io/commands/lindex
     */
    lGet(key:any,index:any)
    /**
     * Return a substring of a larger string
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     *
     * @return  string the substring
     * @link    https://redis.io/commands/getrange
     * @example
     * <pre>
     * $redisCluster->set('key', 'string value');
     * $redisCluster->getRange('key', 0, 5);   // 'string'
     * $redisCluster->getRange('key', -5, -1); // 'value'
     * </pre>
     */
    getRange(key:any,start:any,end:any)
    /**
     * Trims an existing list so that it will contain only a specified range of elements.
     *
     * @param string $key
     * @param int    $start
     * @param int    $stop
     *
     * @return array|false    Bool return FALSE if the key identify a non-list value.
     * @link        https://redis.io/commands/ltrim
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');
     * $redisCluster->lRange('key1', 0, -1); // array('A', 'B', 'C')
     * $redisCluster->lTrim('key1', 0, 1);
     * $redisCluster->lRange('key1', 0, -1); // array('A', 'B')
     * </pre>
     */
    lTrim(key:any,start:any,stop:any)
    /**
     * Returns the specified elements of the list stored at the specified key in
     * the range [start, end]. start and stop are interpretated as indices: 0 the first element,
     * 1 the second ... -1 the last element, -2 the penultimate ...
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     *
     * @return  array containing the values in specified range.
     * @link    https://redis.io/commands/lrange
     * @example
     * <pre>
     * $redisCluster->rPush('key1', 'A');
     * $redisCluster->rPush('key1', 'B');
     * $redisCluster->rPush('key1', 'C');
     * $redisCluster->lRange('key1', 0, -1); // array('A', 'B', 'C')
     * </pre>
     */
    lRange(key:any,start:any,end:any)
    /**
     * Deletes the elements of the sorted set stored at the specified key which have rank in the range [start,end].
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     *
     * @return  int     The number of values deleted from the sorted set
     * @link    https://redis.io/commands/zremrangebyrank
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 1, 'one');
     * $redisCluster->zAdd('key', 2, 'two');
     * $redisCluster->zAdd('key', 3, 'three');
     * $redisCluster->zRemRangeByRank('key', 0, 1); // 2
     * $redisCluster->zRange('key', 0, -1, true); // array('three' => 3)
     * </pre>
     */
    zRemRangeByRank(key:any,start:any,end:any)
    /**
     * Publish messages to channels. Warning: this function will probably change in the future.
     *
     * @param   string $channel a channel to publish to
     * @param   string $message string
     *
     * @link    https://redis.io/commands/publish
     * @return  int Number of clients that received the message
     * @example $redisCluster->publish('chan-1', 'hello, world!'); // send message.
     */
    publish(channel:any,message:any)
    /**
     * Renames a key.
     *
     * @param   string $srcKey
     * @param   string $dstKey
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/rename
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $redisCluster->rename('x', 'y');
     * $redisCluster->get('y');   // → 42
     * $redisCluster->get('x');   // → `FALSE`
     * </pre>
     */
    rename(srcKey:any,dstKey:any)
    /**
     * Renames a key.
     *
     * Same as rename, but will not replace a key if the destination already exists.
     * This is the same behaviour as setNx.
     *
     * @param   string $srcKey
     * @param   string $dstKey
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/renamenx
     * @example
     * <pre>
     * $redisCluster->set('x', '42');
     * $redisCluster->renameNx('x', 'y');
     * $redisCluster->get('y');   // → 42
     * $redisCluster->get('x');   // → `FALSE`
     * </pre>
     */
    renameNx(srcKey:any,dstKey:any)
    /**
     * When called with a single key, returns the approximated cardinality computed by the HyperLogLog data
     * structure stored at the specified variable, which is 0 if the variable does not exist.
     *
     * @param   string|array $key
     *
     * @return  int
     * @link    https://redis.io/commands/pfcount
     * @example
     * <pre>
     * $redisCluster->pfAdd('key1', array('elem1', 'elem2'));
     * $redisCluster->pfAdd('key2', array('elem3', 'elem2'));
     * $redisCluster->pfCount('key1'); // int(2)
     * $redisCluster->pfCount(array('key1', 'key2')); // int(3)
     * </pre>
     */
    pfCount(key:any)
    /**
     * Adds all the element arguments to the HyperLogLog data structure stored at the key.
     *
     * @param   string $key
     * @param   array  $elements
     *
     * @return  bool
     * @link    https://redis.io/commands/pfadd
     * @example $redisCluster->pfAdd('key', array('elem1', 'elem2'))
     */
    pfAdd(key:any,elements:array)
    /**
     * Merge multiple HyperLogLog values into an unique value that will approximate the cardinality
     * of the union of the observed Sets of the source HyperLogLog structures.
     *
     * @param   string $destKey
     * @param   array  $sourceKeys
     *
     * @return  bool
     * @link    https://redis.io/commands/pfmerge
     * @example
     * <pre>
     * $redisCluster->pfAdd('key1', array('elem1', 'elem2'));
     * $redisCluster->pfAdd('key2', array('elem3', 'elem2'));
     * $redisCluster->pfMerge('key3', array('key1', 'key2'));
     * $redisCluster->pfCount('key3'); // int(3)
     * </pre>
     */
    pfMerge(destKey:any,sourceKeys:array)
    /**
     * Changes a substring of a larger string.
     *
     * @param   string $key
     * @param   int    $offset
     * @param   string $value
     *
     * @return  string the length of the string after it was modified.
     * @link    https://redis.io/commands/setrange
     * @example
     * <pre>
     * $redisCluster->set('key', 'Hello world');
     * $redisCluster->setRange('key', 6, "redis"); // returns 11
     * $redisCluster->get('key');                  // "Hello redis"
     * </pre>
     */
    setRange(key:any,offset:any,value:any)
    /**
     * Restore a key from the result of a DUMP operation.
     *
     * @param   string $key   The key name
     * @param   int    $ttl   How long the key should live (if zero, no expire will be set on the key)
     * @param   string $value (binary).  The Redis encoded key value (from DUMP)
     *
     * @return  bool
     * @link    https://redis.io/commands/restore
     * @example
     * <pre>
     * $redisCluster->set('foo', 'bar');
     * $val = $redisCluster->dump('foo');
     * $redisCluster->restore('bar', 0,val:any); // The key 'bar', will now be equal to the key 'foo'
     * </pre>
     */
    restore(key:any,ttl:any,value:any)
    /**
     * Moves the specified member from the set at srcKey to the set at dstKey.
     *
     * @param   string $srcKey
     * @param   string $dstKey
     * @param   string $member
     *
     * @return  bool    If the operation is successful, return TRUE.
     * If the srcKey and/or dstKey didn't exist, and/or the member didn't exist in srcKey, FALSE is returned.
     * @link    https://redis.io/commands/smove
     * @example
     * <pre>
     * $redisCluster->sAdd('key1' , 'set11');
     * $redisCluster->sAdd('key1' , 'set12');
     * $redisCluster->sAdd('key1' , 'set13');          // 'key1' => {'set11', 'set12', 'set13'}
     * $redisCluster->sAdd('key2' , 'set21');
     * $redisCluster->sAdd('key2' , 'set22');          // 'key2' => {'set21', 'set22'}
     * $redisCluster->sMove('key1', 'key2', 'set13');  // 'key1' =>  {'set11', 'set12'}
     *                                          // 'key2' =>  {'set21', 'set22', 'set13'}
     * </pre>
     */
    sMove(srcKey:any,dstKey:any,member:any)
    /**
     * Returns a range of elements from the ordered set stored at the specified key,
     * with values in the range [start, end]. start and stop are interpreted as zero-based indices:
     * 0 the first element,
     * 1 the second ...
     * -1 the last element,
     * -2 the penultimate ...
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     * @param   bool   $withscores
     *
     * @return  array   Array containing the values in specified range.
     * @link    https://redis.io/commands/zrange
     * @example
     * <pre>
     * $redisCluster->zAdd('key1', 0, 'val0');
     * $redisCluster->zAdd('key1', 2, 'val2');
     * $redisCluster->zAdd('key1', 10, 'val10');
     * $redisCluster->zRange('key1', 0, -1); // array('val0', 'val2', 'val10')
     * // with scores
     * $redisCluster->zRange('key1', 0, -1, true); // array('val0' => 0, 'val2' => 2, 'val10' => 10)
     * </pre>
     */
    zRange(key:any,start:any,end:any,withscores:any = null)
    /**
     * Returns the elements of the sorted set stored at the specified key in the range [start, end]
     * in reverse order. start and stop are interpretated as zero-based indices:
     * 0 the first element,
     * 1 the second ...
     * -1 the last element,
     * -2 the penultimate ...
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     * @param   bool   $withscore
     *
     * @return  array   Array containing the values in specified range.
     * @link    https://redis.io/commands/zrevrange
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 0, 'val0');
     * $redisCluster->zAdd('key', 2, 'val2');
     * $redisCluster->zAdd('key', 10, 'val10');
     * $redisCluster->zRevRange('key', 0, -1); // array('val10', 'val2', 'val0')
     *
     * // with scores
     * $redisCluster->zRevRange('key', 0, -1, true); // array('val10' => 10, 'val2' => 2, 'val0' => 0)
     * </pre>
     */
    zRevRange(key:any,start:any,end:any,withscore:any = null)
    /**
     * Returns the elements of the sorted set stored at the specified key which have scores in the
     * range [start,end]. Adding a parenthesis before start or end excludes it from the range.
     * +inf and -inf are also valid limits.
     *
     * zRevRangeByScore returns the same items in reverse order, when the start and end parameters are swapped.
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     * @param   array  $options Two options are available:
     *                          - withscores => TRUE,
     *                          - and limit => array(offset:any,count:any)
     *
     * @return  array   Array containing the values in specified range.
     * @link    https://redis.io/commands/zrangebyscore
     * @example
     * <pre>
     * $redisCluster->zAdd('key', 0, 'val0');
     * $redisCluster->zAdd('key', 2, 'val2');
     * $redisCluster->zAdd('key', 10, 'val10');
     * $redisCluster->zRangeByScore('key', 0, 3);
     * // array('val0', 'val2')
     * $redisCluster->zRangeByScore('key', 0, 3, array('withscores' => TRUE);
     * // array('val0' => 0, 'val2' => 2)
     * $redisCluster->zRangeByScore('key', 0, 3, array('limit' => array(1, 1));
     * // array('val2' => 2)
     * $redisCluster->zRangeByScore('key', 0, 3, array('limit' => array(1, 1));
     * // array('val2')
     * $redisCluster->zRangeByScore('key', 0, 3, array('withscores' => TRUE, 'limit' => array(1, 1));
     * // array('val2'=> 2)
     * </pre>
     */
    zRangeByScore(key:any,start:any,end:any,options:array = [])
    /**
     * @see zRangeByScore()
     *
     * @param   string $key
     * @param   int    $start
     * @param   int    $end
     * @param   array  $options
     *
     * @return    array
     */
    zRevRangeByScore(key:any,start:any,end:any,options:array = [])
    /**
     * Returns a range of members in a sorted set, by lexicographical range
     *
     * @param   string $key    The ZSET you wish to run against.
     * @param   int    $min    The minimum alphanumeric value you wish to get.
     * @param   int    $max    The maximum alphanumeric value you wish to get.
     * @param   int    $offset Optional argument if you wish to start somewhere other than the first element.
     * @param   int    $limit  Optional argument if you wish to limit the number of elements returned.
     *
     * @return  array   Array containing the values in the specified range.
     * @link    https://redis.io/commands/zrangebylex
     * @example
     * <pre>
     * foreach (array('a', 'b', 'c', 'd', 'e', 'f', 'g') as $k => $char) {
     *     $redisCluster->zAdd('key',k:any,char:any);
     * }
     *
     * $redisCluster->zRangeByLex('key', '-', '[c'); // array('a', 'b', 'c')
     * $redisCluster->zRangeByLex('key', '-', '(c'); // array('a', 'b')
     * $redisCluster->zRevRangeByLex('key', '(c','-'); // array('b', 'a')
     * </pre>
     */
    zRangeByLex(key:any,min:any,max:any,offset:any = null,limit:any = null)
    /**
     * @see     zRangeByLex()
     *
     * @param   string $key
     * @param   int    $min
     * @param   int    $max
     * @param   int    $offset
     * @param   int    $limit
     *
     * @return  array
     * @link    https://redis.io/commands/zrevrangebylex
     */
    zRevRangeByLex(key:any,min:any,max:any,offset:any = null,limit:any = null)
    /**
     * Count the number of members in a sorted set between a given lexicographical range.
     *
     * @param   string $key
     * @param   int    $min
     * @param   int    $max
     *
     * @return  int The number of elements in the specified score range.
     * @link    https://redis.io/commands/zlexcount
     * @example
     * <pre>
     * foreach (array('a', 'b', 'c', 'd', 'e', 'f', 'g') as $k => $char) {
     *     $redisCluster->zAdd('key',k:any,char:any);
     * }
     * $redisCluster->zLexCount('key', '[b', '[f'); // 5
     * </pre>
     */
    zLexCount(key:any,min:any,max:any)
    /**
     * Remove all members in a sorted set between the given lexicographical range.
     *
     * @param   string $key The ZSET you wish to run against.
     * @param   int    $min The minimum alphanumeric value you wish to get.
     * @param   int    $max The maximum alphanumeric value you wish to get.
     *
     * @return  array    the number of elements removed.
     * @link    https://redis.io/commands/zremrangebylex
     * @example
     * <pre>
     * foreach (array('a', 'b', 'c', 'd', 'e', 'f', 'g') as $k => $char) {
     *     $redisCluster->zAdd('key',k:any,char:any);
     * }
     * $redisCluster->zRemRangeByLex('key', '(b','[d'); // 2 , remove element 'c' and 'd'
     * $redisCluster->zRange('key',0,-1);// array('a','b','e','f','g')
     * </pre>
     */
    zRemRangeByLex(key:any,min:any,max:any)
    /**
     * Add multiple sorted sets and store the resulting sorted set in a new key
     *
     * @param string $Output
     * @param array  $ZSetKeys
     * @param null|array $Weights
     * @param string $aggregateFunction Either "SUM", "MIN", or "MAX": defines the behaviour to use on
     *                                  duplicate entries during the zUnion.
     *
     * @return int The number of values in the new sorted set.
     * @link    https://redis.io/commands/zunionstore
     * @example
     * <pre>
     * $redisCluster->del('k1');
     * $redisCluster->del('k2');
     * $redisCluster->del('k3');
     * $redisCluster->del('ko1');
     * $redisCluster->del('ko2');
     * $redisCluster->del('ko3');
     *
     * $redisCluster->zAdd('k1', 0, 'val0');
     * $redisCluster->zAdd('k1', 1, 'val1');
     *
     * $redisCluster->zAdd('k2', 2, 'val2');
     * $redisCluster->zAdd('k2', 3, 'val3');
     *
     * $redisCluster->zUnionStore('ko1', array('k1', 'k2')); // 4, 'ko1' => array('val0', 'val1', 'val2', 'val3')
     *
     * // Weighted zUnionStore
     * $redisCluster->zUnionStore('ko2', array('k1', 'k2'), array(1, 1)); // 4, 'ko2' => array('val0', 'val1', 'val2','val3')
     * $redisCluster->zUnionStore('ko3', array('k1', 'k2'), array(5, 1)); // 4, 'ko3' => array('val0', 'val2', 'val3','val1')
     * </pre>
     */
    zUnionStore(Output:any,ZSetKeys:any,Weights?:array = null,aggregateFunction:any = 'SUM')
    /**
     * Intersect multiple sorted sets and store the resulting sorted set in a new key
     *
     * @param   string $Output
     * @param   array  $ZSetKeys
     * @param   null|array $Weights
     * @param   string $aggregateFunction Either "SUM", "MIN", or "MAX":
     *                                    defines the behaviour to use on duplicate entries during the zInterStore.
     *
     * @return  int     The number of values in the new sorted set.
     * @link    https://redis.io/commands/zinterstore
     * @example
     * <pre>
     * $redisCluster->del('k1');
     * $redisCluster->del('k2');
     * $redisCluster->del('k3');
     *
     * $redisCluster->del('ko1');
     * $redisCluster->del('ko2');
     * $redisCluster->del('ko3');
     * $redisCluster->del('ko4');
     *
     * $redisCluster->zAdd('k1', 0, 'val0');
     * $redisCluster->zAdd('k1', 1, 'val1');
     * $redisCluster->zAdd('k1', 3, 'val3');
     *
     * $redisCluster->zAdd('k2', 2, 'val1');
     * $redisCluster->zAdd('k2', 3, 'val3');
     *
     * $redisCluster->zInterStore('ko1', array('k1', 'k2'));               // 2, 'ko1' => array('val1', 'val3')
     * $redisCluster->zInterStore('ko2', array('k1', 'k2'), array(1, 1));  // 2, 'ko2' => array('val1', 'val3')
     *
     * // Weighted zInterStore
     * $redisCluster->zInterStore('ko3', array('k1', 'k2'), array(1, 5), 'min'); // 2, 'ko3' => array('val1', 'val3')
     * $redisCluster->zInterStore('ko4', array('k1', 'k2'), array(1, 5), 'max'); // 2, 'ko4' => array('val3', 'val1')
     * </pre>
     */
    zInterStore(Output:any,ZSetKeys:any,Weights:array = null,aggregateFunction:any = 'SUM')
    /**
     * Deletes a specified member from the ordered set.
     *
     * @param   string $key
     * @param   string $member1
     * @param   string $member2
     * @param   string $memberN
     *
     * @return  int     Number of deleted values
     * @link    https://redis.io/commands/zrem
     * @example
     * <pre>
     * $redisCluster->zAdd('z', 1, 'v1', 2, 'v2', 3, 'v3', 4, 'v4' );  // int(2)
     * $redisCluster->zRem('z', 'v2', 'v3');                           // int(2)
     * var_dump(redisCluster:any->zRange('z', 0, -1) );
     * //// Output:
     * //
     * // array(2) {
     * //   [0]=> string(2) "v1"
     * //   [1]=> string(2) "v4"
     * // }
     * </pre>
     */
    zRem(key:any,member1:any,member2:any = null,memberN:any = null)
    /**
     * Sort
     *
     * @param   string $key
     * @param   array  $option array(key => value, ...) - optional, with the following keys and values:
     *                         - 'by' => 'some_pattern_*',
     *                         - 'limit' => array(0, 1),
     *                         - 'get' => 'some_other_pattern_*' or an array of patterns,
     *                         - 'sort' => 'asc' or 'desc',
     *                         - 'alpha' => TRUE,
     *                         - 'store' => 'external-key'
     *
     * @return  array
     * An array of values, or a number corresponding to the number of elements stored if that was used.
     * @link    https://redis.io/commands/sort
     * @example
     * <pre>
     * $redisCluster->del('s');
     * $redisCluster->sadd('s', 5);
     * $redisCluster->sadd('s', 4);
     * $redisCluster->sadd('s', 2);
     * $redisCluster->sadd('s', 1);
     * $redisCluster->sadd('s', 3);
     *
     * var_dump(redisCluster:any->sort('s')); // 1,2,3,4,5
     * var_dump(redisCluster:any->sort('s', array('sort' => 'desc'))); // 5,4,3,2,1
     * var_dump(redisCluster:any->sort('s', array('sort' => 'desc', 'store' => 'out'))); // (int)5
     * </pre>
     */
    sort(key:any,option:any = null)
    /**
     * Describes the object pointed to by a key.
     * The information to retrieve (string) and the key (string).
     * Info can be one of the following:
     * - "encoding"
     * - "refcount"
     * - "idletime"
     *
     * @param   string $string
     * @param   string $key
     *
     * @return  string|false  for "encoding", int for "refcount" and "idletime", FALSE if the key doesn't exist.
     * @link    https://redis.io/commands/object
     * @example
     * <pre>
     * $redisCluster->object("encoding", "l"); // → ziplist
     * $redisCluster->object("refcount", "l"); // → 1
     * $redisCluster->object("idletime", "l"); // → 400 (in seconds, with a precision of 10 seconds).
     * </pre>
     */
    object(string:any = '',key:any = '')
    /**
     * Subscribe to channels. Warning: this function will probably change in the future.
     *
     * @param array        $channels an array of channels to subscribe to
     * @param string|array $callback either a string or an array(instance:any, 'method_name').
     *                                 The callback function receives 3 parameters: the redis instance, the channel
     *                                 name, and the message.
     *
     * @return mixed            Any non-null return value in the callback will be returned to the caller.
     * @link    https://redis.io/commands/subscribe
     * @example
     * <pre>
     * function f(redisCluster:any,chan:any,msg:any) {
     *  switch(chan:any) {
     *      case 'chan-1':
     *          ...
     *          break;
     *
     *      case 'chan-2':
     *                     ...
     *          break;
     *
     *      case 'chan-2':
     *          ...
     *          break;
     *      }
     * }
     *
     * $redisCluster->subscribe(array('chan-1', 'chan-2', 'chan-3'), 'f'); // subscribe to 3 chans
     * </pre>
     */
    subscribe(channels:any,callback:any)
    /**
     * Subscribe to channels by pattern
     *
     * @param   array        $patterns     The number of elements removed from the set.
     * @param   string|array $callback     Either a string or an array with an object and method.
     *                                       The callback will get four arguments (redis:any,pattern:any,channel:any,message:any)
     *
     * @return  mixed           Any non-null return value in the callback will be returned to the caller.
     *
     * @link    https://redis.io/commands/psubscribe
     * @example
     * <pre>
     * function psubscribe(redisCluster:any,pattern:any,chan:any,msg:any) {
     *  echo "Pattern: $pattern\n";
     *  echo "Channel: $chan\n";
     *  echo "Payload: $msg\n";
     * }
     * </pre>
     */
    psubscribe(patterns:any,callback:any)
    /**
     * Unsubscribes the client from the given channels, or from all of them if none is given.
     *
     * @param $channels
     * @param $callback
     */
    unSubscribe(channels:any,callback:any)
    /**
     * Unsubscribes the client from the given patterns, or from all of them if none is given.
     *
     * @param $channels
     * @param $callback
     */
    punSubscribe(channels:any,callback:any)
    /**
     * Evaluate a LUA script serverside, from the SHA1 hash of the script instead of the script itself.
     * In order to run this command Redis will have to have already loaded the script, either by running it or via
     * the SCRIPT LOAD command.
     *
     * @param   string $scriptSha
     * @param   array  $args
     * @param   int    $numKeys
     *
     * @return  mixed   @see eval()
     * @see     eval()
     * @link    https://redis.io/commands/evalsha
     * @example
     * <pre>
     * $script = 'return 1';
     * $sha = $redisCluster->script('load',script:any);
     * $redisCluster->evalSha(sha:any); // Returns 1
     * </pre>
     */
    evalSha(scriptSha:any,args:any = array(),numKeys:any = 0)
    /**
     * Scan the keyspace for keys.
     *
     * @param  int          &$iterator Iterator, initialized to NULL.
     * @param  string|array $node      Node identified by key or host/port array
     * @param  string       $pattern   Pattern to match.
     * @param  int          $count     Count of keys per iteration (only a suggestion to Redis).
     *
     * @return array|false             This function will return an array of keys or FALSE if there are no more keys.
     * @link   https://redis.io/commands/scan
     * @example
     * <pre>
     * $iterator = null;
     * while(keys:any = $redisCluster->scan(iterator:any)) {
     *     foreach(keys:any as $key) {
     *         echo $key . PHP_EOL;
     *     }
     * }
     * </pre>
     */
    scan(iterator:RMD<any>,node:any,pattern:any = null,count:any = 0)
    /**
     * Scan a set for members.
     *
     * @param   string $key      The set to search.
     * @param   int    &$iterator LONG (reference) to the iterator as we go.
     * @param   null   $pattern  String, optional pattern to match against.
     * @param   int    $count    How many members to return at a time (Redis might return a different amount).
     *
     * @return  array|false   PHPRedis will return an array of keys or FALSE when we're done iterating.
     * @link    https://redis.io/commands/sscan
     * @example
     * <pre>
     * $iterator = null;
     * while (members:any = $redisCluster->sScan('set',iterator:any)) {
     *     foreach (members:any as $member) {
     *         echo $member . PHP_EOL;
     *     }
     * }
     * </pre>
     */
    sScan(key:any,iterator:RMD<any>,pattern:any = null,count:any = 0)
    /**
     * Scan a sorted set for members, with optional pattern and count.
     *
     * @param   string $key      String, the set to scan.
     * @param   int    &$iterator Long (reference), initialized to NULL.
     * @param   string $pattern  String (optional), the pattern to match.
     * @param   int    $count    How many keys to return per iteration (Redis might return a different number).
     *
     * @return  array|false   PHPRedis will return matching keys from Redis, or FALSE when iteration is complete.
     * @link    https://redis.io/commands/zscan
     * @example
     * <pre>
     * $iterator = null;
     * while (members:any = $redis-zscan('zset',iterator:any)) {
     *     foreach (members:any as $member => $score) {
     *         echo $member . ' => ' . $score . PHP_EOL;
     *     }
     * }
     * </pre>
     */
    zScan(key:any,iterator:RMD<any>,pattern:any = null,count:any = 0)
    /**
     * Scan a HASH value for members, with an optional pattern and count.
     *
     * @param   string $key
     * @param   int    &$iterator
     * @param   string $pattern Optional pattern to match against.
     * @param   int    $count   How many keys to return in a go (only a sugestion to Redis).
     *
     * @return  array     An array of members that match our pattern.
     * @link    https://redis.io/commands/hscan
     * @example
     * <pre>
     * $iterator = null;
     * while(elements:any = $redisCluster->hscan('hash',iterator:any)) {
     *    foreach(elements:any as $key => $value) {
     *         echo $key . ' => ' . $value . PHP_EOL;
     *     }
     * }
     * </pre>
     */
    hScan(key:any,iterator:RMD<any>,pattern:any = null,count:any = 0)
    /**
     * Detect whether we're in ATOMIC/MULTI/PIPELINE mode.
     *
     * @return  int     Either RedisCluster::ATOMIC, RedisCluster::MULTI or RedisCluster::PIPELINE
     * @example $redisCluster->getMode();
     */
    getMode()
    /**
     * The last error message (if any)
     *
     * @return  string|null  A string with the last returned script based error message, or NULL if there is no error
     * @example
     * <pre>
     * $redisCluster->eval('this-is-not-lua');
     * $err = $redisCluster->getLastError();
     * // "ERR Error compiling script (new function): user_script:1: '=' expected near '-'"
     * </pre>
     */
    getLastError()
    /**
     * Clear the last error message
     *
     * @return bool true
     * @example
     * <pre>
     * $redisCluster->set('x', 'a');
     * $redisCluster->incr('x');
     * $err = $redisCluster->getLastError();
     * // "ERR value is not an integer or out of range"
     * $redisCluster->clearLastError();
     * $err = $redisCluster->getLastError();
     * // NULL
     * </pre>
     */
    clearLastError()
    /**
     * Get client option
     *
     * @param   string $name parameter name
     *
     * @return  int     Parameter value.
     * @example
     * // return RedisCluster::SERIALIZER_NONE, RedisCluster::SERIALIZER_PHP, or RedisCluster::SERIALIZER_IGBINARY.
     * $redisCluster->getOption(RedisCluster::OPT_SERIALIZER);
     */
    getOption(name:any)
    /**
     * Set client option.
     *
     * @param   string $name  parameter name
     * @param   string $value parameter value
     *
     * @return  bool   TRUE on success, FALSE on error.
     * @example
     * <pre>
     * $redisCluster->setOption(RedisCluster::OPT_SERIALIZER, RedisCluster::SERIALIZER_NONE);        // don't serialize data
     * $redisCluster->setOption(RedisCluster::OPT_SERIALIZER, RedisCluster::SERIALIZER_PHP);         // use built-in serialize/unserialize
     * $redisCluster->setOption(RedisCluster::OPT_SERIALIZER, RedisCluster::SERIALIZER_IGBINARY);    // use igBinary serialize/unserialize
     * $redisCluster->setOption(RedisCluster::OPT_PREFIX, 'myAppName:');                             // use custom prefix on all keys
     * </pre>
     */
    setOption(name:any,value:any)
    /**
     * A utility method to prefix the value with the prefix setting for phpredis.
     *
     * @param   mixed $value The value you wish to prefix
     *
     * @return  string  If a prefix is set up, the value now prefixed.  If there is no prefix, the value will be returned unchanged.
     * @example
     * <pre>
     * $redisCluster->setOption(RedisCluster::OPT_PREFIX, 'my-prefix:');
     * $redisCluster->_prefix('my-value'); // Will return 'my-prefix:my-value'
     * </pre>
     */
    _prefix(value:any)
    /**
     * A utility method to serialize values manually. This method allows you to serialize a value with whatever
     * serializer is configured, manually. This can be useful for serialization/unserialization of data going in
     * and out of EVAL commands as phpredis can't automatically do this itself.  Note that if no serializer is
     * set, phpredis will change Array values to 'Array', and Objects to 'Object'.
     *
     * @param   mixed $value The value to be serialized.
     *
     * @return  mixed
     * @example
     * <pre>
     * $redisCluster->setOption(RedisCluster::OPT_SERIALIZER, RedisCluster::SERIALIZER_NONE);
     * $redisCluster->_serialize("foo"); // returns "foo"
     * $redisCluster->_serialize(Array()); // Returns "Array"
     * $redisCluster->_serialize(new stdClass()); // Returns "Object"
     *
     * $redisCluster->setOption(RedisCluster::OPT_SERIALIZER, RedisCluster::SERIALIZER_PHP);
     * $redisCluster->_serialize("foo"); // Returns 's:3:"foo";'
     * </pre>
     */
    _serialize(value:any)
    /**
     * A utility method to unserialize data with whatever serializer is set up.  If there is no serializer set, the
     * value will be returned unchanged.  If there is a serializer set up, and the data passed in is malformed, an
     * exception will be thrown. This can be useful if phpredis is serializing values, and you return something from
     * redis in a LUA script that is serialized.
     *
     * @param   string $value The value to be unserialized
     *
     * @return mixed
     * @example
     * <pre>
     * $redisCluster->setOption(RedisCluster::OPT_SERIALIZER, RedisCluster::SERIALIZER_PHP);
     * $redisCluster->_unserialize('a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}'); // Will return Array(1,2,3)
     * </pre>
     */
    _unserialize(value:any)
    /**
     * Return all redis master nodes
     *
     * @return array
     * @example
     * <pre>
     * $redisCluster->_masters(); // Will return [[0=>'127.0.0.1','6379'],[0=>'127.0.0.1','6380']]
     * </pre>
     */
    _masters()
    /**
     * Enter and exit transactional mode.
     *
     * @param int $mode RedisCluster::MULTI|RedisCluster::PIPELINE
     *            Defaults to RedisCluster::MULTI.
     *            A RedisCluster::MULTI block of commands runs as a single transaction;
     *            a RedisCluster::PIPELINE block is simply transmitted faster to the server, but without any guarantee
     *            of atomicity. discard cancels a transaction.
     *
     * @return Redis returns the Redis instance and enters multi-mode.
     * Once in multi-mode, all subsequent method calls return the same object until exec() is called.
     * @link    https://redis.io/commands/multi
     * @example
     * <pre>
     * $ret = $redisCluster->multi()
     *      ->set('key1', 'val1')
     *      ->get('key1')
     *      ->set('key2', 'val2')
     *      ->get('key2')
     *      ->exec();
     *
     * //$ret == array (
     * //    0 => TRUE,
     * //    1 => 'val1',
     * //    2 => TRUE,
     * //    3 => 'val2');
     * </pre>
     */
    multi(mode?:any)
    /**
     * @see     multi()
     * @return void|array
     * @link    https://redis.io/commands/exec
     */
    exec()
    /**
     * @see     multi()
     * @link    https://redis.io/commands/discard
     */
    discard()
    /**
     * Watches a key for modifications by another client. If the key is modified between WATCH and EXEC,
     * the MULTI/EXEC transaction will fail (return FALSE). unwatch cancels all the watching of all keys by this client.
     *
     * @param string|array $key : a list of keys
     *
     * @return void
     * @link    https://redis.io/commands/watch
     * @example
     * <pre>
     * $redisCluster->watch('x');
     * // long code here during the execution of which other clients could well modify `x`
     * $ret = $redisCluster->multi()
     *          ->incr('x')
     *          ->exec();
     * // $ret = FALSE if x has been modified between the call to WATCH and the call to EXEC.
     * </pre>
     */
    watch(key:any)
    /**
     * @see     watch()
     * @link    https://redis.io/commands/unwatch
     */
    unwatch()
    /**
     * Performs a synchronous save at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * If a save is already running, this command will fail and return FALSE.
     * @link    https://redis.io/commands/save
     * @example
     * $redisCluster->save('x'); //key
     * $redisCluster->save(['127.0.0.1',6379]); //[host,port]
     */
    save(nodeParams:any)
    /**
     * Performs a background save at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  bool    TRUE in case of success, FALSE in case of failure.
     * If a save is already running, this command will fail and return FALSE.
     * @link    https://redis.io/commands/bgsave
     */
    bgsave(nodeParams:any)
    /**
     * Removes all entries from the current database at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  bool Always TRUE.
     * @link    https://redis.io/commands/flushdb
     */
    flushDB(nodeParams:any)
    /**
     * Removes all entries from all databases at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  bool Always TRUE.
     * @link    https://redis.io/commands/flushall
     */
    flushAll(nodeParams:any)
    /**
     * Returns the current database's size at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return int     DB size, in number of keys.
     * @link    https://redis.io/commands/dbsize
     * @example
     * <pre>
     * $count = $redisCluster->dbSize('x');
     * echo "Redis has $count keys\n";
     * </pre>
     */
    dbSize(nodeParams:any)
    /**
     * Starts the background rewrite of AOF (Append-Only File) at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  bool   TRUE in case of success, FALSE in case of failure.
     * @link    https://redis.io/commands/bgrewriteaof
     * @example $redisCluster->bgrewriteaof('x');
     */
    bgrewriteaof(nodeParams:any)
    /**
     * Returns the timestamp of the last disk save at a specific node.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  int    timestamp.
     * @link    https://redis.io/commands/lastsave
     * @example $redisCluster->lastSave('x');
     */
    lastSave(nodeParams:any)
    /**
     * Returns an associative array of strings and integers
     *
     * @param   string $option Optional. The option to provide redis.
     *                         SERVER | CLIENTS | MEMORY | PERSISTENCE | STATS | REPLICATION | CPU | CLASTER | KEYSPACE
     *                         | COMANDSTATS
     *
     * Returns an associative array of strings and integers, with the following keys:
     * - redis_version
     * - redis_git_sha1
     * - redis_git_dirty
     * - redis_build_id
     * - redis_mode
     * - os
     * - arch_bits
     * - multiplexing_api
     * - atomicvar_api
     * - gcc_version
     * - process_id
     * - run_id
     * - tcp_port
     * - uptime_in_seconds
     * - uptime_in_days
     * - hz
     * - lru_clock
     * - executable
     * - config_file
     * - connected_clients
     * - client_longest_output_list
     * - client_biggest_input_buf
     * - blocked_clients
     * - used_memory
     * - used_memory_human
     * - used_memory_rss
     * - used_memory_rss_human
     * - used_memory_peak
     * - used_memory_peak_human
     * - used_memory_peak_perc
     * - used_memory_peak
     * - used_memory_overhead
     * - used_memory_startup
     * - used_memory_dataset
     * - used_memory_dataset_perc
     * - total_system_memory
     * - total_system_memory_human
     * - used_memory_lua
     * - used_memory_lua_human
     * - maxmemory
     * - maxmemory_human
     * - maxmemory_policy
     * - mem_fragmentation_ratio
     * - mem_allocator
     * - active_defrag_running
     * - lazyfree_pending_objects
     * - mem_fragmentation_ratio
     * - loading
     * - rdb_changes_since_last_save
     * - rdb_bgsave_in_progress
     * - rdb_last_save_time
     * - rdb_last_bgsave_status
     * - rdb_last_bgsave_time_sec
     * - rdb_current_bgsave_time_sec
     * - rdb_last_cow_size
     * - aof_enabled
     * - aof_rewrite_in_progress
     * - aof_rewrite_scheduled
     * - aof_last_rewrite_time_sec
     * - aof_current_rewrite_time_sec
     * - aof_last_bgrewrite_status
     * - aof_last_write_status
     * - aof_last_cow_size
     * - changes_since_last_save
     * - aof_current_size
     * - aof_base_size
     * - aof_pending_rewrite
     * - aof_buffer_length
     * - aof_rewrite_buffer_length
     * - aof_pending_bio_fsync
     * - aof_delayed_fsync
     * - loading_start_time
     * - loading_total_bytes
     * - loading_loaded_bytes
     * - loading_loaded_perc
     * - loading_eta_seconds
     * - total_connections_received
     * - total_commands_processed
     * - instantaneous_ops_per_sec
     * - total_net_input_bytes
     * - total_net_output_bytes
     * - instantaneous_input_kbps
     * - instantaneous_output_kbps
     * - rejected_connections
     * - maxclients
     * - sync_full
     * - sync_partial_ok
     * - sync_partial_err
     * - expired_keys
     * - evicted_keys
     * - keyspace_hits
     * - keyspace_misses
     * - pubsub_channels
     * - pubsub_patterns
     * - latest_fork_usec
     * - migrate_cached_sockets
     * - slave_expires_tracked_keys
     * - active_defrag_hits
     * - active_defrag_misses
     * - active_defrag_key_hits
     * - active_defrag_key_misses
     * - role
     * - master_replid
     * - master_replid2
     * - master_repl_offset
     * - second_repl_offset
     * - repl_backlog_active
     * - repl_backlog_size
     * - repl_backlog_first_byte_offset
     * - repl_backlog_histlen
     * - master_host
     * - master_port
     * - master_link_status
     * - master_last_io_seconds_ago
     * - master_sync_in_progress
     * - slave_repl_offset
     * - slave_priority
     * - slave_read_only
     * - master_sync_left_bytes
     * - master_sync_last_io_seconds_ago
     * - master_link_down_since_seconds
     * - connected_slaves
     * - min-slaves-to-write
     * - min-replicas-to-write
     * - min_slaves_good_slaves
     * - used_cpu_sys
     * - used_cpu_user
     * - used_cpu_sys_children
     * - used_cpu_user_children
     * - cluster_enabled
     *
     * @link    https://redis.io/commands/info
     * @return  array
     * @example
     * <pre>
     * $redisCluster->info();
     *
     * or
     *
     * $redisCluster->info("COMMANDSTATS"); //Information on the commands that have been run (>=2.6 only)
     * $redisCluster->info("CPU"); // just CPU information from Redis INFO
     * </pre>
     */
    info(option:any = null)
    /**
     * @since  redis >= 2.8.12.
     *  Returns the role of the instance in the context of replication
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return array
     * @link   https://redis.io/commands/role
     * @example
     * <pre>
     * $redisCluster->role(['127.0.0.1',6379]);
     * // [ 0=>'master',1 => 3129659, 2 => [ ['127.0.0.1','9001','3129242'], ['127.0.0.1','9002','3129543'] ] ]
     * </pre>
     */
    role(nodeParams:any)
    /**
     * Returns a random key at the specified node
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return string an existing key in redis.
     * @link    https://redis.io/commands/randomkey
     * @example
     * <pre>
     * $key = $redisCluster->randomKey('x');
     * $surprise = $redisCluster->get(key:any);  // who knows what's in there.
     * </pre>
     */
    randomKey(nodeParams:any)
    /**
     * Return the specified node server time.
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  array If successfully, the time will come back as an associative array with element zero being the
     * unix timestamp, and element one being microseconds.
     * @link    https://redis.io/commands/time
     * @example
     * <pre>
     * var_dump(redisCluster:any->time('x') );
     * //// Output:
     * //
     * // array(2) {
     * //   [0] => string(10) "1342364352"
     * //   [1] => string(6) "253002"
     * // }
     * </pre>
     */
    time(nodeParams:any)
    /**
     * Check the specified node status
     *
     * @param string|array $nodeParams key or [host,port]
     *
     * @return  string STRING: +PONG on success. Throws a RedisException object on connectivity error, as described
     *                 above.
     * @link    https://redis.io/commands/ping
     */
    ping(nodeParams:any)
    /**
     * Returns message.
     *
     * @param string|array $nodeParams key or [host,port]
     * @param string        $msg
     *
     * @return mixed
     */
    echo (nodeParams:any,msg:any)
    /**
     * Returns Array reply of details about all Redis Cluster commands.
     *
     * @return mixed array | bool
     */
    command()
    /**
     * Send arbitrary things to the redis server at the specified node
     *
     * @param string|array $nodeParams key or [host,port]
     * @param string       $command    Required command to send to the server.
     * @param mixed        $arguments  Optional variable amount of arguments to send to the server.
     *
     * @return  mixed
     */
    rawCommand(nodeParams:any,command:any,args:any)
    /**
     * @since redis >= 3.0
     * Executes cluster command
     *
     * @param string|array $nodeParams key or [host,port]
     * @param string       $command    Required command to send to the server.
     * @param mixed        $arguments  Optional variable amount of arguments to send to the server.
     *
     * @return  mixed
     * @link  https://redis.io/commands#cluster
     * @example
     * <pre>
     * $redisCluster->cluster(['127.0.0.1',6379],'INFO');
     * </pre>
     */
    cluster(nodeParams:any,command:any,args:any)
    /**
     * Allows you to get information of the cluster client
     *
     * @param string|array $nodeParams key or [host,port]
     * @param string       $subCmd     can be: 'LIST', 'KILL', 'GETNAME', or 'SETNAME'
     * @param string       $args       optional arguments
     */
    client(nodeParams:any,subCmd:any,args:any)
    /**
     * Get or Set the redis config keys.
     *
     * @param string|array $nodeParams key or [host,port]
     * @param string       $operation  either `GET` or `SET`
     * @param string       $key        for `SET`, glob-pattern for `GET`. See https://redis.io/commands/config-get for examples.
     * @param string       $value      optional string (only for `SET`)
     *
     * @return  array   Associative array for `GET`, key -> value
     * @link    https://redis.io/commands/config-get
     * @link    https://redis.io/commands/config-set
     * @example
     * <pre>
     * $redisCluster->config(['127.0.0.1',6379], "GET", "*max-*-entries*");
     * $redisCluster->config(['127.0.0.1',6379], "SET", "dir", "/var/run/redis/dumps/");
     * </pre>
     */
    config(nodeParams:any,operation:any,key:any,value:any)
    /**
     * A command allowing you to get information on the Redis pub/sub system.
     *
     * @param    string|array $nodeParams key or [host,port]
     *
     * @param    string       $keyword    String, which can be: "channels", "numsub", or "numpat"
     * @param    string|array $argument   Optional, variant.
     *                                    For the "channels" subcommand, you can pass a string pattern.
     *                                    For "numsub" an array of channel names
     *
     * @return    array|int               Either an integer or an array.
     *                          - channels  Returns an array where the members are the matching channels.
     *                          - numsub    Returns a key/value array where the keys are channel names and
     *                                      values are their counts.
     *                          - numpat    Integer return containing the number active pattern subscriptions.
     * @link    https://redis.io/commands/pubsub
     * @example
     * <pre>
     * $redisCluster->pubsub(['127.0.0.1',6379], 'channels'); // All channels
     * $redisCluster->pubsub(['127.0.0.1',6379], 'channels', '*pattern*'); // Just channels matching your pattern
     * $redisCluster->pubsub(['127.0.0.1',6379], 'numsub', array('chan1', 'chan2')); // Get subscriber counts for
     * 'chan1' and 'chan2'
     * $redisCluster->pubsub(['127.0.0.1',6379], 'numpat'); // Get the number of pattern subscribers
     * </pre>
     */
    pubsub(nodeParams:any,keyword:any,argument:any)
    /**
     * Execute the Redis SCRIPT command to perform various operations on the scripting subsystem.
     *
     * @param   string|array $nodeParams key or [host,port]
     * @param   string       $command    load | flush | kill | exists
     * @param   string       $script
     *
     * @return  mixed
     * @link    https://redis.io/commands/script-load
     * @link    https://redis.io/commands/script-kill
     * @link    https://redis.io/commands/script-flush
     * @link    https://redis.io/commands/script-exists
     * @example
     * <pre>
     * $redisCluster->script(['127.0.0.1',6379], 'load',script:any);
     * $redisCluster->script(['127.0.0.1',6379], 'flush');
     * $redisCluster->script(['127.0.0.1',6379], 'kill');
     * $redisCluster->script(['127.0.0.1',6379], 'exists',script1:any, [$script2,script3:any, ...]);
     * </pre>
     *
     * SCRIPT LOAD will return the SHA1 hash of the passed script on success, and FALSE on failure.
     * SCRIPT FLUSH should always return TRUE
     * SCRIPT KILL will return true if a script was able to be killed and false if not
     * SCRIPT EXISTS will return an array with TRUE or FALSE for each passed script
     */
    script(nodeParams:any,command:any,script:any)
    /**
     * This function is used in order to read and reset the Redis slow queries log.
     *
     * @param   string|array $nodeParams key or [host,port]
     * @param   string       $command
     * @param   mixed        $argument
     *
     * @link  https://redis.io/commands/slowlog
     * @example
     * <pre>
     * $redisCluster->slowLog(['127.0.0.1',6379],'get','2');
     * </pre>
     */
    slowLog(nodeParams:any,command:any,argument:any)
    /**
     * Add one or more geospatial items in the geospatial index represented using a sorted set
     *
     * @param string $key
     * @param float  $longitude
     * @param float  $latitude
     * @param string $member
     *
     * @link  https://redis.io/commands/geoadd
     * @example
     * <pre>
     * $redisCluster->geoAdd('Sicily', 13.361389, 38.115556, 'Palermo'); // int(1)
     * $redisCluster->geoAdd('Sicily', 15.087269, 37.502669, "Catania"); // int(1)
     * </pre>
     */
    geoAdd(key:any,longitude:any,latitude:any,member:any)
    /**
     * Returns members of a geospatial index as standard geohash strings
     *
     * @param string $key
     * @param string $member1
     * @param string $member2
     * @param string $memberN
     *
     * @example
     * <pre>
     * $redisCluster->geoAdd('Sicily', 13.361389, 38.115556, 'Palermo'); // int(1)
     * $redisCluster->geoAdd('Sicily', 15.087269, 37.502669, "Catania"); // int(1)
     * $redisCluster->geohash('Sicily','Palermo','Catania');//['sqc8b49rny0','sqdtr74hyu0']
     * </pre>
     */
    geohash(key:any,member1:any,member2:any = null,memberN:any = null)
    /**
     * Returns longitude and latitude of members of a geospatial index
     *
     * @param string $key
     * @param string $member1
     * @param string $member2
     * @param string $memberN
     * @example
     * <pre>
     * $redisCluster->geoAdd('Sicily', 15.087269, 37.502669, "Catania"); // int(1)
     * $redisCluster->geopos('Sicily','Palermo');//[['13.36138933897018433','38.11555639549629859']]
     * </pre>
     */
    geopos(key:any,member1:any,member2:any = null,memberN:any = null)
    /**
     *
     * Returns the distance between two members of a geospatial index
     *
     * @param    string $key
     * @param    string $member1
     * @param    string $member2
     * @param    string $unit The unit must be one of the following, and defaults to meters:
     *                        m for meters.
     *                        km for kilometers.
     *                        mi for miles.
     *                        ft for feet.
     *
     * @link https://redis.io/commands/geoadd
     * @example
     * <pre>
     * $redisCluster->geoAdd('Sicily', 13.361389, 38.115556, 'Palermo'); // int(1)
     * $redisCluster->geoAdd('Sicily', 15.087269, 37.502669, "Catania"); // int(1)
     * $redisCluster->geoDist('Sicily', 'Palermo' ,'Catania'); // float(166274.1516)
     * $redisCluster->geoDist('Sicily', 'Palermo','Catania', 'km'); // float(166.2742)
     * </pre>
     */
    geoDist(key:any,member1:any,member2:any,unit:any = 'm')
    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point
     *
     * @param    string $key
     * @param    float  $longitude
     * @param    float  $latitude
     * @param    float  $radius
     * @param    string $radiusUnit String can be: "m" for meters; "km" for kilometers , "mi" for miles, or "ft" for feet.
     * @param    array  $options
     *
     * @link  https://redis.io/commands/georadius
     * @example
     * <pre>
     * $redisCluster->del('Sicily');
     * $redisCluster->geoAdd('Sicily', 12.361389, 35.115556, 'Palermo'); // int(1)
     * $redisCluster->geoAdd('Sicily', 15.087269, 37.502669, "Catania"); // int(1)
     * $redisCluster->geoAdd('Sicily', 13.3585, 35.330022, "Agrigento"); // int(1)
     *
     * var_dump(redisCluster:any->geoRadius('Sicily',13.3585, 35.330022, 300, 'km', ['WITHDIST' ,'DESC']) );
     *
     * array(3) {
     *    [0]=>
     *   array(2) {
     *        [0]=>
     *     string(7) "Catania"
     *        [1]=>
     *     string(8) "286.9362"
     *   }
     *   [1]=>
     *   array(2) {
     *        [0]=>
     *     string(7) "Palermo"
     *        [1]=>
     *     string(7) "93.6874"
     *   }
     *   [2]=>
     *   array(2) {
     *        [0]=>
     *     string(9) "Agrigento"
     *        [1]=>
     *     string(6) "0.0002"
     *   }
     * }
     * var_dump(redisCluster:any->geoRadiusByMember('Sicily','Agrigento', 100, 'km', ['WITHDIST' ,'DESC']) );
     *
     * * array(2) {
     *    [0]=>
     *   array(2) {
     *        [0]=>
     *     string(7) "Palermo"
     *        [1]=>
     *     string(7) "93.6872"
     *   }
     *   [1]=>
     *   array(2) {
     *        [0]=>
     *     string(9) "Agrigento"
     *        [1]=>
     *     string(6) "0.0000"
     *   }
     * }
     *
     * <pre>
     */
    geoRadius(key:any,longitude:any,latitude:any,radius:any,radiusUnit:any,options:array)
    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member
     *
     * @see geoRadius
     *
     * @param string $key
     * @param string $member
     * @param float  $radius
     * @param string $radiusUnit
     * @param array  $options
     */
    geoRadiusByMember(key:any,member:any,radius:any,radiusUnit:any,options:array)
}
class RedisClusterException extends Exception{}
