declare var _SERVER:ArrayMappingType<any>;
declare var _GET:ArrayMappingType<any>;
declare var _POST:ArrayMappingType<any>;
declare var _FILES:ArrayMappingType<any>;
declare var _REQUEST:ArrayMappingType<any>;
declare var _SESSION:ArrayMappingType<any>;
declare var _ENV:ArrayMappingType<any>;
declare var _COOKIE:ArrayMappingType<any>;

declare class stdClass extends Object{
    [key:string]:any;
};

declare interface Resource{}

declare interface ArrayMappingType<T=any> extends Array<T>{
    [key:string]:T
    [key:number]:T
}

declare type ScalarValueType = string | number | boolean | null;

declare type TableColumnValueType = string | number | null;

declare type StreamContextCreateOptionType = ArrayMappingType<array> | ArrayMappingType<string>[]

//引用内存地址类型
declare type RMD<T> = T;
declare type ObjectProtector<T> = T;
declare type ArrayProtector<T> = T;

declare type GeneralCallback<T=any,R=void> = [string, string] | (...args:T[])=>R;

@Reference('./php.constant.d.es');
@Reference('./spl.d.es');
@Reference('./standard');

declare function dirname(path:string):string;
declare function require(path:string):any;
declare function include(path:string):any;

/**
* @param options
* 必须是一个二维关联数组或 null，二维关联数组格式如下：$arr['wrapper']['option'] = $value。请参考 上下文（Context）选项 中可用的封装协议和选项列表。
* 默认为 null。
* @param params
* 必须是 $arr['parameter'] = $value 格式的关联数组或 null。 请参考 上下文（Context）参数 里的标准资源流参数列表。
*/
declare function stream_context_create(options:StreamContextCreateOptionType, params?:array): Resource;

/**
* 检查文件或目录是否存在
*/
declare function file_exists(filename:string): boolean;

declare function rand(min:number, max:number):number;
declare function mime_content_type(filename:string):string;

/**
* 把整个文件读入一个数组中
*/
declare function file(filename:string, flags?:number, context?:Resource): array|false;

/**
* 将整个文件读入一个字符串
* @param filename 要读取的文件的名称。
* @param data 要写入的数据。类型可以是 string，array 或者是 stream 资源（如上面所说的那样）。如果 data 指定为 stream 资源，这里 stream 中所保存的缓存数据将被写入到指定文件中，这种用法就相似于使用 stream_copy_to_stream() 函数。
* @param context stream_context_create() 创建的有效的上下文（context）资源。 如果你不需要自定义 context，可以用 null 来忽略。
* @param offset 读取原始数据流的开始位置偏移量。负的 offset 会从数据流的末尾开始统计。远程文件不支持偏移量寻址（offset）。 对远程文件以较小的 offset 可能可以正常寻址， 但由于是对缓冲流进行操作，所以操作结果不可预测。
* @param length 要读取数据的最大长度。 默认情况下会读到文件末尾。 注意，该参数会应用到处理 stream 的过滤器（filter）中。
*/
declare function file_get_contents(filename:string, use_include_path?:boolean, context?:Resource, offset?:number, length?:number): string|false;

/**
* 将数据写入文件
* @param filename 要写入的文件的名称。
* @param use_include_path 常量 FILE_USE_INCLUDE_PATH 用于触发搜索 include path。 因为 FILE_USE_INCLUDE_PATH 是个 int，如果开启了严格类型 将无法启用。 所以要用 true 来代替常量。
* @param flags flags 的值可以是 以下 flag 使用 OR (|) 运算符进行的组合。
* @param context stream_context_create() 创建的有效的上下文（context）资源。 如果你不需要自定义 context，可以用 null 来忽略。
*/
declare function file_put_contents(filename:string, data?:any, flags?:number, context?:Resource): int|false;


/**
* 打开文件
* @param filename
* 如果 filename 是 "scheme://..." 的格式，则被当成一个 URL，PHP 将搜索协议处理器（也被称为封装协议）来处理此模式。如果该协议尚未注册封装协议，PHP 将发出一条消息来帮助检查脚本中潜在的问题并将 filename 当成一个普通的文件名继续执行下去。
* 如果 PHP 认为 filename 指定的是一个本地文件，将尝试在该文件上打开一个流。该文件必须是 PHP 可以访问的，因此需要确认文件访问权限允许该访问。如果激活了 open_basedir 则会应用进一步的限制。
* 如果 PHP 认为 filename 指定的是一个已注册的协议，而该协议被注册为一个网络 URL，PHP 将检查并确认 allow_url_fopen 已被激活。如果关闭了，PHP 将发出一个警告，而 fopen 的调用则失败。
* @param mode 参数指定了所要求到该流的访问类型。
* @param use_include_path
* 如果也需要在 include_path 中搜寻文件的话，可以将可选的第三个参数 use_include_path 设为 '1' 或 true。
* @param context
* 上下文流（context stream） resource。
*/
declare function fopen(
    filename:string,
    mode?:'r'|'r+'|'w'|'w+'|'a'|'a+'|'x'|'x+'|'c'|'c+'|'e',
    use_include_path?:boolean,
    context?:Resource
): Resource|false


