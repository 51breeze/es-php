declare var _SERVER:ArrayMapping<any>;
declare var _GET:ArrayMapping<any>;
declare var _POST:ArrayMapping<any>;
declare var _FILES:ArrayMapping<any>;
declare var _REQUEST:ArrayMapping<any>;
declare var _SESSION:ArrayMapping<any>;
declare var _ENV:ArrayMapping<any>;
declare var _COOKIE:ArrayMapping<any>;

declare interface Resource{}

declare interface ArrayMapping<T=any> extends Array<T>{
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