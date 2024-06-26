// Start of SPL v.0.2

/**
 * Exception that represents error in the program logic. This kind of
 * exceptions should directly lead to a fix in your code.
 * @link https://php.net/manual/en/class.logicexception.php
 */
declare class LogicException extends Exception{}

/**
 * Exception thrown if a callback refers to an undefined function or if some
 * arguments are missing.
 * @link https://php.net/manual/en/class.badfunctioncallexception.php
 */
declare class BadFunctionCallException extends LogicException{}

/**
 * Exception thrown if a callback refers to an undefined method or if some
 * arguments are missing.
 * @link https://php.net/manual/en/class.badmethodcallexception.php
 */
declare class BadMethodCallException extends BadFunctionCallException{}

/**
 * Exception thrown if a value does not adhere to a defined valid data domain.
 * @link https://php.net/manual/en/class.domainexception.php
 */
declare class DomainException extends LogicException{}

/**
 * Exception thrown if an argument does not match with the expected value.
 * @link https://php.net/manual/en/class.invalidargumentexception.php
 */
declare class InvalidArgumentException extends LogicException{}

/**
 * Exception thrown if a length is invalid.
 * @link https://php.net/manual/en/class.lengthexception.php
 */
declare class LengthException extends LogicException{}

/**
 * Exception thrown when an illegal index was requested. This represents
 * errors that should be detected at compile time.
 * @link https://php.net/manual/en/class.outofrangeexception.php
 */
declare class OutOfRangeException extends LogicException{}

/**
 * Exception thrown if an error which can only be found on runtime occurs.
 * @link https://php.net/manual/en/class.runtimeexception.php
 */
declare class RuntimeException extends Exception{}

/**
 * Exception thrown if a value is not a valid key. This represents errors
 * that cannot be detected at compile time.
 * @link https://php.net/manual/en/class.outofboundsexception.php
 */
declare class OutOfBoundsException extends RuntimeException{}

/**
 * Exception thrown when you add an element into a full container.
 * @link https://php.net/manual/en/class.overflowexception.php
 */
declare class OverflowException extends RuntimeException{}

/**
 * Exception thrown to indicate range errors during program execution.
 * Normally this means there was an arithmetic error other than
 * under/overflow. This is the runtime version of
 * <b>DomainException</b>.
 * @link https://php.net/manual/en/class.rangeexception.php
 */
declare class RangeException extends RuntimeException{}

/**
 * Exception thrown when you try to remove an element of an empty container.
 * @link https://php.net/manual/en/class.underflowexception.php
 */
declare class UnderflowException extends RuntimeException{}

/**
 * Exception thrown if a value does not match with a set of values. Typically
 * this happens when a function calls another function and expects the return
 * value to be of a certain type or value not including arithmetic or buffer
 * related errors.
 * @link https://php.net/manual/en/class.unexpectedvalueexception.php
 */
declare class UnexpectedValueException extends RuntimeException{}

/**
 * The EmptyIterator class for an empty iterator.
 * @link https://secure.php.net/manual/en/class.emptyiterator.php
 */
declare class EmptyIterator implements Iterator {
    /**
     * Return the current element
     * @link https://php.net/manual/en/iterator.current.php
     * @return mixed Can return any type.
     */
	current()
    /**
     * Move forward to next element
     * @link https://php.net/manual/en/iterator.next.php
     * @return void Any returned value is ignored.
     */
	next()
    /**
     * Return the key of the current element
     * @link https://php.net/manual/en/iterator.key.php
     * @return string|float|int|boolean|null scalar on success, or null on failure.
     */
	key()
    /**
     * Checks if current position is valid
     * @link https://php.net/manual/en/iterator.valid.php
     * @return bool The return value will be casted to boolean and then evaluated.
     * Returns true on success or false on failure.
     */
	valid()
    /**
     * Rewind the Iterator to the first element
     * @link https://php.net/manual/en/iterator.rewind.php
     * @return void Any returned value is ignored.
     */
	rewind()
}

/**
 * Filtered iterator using the callback to determine which items are accepted or rejected.
 * @link https://secure.php.net/manual/en/class.callbackfilteriterator.php
 * @since 5.4
 */
declare class CallbackFilterIterator extends FilterIterator {
    /**
     * Creates a filtered iterator using the callback to determine which items are accepted or rejected.
     * @param Iterator $iterator The iterator to be filtered.
     * @param callable $callback The callback, which should return TRUE to accept the current item or FALSE otherwise.
     * May be any valid callable value.
     * The callback should accept up to three arguments: the current item, the current key and the iterator, respectively.
     * <code> function my_callback(current:any,key:any,iterator:any) </code>
     * @link https://secure.php.net/manual/en/callbackfilteriterator.construct.php
     */
	__construct(iterator:Iterator ,callback:(...args)=>void)
    /**
     * This method calls the callback with the current value, current key and the inner iterator.
     * The callback is expected to return TRUE if the current item is to be accepted, or FALSE otherwise.
     * @link https://secure.php.net/manual/en/callbackfilteriterator.accept.php
     * @return bool true if the current element is acceptable, otherwise false.
     */
	accept()
}

/**
 * (PHP 5 >= 5.4.0)<br>
 * RecursiveCallbackFilterIterator from a RecursiveIterator
 * @link https://secure.php.net/manual/en/class.recursivecallbackfilteriterator.php
 * @since 5.4
 */
declare class RecursiveCallbackFilterIterator extends CallbackFilterIterator implements RecursiveIterator {
    /**
     * Create a RecursiveCallbackFilterIterator from a RecursiveIterator
     * @param RecursiveIterator $iterator The recursive iterator to be filtered.
     * @param string $callback The callback, which should return TRUE to accept the current item or FALSE otherwise. See Examples.
     * May be any valid callable value.
     * @link https://secure.php.net/manual/en/recursivecallbackfilteriterator.getchildren.php
     */
	__construct(iterator:RecursiveIterator,callback:any )
    /**
     * Check whether the inner iterator's current element has children
     * @link https://php.net/manual/en/recursiveiterator.haschildren.php
     * @return bool Returns TRUE if the current element has children, FALSE otherwise.
     */
	hasChildren()
    /**
     * Returns an iterator for the current entry.
     * @link https://secure.php.net/manual/en/recursivecallbackfilteriterator.haschildren.php
     * @return RecursiveCallbackFilterIterator containing the children.
     */
	getChildren()
}

/**
 * Classes implementing <b>RecursiveIterator</b> can be used to iterate
 * over iterators recursively.
 * @link https://php.net/manual/en/class.recursiveiterator.php
 */
