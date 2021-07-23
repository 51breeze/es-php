const Syntax = require("../core/Syntax");
class AssignmentExpression extends Syntax{
    emitter(){
        const desc = this.stack.description();
        if( desc && desc.isVariableDeclarator && desc.useRefItems && desc.useRefItems.size === 0){
            return null;
        }
       
        let refs = null;
        if( desc && desc.isVariableDeclarator ){
            const addressRefObject = this.getAssignAddressRef(desc);
            if( this.stack.right.isMemberExpression || this.stack.right.isCallExpression || this.stack.right.isIdentifier ){
                const originType = this.compiler.callUtils("getOriginType",  this.stack.right.type() );
                if( originType.id === "Array" ){
                    this.addAssignAddressRef(desc, this.stack.right);
                    refs = '$'+this.generatorVarName(this.stack.right.description(),"_RD") + ' = &';
                }
            }

            if( addressRefObject ){
                const left = '$'+this.generatorVarName(desc,"_ARV")
                const addressIndex = addressRefObject.getIndex( this.stack.right );
                this.insertExpression( this.stack, this.semicolon(`${left} = ${addressIndex}`) );
            }
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
            return `${left} = ${refs}${right}`;
        }
        return `${left} = ${right}`;
    }
}
module.exports = AssignmentExpression;