function createRefs(ctx, target, expression){
    const name = ctx.getDeclareRefsName(target, 'S');
    const refNode = ctx.createDeclarationNode('const', [
        ctx.createDeclaratorNode(
            ctx.createIdentifierNode(name),
            ctx.createTypeTransformNode('object',expression),
        )
    ]);
    ctx.insertNodeBlockContextAt(refNode);
}

module.exports = function(ctx,stack){
    const node = ctx.createNode( stack );
    const target = stack.parentStack.init;
    if(target){
        if( !(target.isObjectExpression || target.isArrayExpression) ){
            createRefs(node, target, node.createToken(target));
        }
    }
    node.properties = stack.properties.map( item=> node.createToken(item) );
    return node;
}