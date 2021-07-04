const Syntax = require("../core/Syntax");
class ThisExpression  extends Syntax {
    emitter(){
        return `$this`;
    }
}
module.exports = ThisExpression;