declare interface RecursiveIterator extends Iterator {
    /**
     * Returns if an iterator can be created for the current entry.
     * @link https://php.net/manual/en/recursiveiterator.haschildren.php
     * @return bool true if the current entry can be iterated over, otherwise returns false.
     */
	hasChildren();
    /**
     * Returns an iterator for the current entry.
     * @link https://php.net/manual/en/recursiveiterator.getchildren.php
     * @return RecursiveIterator An iterator for the current entry.
     */
	getChildren();
}

/**
 * Can be used to iterate through recursive iterators.
 * @link https://php.net/manual/en/class.recursiveiteratoriterator.php
 */
declare class RecursiveIteratorIterator implements OuterIterator {
    /**
     * The default. Lists only leaves in iteration.
     */
    const LEAVES_ONLY = 0;
    /**
     * Lists leaves and parents in iteration with parents coming first.
     */
    const SELF_FIRST = 1;
    /**
     * Lists leaves and parents in iteration with leaves coming first.
     */
    const CHILD_FIRST = 2;
    /**
     * Special flag: Ignore exceptions thrown in accessing children.
     */
    const CATCH_GET_CHILD = 16;
    /**
     * Construct a RecursiveIteratorIterator
     * @link https://php.net/manual/en/recursiveiteratoriterator.construct.php
     * @param Traversable $iterator
     * @param int $mode [optional] The operation mode. See class constants for details.
     * @param int $flags [optional] A bitmask of special flags. See class constants for details.
     * @since 5.1.3
     */
	__construct(iterator:Traversable,mode?:number,flags?:number = 0)
    /**
     * Rewind the iterator to the first element of the top level inner iterator
     * @link https://php.net/manual/en/recursiveiteratoriterator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Check whether the current position is valid
     * @link https://php.net/manual/en/recursiveiteratoriterator.valid.php
     * @return bool true if the current position is valid, otherwise false
     */
	valid()
    /**
     * Access the current key
     * @link https://php.net/manual/en/recursiveiteratoriterator.key.php
     * @return string|float|int|boolean|null The current key.
     */
	key()
    /**
     * Access the current element value
     * @link https://php.net/manual/en/recursiveiteratoriterator.current.php
     * @return mixed The current elements value.
     */
	current()
    /**
     * Move forward to the next element
     * @link https://php.net/manual/en/recursiveiteratoriterator.next.php
     * @return void
     */
	next()
    /**
     * Get the current depth of the recursive iteration
     * @link https://php.net/manual/en/recursiveiteratoriterator.getdepth.php
     * @return int The current depth of the recursive iteration.
     */
	getDepth()
    /**
     * The current active sub iterator
     * @link https://php.net/manual/en/recursiveiteratoriterator.getsubiterator.php
     * @param int $level [optional]
     * @return RecursiveIterator The current active sub iterator.
     */
	getSubIterator(level:any)
    /**
     * Get inner iterator
     * @link https://php.net/manual/en/recursiveiteratoriterator.getinneriterator.php
     * @return Iterator The current active sub iterator.
     */
	getInnerIterator()
    /**
     * Begin Iteration
     * @link https://php.net/manual/en/recursiveiteratoriterator.beginiteration.php
     * @return void
     */
	beginIteration()
    /**
     * End Iteration
     * @link https://php.net/manual/en/recursiveiteratoriterator.enditeration.php
     * @return void
     */
	endIteration()
    /**
     * Has children
     * @link https://php.net/manual/en/recursiveiteratoriterator.callhaschildren.php
     * @return bool true if the element has children, otherwise false
     */
	callHasChildren()
    /**
     * Get children
     * @link https://php.net/manual/en/recursiveiteratoriterator.callgetchildren.php
     * @return RecursiveIterator A <b>RecursiveIterator</b>.
     */
	callGetChildren()
    /**
     * Begin children
     * @link https://php.net/manual/en/recursiveiteratoriterator.beginchildren.php
     * @return void
     */
	beginChildren()
    /**
     * End children
     * @link https://php.net/manual/en/recursiveiteratoriterator.endchildren.php
     * @return void
     */
	endChildren()
    /**
     * Next element
     * @link https://php.net/manual/en/recursiveiteratoriterator.nextelement.php
     * @return void
     */
	nextElement()
    /**
     * Set max depth
     * @link https://php.net/manual/en/recursiveiteratoriterator.setmaxdepth.php
     * @param int $maxDepth [optional] <p>
     * The maximum allowed depth. Default -1 is used
     * for any depth.
     * </p>
     * @return void
     */
	setMaxDepth(maxDepth:any = -1)
    /**
     * Get max depth
     * @link https://php.net/manual/en/recursiveiteratoriterator.getmaxdepth.php
     * @return int|false The maximum accepted depth, or false if any depth is allowed.
     */
	getMaxDepth()
}

/**
 * Classes implementing <b>OuterIterator</b> can be used to iterate
 * over iterators.
 * @link https://php.net/manual/en/class.outeriterator.php
 */
declare interface OuterIterator extends Iterator {
    /**
     * Returns the inner iterator for the current entry.
     * @link https://php.net/manual/en/outeriterator.getinneriterator.php
     * @return Iterator The inner iterator for the current entry.
     */
	getInnerIterator();
}

/**
 * This iterator wrapper allows the conversion of anything that is
 * Traversable into an Iterator.
 * It is important to understand that most classes that do not implement
 * Iterators have reasons as most likely they do not allow the full
 * Iterator feature set. If so, techniques should be provided to prevent
 * misuse, otherwise expect exceptions or fatal errors.
 * @link https://php.net/manual/en/class.iteratoriterator.php
 */
declare class IteratorIterator implements OuterIterator {
    /**
     * Create an iterator from anything that is traversable
     * @link https://php.net/manual/en/iteratoriterator.construct.php
     * @param Traversable $iterator
     * @param string $class [optional]
     */
	__construct(iterator:Traversable,className?:class<any>)
    /**
     * Get the inner iterator
     * @link https://php.net/manual/en/iteratoriterator.getinneriterator.php
     * @return Iterator The inner iterator as passed to IteratorIterator::__construct.
     */
	getInnerIterator()
    /**
     * Rewind to the first element
     * @link https://php.net/manual/en/iteratoriterator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Checks if the iterator is valid
     * @link https://php.net/manual/en/iteratoriterator.valid.php
     * @return bool true if the iterator is valid, otherwise false
     */
	valid()
    /**
     * Get the key of the current element
     * @link https://php.net/manual/en/iteratoriterator.key.php
     * @return string|float|int|boolean|null The key of the current element.
     */
	key()
    /**
     * Get the current value
     * @link https://php.net/manual/en/iteratoriterator.current.php
     * @return mixed The value of the current element.
     */
	current()
    /**
     * Forward to the next element
     * @link https://php.net/manual/en/iteratoriterator.next.php
     * @return void
     */
	next()
}

/**
 * This abstract iterator filters out unwanted values. This class should be extended to
 * implement custom iterator filters. The <b>FilterIterator::accept</b>
 * must be implemented in the subclass.
 * @link https://php.net/manual/en/class.filteriterator.php
 */
 @abstract
