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
        const stack = this.parentStack.parentStack || this.parentStack;
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

    createComment(items, comment, indent='\t'){
        let def = comment ? comment.map( item=>{
            if( item.type === "Block" ){
                return `${indent}* `+item.value.split(/\r?\n/).map( val=>{
                    return val.replace(/^[\s\*\t]+/,'');
                }).filter( val=>!!val ).join(`\r\n${indent}* `);
            }
            return '';
        }).join("") : '';
        def = def ? def+'\r\n' : def;
        return `${indent}/**\r\n`+items.map( item=>{
            return `${indent}* @${item.action} ${item.name}`
        }).join("\r\n")+`\r\n${def}${indent}*/`;
    }

    emitter(){
        const module = this.module;
        const methods = module.methods;
        const members = module.members;
        const content = [];
        const refs = [];
        const staticName = this.stack.static ? 'static' : '';
        const abstract = !staticName && this.stack.abstract ? 'abstract' : '';
        const push = (content, value, comment, flag=false, indent='\t')=>{
            if(value){
                value = value.replace(/\r\n/g,'\r\n\t');
                if( comment ){
                    value = comment+'\r\n'+indent+value;
                }else{
                    value = indent+value;
                }
                if( flag ){
                    content.unshift(value);
                }else{
                    content.push(value);
                }
            }
        }
        const emitter=(target,content,isStatic)=>{
            for( var name in target ){
                const item = target[ name ];
                if( item.isAccessor ){
                    let comment = '';
                    if(item.get){
                        comment = this.createComment([
                            {action:"getter",name:name},
                        ],item.get.comments);
                    }
                    push(content, this.emitStack(item.get,isStatic), comment );
                    if(item.set){
                        comment = this.createComment([
                            {action:"setter",name:name},
                        ],item.set.comments);
                    }
                    push(content, this.emitStack(item.set,isStatic), comment );
                }else{
                    let comment = '';
                    if( item.isMethodDefinition ){
                        comment = this.createComment([
                            {action:"method",name:name},
                        ],item.comments);
                    }else{
                        comment = this.createComment([
                            {action:"property",name:name},
                        ], item.comments);
                    }
                    push(content, this.emitStack(item,isStatic), comment );
                }
            }
        }

        const imps = this.getImps(module);
        const inherit = this.getInherit(module);
        
        emitter( methods, content, true);
        emitter( members, content, false);

        const accessorNames = this.getAccessorNamesByModule( module );
        if( accessorNames ){
            const setCase= [];
            const getCase= [];
            const indent = this.getIndent();
            ['get','set'].forEach( type=>{
                const map = accessorNames[type] || {};
                for(var key in map){
                    if( type==="get"){
                        getCase.push( this.semicolon(`\t\t\tcase '${key}' : return $this->${map[key]}()`) );
                    }else if( type==="set"){
                        setCase.push( this.semicolon(`\t\t\tcase '${key}' : $this->${map[key]}( $value ); break`) );
                    }
                }
            });
            if( getCase.length > 0 ){
                content.push(`\tpublic function __get( $name ){\r\n${indent}\t\tswitch($name){\r\n${getCase.join("\r\n")}\r\n${indent}\t\t}\r\n\t}`)
            }
            if( setCase.length > 0 ){
                content.push(`\tpublic function __set( $name, $value ){\r\n${indent}\t\tswitch($name){\r\n${setCase.join("\r\n")}\r\n${indent}\t\t}\r\n\t}`)
            }
        }

        const construct = module.methodConstructor ? this.emitStack(module.methodConstructor,false) : null;
        const external = this.buildExternal();
        this.createDependencies(module,refs);

        if( construct ){
            const comment = module.methodConstructor ? module.methodConstructor.comments : null;
            const commentItems = [
                {action:"constructor",name:module.id},
            ];
            push(content,construct,this.createComment(commentItems, comment), true);
        }

        const classCommentItems = [
            {action:"class",name:module.id}
        ];
        if(module.implements && module.implements.length > 0){
            classCommentItems.push({
                action:"implements",
                name:module.implements.map( item=>this.getReferenceNameByModule(item,true) ).join(",")
            });
        }
        if(module.extends && module.extends.length > 0){
            classCommentItems.push({
                action:"inherit",
                name:module.extends.map( item=>this.getReferenceNameByModule(item,true) ).join(",")
            });
        }

        const body = [];
        if( module.namespace.identifier){
            refs.unshift(`namespace ${module.namespace.getChain().join("\\\\")};`);
        }
        staticName && body.push( staticName );
        abstract && body.push( abstract );
        body.push( 'class' );
        body.push( module.id );
        inherit && body.push( `extends ${this.getReferenceNameByModule(inherit)}` );
        imps.length > 0 && body.push( `implements ${imps.map(impModule=>this.getReferenceNameByModule(impModule)).join(",")}` );
        const parts = refs.concat(this.createComment(classCommentItems, this.stack.comments,''),body.join(" ")+'{\r\n', content.join("\r\n\r\n"),'}');
        if( external ){
            parts.push( external );
        }
        return '<?php\r\n'+parts.join("\r\n");
    }
}

module.exports = ClassDeclaration;