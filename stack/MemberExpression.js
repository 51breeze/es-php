const Syntax = require("../core/Syntax");
const Polyfill = require("../core/Polyfill");
class MemberExpression extends Syntax{

   intercept(desc,object,property){
      const type = this.compiler.callUtils("getOriginType", desc.type() );
      if( type && this.compiler.callUtils("isTypeModule",type) ){
         const name = type.id.toString();
         const polyModule = Polyfill.modules.get(name);
         if( polyModule && polyModule.method ){
            const result = polyModule.method(this, object, property, [], desc, this.compiler.callUtils("isTypeModule",desc) , true);
            if( result ){
               return result;
            }
         }
      }
      return null;
  }

   emitter(){
      const module = this.module;
      const property = this.stack.property.isIdentifier && !this.stack.computed ? this.stack.property.value() : this.make(this.stack.property);
      const result = this.intercept(this.stack.object.description(),this.stack.object,property);
      if( result ){
          return result;
      }
      const object = this.make(this.stack.object);
      const description = this.stack.description();
      let sep =  this.stack.object.isSuperExpression ? "::" : "->";
      if( description && description.isModule && this.compiler.callUtils("isTypeModule",description) ){
         this.addDepend( description );
         return this.getReferenceNameByModule( description );
      }else if( this.compiler.callUtils("isTypeModule",this.stack.object.description()) ){
         this.addDepend( this.stack.object.description() );
         sep = "::";
      }

      if(this.stack.computed){
         const objectDesc = this.stack.object.description();
         if( !this.isBaseType( this.stack.object.type() ) || (objectDesc.assignItems && objectDesc.assignItems.size > 1) ){
            this.addDepend( this.stack.getModuleById("Reflect") );
            return `${this.checkRefsName("Reflect")}::get(${this.getClassStringName(module)},${object},${property})`;
         }
         const tName = this.getTypeName( this.stack.object.type() );
         if( tName === "array" || tName ==="string" ){
            return `${object}[${property}]`;
         }
         if( this.stack.property.isLiteral ){
            return `${object}${sep}{${property}}`;
         }
         return `${object}${sep}${property}`;
      }

      if( description && description.isType && description.isAnyType ){
         this.addDepend( this.stack.getModuleById("Reflect") );
         return `${this.checkRefsName("Reflect")}::get(${this.getClassStringName(module)},${object},"${property}")`;
      }

      if( description && description.isMethodGetterDefinition ){
         const name = this.firstToUpper(property);
         return `${object}${sep}get${name}()`;
      }

      if( description && description.isMethodSetterDefinition ){
         const name = this.firstToUpper(property);
         return `${object}${sep}set${name}`;
      }
      
      return `${object}${sep}${property}`;
   }
}

module.exports = MemberExpression;
