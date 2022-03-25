const Syntax = require("../core/Syntax");
class VariableDeclaration extends Syntax {
    emitter(){
        let declareBefore = [];
        this.stack.removeAllListeners("insertDeclareBeforeEmit")
        this.stack.addListener("insertDeclareBeforeEmit",(event)=>{
            if( event && event.name){
                declareBefore.push(event.name);
            }
        });

        const inFor = this.stack.flag;
        const declarations = declareBefore.concat(this.stack.declarations.map( item=>{
            if( inFor || item.isPattern ){
                return this.make(item);
            }else{
                return this.semicolon(this.make(item));
            }
           
        }));
        if( inFor ){
            if( declarations.length > 1 ){
                return `(${declarations.join(", ")})`;
            }else{
                return `${declarations[0]}`;
            }
        }
        return declarations.join("\r\n");
   }
}

module.exports = VariableDeclaration;