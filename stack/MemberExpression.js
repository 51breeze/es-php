const Syntax = require("../core/Syntax");
const Polyfill = require("../core/Polyfill");
class MemberExpression extends Syntax{

   intercept(desc,object,property){
      const type = this.compiler.callUtils("getOriginType", desc.type() );
      if( type && this.compiler.callUtils("isTypeModule",type) ){
         const typeName = type.id.toString();
         for(var name of [typeName,'Object']){
            const polyModule = Polyfill.modules.get(name);
            if( polyModule && polyModule.method ){
               const result = polyModule.method(this, object, property, [], desc, this.compiler.callUtils("isTypeModule",desc) , true);
               if( result ){
                  return result;
               }
            }
         }
      }
      return null;
   }

   emitter(){
      const module = this.module;
      const property = this.stack.property.isIdentifier && !this.stack.computed ? this.stack.property.value() : this.make(this.stack.property);
      const baseDescription = this.stack.object.description();
      const result = this.intercept(baseDescription,this.stack.object,property);
      if( result ){
          return result;
      }
      const object = this.make(this.stack.object);
      const description = this.stack.description();
      const type = this.stack.type();
      if(type && type.isFunctionType ){
         const inCall = !!(this.parentStack && this.parentStack.isCallExpression && this.parentStack.arguments.indexOf(this.stack) < 0);
         if( !inCall ){
            this.addDepend( "Reflect" );
            const propName = this.stack.property.isIdentifier && !this.stack.computed ? `'${property}'` : property;
            return `${this.checkRefsName("Reflect")}::get(${this.getClassStringName(module)},${object},${propName})`;
         }
      }

      let sep =  this.stack.object.isSuperExpression ? "::" : "->";
      if( description && description.isModule && this.compiler.callUtils("isTypeModule",description) ){
         this.addDepend( description );
         return this.getReferenceNameByModule( description );
      }else if( this.compiler.callUtils("isTypeModule",baseDescription) ){
         this.addDepend( this.stack.object.description() );
         sep = "::";
      }else if( this.stack.object.type().isClassType ){
         const classType = this.stack.object.type();
         if( classType.isClassGenericType ){
            (classType.types||[]).forEach( item=>{
               const type = item.type();
               const items = type.isUnionType ||  type.isTupleType ? item.elements : [type];
               items.forEach( type=>{
                  this.addDepend( type );
               });
            });
         }
         sep = "::";
      }

      if(this.stack.computed){
         const objectDesc = this.stack.object.description();
         const objectType = this.stack.object.type();
         if( objectType && !objectType.isAnyType && objectDesc && objectDesc.assignItems && objectDesc.assignItems.size < 2 ){
            const tName = this.getAvailableTypeName( objectType );
            if( tName === "array" || tName ==="string" ){
               return `${object}[${property}]`;
            }
            if( this.stack.property.isLiteral ){
               return `${object}${sep}{${property}}`;
            }
            return `${object}${sep}${property}`;
         }
      }
      
      if( type && type.isType && type.isAnyType ){
         this.addDepend( "Reflect" );
         const propName = this.stack.property.isIdentifier && !this.stack.computed ? `'${property}'` : property;
         return `${this.checkRefsName("Reflect")}::get(${this.getClassStringName(module)},${object},${propName})`;
      }

      if( description && description.isMethodGetterDefinition ){
         const name = this.getAccessorName(description,"get",property);
         return `${object}${sep}${name}()`;
      }

      if( description && description.isMethodSetterDefinition ){
         const name = this.getAccessorName(description,"set",property);
         return `${object}${sep}${name}`;
      }
      
      return `${object}${sep}${property}`;
   }
}

module.exports = MemberExpression;
