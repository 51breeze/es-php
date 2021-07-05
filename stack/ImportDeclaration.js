const Syntax = require("../core/Syntax");
class ImportDeclaration extends Syntax{
   emitter(){
      const classModule = this.stack.getModuleById( this.stack.specifiers.value() );
      if( this.isDependModule(classModule) ){
         console.log(  "===========", this.getReferenceNameByModule( classModule ) )
         return this.getReferenceNameByModule( classModule );
      }
      return null;
   }
}
module.exports = ImportDeclaration;