const Syntax = require("../core/Syntax");
class IfStatement extends Syntax{
    emitter(){
        const condition = this.make(this.stack.condition);
        const consequent = this.make(this.stack.consequent);
        const indent = this.getIndent();
        const alternate = this.stack.alternate && this.make(this.stack.alternate);
        if( alternate ){
            return `${indent}if(${condition}){\r\n${consequent}\r\n${indent}}else{\r\n${alternate}\r\n${indent}}`;
        }
        return `${indent}if(${condition}){\r\n${consequent}\r\n${indent}}`;
    }
}

module.exports = IfStatement;