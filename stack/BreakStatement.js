const Syntax = require("../core/Syntax");
class BreakStatement extends Syntax{
    emitter(){
        let index = 0;
        if( this.stack.label ){
            const label = this.stack.label.value();
            this.stack.getParentStack( stack=>{
                if(stack.isForOfStatement || stack.isForInStatement || stack.isForStatement || stack.isSwitchStatement || stack.isDoWhileStatement || stack.isWhileStatement){
                    index++;
                }
                if( stack.isLabeledStatement && stack.label.value() === label ){
                    return true;
                }
                return !!stack.isFunctionExpression;
            })
            //return this.semicolon(`goto ${label}`);
        }
        if( index > 0 ){
            return this.semicolon(`break ${index}`);
        }
        return this.semicolon(`break`);
    }
}
module.exports = BreakStatement;