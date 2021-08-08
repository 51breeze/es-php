const Syntax = require("../core/Syntax");
class LogicalExpression extends Syntax{
     emitter(){
          const left= this.make(this.stack.left);
          const right= this.make(this.stack.right);
          const operator = this.stack.node.operator;
          if( operator.charCodeAt(0) === 124 && operator.charCodeAt(1) === 124 ){
               return `${left} ?: ${right}`;
          }else if( operator.charCodeAt(0) === 38 && operator.charCodeAt(1) === 38 ){
               //return `${left} && ${right}`;
          }
          return `${left} ${operator} ${right}`;
     }
}

module.exports = LogicalExpression;