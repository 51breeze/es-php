const Syntax = require("../core/Syntax");
class FunctionExpression extends Syntax{
    emitter(){
        const insertBefore = [];
        this.stack.removeAllListeners( this.getEventName("insertBefore") )
        this.stack.addListener(this.getEventName("insertBefore"),(content)=>{
            if( content ){
                insertBefore.push(content);
            }
        });

        const paramItems = this.stack.params;
        const before = [];
        const params = paramItems.map( item=>{
            if( item.isObjectPattern ){
                const sName = '$'+this.stack.scope.generateVarName('_s',true);
                before.push( this.semicolon( `\t${sName} = ${sName} ?: new \\stdClass`) );
                item.properties.forEach( property=>{
                    const key = property.key.value();
                    if( property.hasInit ){
                        const initStack = property.init.isAssignmentPattern ? property.init.right : property.init;
                        insertBefore.push( this.semicolon( `\t$${key} = ${sName}->${key} ?? ${this.make(initStack)}`) );
                    }else{
                        insertBefore.push( this.semicolon( `\t$${key} = ${sName}->${key}`) );
                    }
                });
                return `object ${sName}`;
            }else if( item.isArrayPattern ){
                const sName = '$'+this.stack.scope.generateVarName('_s',true);
                before.push( this.semicolon( `\t${sName} = ${sName} ?: []`) );
                item.elements.forEach( (property,index)=>{
                    if( property.isAssignmentPattern ){
                        const key = property.left.value();
                        insertBefore.push( this.semicolon( `\t$${key} = ${sName}[${index}] ?? ${this.make(property.right)}`) );
                    }else{
                        const key = property.value();
                        insertBefore.push( this.semicolon( `\t$${key} = ${sName}[${index}]`) );
                    }
                });
                return `array ${sName}`;
            }

            const type = item.type();
            const originType = this.compiler.callUtils("getOriginType", type);
            let typeName = '';
            let defaultValue = '';
            if( !item.isAssignmentPattern && item.question ){
                defaultValue = '=null';
            }
            if(item.acceptType && item.isParamDeclarator && !item.isRestElement ){
                const t = this.getAvailableTypeName( item.acceptType.type() );
                if( t ){
                    typeName = t+' ';
                }
            }
            if( !item.isRestElement && originType.id === "Array" ){
                const desc = item.description();
                const has = item.isAssignmentPattern ? desc.assignItems.size > 1 : desc.assignItems.size > 0;
                if( has ){
                    const address = this.addAssignAddressRef(desc);
                    const refs = '$'+address.createName( desc );
                    if( item.isAssignmentPattern ){
                        const left = this.make( item.left );
                        before.push( this.semicolon(`\t${left} = ${refs}`) );
                    }else{
                        before.push( this.semicolon(`\t${this.make( item )} = ${refs}`) );
                    }
                    return typeName+'&'+refs+defaultValue;
                }
                return typeName+'&'+this.make(item)+defaultValue;
            }
            return typeName+this.make(item)+defaultValue;
        });

        let key = this.stack.isConstructor ? '__construct' : (this.stack.key ? this.stack.key.value() : null);
        const async = this.stack.async;
        const body = this.stack.body && this.make(this.stack.body);
        const method = !!this.stack.parentStack.isMethodDefinition;
        const endIndent = this.getIndent();
        const startIndent = this.stack.parentStack.isBlockStatement ? endIndent : '';
        const variableRefs = !method ? this.getVariableRefs() : null;
        const useVariables = variableRefs ? 'use('+Array.from( variableRefs.values() ).map( stack=>`&\$${stack.value()}` ).join(", ")+')' : '';
        const type = this.stack.type( this.stack.getContext(null,null,true) );
        if( this.stack.isArrowFunctionExpression && this.stack.scope.isExpression ){
            const content = before.concat(insertBefore.splice(0), this.semicolon(`${this.getIndent(1)}\treturn ${body}`) ).join("\r\n");
            return `${startIndent}function(${params.join(",")})${useVariables}{\r\n${content}\r\n${endIndent}}`;
        }else{
            const content = before.concat(insertBefore.splice(0),body);
            if( method ){
                let refsAddress = '';
                const originType = this.compiler.callUtils("getOriginType", type);
                if( originType.id === "Array" ){
                    const hasRefs = this.stack.scope.returnItems.some( (item)=>{
                        item = item.argument;
                        const type = item.type();
                        const originType = this.compiler.callUtils("getOriginType", type);
                        if( originType.id === "Array"){
                            if( item.isMemberExpression ){
                                return true;
                            }
                            const desc = item.description();
                            if( desc.isDeclarator && desc.isStack ){
                                return Array.from(desc.assignItems.values()).some(item=>{
                                    return !!item.isMemberExpression;
                                });
                            }
                        }
                        return false;
                    });
                    if( hasRefs ){
                        refsAddress='&';
                    }
                }

                let typeName = refsAddress ? this.getAvailableTypeName( type ) : this.stack._returnType ? this.getAvailableTypeName( this.stack._returnType.type() ) : null;
                typeName = typeName ? ':'+typeName : '';
                if( this.stack.parentStack.isAccessor ){
                    if( this.stack.parentStack.isMethodGetterDefinition ){
                        key = this.getAccessorName( this.stack.parentStack, 'get', key);
                    }else{
                        key = this.getAccessorName( this.stack.parentStack, 'set', key);
                    } 
                }
                if( this.module.isInterface ){
                    return `function ${key}(${params.join(",")})${typeName}`;
                }
                return `function ${refsAddress}${key}(${params.join(",")})${typeName}{\r\n${content.join("\r\n")}\r\n${endIndent}}`;
            }else if( this.stack.isFunctionDeclaration ){
                return `${startIndent}function ${key}(${params.join(",")})${useVariables}{\r\n${content.join("\r\n")}\r\n${endIndent}}`;
            }
            return `${startIndent}function(${params.join(",")})${useVariables}{\r\n${content.join("\r\n")}\r\n${endIndent}}`;
        }
    }
}

module.exports = FunctionExpression;