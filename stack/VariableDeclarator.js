const Syntax = require("../core/Syntax");
class VariableDeclarator extends Syntax {
    emitter(){
        if( this.stack.isPattern ){
            return this.make(this.stack.id);
        }else{

            if( this.stack.useRefItems && this.stack.useRefItems.size === 0){
                return null;
            }

            let refs = null;
            const type = this.stack.init && this.stack.init.type();
            if( this.stack.init ){
                const maybeArrayRef = this.stack.init.isMemberExpression || this.stack.init.isCallExpression || this.stack.init.isIdentifier;
                if( maybeArrayRef ){
                    const originType = this.compiler.callUtils("getOriginType", type );
                    if( originType.id === "Array" ){
                        const initDesc = this.stack.init.description();
                        const address = this.addAssignAddressRef( this.stack, this.stack.init);
                        let needAddressRef = true;
                        if( initDesc.module === originType ){
                            const initDescType = initDesc.type();
                            needAddressRef = initDescType.isThisType || (initDescType.target && initDescType.target.isThisType);
                        }
                        if( needAddressRef ){
                            if( this.hasAssigned(this.stack) ){
                                const name = address.createName( initDesc );
                                refs = `\$${name} = &`;
                            }else{
                                refs = `&`;
                            }
                        }
                        if( this.hasCrossScopeAssignment(this.stack.assignItems) ){
                            const left = '$'+this.generatorVarName(this.stack,"_ARV")
                            const addressIndex = address.getIndex( this.stack.init );
                            this.insertExpression( this.stack, this.semicolon(`${left} = ${addressIndex}`) );
                        }
                    }
                }
            }

            const init = this.stack.init && this.make(this.stack.init);
            const name = this.stack.id.value();
            if( init && !type.isNullableType ){
                if( refs ){
                    return `\$${name} = ${refs}${init}`;
                }
                return `\$${name} = ${init}`;
            }
            return null;
        }
    }
}

module.exports = VariableDeclarator;