const Syntax = require("../core/Syntax");
class ClassDeclaration extends Syntax{
    emitStack(item,isStatic){
        if( !item )return null;
        const metaTypes = item.metatypes;
        const annotations = item.annotations;
        const modifier = item.modifier ? item.modifier.value() : 'public';
        if( !this.checkMetaTypeSyntax(metaTypes) ){
            return null;
        }
        const items = [];
        if( isStatic ){
            items.push("static");
        }
        items.push( modifier );
        items.push( this.make(item) );
        return items.join(" ");
    }

    buildExternal(){
        const stack = this.parentStack.parentStack;
        if( stack && stack.externals.length > 0 ){
            const externals = stack.externals.map( item=>this.make(item) ).filter(item=>!!item);
            if( externals.length > 0 ){
                return [ 
                    this.semicolon('/*externals code*/'),
                    this.semicolon(externals.join("\r\n"))
                ].join("\r\n");
            }
        }
        return null;
    }

    emitter(){
        const module = this.module;
        const methods = module.methods;
        const members = module.members;
        const content = [];
        const refs = [];
        const staticName = this.stack.static ? 'static' : '';
        const abstract = !staticName && this.stack.abstract ? 'abstract' : '';
        const push = (content,value)=>{
            value && content.push( value );
        }
        const emitter=(target,content,isStatic)=>{
            for( var name in target ){
                const item = target[ name ];
                if( item.isAccessor ){
                    push(content, this.emitStack(item.get,isStatic) );
                    push(content, this.emitStack(item.set,isStatic) );
                }else{
                    push(content, this.emitStack(item,isStatic) );
                }
            }
        }

        const imps = this.getImps(module);
        const inherit = this.getInherit(module);
        
        emitter( methods, content, true);
        emitter( members, content, false);

        const defaultConstructor=[];
        if( inherit ){
            defaultConstructor.push(`public function __construct(){`);
            defaultConstructor.push( this.semicolon(`\tparent::__construct()`) );
            defaultConstructor.push('}');
        }
        const construct = module.methodConstructor ? this.emitStack(module.methodConstructor,false) : `${defaultConstructor.join("\r\n")}`;
        const external = this.buildExternal();
        this.createDependencies(module,refs);

        const body = [];
        if( module.namespace.identifier){
            push(body, `namespace ${module.namespace.getChain().join("\\\\")};` );
        }
        push(body, staticName);
        push(body, abstract);
        push(body, 'class');
        push(body, module.id );
        push(body,  inherit ? `extends ${this.getReferenceNameByModule(inherit)}` : null);
        push(body,  imps.length > 0 ? `implements ${imps.map(impModule=>this.getReferenceNameByModule(impModule)).join(",")}` : null);
        const parts = refs.concat(body.join(" ")+'{', '\t'+[construct].concat(content).join("\r\n").replace(/\r\n/g,'\r\n\t'),'}');
        if( external ){
            parts.push( external );
        }
        return '<?php\r\n'+parts.join("\r\n");
    }
}

module.exports = ClassDeclaration;