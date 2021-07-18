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
                if( this.stack.init.isMemberExpression || this.stack.init.isCallExpression || this.stack.init.isIdentifier){
                    const originType = this.compiler.callUtils("getOriginType", type );
                    if( originType.id === "Array" ){
                        this.addAssignAddressRef( this.stack, this.stack.init );
                        refs = '&';
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