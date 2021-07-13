const Syntax = require("../core/Syntax");
class ReturnStatement extends Syntax{
    emitter(){
        const argument = this.stack.argument;
        if( !argument ){
            return this.semicolon(`return`);
        }
        const desc = argument.description();
        const addressRef = this.getAssignAddressRef(desc);
        return this.semicolon(`return ${this.make( addressRef || argument)}`);
    }
}

module.exports = ReturnStatement;