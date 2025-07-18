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

package manifest{

    declare class Annotations{
        static getMetadata():Record<any>
        static getWrapper(classObject:class<any>):null | MetadataWrapper;
    }

    declare class Assets{
        static all():string[]
        static path(id):null | string
        static get(id:string):null | string
    }

    declare class Comments{
        static getMetadata():Record
        static getWrapper(classObject:class<any>):null | MetadataWrapper;
    }

    declare class MetadataWrapper{

        static const TOP:string;
        static const CONSTRUCT:string;
        static const METHOD:string;
        static const GETTER:string;
        static const SETTER:string;
        static const PROPERTY:string;

        constructor(data:Record);
        getMetadata():Record<Record<any>,string>;
        get(methodName:string, kind:string=MetadataWrapper.METHOD):null | Record;
        values():{name:string,kind:string,comment:Record}[];
        forEach(callback:(comment:Record, name?:string, kind?:string)=>void):void;
        forMap<T>(callback:(comment:Record, name?:string, kind?:string)=>T):T[];
    }

}

package web{
    declare class VNode implements global.VNode{}
}

package web.components{

    @WebComponent
    declare class Component{
        constructor(props?:Record<any>);
        @Noop
        protected onInitialized():void;
        @Noop
        protected onErrorCaptured():void;
        @Noop
        render():VNode | Component;
        get parent():Component
        get children():Component[];
        getRefs(name:string);
        hasSlot(name?:string):boolean;
        renderSlot(name?:string,props?:Record,fallback?:(...args)=>(VNode | Component)[]):VNode;
        forceUpdate();
        provide(name:string, provider:()=>any):void;
        inject<T=any>(name:string, from?:string, defaultValue?:T):T;
        toValue<T>(value:T): T;
        getAttribute<T=any>(name:string):T;
    }
}

declare function renderToString(vnode:web.VNode | web.components.Component):string;
declare function createVNode(component:string | web.components.Component, attrs?:Record<any>, children?:string | web.components.Component[]):VNode;