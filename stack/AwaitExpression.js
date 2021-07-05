const Syntax = require("../core/Syntax");
class AwaitExpression extends Syntax{
     emitter(){
          return this.make(this.stack.argument);
     }
}

module.exports = AwaitExpression;