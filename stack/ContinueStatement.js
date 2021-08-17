const Syntax = require("../core/Syntax");
class ContinueStatement extends Syntax{
    emitter(){
        var index = 0;
        if( this.stack.label ){
            //return this.semicolon(`goto ${this.stack.label.value()}`); 
            const label = this.stack.label.value();
            this.stack.getParentStack( stack=>{
                if(stack.isForOfStatement || stack.isForInStatement || stack.isForStatement || stack.isSwitchStatement || stack.isDoWhileStatement || stack.isWhileStatement){
                    index++;
                }
                if( stack.isLabeledStatement && stack.label.value() === label ){
                    return true;
                }
                return !!stack.isFunctionExpression;
            });
        }
        if( index > 0 ){
            return this.semicolon(`continue ${index}`);
        }
        return this.semicolon('continue');
    }
}

module.exports = ContinueStatement;