const Syntax = require("../core/Syntax");
class TypeTransformExpression extends Syntax{
     emitter(){
          const type = this.make(this.stack.typeExpression);
          const expre = this.make(this.stack.referExpression);
          return `(${type})${expre}`;
     }
}
module.exports = TypeTransformExpression;