declare class FilterIterator extends IteratorIterator {
    /**
     * Check whether the current element of the iterator is acceptable
     * @link https://php.net/manual/en/filteriterator.accept.php
     * @return bool true if the current element is acceptable, otherwise false.
     */
	@abstract
    accept();
    /**
     * Construct a filterIterator
     * @link https://php.net/manual/en/filteriterator.construct.php
     * @param Iterator $iterator
     */
	__construct(iterator:Iterator)
    /**
     * Rewind the iterator
     * @link https://php.net/manual/en/filteriterator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Check whether the current element is valid
     * @link https://php.net/manual/en/filteriterator.valid.php
     * @return bool true if the current element is valid, otherwise false
     */
	valid()
    /**
     * Get the current key
     * @link https://php.net/manual/en/filteriterator.key.php
     * @return string|float|int|boolean|null The current key.
     */
	key()
    /**
     * Get the current element value
     * @link https://php.net/manual/en/filteriterator.current.php
     * @return mixed The current element value.
     */
	current()
    /**
     * Move the iterator forward
     * @link https://php.net/manual/en/filteriterator.next.php
     * @return void
     */
	next()
    /**
     * Get the inner iterator
     * @link https://php.net/manual/en/filteriterator.getinneriterator.php
     * @return Iterator The inner iterator.
     */
	getInnerIterator()
}

/**
 * This abstract iterator filters out unwanted values for a <b>RecursiveIterator</b>.
 * This class should be extended to implement custom filters.
 * The <b>RecursiveFilterIterator::accept</b> must be implemented in the subclass.
 * @link https://php.net/manual/en/class.recursivefilteriterator.php
 */
 @abstract 
 declare class RecursiveFilterIterator extends FilterIterator implements RecursiveIterator {
    /**
     * Create a RecursiveFilterIterator from a RecursiveIterator
     * @link https://php.net/manual/en/recursivefilteriterator.construct.php
     * @param RecursiveIterator $iterator
     */
	__construct(iterator:RecursiveIterator)
    /**
     * Check whether the inner iterator's current element has children
     * @link https://php.net/manual/en/recursivefilteriterator.haschildren.php
     * @return bool true if the inner iterator has children, otherwise false
     */
	hasChildren()
    /**
     * Return the inner iterator's children contained in a RecursiveFilterIterator
     * @link https://php.net/manual/en/recursivefilteriterator.getchildren.php
     * @return RecursiveFilterIterator containing the inner iterator's children.
     */
	getChildren()
}

/**
 * This extended FilterIterator allows a recursive iteration using RecursiveIteratorIterator that only shows those elements which have children.
 * @link https://php.net/manual/en/class.parentiterator.php
 */
declare class ParentIterator extends RecursiveFilterIterator {
    /**
     * Determines acceptability
     * @link https://php.net/manual/en/parentiterator.accept.php
     * @return bool true if the current element is acceptable, otherwise false.
     */
	accept()
    /**
     * Constructs a ParentIterator
     * @link https://php.net/manual/en/parentiterator.construct.php
     * @param RecursiveIterator $iterator
     */
	__construct(iterator:RecursiveIterator)
    /**
     * Check whether the inner iterator's current element has children
     * @link https://php.net/manual/en/recursivefilteriterator.haschildren.php
     * @return bool true if the inner iterator has children, otherwise false
     */
	hasChildren()
    /**
     * Return the inner iterator's children contained in a RecursiveFilterIterator
     * @link https://php.net/manual/en/recursivefilteriterator.getchildren.php
     * @return ParentIterator containing the inner iterator's children.
     */
	getChildren()
}

/**
 * The Seekable iterator.
 * @link https://php.net/manual/en/class.seekableiterator.php
 */
declare interface SeekableIterator extends Iterator {
    /**
     * Seeks to a position
     * @link https://php.net/manual/en/seekableiterator.seek.php
     * @param int $offset <p>
     * The position to seek to.
     * </p>
     * @return void
     */
	seek(offset:any);
}

/**
 * The <b>LimitIterator</b> class allows iteration over
 * a limited subset of items in an <b>Iterator</b>.
 * @link https://php.net/manual/en/class.limititerator.php
 */
declare class LimitIterator extends IteratorIterator {
    /**
     * Construct a LimitIterator
     * @link https://php.net/manual/en/limititerator.construct.php
     * @param Iterator $iterator The iterator to limit.
     * @param int $offset [optional] The offset to start at. Must be zero or greater.
     * @param int $limit [optional] The number of items to iterate. Must be -1 or greater. -1, the default, means no limit.
     */
	__construct(iterator:Iterator,offset:any = 0,limit:any = -1)
    /**
     * Rewind the iterator to the specified starting offset
     * @link https://php.net/manual/en/limititerator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Check whether the current element is valid
     * @link https://php.net/manual/en/limititerator.valid.php
     * @return bool true on success or false on failure.
     */
	valid()
    /**
     * Get current key
     * @link https://php.net/manual/en/limititerator.key.php
     * @return string|float|int|boolean|null the key for the current item.
     */
	key()
    /**
     * Get current element
     * @link https://php.net/manual/en/limititerator.current.php
     * @return mixed the current element or null if there is none.
     */
	current()
    /**
     * Move the iterator forward
     * @link https://php.net/manual/en/limititerator.next.php
     * @return void
     */
	next()
    /**
     * Seek to the given position
     * @link https://php.net/manual/en/limititerator.seek.php
     * @param int $offset <p>
     * The position to seek to.
     * </p>
     * @return int the offset position after seeking.
     */
	seek(offset:any)
    /**
     * Return the current position
     * @link https://php.net/manual/en/limititerator.getposition.php
     * @return int The current position.
     */
	getPosition()
    /**
     * Get inner iterator
     * @link https://php.net/manual/en/limititerator.getinneriterator.php
     * @return Iterator The inner iterator passed to <b>LimitIterator::__construct</b>.
     */
	getInnerIterator()
}

/**
 * This object supports cached iteration over another iterator.
 * @link https://php.net/manual/en/class.cachingiterator.php
 */
