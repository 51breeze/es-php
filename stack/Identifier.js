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
          if( desc.isModule && !(this.stack.parentStack.isNewExpression || this.stack.parentStack.isMemberExpression) && this.compiler.callUtils("isTypeModule",desc) ){
               this.addDepend( desc );
               if( this.stack.parentStack.isBinaryExpression ){
                    return this.getReferenceNameByModule(desc, true);
               }
               return this.getClassStringName( desc, true);
          }
          return this.stack.value();
     }
}
module.exports = Identifier;