const Syntax = require("../core/Syntax");
class ForInStatement extends Syntax{
   emitter(){
      const left = this.make(this.stack.left.declarations[0].id);
      const right = this.make(this.stack.right);
      const body = this.stack.body && this.make(this.stack.body);
      const indent = this.getIndent();
      const refs =  '$'+this.generatorVarName(this.stack, '_item');
      if( !this.stack.body ){
         return this.semicolon(`foreach(${right} as ${left}=>${refs})`);
      }
      if( body ){
         return `${indent}foreach(${right} as ${left}=>${refs}){\r\n${body}\r\n${indent}}`;
      }
      return `${indent}foreach(${right} as ${left}=>${refs}){\r\n${indent}}`;
   }
}

module.exports = ForInStatement;