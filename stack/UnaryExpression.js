const Syntax = require("../core/Syntax");
class UnaryExpression extends Syntax {
   emitter(){
       const argument = this.make(this.stack.argument);
       const operator = this.stack.node.operator;
       const prefix   = this.stack.node.prefix;
       if( prefix ){
         if( operator==="typeof"){
            this.addDepend( this.stack.getModuleById("System") );
            return `System::typeof(${argument})`;
         }
         return `${operator}${argument}`;
       }
       return `${argument}${operator}`;
   }
}

module.exports = UnaryExpression;