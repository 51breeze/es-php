const Syntax = require("../core/Syntax");
class ReturnStatement extends Syntax{
    emitter(){
        const argument = this.stack.argument && this.make( this.stack.argument);
        return this.semicolon(`return ${argument}`);
    }
}

module.exports = ReturnStatement;