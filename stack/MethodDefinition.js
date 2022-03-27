const Syntax = require("../core/Syntax");
const Builder = require("../core/Builder");
const annotations = ['post','get','put','option','delete'];
class MethodDefinition extends Syntax{
    emitter(){
        const annotation =  (this.stack.annotations||[]).find( item=>annotations.includes(item.name.toLowerCase()));
        if( annotation ){
            const data = this.make(annotation);
            Builder.Metadata.get('route').set( data.path, data);
        }
        return this.make(this.stack.expression);
    }
}

module.exports = MethodDefinition;