const Syntax = require("../core/Syntax");
class MemberExpression extends Syntax{

   array_method(object,property){
      switch( property ){
         case "length" :
            return `count(${object})`;
      }
   }

   intercept(desc, object, property){
      const type = desc.type();
      let name = type.toString();
      switch( true ){
          case type.isTupleType :
          case type.isLiteralArrayType :
              name =  'array';
           case type.isInstanceofType :
              name = type.inherit.id;
          break;
      }
      switch( name.toLowerCase() ){
          case "string" :
              return null;
          case "array"  :
              return this.array_method(object, property);
      }
   }

   emitter(){
      const module = this.module;
      const property = this.stack.property.isIdentifier && !this.stack.computed ? this.stack.property.value() : this.make(this.stack.property);
      const object = this.make(this.stack.object);
      const result = this.intercept(this.stack.object.description(),object,property);
      if( result ){
          return result;
      }
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
         if( !this.compiler.callUtils("isLiteralObjectType", this.stack.object.type()) ){
            this.addDepend( this.stack.getModuleById("Reflect") );
            return `${this.checkRefsName("Reflect")}::get(${module.id},${object},${property})`;
         }
         if(this.getTypeName( this.stack.object.type() ) ==="array" ){
            return `${object}[${property}]`;
         }
         if( this.stack.property.isLiteral ){
            return `${object}${sep}{${property}}`;
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

      if( description && description.isMethodSetterDefinition ){
         const name = this.firstToUpper(property);
         return `${object}${sep}set${name}`;
      }
      
      return `${object}${sep}${property}`;
   }
}

module.exports = MemberExpression;
