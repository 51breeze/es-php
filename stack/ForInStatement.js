const Syntax = require("../core/Syntax");
const Polyfill = require("../core/Polyfill");
class ForInStatement extends Syntax{
   emitter(){
      const left = this.make(this.stack.left.declarations[0].id);
      let right = this.make(this.stack.right);
      const body = this.stack.body && this.make(this.stack.body);
      const indent = this.getIndent();
      let polyModule = Polyfill.modules.get('Object');
      if( polyModule && polyModule.method ){
         const result = polyModule.method(this, null, 'keys', [right], null, true, false, 'Object' );
         if( result ){
            right = result;
         }
      }
      if( !this.stack.body ){
         return this.semicolon(`foreach(${right} as ${left})`);
      }
      if( body ){
         return `${indent}foreach(${right} as ${left}){\r\n${body}\r\n${indent}}`;
      }
      return `${indent}foreach(${right} as ${left}){\r\n${indent}}`;
   }
}

module.exports = ForInStatement;