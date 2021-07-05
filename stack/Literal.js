const Syntax = require("../core/Syntax");
class Literal extends Syntax{
     emitter(){
          const type = this.stack.type();
          if( type.toString().toLowerCase() === "regexp"){
               this.addDepend( this.stack.getModuleById("RegExp") );
               const args = this.stack.raw().split('/').filter( item=>!!item );
               return `(new RegExp('${args.join("','")}'))`;
          }
          return this.stack.raw();
     }
}
module.exports = Literal;