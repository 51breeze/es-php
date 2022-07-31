module.exports = function(ctx,stack){
    const desc = stack.description();
    const module = stack.module;
    const isMember = stack.left.isMemberExpression;

    var addressRefs = null;
    if( desc && (desc.isVariableDeclarator || desc.isParamDeclarator) ){
        let addressRefObject = ctx.getAssignAddressRef(desc);
        if( addressRefObject ){
            let maybeArrayRef = stack.right.isMemberExpression || stack.right.isCallExpression || stack.right.isIdentifier;
            if(addressRefObject || maybeArrayRef ){
                const originType = ctx.builder.getAvailableOriginType( stack.right.type( stack.right.getContext() ) );
                if( originType === "Array" ){
                    addressRefObject = ctx.addAssignAddressRef(desc, stack.right);
                    const rDesc = stack.right.description();
                    if( maybeArrayRef && !ctx.isDeclaratorModuleMember(rDesc,true) ){
                        const name = addressRefObject.createName( rDesc );
                        addressRefs = name;
                    }
                }
            }
            if( addressRefObject && ctx.hasCrossScopeAssignment( desc.assignItems ) ){
                const left = ctx.checkRefsName(desc,"_ARV")
                const addressIndex = addressRefObject.getIndex( stack.right );
                ctx.insertNodeBlockContextAt( ctx.createAssignmentNode( ctx.createIdentifierNode(left, null, true), ctx.createLiteralNode(addressIndex) ) );
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

    var refsNode = ctx.createToken(stack.right);
    if( addressRefs ){
        refsNode = ctx.createAssignmentNode( 
            ctx.createIdentifierNode(addressRefs,null,true), 
            ctx.creaateAddressRefsNode(refsNode) 
        );
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
            refsNode
        ], stack);
    }else if(desc && desc.isMethodSetterDefinition){
        return ctx.createCalleeNode(
            ctx.createToken( stack.left ),
            [
                refsNode
            ],
            stack
        );
    }else{
        const node = ctx.createNode( stack );
        node.left = node.createToken( stack.left );
        node.right = refsNode;
        refsNode.parent = node;
        return node;
    }
}