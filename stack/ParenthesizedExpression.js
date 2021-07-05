const Syntax = require("../core/Syntax");
class ParenthesizedExpression extends Syntax{
    emitter(){
        if( this.stack.parentStack.isExpressionStatement || this.parentStack.isNewExpression ){
            return this.make(this.stack.expression);
        }
        return `(${this.make(this.stack.expression)})`;
    }
}

module.exports = ParenthesizedExpression;