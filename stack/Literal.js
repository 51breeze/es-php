const Syntax = require("../core/Syntax");
class Literal extends Syntax{
     emitter(){
          const type = this.stack.type();
          const regexp = this.stack.getGlobalTypeById('RegExp');
          if( type && (type === regexp || type.inherit === regexp) ){
               this.addDepend("RegExp");
               const args = this.stack.raw().split('/').filter( item=>!!item );
               const parent = this.stack.parentStack;
               if( parent && (parent.isVariableDeclarator || parent.isAssignmentExpression || parent.isAssignmentPattern) ){
                    return `new RegExp('${args.join("','")}')`;
               }
               return `(new RegExp('${args.join("','")}'))`;
          }
          return this.stack.raw();
     }
}
module.exports = Literal;