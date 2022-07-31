const Token = require("../core/Token");

module.exports = function(ctx,stack){
    const desc = stack.description();
    const module = stack.module;
    const isMember = stack.left.isMemberExpression;

    let refs = null;
    if( desc && (desc.isVariableDeclarator || desc.isParamDeclarator) ){
        let addressRefObject = ctx.getAssignAddressRef(desc);
        if( addressRefObject ){
            let maybeArrayRef = stack.right.isMemberExpression || stack.right.isCallExpression || stack.right.isIdentifier;
            if(addressRefObject || maybeArrayRef ){
                const originType = ctx.builder.getAvailableOriginType( stack.right.type( stack.right.getContext() ) );
                if( originType === "Array" ){
                    addressRefObject = ctx.addAssignAddressRef(desc, stack.right );
                    const rDesc = stack.right.description();
                    if( maybeArrayRef && !this.isDeclaratorModuleMember(rDesc,true) ){
                        const name = addressRefObject.createName( rDesc );
                        refs = `\$${name} = &`;
                    }
                }
            }
            if( addressRefObject && ctx.hasCrossScopeAssignment( desc.assignItems ) ){
                const left = ctx.checkRefsName(desc,"_ARV")
                const addressIndex = addressRefObject.getIndex( this.stack.right );
                ctx.insertExpression( this.semicolon(`${left} = ${addressIndex}`) );
            }
        }
    }


    var isReflect = false;
    if( isMember ){
        if( stack.left.computed ){
            const hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
            if( !hasDynamic && !ctx.compiler.callUtils("isLiteralObjectType", stack.left.object.type() ) ){
                isReflect = true;
            }
        }else if( desc && desc.isAnyType ){
            isReflect = !ctx.compiler.callUtils("isLiteralObjectType", stack.left.object.type() )
        }
    }

    if(isReflect){
        ctx.addDepend( stack.getGlobalTypeById("Reflect") );
        const callee = ctx.createStaticMemberNode([
            ctx.createIdentifierNode('Reflect'),
            ctx.createIdentifierNode('set')
        ]);
        return ctx.createCalleeNode( callee, [
            ctx.createClassRefsNode( module ),
            ctx.createToken(stack.left.object), 
            ctx.createToken(stack.left.property),
            ctx.createToken(stack.right)
        ], stack);
    }else if(desc && desc.isMethodSetterDefinition){
        return ctx.createCalleeNode(
            ctx.createToken( stack.left ),
            [
                ctx.createToken(stack.right)
            ],
            stack
        );
    }else{
        const node = ctx.createNode( stack );
        node.left = node.createToken( stack.left );
        node.right = node.createToken( stack.right );
        return node;
    }
}