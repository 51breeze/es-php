const Syntax = require("../core/Syntax");
class NewExpression extends Syntax{
    emitter(){
        const callee= this.make(this.stack.callee);
        const desc = this.stack.callee.description();
        if( this.compiler.callUtils("isTypeModule",desc) ){
            this.addDepend( desc );
        }
        let refs = callee;
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