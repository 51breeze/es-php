const Syntax = require("../core/Syntax");
class AssignmentExpression extends Syntax{
    emitter(){
        const desc = this.stack.description();
        let refs = null;
        if( this.stack.right.isMemberExpression || this.stack.right.isCallExpression || this.stack.right.isIdentifier ){
            const originType = this.compiler.callUtils("getOriginType",  this.stack.right.type() );
            if( originType.id === "Array" ){
                this.addAssignAddressRef(desc, this.stack.right);
                if( desc.isMemberExpression ){
                    refs = this.generatorVarName( this.stack.right.description(), "_RD" , false, this.scope );
                }else{
                    const size = desc.assignItems.size;
                    if( size > 1 ){
                        const assignItems = Array.from( desc.assignItems.values() );
                        const lastItem = assignItems.pop();
                        if( assignItems.some( value=>lastItem.scope !== value.scope ) ){
                            refs = this.generatorVarName( this.stack.right.description(), "_RD", false, this.scope );
                        }
                    }
                } 
            }
        }

        if( !refs && desc.isVariableDeclarator && desc.useRefItems && (
            desc.useRefItems.size === 0 || 
            Array.from( desc.useRefItems.values() ).every( item=>item.isReturnStatement )
        )){
            return null;
        }

        const right= this.make(this.stack.right);
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

        if( refs ){
            return `${left} = \$${refs} = &${right}`;
        }
        return `${left} = ${right}`;
    }
}
module.exports = AssignmentExpression;