declare class CachingIterator extends IteratorIterator implements ArrayAccess, Countable, Stringable {
    /**
     * String conversion flag (mutually exclusive): Uses the current element for the iterator's string conversion.
     * This converts the current element to a string only once, regardless of whether it is needed or not.
     */
    const CALL_TOSTRING = 1;
    /**
     * String conversion flag (mutually exclusive). Uses the current key for the iterator's string conversion.
     */
    const TOSTRING_USE_KEY = 2;
    /**
     * String conversion flag (mutually exclusive). Uses the current element for the iterator's string conversion.
     * This converts the current element to a string only when (and every time) it is needed.
     */
    const TOSTRING_USE_CURRENT = 4;
    /**
     * String conversion flag (mutually exclusive). Forwards the string conversion to the inner iterator.
     * This converts the inner iterator to a string only once, regardless of whether it is needed or not.
     */
    const TOSTRING_USE_INNER = 8;
    /**
     * Ignore exceptions thrown in accessing children. Only used with {@see RecursiveCachingIterator}.
     */
    const CATCH_GET_CHILD = 16;
    /**
     * Cache all read data. This is needed to use {@see CachingIterator::getCache}, and ArrayAccess and Countable methods.
     */
    const FULL_CACHE = 256;
    /**
     * Constructs a new CachingIterator.
     * @link https://php.net/manual/en/cachingiterator.construct.php
     * @param Iterator $iterator The iterator to cache.
     * @param int $flags [optional] A bitmask of flags. See CachingIterator class constants for details.
     */
	__construct(iterator:Iterator,flags?:number)
    /**
     * Rewind the iterator
     * @link https://php.net/manual/en/cachingiterator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Check whether the current element is valid
     * @link https://php.net/manual/en/cachingiterator.valid.php
     * @return bool true on success or false on failure.
     */
	valid()
    /**
     * Return the key for the current element
     * @link https://php.net/manual/en/cachingiterator.key.php
     * @return string|float|int|boolean|null
     */
	key()
    /**
     * Return the current element
     * @link https://php.net/manual/en/cachingiterator.current.php
     * @return mixed
     */
	current()
    /**
     * Move the iterator forward
     * @link https://php.net/manual/en/cachingiterator.next.php
     * @return void
     */
	next()
    /**
     * Check whether the inner iterator has a valid next element
     * @link https://php.net/manual/en/cachingiterator.hasnext.php
     * @return bool true on success or false on failure.
     */
	hasNext()
    /**
     * Return the string representation of the current iteration based on the flag being used.
     * @link https://php.net/manual/en/cachingiterator.tostring.php
     * @return string The string representation of the current iteration based on the flag being used.
     */
	__toString()
    /**
     * Returns the inner iterator
     * @link https://php.net/manual/en/cachingiterator.getinneriterator.php
     * @return Iterator an object implementing the Iterator interface.
     */
	getInnerIterator()
    /**
     * Get flags used
     * @link https://php.net/manual/en/cachingiterator.getflags.php
     * @return int Bitmask of the flags
     */
	getFlags()
    /**
     * The setFlags purpose
     * @link https://php.net/manual/en/cachingiterator.setflags.php
     * @param int $flags Bitmask of the flags to set.
     * @return void
     */
	setFlags(flags:any)
    /**
     * Internal cache array index to retrieve.
     * @link https://php.net/manual/en/cachingiterator.offsetget.php
     * @param string $key The index of the element to retrieve.
     * @return mixed
     * @throws BadMethodCallException when the {@see CachingIterator::FULL_CACHE} flag is not being used.
     */
	offsetGet(key:any)
    /**
     * Set an element on the internal cache array.
     * @link https://php.net/manual/en/cachingiterator.offsetset.php
     * @param string $key The index of the element to be set.
     * @param string $value The new value for the <i>index</i>.
     * @return void
     * @throws BadMethodCallException when the {@see CachingIterator::FULL_CACHE} flag is not being used.
     */
	offsetSet(key:any,value:any)
    /**
     * Remove an element from the internal cache array.
     * @link https://php.net/manual/en/cachingiterator.offsetunset.php
     * @param string $key The index of the element to be unset.
     * @return void
     * @throws BadMethodCallException when the {@see CachingIterator::FULL_CACHE} flag is not being used.
     */
	offsetUnset(key:any)
    /**
     * Return whether an element at the index exists on the internal cache array.
     * @link https://php.net/manual/en/cachingiterator.offsetexists.php
     * @param string $key The index being checked.
     * @return bool true if an entry referenced by the offset exists, false otherwise.
     * @throws BadMethodCallException when the {@see CachingIterator::FULL_CACHE} flag is not being used.
     */
	offsetExists(key:any)
    /**
     * Retrieve the contents of the cache
     * @link https://php.net/manual/en/cachingiterator.getcache.php
     * @return array An array containing the cache items.
     * @throws BadMethodCallException when the {@see CachingIterator::FULL_CACHE} flag is not being used.
     */
	getCache()
    /**
     * The number of elements in the iterator
     * @link https://php.net/manual/en/cachingiterator.count.php
     * @return int The count of the elements iterated over.
     * @throws BadMethodCallException when the {@see CachingIterator::FULL_CACHE} flag is not being used.
     * @since 5.2.2
     */
	count()
}

/**
 * ...
 * @link https://php.net/manual/en/class.recursivecachingiterator.php
 */
declare class RecursiveCachingIterator extends CachingIterator implements RecursiveIterator {
    /**
     * Constructs a new RecursiveCachingIterator.
     * @link https://php.net/manual/en/recursivecachingiterator.construct.php
     * @param Iterator $iterator The iterator to cache.
     * @param int $flags [optional] A bitmask of flags. See CachingIterator class constants for details.
     */
	__construct(iterator:Iterator,flags?:number)
    /**
     * Check whether the current element of the inner iterator has children
     * @link https://php.net/manual/en/recursivecachingiterator.haschildren.php
     * @return bool true if the inner iterator has children, otherwise false
     */
	hasChildren()
    /**
     * Return the inner iterator's children as a RecursiveCachingIterator
     * @link https://php.net/manual/en/recursivecachingiterator.getchildren.php
     * @return RecursiveCachingIterator The inner iterator's children, as a RecursiveCachingIterator.
     */
	getChildren()
}

/**
 * This iterator cannot be rewinded.
 * @link https://php.net/manual/en/class.norewinditerator.php
 */
declare class NoRewindIterator extends IteratorIterator {
    /**
     * Construct a NoRewindIterator
     * @link https://php.net/manual/en/norewinditerator.construct.php
     * @param Iterator $iterator
     */
	__construct(iterator:Iterator)
    /**
     * Prevents the rewind operation on the inner iterator.
     * @link https://php.net/manual/en/norewinditerator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Validates the iterator
     * @link https://php.net/manual/en/norewinditerator.valid.php
     * @return bool true on success or false on failure.
     */
	valid()
    /**
     * Get the current key
     * @link https://php.net/manual/en/norewinditerator.key.php
     * @return string|float|int|boolean|null The current key.
     */
	key()
    /**
     * Get the current value
     * @link https://php.net/manual/en/norewinditerator.current.php
     * @return mixed The current value.
     */
	current()
    /**
     * Forward to the next element
     * @link https://php.net/manual/en/norewinditerator.next.php
     * @return void
     */
	next()
    /**
     * Get the inner iterator
     * @link https://php.net/manual/en/norewinditerator.getinneriterator.php
     * @return Iterator The inner iterator, as passed to <b>NoRewindIterator::__construct</b>.
     */
	getInnerIterator()
}

