const Syntax = require("../core/Syntax");
class ForOfStatement extends Syntax{
    emitter(){
        const left = this.make(this.stack.left);
        const right = this.make(this.stack.right);
        const body = this.stack.body && this.make(this.stack.body);
        const indent = this.getIndent();
        const condition = `${right} as ${left}`;
        if( !this.stack.body ){
            return this.semicolon(`${indent}foreach(${condition})`);
        }
        if( body ){
            return `${indent}foreach(${condition}){\r\n${body}\r\n${indent}}`;
        }
        return `${indent}foreach(${condition}){\r\n${indent}}`;
    }
}

module.exports = ForOfStatement;