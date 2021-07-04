const Syntax = require("../core/Syntax");
class MemberExpression extends Syntax{
   emitter(){
      const module = this.module;
      const property = this.stack.property.isIdentifier ? this.stack.property.value() : this.make(this.stack.property);
      const object = this.make(this.stack.object);
      const description = this.stack.description();
      let sep =  this.stack.object.isSuperExpression ? "::" : "->";
      if( description && description.isModule && this.compiler.callUtils("isTypeModule",description) ){
         this.addDepend( description );
      }else if( this.compiler.callUtils("isTypeModule",this.stack.object.description()) ){
         this.addDepend( this.stack.object.description() );
         sep = "::";
      }

      if(this.stack.computed){
         if( !this.compiler.callUtils("isLiteralObjectType", this.stack.object.type()) ){
            this.addDepend( this.stack.getModuleById("Reflect") );
            return `${this.checkRefsName("Reflect")}::get(${module.id},${object},${property})`;
         }
         return `${object}${sep}${property}`;
      }

      if( description && description.isType && description.isAnyType ){
         this.addDepend( this.stack.getModuleById("Reflect") );
         return `${this.checkRefsName("Reflect")}::get(${module.id},${object},"${property}")`;
      }

      if( description && description.isMethodGetterDefinition ){
         const name = this.firstToUpper(property);
         return `${object}${sep}get${name}()`;
      }

      if( this.compiler.callUtils("isClassType", description) ){
         return module.getReferenceNameByModule( description );
      }

      return `${object}${sep}${property}`;
   }
}

module.exports = MemberExpression;
