const Syntax = require("../core/Syntax");
class Identifier extends Syntax{
     emitter(){
          let desc = this.stack.description();
          if( desc.isProperty && desc.parentStack.isObjectPattern ){
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