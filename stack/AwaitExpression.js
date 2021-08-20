const Syntax = require("../core/Syntax");
class AwaitExpression extends Syntax{
     emitter(){
          this.addDepend("Promise");
          return `Promise::sent(${this.make(this.stack.argument)})`;
     }
}

module.exports = AwaitExpression;