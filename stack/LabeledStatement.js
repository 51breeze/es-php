const Syntax = require("../core/Syntax");
class LabeledStatement extends Syntax{
    emitter(){
        //const label = this.stack.label.value();
        const body  = this.make(this.stack.body);
        //const indent = this.getIndent();
        //return `${indent}${label}:${body.replace(/^\t/g,'')}`;
        return body;
    }
}

module.exports = LabeledStatement;