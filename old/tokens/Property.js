function getSpreadRefName(ctx, target){
    let name = ctx.getWasRefsName(target, 'S');
    if( !name ){
        name = ctx.getDeclareRefsName(target, 'S');
        const refNode = ctx.createDeclarationNode('const', [
            ctx.createDeclaratorNode(
                ctx.createIdentifierNode(name),
                ctx.createTypeTransformNode('object',ctx.createToken(target)),
            )
        ]);
        ctx.insertNodeBlockContextAt(refNode);
    }
    return ctx.createIdentifierNode(name,null,true);
}

module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    node.computed = !!stack.computed;
    if( stack.parentStack.isObjectPattern ){
        const target = stack.parentStack.parentStack.init;
        let key = stack.value();
        let name = null;
        let value = null;
        if(stack.hasAssignmentPattern){
            value = node.createToken(stack.init.right);
            name = stack.init.left.value();
        }else{
            value = node.createLiteralNode(null);
            name = stack.init.value();
        }
  
        if( target.isObjectExpression || target.isArrayExpression){
            const init = target.attribute( key );
            return node.createStatementNode(
                node.createAssignmentNode( 
                    node.createIdentifierNode(name,null,true),
                    init ? node.createBinaryNode('??',node.createToken(init.init), init.init.isLiteral ? node.createLiteralNode(null) : value) : value
                )
            );
        }else{
            const obj =  getSpreadRefName(node, target);
            return node.createStatementNode(
                node.createAssignmentNode( 
                    node.createIdentifierNode(name,null,true),
                    node.createBinaryNode('??', node.createMemberNode([
                        obj,
                        node.createIdentifierNode(key)
                    ], null), value)
                )
            );
        }
    }

    if(!node.computed && stack.parentStack.isObjectExpression){
        node.key = node.createLiteralNode( stack.key.value() );
    }else{
        node.key = node.createToken(stack.key);
        if( node.computed && node.key.type ==="Identifier"){
            node.key.isVariable = true;
        }
    }
    node.init = node.createToken(stack.init);
    if( stack.hasInit && ctx.isPassableReferenceExpress(stack.init, stack.type()) ){
        if( stack.init.isCallExpression || stack.init.isAwaitExpression ){
            const name = ctx.getDeclareRefsName(stack.init, 'R');
            const refNode = ctx.createDeclarationNode('const', [
                ctx.createDeclaratorNode(
                    ctx.createIdentifierNode(name),
                    ctx.creaateAddressRefsNode( node.init ),
                )
            ]);
            ctx.insertNodeBlockContextAt(refNode);
            node.init = ctx.creaateAddressRefsNode( ctx.createIdentifierNode(name,null,true) );
        }else{
            node.init = ctx.creaateAddressRefsNode( node.init );
        }
    }
    return node;
}