const Syntax = require("../core/Syntax");
class VariableDeclarator extends Syntax {
    emitter(){
        if( this.stack.isPattern ){
            return this.make(this.stack.id);
        }else{

            let refs = null;
            const type = this.stack.init && this.stack.init.type();
            if( this.stack.init ){
                if( this.stack.init.isMemberExpression || this.stack.init.isCallExpression || this.stack.init.isIdentifier){
                    const originType = this.compiler.callUtils("getOriginType", type );
                    if( originType.id === "Array" ){
                        this.addAssignAddressRef( this.stack, this.stack.init );
                        if( !this.stack.init.isIdentifier ){
                            const size = this.stack.assignItems.size;
                            const desc = this.stack.init.description();
                            if( size > 1 ){
                                const assignItems = Array.from( this.stack.assignItems.values() );
                                const lastItem = assignItems.pop();
                                if( assignItems.some( value=>lastItem.scope !== value.scope ) ){
                                    refs = this.generatorVarName( desc, "_RD", false, this.scope );
                                }
                            }
                            if( !refs && (desc.isMethodGetterDefinition || this.stack.init.isCallExpression) ){
                                refs = this.generatorVarName( desc, "_RD", false, this.scope );
                            }
                        }
                        if( !refs ){
                            return null;
                        }
                    }
                }
            }

            const init = this.stack.init && this.make(this.stack.init);
            const name = this.stack.id.value();
            if( init && !type.isNullableType ){
                if( refs ){
                    return `\$${name} = \$${refs} = &${init}`;
                }
                return `\$${name} = ${init}`;
            }
            return null;
        }
    }
}

module.exports = VariableDeclarator;