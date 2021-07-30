const Syntax = require("../core/Syntax");
class BinaryExpression extends Syntax{
     emitter(){
          const left = this.make(this.stack.left);
          const right = this.make(this.stack.right);
          const operator = this.stack.node.operator;
          if( operator ==="is" || operator==="instanceof" ){
               const type = this.stack.right.type();
               this.addDepend( type );
               if( operator!=="instanceof" ){
                    if( this.compiler.callUtils("isGloableModule", type) ){
                         return `${left} instanceof ${right}`;
                    }
                    return `is_a(${left},'${right}')`;
               }
          }
          if( operator.charCodeAt(0) === 43 && !this.isNumberType(this.stack.left, this.stack.right) ){
               if( this.stack.left.type().toString() ==="any" && this.stack.right.type().toString() ==="any" ){
                    this.addDepend( this.getModuleById("System") );
                    return `System::addition(${left},${right})`;
               }else{
                    return `${left} . ${right}`;
               }
          }
          return `${left} ${operator} ${right}`;
     }
}
module.exports = BinaryExpression;