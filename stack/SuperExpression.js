const Syntax = require("../core/Syntax");
class SuperExpression  extends Syntax {
    emitter(){
        return `parent`;
    }
}

module.exports = SuperExpression;