/**
* 新建目录
* @param directory 目录的路径。
* 小技巧：如已启用fopen 包装器，在此函数中， URL 可作为文件名。关于如何指定文件名详见 fopen()。各种 wapper 的不同功能请参见 支持的协议和封装协议，注意其用法及其可提供的预定义变量。
* @param permissions
* 默认权限是 0777，意味着最大可能的访问权。有关权限的更多信息请阅读 chmod() 页面。
* 注意:permissions 在 Windows 下被忽略。
* 注意也许想用八进制数指定 permissions，也就是说该数应以零打头。permissions 也会被当前的 umask 修改，可以用 umask() 来改变。
* @param recursive
* 如果为 true，还将会创建指定 directory 的任何父级目录，并具有相同的权限。
* @param context 上下文流（context stream） resource。
*/
declare function mkdir(
    directory:string,
    permissions?:int,
    recursive?:boolean,
    context?:Resource
): boolean


/**
* 延缓执行
*/
declare function sleep(seconds:uint):number;

/**
* 延缓执行
*/
declare function usleep(microseconds:uint):void;

/**
* 延缓执行若干秒和纳秒
*/
declare function time_nanosleep(seconds:uint, nanoseconds:uint):boolean;

/**
* 使脚本睡眠到指定的 timestamp。
*/
declare function time_sleep_until(timestamp:float): boolean;

/**
* 生成一个唯一ID
* @param prefix 有用的参数。例如：如果在多台主机上可能在同一微秒生成唯一ID。
* prefix为空，则返回的字符串长度为 13。more_entropy 为 true，则返回的字符串长度为 23。
* @param  more_entropy
* 如果设置为 true，uniqid() 会在返回的字符串结尾增加额外的熵（使用线性同余组合发生器）。 使得唯一ID更具唯一性。
*/
declare function uniqid(prefix?:string, more_entropy?:boolean): string;

/**
*  Unpack data from binary string
* @param format
* @param  strValue
* @param offset
*/
declare function unpack(format:string, strValue:string, offset?:number): ArrayMappingType<string> | false;

/**
*  数据打包成二进制字符串
* @param format
* 字符串由格式代码组成，后面跟着一个可选的重复参数。
* 重复参数可以是一个整数值或者 * 值来重复到输入数据的末尾。
* 对于 a, A, h, H 格式化代码，其后的重复参数指定了给定数据将会被使用几个字符串。
* 对于 @，其后的数字表示放置剩余数据的绝对定位（之前的数据将会被空字符串填充），
* 对于其他所有内容，重复数量指定消耗多少个数据参数并将其打包到生成的二进制字符串中
* @param  ...values
*/
declare function pack(format:string, ...values): string | false;

/**
*  输出一个消息并且退出当前脚本
*/
declare function exit(status?:int): void


/**
*  检查某个名称的常量是否存在
*/
declare function defined(name:string): boolean;

/**
*  定义一个常量
*/
declare function define(name:string, value:ScalarValueType | array, insensitive?:boolean): boolean;

/**
*  Returns the value of a constant
*/
declare function constant(name:string):ScalarValueType | array;


declare function deg2rad(num:number): float;
declare function rad2deg(num:number): float;

declare function strtotime(datetime:string, baseTimestamp?:number): int|false;

/**
* Get now unix timestamp. sec unit
*/
declare function time():uint;

/**
* Get now unix date
*/
declare function date(format:string, time?:number ):string;

/**
* @param value 要过滤的内容。注意：标量值在过滤前，会被转换成字符串。
* @param filter
* @param options 一个选项的关联数组，或者按位区分的标示。如果过滤器接受选项，可以通过数组的 "flags" 下标去提供这些标示。 对于回调型的过滤器，应该传入 callable。 
*                这个回调函数必须接受一个参数（即待过滤的值），并且返回一个在过滤/净化后的值。
* @return any
*/
declare function filter_var<T=any>(value:T, filter?:number, options?:{
    options?:{
        default?:any,
        min_range?:any
    },
    flags?:number
} | (value)=>any):T | false;