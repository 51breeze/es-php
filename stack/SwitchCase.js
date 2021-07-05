const Syntax = require("../core/Syntax");
class SwitchCase  extends Syntax {
   emitter(){
      const condition = this.make(this.stack.condition && this.stack.condition);
      const indent = this.getIndent();
      const consequent = this.stack.consequent.map( item=>this.make(item) ).join("\r\n");
      if( condition ){
         return `${indent}case ${condition} :\r\n${consequent}`;
      }
      if( consequent ){
         return `${indent}default:\r\n${consequent}`;
      }
      return `${indent}default:`;
   }
}

module.exports = SwitchCase;