const Syntax = require("../core/Syntax");
class SwitchStatement  extends Syntax {
    emitter() {
        const condition = this.make(this.stack.condition);
        const indent = this.getIndent();
        const cases = this.stack.cases.map( item=>this.make(item) ).join("\r\n");
        return `${indent}switch(${condition}){\r\n${cases}\r\n${indent}}`;
    }
}

module.exports = SwitchStatement;