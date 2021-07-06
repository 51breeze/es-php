const Syntax = require("../core/Syntax");
class EnumDeclaration extends Syntax{
    makeEnum(){
        const module = this.module;
        const inherit = this.getInherit(module);
        const content = [];
        const refs = [];
        const properties = [];
        const emitter=(target,content)=>{
            for( var name in target ){
                const item = target[ name ];
                const value = this.make(item);
                content.push(`\tpublic const ${name} = ${value};`);
                properties.push(`case ${value} : return '${name}';`);
            }
        }
        emitter( module.methods, content );
        properties.push(`default: return null;`);
        content.push(`\tstatic public function getName($value){\r\n\t\tswitch($value){\r\n\t\t\t${properties.join("\r\n\t\t\t")}\r\n\t\t}\r\n\t}`)
        
        if( module.namespace.identifier){
            refs.push(`namespace ${module.namespace.getChain().join("\\\\")};` );
        }
        
        this.createDependencies(module,refs);

        const body = [];
        body.push( 'class' );
        body.push( module.id);
        if( inherit ){
            body.push( `extends ${this.getReferenceNameByModule(inherit)}`);
        }
        const parts = refs.concat(body.join(" ")+'{', content.join("\r\n") ,"}");
        return '<?php\r\n'+ parts.join("\r\n");
    }

    emitter(){
        if( this.stack.parentStack.isPackageDeclaration ){
            return this.makeEnum();
        }
        const name = '\$'+this.stack.value();
        const properties = this.stack.properties.map( item=>{
            const key = item.value();
            const value = this.make(item.init);
            return this.semicolon(`${name}[${name}->${key}=${value}]='${key}'`);
        });
        properties.unshift( this.semicolon(`${name}=new \\ArrayObject([], \\ArrayObject::STD_PROP_LIST | \\ArrayObject::ARRAY_AS_PROPS)`) );
        return properties.join("\r\n");
    }
}

module.exports = EnumDeclaration;