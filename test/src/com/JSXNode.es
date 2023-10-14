package com;

public class JSXNode implements VNode{
    type:string;
    attr:{[key:string]:any};
    children:VNode[];
    props:{key:string};
    key:string|number;
    constructor(type:string, attr:any, children:JSXNode[]){
        this.type = type;
        this.attr = attr;
        this.children = children instanceof Array ?  children : [];
    }
}