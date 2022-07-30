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

