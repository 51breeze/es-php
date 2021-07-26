const Syntax = require("../core/Syntax");
class TemplateLiteral extends Syntax{
    emitter(){
        const expressions = this.stack.expressions.map( item=>this.make(item) );
        return this.stack.quasis.map( (item,index)=>{
            const value = item.value().replace(/\u0027/g,"\\'");
            const items = [];
            if( value ){
                items.push( `'${value}'` );
            }
            if( expressions[index] ){
                items.push( `(${expressions[index]})`);
            }
            return items.join(' . ')
        }).filter(value=>!!value).join(' . ');
    }
}
module.exports = TemplateLiteral;