/**
 * An Iterator that iterates over several iterators one after the other.
 * @link https://php.net/manual/en/class.appenditerator.php
 */
declare class AppendIterator extends IteratorIterator {
    /**
     * Constructs an AppendIterator
     * @link https://php.net/manual/en/appenditerator.construct.php
     */
	__construct()
    /**
     * Appends an iterator
     * @link https://php.net/manual/en/appenditerator.append.php
     * @param Iterator $iterator <p>
     * The iterator to append.
     * </p>
     * @return void
     */
	append(iterator:Iterator)
    /**
     * Rewinds the Iterator
     * @link https://php.net/manual/en/appenditerator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Checks validity of the current element
     * @link https://php.net/manual/en/appenditerator.valid.php
     * @return bool true on success or false on failure.
     */
	valid()
    /**
     * Gets the current key
     * @link https://php.net/manual/en/appenditerator.key.php
     * @return string|float|int|boolean|null The current key if it is valid or null otherwise.
     */
	key()
    /**
     * Gets the current value
     * @link https://php.net/manual/en/appenditerator.current.php
     * @return mixed The current value if it is valid or null otherwise.
     */
	current()
    /**
     * Moves to the next element
     * @link https://php.net/manual/en/appenditerator.next.php
     * @return void
     */
	next()
    /**
     * Gets an inner iterator
     * @link https://php.net/manual/en/appenditerator.getinneriterator.php
     * @return Iterator the current inner Iterator.
     */
	getInnerIterator()
    /**
     * Gets an index of iterators
     * @link https://php.net/manual/en/appenditerator.getiteratorindex.php
     * @return int The index of iterators.
     */
	getIteratorIndex()
    /**
     * The getArrayIterator method
     * @link https://php.net/manual/en/appenditerator.getarrayiterator.php
     * @return ArrayIterator containing the appended iterators.
     */
	getArrayIterator()
}

/**
 * The <b>InfiniteIterator</b> allows one to
 * infinitely iterate over an iterator without having to manually
 * rewind the iterator upon reaching its end.
 * @link https://php.net/manual/en/class.infiniteiterator.php
 */
declare class InfiniteIterator extends IteratorIterator {
    /**
     * Constructs an InfiniteIterator
     * @link https://php.net/manual/en/infiniteiterator.construct.php
     * @param Iterator $iterator
     */
	__construct(iterator:Iterator)
    /**
     * Moves the inner Iterator forward or rewinds it
     * @link https://php.net/manual/en/infiniteiterator.next.php
     * @return void
     */
	next()
}

/**
 * This iterator can be used to filter another iterator based on a regular expression.
 * @link https://php.net/manual/en/class.regexiterator.php
 */
declare class RegexIterator extends FilterIterator {
    /**
     * Return all matches for the current entry @see preg_match_all
     */
    const ALL_MATCHES = 2;
    /**
     * Return the first match for the current entry @see preg_match
     */
    const GET_MATCH = 1;
    /**
     * Only execute match (filter) for the current entry @see preg_match
     */
    const MATCH = 0;
    /**
     * Replace the current entry (Not fully implemented yet) @see preg_replace
     */
    const REPLACE = 4;
    /**
     * Returns the split values for the current entry @see preg_split
     */
    const SPLIT = 3;
    /**
     * Special flag: Match the entry key instead of the entry value.
     */
    const USE_KEY = 1;
    const INVERT_MATCH = 2;
    public $replacement;
    /**
     * Create a new RegexIterator
     * @link https://php.net/manual/en/regexiterator.construct.php
     * @param Iterator $iterator The iterator to apply this regex filter to.
     * @param string $pattern The regular expression to match.
     * @param int $mode [optional] Operation mode, see RegexIterator::setMode() for a list of modes.
     * @param int $flags [optional] Special flags, see RegexIterator::setFlags() for a list of available flags.
     * @param int $pregFlags [optional] The regular expression flags. These flags depend on the operation mode parameter
     */
	__construct(iterator:Iterator,pattern:string,mode?:number,flags?:number = 0,pregFlags?:number = 0)
    /**
     * Get accept status
     * @link https://php.net/manual/en/regexiterator.accept.php
     * @return bool true if a match, false otherwise.
     */
	accept()
    /**
     * Returns operation mode.
     * @link https://php.net/manual/en/regexiterator.getmode.php
     * @return int the operation mode.
     */
	getMode()
    /**
     * Sets the operation mode.
     * @link https://php.net/manual/en/regexiterator.setmode.php
     * @param int $mode <p>
     * The operation mode.
     * </p>
     * <p>
     * The available modes are listed below. The actual
     * meanings of these modes are described in the
     * predefined constants.
     * <table>
     * <b>RegexIterator</b> modes
     * <tr valign="top">
     * <td>value</td>
     * <td>constant</td>
     * </tr>
     * <tr valign="top">
     * <td>0</td>
     * <td>
     * RegexIterator::MATCH
     * </td>
     * </tr>
     * <tr valign="top">
     * <td>1</td>
     * <td>
     * RegexIterator::GET_MATCH
     * </td>
     * </tr>
     * <tr valign="top">
     * <td>2</td>
     * <td>
     * RegexIterator::ALL_MATCHES
     * </td>
     * </tr>
     * <tr valign="top">
     * <td>3</td>
     * <td>
     * RegexIterator::SPLIT
     * </td>
     * </tr>
     * <tr valign="top">
     * <td>4</td>
     * <td>
     * RegexIterator::REPLACE
     * </td>
     * </tr>
     * </table>
     * </p>
     * @return void
     */
	setMode(mode:any)
    /**
     * Get flags
     * @link https://php.net/manual/en/regexiterator.getflags.php
     * @return int the set flags.
     */
	getFlags()
    /**
     * Sets the flags.
     * @link https://php.net/manual/en/regexiterator.setflags.php
     * @param int $flags <p>
     * The flags to set, a bitmask of class constants.
     * </p>
     * <p>
     * The available flags are listed below. The actual
     * meanings of these flags are described in the
     * predefined constants.
     * <table>
     * <b>RegexIterator</b> flags
     * <tr valign="top">
     * <td>value</td>
     * <td>constant</td>
     * </tr>
     * <tr valign="top">
     * <td>1</td>
     * <td>
     * RegexIterator::USE_KEY
     * </td>
     * </tr>
     * </table>
     * </p>
     * @return void
     */
	setFlags(flags:any)
    /**
    * Returns current regular expression
    * @link https://secure.php.net/manual/en/regexiterator.getregex.php
    * @return string
    * @since 5.4
    */
	getRegex()
    /**
     * Returns the regular expression flags.
     * @link https://php.net/manual/en/regexiterator.getpregflags.php
     * @return int a bitmask of the regular expression flags.
     */
	getPregFlags()
    /**
     * Sets the regular expression flags.
     * @link https://php.net/manual/en/regexiterator.setpregflags.php
     * @param int $pregFlags <p>
     * The regular expression flags. See <b>RegexIterator::__construct</b>
     * for an overview of available flags.
     * </p>
     * @return void
     */
	setPregFlags(pregFlags:any)
}

