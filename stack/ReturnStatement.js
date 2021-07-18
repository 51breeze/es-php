const Syntax = require("../core/Syntax");
class ReturnStatement extends Syntax{
    emitter(){
        const argument = this.stack.argument;
        if( !argument ){
            return this.semicolon(`return`);
        }
        return this.semicolon(`return ${this.make( argument)}`);
    }
}

module.exports = ReturnStatement;