const Syntax = require("../core/Syntax");
class Declarator  extends Syntax {
    emitter(){
        let desc = this.stack.description();
        if(desc && this.compiler.callUtils("isTypeModule",desc) ){
            this.module.addDepend( desc );
        }
        if( this.stack.acceptType && this.stack.isParamDeclarator ){
            const type = this.getTypeName( this.stack.acceptType.type() );
            if( type ){
                return `${type} \$${this.stack.value()}`;
            }
        }
        return `\$${this.stack.value()}`;
    }
}

module.exports = Declarator;