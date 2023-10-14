declare var _SERVER:ArrayMappingType<any>;
declare var _GET:ArrayMappingType<any>;
declare var _POST:ArrayMappingType<any>;
declare var _FILES:ArrayMappingType<any>;
declare var _REQUEST:ArrayMappingType<any>;
declare var _SESSION:ArrayMappingType<any>;
declare var _ENV:ArrayMappingType<any>;
declare var _COOKIE:ArrayMappingType<any>;

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
//对象保护类型
declare type ObjectProtector<T> = T;
//数据保护类型
declare type ArrayProtector<T> = T;
//通用调用类型
declare type GeneralCallback<T=any,R=void> = [string, string] | (...args:T[])=>R;

declare function require(path:string):any;
declare function require_once(path:string):any;
declare function include(path:string):any;
declare function include_once(path:string):any;

@Reference('./standard/basic.d.es');
@Reference('./core');
@Reference('./standard');
@Reference('./json');
@Reference('./spl');
@Reference('./bcmath');
@Reference('./date');
@Reference('./fileinfo');
@Reference('./filter');
@Reference('./gd');
@Reference('./hash');
@Reference('./iconv');
@Reference('./mongo');
@Reference('./mongodb');
@Reference('./mssql');
@Reference('./mysql');
@Reference('./mysqli');
@Reference('./pdo');
@Reference('./pgsql');
@Reference('./redis');