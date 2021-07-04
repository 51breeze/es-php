const Syntax = require("../core/Syntax");
class InterfaceDeclaration extends Syntax{

    emitStack(item,isStatic){
        if( !item )return null;
        const metaTypes = item.metatypes;
        const annotations = item.annotations;
        const modifier = item.modifier ? item.modifier.value() : 'public';
        if( !this.checkMetaTypeSyntax(metaTypes) ){
            return null;
        }
        const items = [];
        items.push( modifier );
        items.push( this.make(item) );
        return items.join(" ");
    }

    emitter(){
        const module = this.module;
        const members = module.members;
        const content = [];
        const refs = [];
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
        
        emitter( members, content, false);
        this.createDependencies(module,refs);

        const body = [];
        push(body, 'interface');
        push(body, module.id );
        push(body,  inherit ? `extends ${this.getReferenceNameByModule(inherit)}` : null);
        push(body,  imps.length > 0 ? `implements ${imps.map(impModule=>this.getReferenceNameByModule(impModule)).join(",")}` : null);
        const parts = refs.concat(body.join(" "),'{',content.join("\r\n"),'}');
        return parts.join("\r\n");
    }
}

module.exports = InterfaceDeclaration;