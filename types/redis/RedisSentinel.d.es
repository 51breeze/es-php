
/**
 * The MIT License (MIT)
 *
 * Copyright (c) Tawana Musewe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * <https://opensource.org/licenses/MIT>.
 */

/**
 * Helper autocomplete for phpredis extension
 *
 * @author  Tawana Musewe <tawana@aeonis.co.za>
 * @link    https://github.com/tbtmuse/phpredis-sentinel-phpdoc
 */
declare class RedisSentinel {
	/**
	 * Creates a Redis Sentinel
	 *
	 * @param string      $host          Sentinel IP address or hostname
	 * @param int         $port          Sentinel Port
	 * @param float       $timeout       Value in seconds (optional, default is 0 meaning unlimited)
	 * @param string|null $persistent    Persistent connection id (optional, default is null meaning not persistent)
	 * @param int         $retryInterval Value in milliseconds (optional, default is 0)
	 * @param float       $readTimeout   Value in seconds (optional, default is 0 meaning unlimited)
	 *
	 * @example
	 * // 1s timeout, 100ms delay between reconnection attempts.
	 * $sentinel = new RedisSentinel('127.0.0.1', 26379, 1, null, 100);
	 */
	constructor(host:string,port:int,timeout:float = 0.0,persistent?:string = null,retryInterval:int = 0,readTimeout:float = 0.0)
	__construct(host:string,port:int,timeout:float = 0.0,persistent?:string = null,retryInterval:int = 0,readTimeout:float = 0.0):this;
	/**
	 * Check if the current Sentinel configuration is able to reach the quorum needed to failover a master, and the
	 * majority needed to authorize the failover. This command should be used in monitoring systems to check if a
	 * Sentinel deployment is ok.
	 *
	 * @param string $master Name of master
	 *
	 * @return bool True in case of success, False in case of failure.
	 *
	 * @example $sentinel->ckquorum('mymaster');
	 *
	 * @since   >= 5.2.0
	 */
	ckquorum(master:string):boolean
	/**
	 * Force a failover as if the master was not reachable, and without asking for agreement to other Sentinels
	 * (however a new version of the configuration will be published so that the other Sentinels will update
	 * their configurations).
	 *
	 * @param string $master Name of master
	 *
	 * @return bool True in case of success, False in case of failure.
	 *
	 * @example $sentinel->failover('mymaster');
	 *
	 * @since   >= 5.2.0
	 */
	failover(master:string):boolean
	/**
	 * Force Sentinel to rewrite its configuration on disk, including the current Sentinel state.
	 *
	 * Normally Sentinel rewrites the configuration every time something changes in its state (in the context of the
	 * subset of the state which is persisted on disk across restart). However sometimes it is possible that the
	 * configuration file is lost because of operation errors, disk failures, package upgrade scripts or configuration
	 * managers. In those cases a way to to force Sentinel to rewrite the configuration file is handy.
	 *
	 * This command works even if the previous configuration file is completely missing.
	 *
	 * @return bool True in case of success, False in case of failure.
	 *
	 * @example $sentinel->flushconfig();
	 *
	 * @since   >= 5.2.0
	 */
	flushconfig():boolean
	/**
	 * Return the ip and port number of the master with that name. If a failover is in progress or terminated
	 * successfully for this master it returns the address and port of the promoted replica.
	 *
	 * @param string $master Name of master
	 *
	 * @return array|false ['address', 'port'] in case of success, False in case of failure.
	 *
	 * @example $sentinel->getMasterAddrByName('mymaster');
	 *
	 * @since   >= 5.2.0
	 */
	getMasterAddrByName(master:string)
	/**
	 * Return the state and info of the specified master
	 *
	 * @param string $master Name of master
	 *
	 * @return array|false Associative array with info in case of success, False in case of failure.
	 *
	 * @example $sentinel->master('mymaster');
	 *
	 * @since   >= 5.2.0
	 */
	master(master:string)
	/**
	 * Return a list of monitored masters and their state
	 *
	 * @return array|false Array of arrays with info for each master in case of success, FALSE in case of failure.
	 *
	 * @example $sentinel->masters();
	 *
	 * @since   >= 5.2.0
	 */
	masters()
	/**
	 * Ping the sentinel
	 *
	 * @return bool True in case of success, False in case of failure
	 *
	 * @example $sentinel->ping();
	 *
	 * @since   >= 5.2.0
	 */
	ping():boolean
	/**
	 * Reset all the masters with matching name. The pattern argument is a glob-style pattern.
	 * The reset process clears any previous state in a master (including a failover in progress), and removes every
	 * replica and sentinel already discovered and associated with the master.
	 *
	 * @param string $pattern Glob-style pattern
	 *
	 * @return bool True in case of success, False in case of failure
	 *
	 * @example $sentinel->reset('*');
	 *
	 * @since   >= 5.2.0
	 */
	reset(pattern:string):boolean
	/**
	 * Return a list of sentinel instances for this master, and their state
	 *
	 * @param string $master Name of master
	 *
	 * @return array|false Array of arrays with info for each sentinel in case of success, False in case of failure
	 *
	 * @example $sentinel->sentinels('mymaster');
	 *
	 * @since   >= 5.2.0
	 */
	sentinels(master:string)
	/**
	 * Return a list of sentinel instances for this master, and their state
	 *
	 * @param string $master Name of master
	 *
	 * @return array|false Array of arrays with info for each replica in case of success, False in case of failure
	 *
	 * @example $sentinel->slaves('mymaster');
	 *
	 * @since   >= 5.2.0
	 */
	slaves(master:string)
}
