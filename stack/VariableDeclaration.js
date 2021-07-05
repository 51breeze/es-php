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

        const declarations = declareBefore.concat(this.stack.declarations.map( item=>{
            return this.make(item)
        }));
        if( this.stack.flag ){
            return `${declarations.join(",")}`;
        }
        return this.semicolon(`${declarations.join(",")}`);
   }
}

module.exports = VariableDeclaration;