/**
 * This recursive iterator can filter another recursive iterator via a regular expression.
 * @link https://php.net/manual/en/class.recursiveregexiterator.php
 */
declare class RecursiveRegexIterator extends RegexIterator implements RecursiveIterator {
    /**
     * Creates a new RecursiveRegexIterator.
     * @link https://php.net/manual/en/recursiveregexiterator.construct.php
     * @param RecursiveIterator $iterator The iterator to apply this regex filter to.
     * @param string $pattern The regular expression to match.
     * @param int $mode [optional] Operation mode, see RegexIterator::setMode() for a list of modes.
     * @param int $flags [optional] Special flags, see RegexIterator::setFlags() for a list of available flags.
     * @param int $pregFlags [optional] The regular expression flags. These flags depend on the operation mode parameter
     */
	__construct(iterator:RecursiveIterator,pattern:any,mode?:number,flags?:number = 0,pregFlags?:any = 0)
    /**
     * Returns whether an iterator can be obtained for the current entry.
     * @link https://php.net/manual/en/recursiveregexiterator.haschildren.php
     * @return bool true if an iterator can be obtained for the current entry, otherwise returns false.
     */
	hasChildren()
    /**
     * Returns an iterator for the current entry.
     * @link https://php.net/manual/en/recursiveregexiterator.getchildren.php
     * @return RecursiveRegexIterator An iterator for the current entry, if it can be iterated over by the inner iterator.
     */
	getChildren()
}

/**
 * Allows iterating over a <b>RecursiveIterator</b> to generate an ASCII graphic tree.
 * @link https://php.net/manual/en/class.recursivetreeiterator.php
 */
declare class RecursiveTreeIterator extends RecursiveIteratorIterator {
    const BYPASS_CURRENT = 4;
    const BYPASS_KEY = 8;
    const PREFIX_LEFT = 0;
    const PREFIX_MID_HAS_NEXT = 1;
    const PREFIX_MID_LAST = 2;
    const PREFIX_END_HAS_NEXT = 3;
    const PREFIX_END_LAST = 4;
    const PREFIX_RIGHT = 5;
    /**
     * Construct a RecursiveTreeIterator
     * @link https://php.net/manual/en/recursivetreeiterator.construct.php
     * @param RecursiveIterator|IteratorAggregate $iterator
     * @param int $flags [optional] Flags to control the behavior of the RecursiveTreeIterator object.
     * @param int $cachingIteratorFlags [optional] Flags to affect the behavior of the {@see RecursiveCachingIterator} used internally.
     * @param int $mode [optional] Flags to affect the behavior of the {@see RecursiveIteratorIterator} used internally.
     */
	__construct(iterator:any,flags?:number,cachingIteratorFlags?:number,mode?:number)
    /**
     * Rewind iterator
     * @link https://php.net/manual/en/recursivetreeiterator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Check validity
     * @link https://php.net/manual/en/recursivetreeiterator.valid.php
     * @return bool true if the current position is valid, otherwise false
     */
	valid()
    /**
     * Get the key of the current element
     * @link https://php.net/manual/en/recursivetreeiterator.key.php
     * @return string the current key prefixed and postfixed.
     */
	key()
    /**
     * Get current element
     * @link https://php.net/manual/en/recursivetreeiterator.current.php
     * @return string the current element prefixed and postfixed.
     */
	current()
    /**
     * Move to next element
     * @link https://php.net/manual/en/recursivetreeiterator.next.php
     * @return void
     */
	next()
    /**
     * Begin iteration
     * @link https://php.net/manual/en/recursivetreeiterator.beginiteration.php
     * @return RecursiveIterator A <b>RecursiveIterator</b>.
     */
	beginIteration()
    /**
     * End iteration
     * @link https://php.net/manual/en/recursivetreeiterator.enditeration.php
     * @return void
     */
	endIteration()
    /**
     * Has children
     * @link https://php.net/manual/en/recursivetreeiterator.callhaschildren.php
     * @return bool true if there are children, otherwise false
     */
	callHasChildren()
    /**
     * Get children
     * @link https://php.net/manual/en/recursivetreeiterator.callgetchildren.php
     * @return RecursiveIterator A <b>RecursiveIterator</b>.
     */
	callGetChildren()
    /**
     * Begin children
     * @link https://php.net/manual/en/recursivetreeiterator.beginchildren.php
     * @return void
     */
	beginChildren()
    /**
     * End children
     * @link https://php.net/manual/en/recursivetreeiterator.endchildren.php
     * @return void
     */
	endChildren()
    /**
     * Next element
     * @link https://php.net/manual/en/recursivetreeiterator.nextelement.php
     * @return void
     */
	nextElement()
    /**
     * Get the prefix
     * @link https://php.net/manual/en/recursivetreeiterator.getprefix.php
     * @return string the string to place in front of current element
     */
	getPrefix()
    /**
     * @param string $postfix
     */
	setPostfix(postfix:any)
    /**
     * Set a part of the prefix
     * @link https://php.net/manual/en/recursivetreeiterator.setprefixpart.php
     * @param int $part <p>
     * One of the RecursiveTreeIterator::PREFIX_* constants.
     * </p>
     * @param string $value <p>
     * The value to assign to the part of the prefix specified in <i>part</i>.
     * </p>
     * @return void
     */
	setPrefixPart(part:any,value:any)
    /**
     * Get current entry
     * @link https://php.net/manual/en/recursivetreeiterator.getentry.php
     * @return string the part of the tree built for the current element.
     */
	getEntry()
    /**
     * Get the postfix
     * @link https://php.net/manual/en/recursivetreeiterator.getpostfix.php
     * @return string to place after the current element.
     */
	getPostfix()
}

/**
 * This class allows objects to work as arrays.
 * @link https://php.net/manual/en/class.arrayobject.php
 */
