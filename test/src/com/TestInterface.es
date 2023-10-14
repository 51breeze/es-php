package com{
    public interface TestInterface {
        get personName():string
        set personName(val:string):void
        avg<T extends string,B>(a):void
        method( name:string, age:int):any
    }
}