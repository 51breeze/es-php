const Syntax = require("../core/Syntax");
class NewExpression extends Syntax{
    emitter(){
        const callee= this.make(this.stack.callee);
        const desc = this.stack.callee.description();
        if( this.compiler.callUtils("isTypeModule",desc) ){
            this.addDepend( desc );
        }
        let refs = callee;
        const hasAssignmentExpression = this.stack.arguments.some( item=>!!item.isAssignmentExpression );
        const declareParams = desc.params;
        const args=this.stack.arguments.map( (item,index)=>{
            let value = this.make( item );
            if( declareParams && declareParams[index] && (hasAssignmentExpression || item.isArrayExpression) ){
                const declareType = declareParams[index].type();
                if( declareType ){
                    const originType = this.compiler.callUtils("getOriginType", declareType );
                    if( originType.id === "Array" ){
                        const name = '$'+this.generatorVarName(item,"_V" );
                        this.insertExpression( this.stack, this.semicolon(`${name} = ${value}`) );
                        return name;
                    }
                }
            }
            if( item.isIdentifier ){
                return this.createArrayRefs(item.description(), value);
            }
            return value;
        }).join(",");

        if( desc === this.stack.getModuleById("Array") ){
            if( this.stack.arguments.length >0  ){
                if( this.stack.arguments.length === 1 ){
                    this.addDepend( this.stack.getModuleById("Array") );
                    return `es_array_new(${args})`;
                }
                return `[${args}]`;
            }
            return `[]`;
        }

        if( this.stack.callee.isParenthesizedExpression ){
            refs = '$'+this.generatorRefName(this.stack.callee, "_refClass", "new", ()=>{
                return callee;
            });
        }
        
        return `new ${refs}(${args})`;
    }
}

module.exports = NewExpression;