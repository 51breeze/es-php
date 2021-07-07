const Syntax = require("../core/Syntax");
class NewExpression extends Syntax{
    emitter(){
        const callee= this.make(this.stack.callee);
        const desc = this.stack.callee.description();
        if( this.compiler.callUtils("isTypeModule",desc) ){
            this.addDepend( desc );
        }
        let refs = callee;
        if( desc === this.stack.getModuleById("Array") ){
            let args=this.stack.arguments.map( item=> this.make(item) ).join(",");
            if( this.stack.arguments.length >0  ){
                if( this.stack.arguments.length === 1 ){
                    this.addDepend( this.stack.getModuleById("Array") );
                    return `es_array_new(${args})`;
                }
                return `[${args}]`;
            }
            return `[]`;
        }
        if( this.stack.callee.isParenthesizedExpression ){
            refs = '$'+this.generatorRefName(this.stack.callee, "_refClass", "new", ()=>{
                return callee;
            });
        }
        const args=this.stack.arguments.map( item=> this.make(item) ).join(",");
        return `new ${refs}(${args})`;
    }
}

module.exports = NewExpression;