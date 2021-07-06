const Syntax = require("../core/Syntax");
class SuperExpression  extends Syntax {
    emitter(){
        if( this.parentStack.isCallExpression ){
            return `parent::__construct`;  
        }
        return `parent`;
    }
}

module.exports = SuperExpression;