declare class ArrayObject implements IteratorAggregate, ArrayAccess, Serializable, Countable {
    /**
     * Properties of the object have their normal functionality when accessed as list (var_dump, foreach, etc.).
     */
    const STD_PROP_LIST = 1;
    /**
     * Entries can be accessed as properties (read and write).
     */
    const ARRAY_AS_PROPS = 2;
    /**
     * Construct a new array object
     * @link https://php.net/manual/en/arrayobject.construct.php
     * @param array|object $array The input parameter accepts an array or an Object.
     * @param int $flags Flags to control the behaviour of the ArrayObject object.
     * @param string $iteratorClass Specify the class that will be used for iteration of the ArrayObject object. ArrayIterator is the default class used.
     *
     */
	__construct(array:any = array(),flags:any = 0,iteratorClass:any = "ArrayIterator")
    /**
     * Returns whether the requested index exists
     * @link https://php.net/manual/en/arrayobject.offsetexists.php
     * @param int|string $key <p>
     * The index being checked.
     * </p>
     * @return bool true if the requested index exists, otherwise false
     */
	offsetExists(key:any)
    /**
     * Returns the value at the specified index
     * @link https://php.net/manual/en/arrayobject.offsetget.php
     * @param int|string $key <p>
     * The index with the value.
     * </p>
     * @return mixed|false The value at the specified index or false.
     */
	offsetGet(key:any)
    /**
     * Sets the value at the specified index to newval
     * @link https://php.net/manual/en/arrayobject.offsetset.php
     * @param int|string $key <p>
     * The index being set.
     * </p>
     * @param mixed $value <p>
     * The new value for the <i>index</i>.
     * </p>
     * @return void
     */
	offsetSet(key:any,value:any)
    /**
     * Unsets the value at the specified index
     * @link https://php.net/manual/en/arrayobject.offsetunset.php
     * @param int|string $key <p>
     * The index being unset.
     * </p>
     * @return void
     */
	offsetUnset(key:any)
    /**
     * Appends the value
     * @link https://php.net/manual/en/arrayobject.append.php
     * @param mixed $value <p>
     * The value being appended.
     * </p>
     * @return void
     */
	append(value:any)
    /**
     * Creates a copy of the ArrayObject.
     * @link https://php.net/manual/en/arrayobject.getarraycopy.php
     * @return array a copy of the array. When the <b>ArrayObject</b> refers to an object
     * an array of the public properties of that object will be returned.
     */
	getArrayCopy()
    /**
     * Get the number of public properties in the ArrayObject
     * When the <b>ArrayObject</b> is constructed from an array all properties are public.
     * @link https://php.net/manual/en/arrayobject.count.php
     * @return int The number of public properties in the ArrayObject.
     */
	count()
    /**
     * Gets the behavior flags.
     * @link https://php.net/manual/en/arrayobject.getflags.php
     * @return int the behavior flags of the ArrayObject.
     */
	getFlags()
    /**
     * Sets the behavior flags.
     * @link https://php.net/manual/en/arrayobject.setflags.php
     * @param int $flags <p>
     * The new ArrayObject behavior.
     * It takes on either a bitmask, or named constants. Using named
     * constants is strongly encouraged to ensure compatibility for future
     * versions.
     * </p>
     * <p>
     * The available behavior flags are listed below. The actual
     * meanings of these flags are described in the
     * predefined constants.
     * <table>
     * ArrayObject behavior flags
     * <tr valign="top">
     * <td>value</td>
     * <td>constant</td>
     * </tr>
     * <tr valign="top">
     * <td>1</td>
     * <td>
     * ArrayObject::STD_PROP_LIST
     * </td>
     * </tr>
     * <tr valign="top">
     * <td>2</td>
     * <td>
     * ArrayObject::ARRAY_AS_PROPS
     * </td>
     * </tr>
     * </table>
     * </p>
     * @return void
     */
	setFlags(flags:any)
    /**
     * Sort the entries by value
     * @link https://php.net/manual/en/arrayobject.asort.php
     * @param int $flags [optional]
     * @return void
     */
	asort(flags:any = SORT_REGULAR)
    /**
     * Sort the entries by key
     * @link https://php.net/manual/en/arrayobject.ksort.php
     * @param int $flags [optional]
     * @return void
     */
	ksort(flags:any = SORT_REGULAR)
    /**
     * Sort the entries with a user-defined comparison function and maintain key association
     * @link https://php.net/manual/en/arrayobject.uasort.php
     * @param callback $callback <p>
     * Function <i>cmp_function</i> should accept two
     * parameters which will be filled by pairs of entries.
     * The comparison function must return an integer less than, equal
     * to, or greater than zero if the first argument is considered to
     * be respectively less than, equal to, or greater than the
     * second.
     * </p>
     * @return void
     */
	uasort(callback:any)
    /**
     * Sort the entries by keys using a user-defined comparison function
     * @link https://php.net/manual/en/arrayobject.uksort.php
     * @param callback $callback <p>
     * The callback comparison function.
     * </p>
     * <p>
     * Function <i>cmp_function</i> should accept two
     * parameters which will be filled by pairs of entry keys.
     * The comparison function must return an integer less than, equal
     * to, or greater than zero if the first argument is considered to
     * be respectively less than, equal to, or greater than the
     * second.
     * </p>
     * @return void
     */
	uksort(callback:any)
    /**
     * Sort entries using a "natural order" algorithm
     * @link https://php.net/manual/en/arrayobject.natsort.php
     * @return void
     */
	natsort()
    /**
     * Sort an array using a case insensitive "natural order" algorithm
     * @link https://php.net/manual/en/arrayobject.natcasesort.php
     * @return void
     */
	natcasesort()
    /**
     * Unserialize an ArrayObject
     * @link https://php.net/manual/en/arrayobject.unserialize.php
     * @param string $data <p>
     * The serialized <b>ArrayObject</b>.
     * </p>
     * @return void The unserialized <b>ArrayObject</b>.
     */
	unserialize(data:any)
    /**
     * Serialize an ArrayObject
     * @link https://php.net/manual/en/arrayobject.serialize.php
     * @return string The serialized representation of the <b>ArrayObject</b>.
     */
	serialize()
    /**
     * @return array
     * @since 7.4
     */
	__debugInfo()
    /**
     * @return array
     * @since 7.4
     */
	__serialize()
    /**
     * @param array $data
     * @since 7.4
     */
	__unserialize(data:array)
    /**
     * Create a new iterator from an ArrayObject instance
     * @link https://php.net/manual/en/arrayobject.getiterator.php
     * @return ArrayIterator An iterator from an <b>ArrayObject</b>.
     */
	getIterator()
    /**
     * Exchange the array for another one.
     * @link https://php.net/manual/en/arrayobject.exchangearray.php
     * @param mixed $array <p>
     * The new array or object to exchange with the current array.
     * </p>
     * @return array the old array.
     */
	exchangeArray(array:any)
    /**
     * Sets the iterator classname for the ArrayObject.
     * @link https://php.net/manual/en/arrayobject.setiteratorclass.php
     * @param string $iteratorClass <p>
     * The classname of the array iterator to use when iterating over this object.
     * </p>
     * @return void
     */
	setIteratorClass(iteratorClass:any)
    /**
     * Gets the iterator classname for the ArrayObject.
     * @link https://php.net/manual/en/arrayobject.getiteratorclass.php
     * @return string the iterator class name that is used to iterate over this object.
     */
	getIteratorClass()
}

