const Syntax = require("../core/Syntax");
class BreakStatement extends Syntax{
    emitter(){
        if( this.stack.label ){
            const label = this.stack.label.value();
            return this.semicolon(`goto ${label}`);
        }
        return this.semicolon(`break`);
    }
}
module.exports = BreakStatement;