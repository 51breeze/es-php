const Syntax = require("../core/Syntax");
class Identifier extends Syntax{
     emitter(){
          let desc = this.stack.description();
          if( desc && desc.parentStack && desc.parentStack.isDeclaratorVariable ){
               if( this.compiler.callUtils("isTypeModule",desc.type() ) ){
                    this.addDepend( desc.type() );
                    return desc.type().toString();
               }
          }
          if( desc && desc.isProperty && desc.parentStack.isObjectPattern ){
               this.addVariableRefs( desc );
               return `\$${this.stack.value()}`;
          }
          if( desc && desc.isDeclarator && desc.isStack ){
              this.addVariableRefs( desc );
              return `\$${this.stack.value()}`;
          }
          return this.stack.value();
     }
}
module.exports = Identifier;