const Syntax = require("../core/Syntax");
class AssignmentExpression extends Syntax{
    emitter(){
        const right= this.make(this.stack.right);
        const desc = this.stack.description();
        if( desc.isAnyType ){
            if( this.stack.left.isMemberExpression ){
                if( this.stack.left.computed ){
                   const left = this.make(this.stack.left.object);
                   const property = this.make(this.stack.left.property);
                   const reflect = this.checkRefsName("Reflect");
                   this.addDepend( this.stack.getModuleById("Reflect") );
                   return `${reflect}::set(${this.module.id},${left},${property},${right})`;
                }
            }
        }

        const left = this.make(this.stack.left);
        if( desc && desc.kind ==="set" && desc.isMethodSetterDefinition ){
            return `${left}(${right})`;
        }
        return `${left}=${right}`;
    }
}
module.exports = AssignmentExpression;