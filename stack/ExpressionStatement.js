const Syntax = require("../core/Syntax");
class ExpressionStatement extends Syntax{
    emitter(){
        const value = this.make(this.stack.expression);
        return this.semicolon( value );
    }
}
module.exports = ExpressionStatement;