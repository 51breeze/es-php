const Syntax = require("../core/Syntax");
class PropertyDefinition extends Syntax{
    emitter() {
        const name = this.stack.id.value();
        const init = this.stack.init ? this.make(this.stack.init) : `null`;
        if( this.stack.kind ==="const" && this.stack.static ){
            return `const ${name} = ${init}`;
        }
        return `\$${name} = ${init};`;
    }
}

module.exports = PropertyDefinition;