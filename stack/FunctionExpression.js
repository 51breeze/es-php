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

        const body = this.stack.body && this.make(this.stack.body);
        const paramItems = this.stack.params;
        const before = [];
        const params = paramItems.map( item=>{
            return this.make(item);
        });
        let key = this.stack.isConstructor ? '__construct' : (this.stack.key ? this.stack.key.value() : null);
        const method = !!this.stack.parentStack.isMethodDefinition;
        const endIndent = this.getIndent();
        const startIndent = this.stack.parentStack.isBlockStatement ? endIndent : '';
        const variableRefs = !method ? this.getVariableRefs() : null;
        const useVariables = variableRefs ? 'use('+Array.from( variableRefs.values() ).map( stack=>`&\$${stack.value()}` ).join(", ")+')' : '';
        if( this.stack.isArrowFunctionExpression && this.stack.scope.isExpression ){
            const content = before.concat(insertBefore.splice(0), this.semicolon(`${this.getIndent(1)}return ${body}`) ).join("\r\n");
            return `${startIndent}function(${params.join(",")})${useVariables}{\r\n${content}\r\n${endIndent}}`;
        }else{
            const content = before.concat(insertBefore.splice(0),body);
            if( method ){
                const type = this.getTypeName( this.stack.type(true) );
                const typeName = type ? ':'+type : '';
                if( this.stack.parentStack.isAccessor ){
                    key = this.stack.parentStack.isMethodGetterDefinition ? 'get'+this.firstToUpper( key ) : 'set'+this.firstToUpper( key );
                }
                if( this.module.isInterface ){
                    return `function ${key}(${params.join(",")})${typeName};`;
                }
                return `function ${key}(${params.join(",")})${typeName}{\r\n${content.join("\r\n")}\r\n${endIndent}}`;
            }else if( this.stack.isFunctionDeclaration ){
                return `${startIndent}function ${key}(${params.join(",")})${useVariables}{\r\n${content.join("\r\n")}\r\n${endIndent}}`;
            }
            return `${startIndent}function(${params.join(",")})${useVariables}{\r\n${content.join("\r\n")}\r\n${endIndent}}`;
        }
    }
}

module.exports = FunctionExpression;