package com;
import web.VNode;
public class JSXNode extends VNode{
    type:string;
    attr:{[key:string]:any};
    children:VNode[];
    props?:{[key:string]:any};
    key:string|number;
    constructor(type:string, attr:any, children:JSXNode[]){
        super(type, attr, children)
        this.type = type;
        this.attr = attr;
        this.children = children instanceof Array ?  children : [];

        renderToString(this)

        createVNode('div');
    }
}