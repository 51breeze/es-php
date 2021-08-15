const Syntax = require("../core/Syntax");
class ForStatement extends Syntax{
    emitter(){
        const condition = this.stack.condition ? this.make(this.stack.condition) : '';
        const update = this.stack.update ? this.make(this.stack.update) : '';
        const indent = this.getIndent();
        const init = this.stack.init ? this.make(this.stack.init) : '';
        const body = this.stack.body && this.make(this.stack.body);
        if( !this.stack.body ){
            return this.semicolon(`${indent}for(${init};${condition};${update})`);
        }
        if( body ){
            return `${indent}for(${init};${condition};${update}){\r\n${body}\r\n${indent}}`;
        }
        return `${indent}for(${init};${condition};${update}){\r\n${indent}}`;
    }
}

module.exports = ForStatement;