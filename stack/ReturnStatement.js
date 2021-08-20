const Syntax = require("../core/Syntax");
class ReturnStatement extends Syntax{
    emitter(){
        const argument = this.stack.argument;
        if( !argument ){
            return this.semicolon(`return`);
        }
        let value = this.make(argument);
        if( argument.isIdentifier ){
            value = this.createArrayRefs(argument.description(), value);
        }
        const stack = this.stack.getParentStack( stack=>!!stack.isFunctionExpression );
        if( stack && stack.async ){
            this.addDepend("Promise");
            return this.semicolon(`return Promise::getInstance(${value})`);
        }
        return this.semicolon(`return ${value}`);
    }
}

module.exports = ReturnStatement;