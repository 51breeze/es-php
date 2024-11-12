declare var _SERVER:Record;
declare var _GET:Record;
declare var _POST:Record;
declare var _FILES:Record;
declare var _REQUEST:Record;
declare var _SESSION:Record;
declare var _ENV:Record;
declare var _COOKIE:Record;
declare interface Resource{}
declare interface ArrayMapping<T=any> extends Array<T>{
    [key:string]:T
    [key:number]:T
}
//标量类型
declare type Scalar = string | number | boolean | null;
//引用内存地址类型
declare type RMD<T> = T;
//对象保护类型
declare type ObjectProtector<T> = T;
//数组保护类型
declare type ArrayProtector<T> = T;
//通用回调类型
declare type GeneralCallback<T=any,R=any> = [string, string] | (...args:T[])=>R;

package asset{
    declare class Manifest{
        static all():Record<any>
        static get(name:string):null | Record<Record<any>>
    }
}