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

//引用内存地址类型
declare type RMD<T> = T;
declare type ObjectProtector<T> = T;
declare type ArrayProtector<T> = T;
declare type GeneralCallback<T=any,R=void> = [string, string] | (...args:T[])=>R;