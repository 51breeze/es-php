const Syntax = require("../core/Syntax");
class ObjectPattern extends Syntax {
    emitter(){
        return this.stack.properties.map( item=> {
            return this.semicolon( this.make(item) );
        }).join('\r\n');
    }
}

module.exports = ObjectPattern;