/**
 * This iterator allows to unset and modify values and keys while iterating
 * over Arrays and Objects.
 * @link https://php.net/manual/en/class.arrayiterator.php
 */
declare class ArrayIterator implements SeekableIterator, ArrayAccess, Serializable, Countable {
    const STD_PROP_LIST = 1;
    const ARRAY_AS_PROPS = 2;
    /**
     * Construct an ArrayIterator
     * @link https://php.net/manual/en/arrayiterator.construct.php
     * @param array $array The array or object to be iterated on.
     * @param int $flags Flags to control the behaviour of the ArrayObject object.
     * @see ArrayObject::setFlags()
     */
	__construct(array:any = array(),flags:any = 0)
    /**
     * Check if offset exists
     * @link https://php.net/manual/en/arrayiterator.offsetexists.php
     * @param string $key <p>
     * The offset being checked.
     * </p>
     * @return bool true if the offset exists, otherwise false
     */
	offsetExists(key:any)
    /**
     * Get value for an offset
     * @link https://php.net/manual/en/arrayiterator.offsetget.php
     * @param string $key <p>
     * The offset to get the value from.
     * </p>
     * @return mixed The value at offset <i>index</i>.
     */
	offsetGet(key:any)
    /**
     * Set value for an offset
     * @link https://php.net/manual/en/arrayiterator.offsetset.php
     * @param string $key <p>
     * The index to set for.
     * </p>
     * @param string $value <p>
     * The new value to store at the index.
     * </p>
     * @return void
     */
	offsetSet(key:any,value:any)
    /**
     * Unset value for an offset
     * @link https://php.net/manual/en/arrayiterator.offsetunset.php
     * @param string $key <p>
     * The offset to unset.
     * </p>
     * @return void
     */
	offsetUnset(key:any)
    /**
     * Append an element
     * @link https://php.net/manual/en/arrayiterator.append.php
     * @param mixed $value <p>
     * The value to append.
     * </p>
     * @return void
     */
	append(value:any)
    /**
     * Get array copy
     * @link https://php.net/manual/en/arrayiterator.getarraycopy.php
     * @return array A copy of the array, or array of public properties
     * if ArrayIterator refers to an object.
     */
	getArrayCopy()
    /**
     * Count elements
     * @link https://php.net/manual/en/arrayiterator.count.php
     * @return int The number of elements or public properties in the associated
     * array or object, respectively.
     */
	count()
    /**
     * Get flags
     * @link https://php.net/manual/en/arrayiterator.getflags.php
     * @return string The current flags.
     */
	getFlags()
    /**
     * Set behaviour flags
     * @link https://php.net/manual/en/arrayiterator.setflags.php
     * @param string $flags <p>
     * A bitmask as follows:
     * 0 = Properties of the object have their normal functionality
     * when accessed as list (var_dump, foreach, etc.).
     * 1 = Array indices can be accessed as properties in read/write.
     * </p>
     * @return void
     */
	setFlags(flags:any)
    /**
     * Sort array by values
     * @link https://php.net/manual/en/arrayiterator.asort.php
     * @param int $flags [optional]
     * @return void
     */
	asort(flags:any = SORT_REGULAR)
    /**
     * Sort array by keys
     * @link https://php.net/manual/en/arrayiterator.ksort.php
     * @param int $flags [optional]
     * @return void
     */
	ksort(flags:any = SORT_REGULAR)
    /**
     * User defined sort
     * @link https://php.net/manual/en/arrayiterator.uasort.php
     * @param callable $callback <p>
     * The compare function used for the sort.
     * </p>
     * @return void
     */
	uasort(callback:any)
    /**
     * User defined sort
     * @link https://php.net/manual/en/arrayiterator.uksort.php
     * @param callable $callback <p>
     * The compare function used for the sort.
     * </p>
     * @return void
     */
	uksort(callback:any)
    /**
     * Sort an array naturally
     * @link https://php.net/manual/en/arrayiterator.natsort.php
     * @return void
     */
	natsort()
    /**
     * Sort an array naturally, case insensitive
     * @link https://php.net/manual/en/arrayiterator.natcasesort.php
     * @return void
     */
	natcasesort()
    /**
     * Unserialize
     * @link https://php.net/manual/en/arrayiterator.unserialize.php
     * @param string $data <p>
     * The serialized ArrayIterator object to be unserialized.
     * </p>
     * @return string The <b>ArrayIterator</b>.
     */
	unserialize(data:any)
    /**
     * Serialize
     * @link https://php.net/manual/en/arrayiterator.serialize.php
     * @return string The serialized <b>ArrayIterator</b>.
     */
	serialize()
    /**
     * Rewind array back to the start
     * @link https://php.net/manual/en/arrayiterator.rewind.php
     * @return void
     */
	rewind()
    /**
     * Return current array entry
     * @link https://php.net/manual/en/arrayiterator.current.php
     * @return mixed The current array entry.
     */
	current()
    /**
     * Return current array key
     * @link https://php.net/manual/en/arrayiterator.key.php
     * @return string|float|int|boolean|null The current array key.
     */
	key()
    /**
     * Move to next entry
     * @link https://php.net/manual/en/arrayiterator.next.php
     * @return void
     */
	next()
    /**
     * Check whether array contains more entries
     * @link https://php.net/manual/en/arrayiterator.valid.php
     * @return bool
     */
	valid()
    /**
     * Seek to position
     * @link https://php.net/manual/en/arrayiterator.seek.php
     * @param int $offset <p>
     * The position to seek to.
     * </p>
     * @return void
     */
	seek(offset:any)
    /**
     * @return array
     * @since 7.4
     */
	__debugInfo()
    /**
     * @return array
     * @since 7.4
     */
	__serialize()
    /**
     * @param array $data
     * @since 7.4
     */
	__unserialize(data:array)
}

/**
 * This iterator allows to unset and modify values and keys while iterating over Arrays and Objects
 * in the same way as the ArrayIterator. Additionally it is possible to iterate
 * over the current iterator entry.
 * @link https://php.net/manual/en/class.recursivearrayiterator.php
 */
declare class RecursiveArrayIterator extends ArrayIterator implements RecursiveIterator {
    const CHILD_ARRAYS_ONLY = 4;
    /**
     * Returns whether current entry is an array or an object.
     * @link https://php.net/manual/en/recursivearrayiterator.haschildren.php
     * @return bool true if the current entry is an array or an object,
     * otherwise false is returned.
     */
	hasChildren()
    /**
     * Returns an iterator for the current entry if it is an array or an object.
     * @link https://php.net/manual/en/recursivearrayiterator.getchildren.php
     * @return RecursiveArrayIterator An iterator for the current entry, if it is an array or object.
     */
	getChildren()
}
