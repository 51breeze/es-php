const Syntax = require("../core/Syntax");
class AssignmentExpression extends Syntax{
    emitter(){
        const desc = this.stack.description();
        if( desc && desc.isVariableDeclarator && desc.useRefItems && desc.useRefItems.size === 0){
            return null;
        }
        let refs = null;
        if( desc && (desc.isVariableDeclarator || desc.isParamDeclarator) ){
            let addressRefObject = this.getAssignAddressRef(desc);
            let maybeArrayRef = this.stack.right.isMemberExpression || this.stack.right.isCallExpression || this.stack.right.isIdentifier;
            if(addressRefObject || maybeArrayRef ){
                const originType = this.compiler.callUtils("getOriginType",  this.stack.right.type() );
                if( originType.id === "Array" ){
                    addressRefObject = this.addAssignAddressRef(desc, this.stack.right );
                    const rDesc = this.stack.right.description();
                    if( maybeArrayRef && !this.isDeclaratorModuleMember(rDesc,true) ){
                        const name = addressRefObject.createName( rDesc );
                        refs = `\$${name} = &`;
                    }
                }
            }
            if( addressRefObject && this.hasCrossScopeAssignment(desc.assignItems) ){
                const left = '$'+this.generatorVarName(desc,"_ARV")
                const addressIndex = addressRefObject.getIndex( this.stack.right );
                this.insertExpression(this.semicolon(`${left} = ${addressIndex}`) );
            }
        }

        const right= this.make(this.stack.right);
        if( this.stack.left.isMemberExpression && this.stack.left.computed ){
            const objectDesc = this.stack.left.object.description();
            const objectType = this.stack.left.object.type();
            if( !objectType || objectType.isAnyType || !(objectDesc && objectDesc.assignItems && objectDesc.assignItems.size < 2) ){
                const left = this.make(this.stack.left.object);
                const property = this.make(this.stack.left.property);
                const reflect = this.checkRefsName("Reflect");
                this.addDepend("Reflect");
                return `${reflect}::set(${this.getClassStringName(this.module)},${left},${property},${right})`;
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