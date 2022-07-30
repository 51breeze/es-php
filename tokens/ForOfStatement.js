module.exports = function(ctx,stack){
    const type = stack.compiler.callUtils('getOriginType',stack.right.type());
    if( stack.compiler.callUtils('isLocalModule', type) || stack.right.type().isAnyType ){
        const node = ctx.createNode(stack,'ForStatement');
        const init = node.createToken(stack.left);
        const obj = init.checkRefsName('_i');
        const res = init.checkRefsName('_v');
        const object = init.createAssignmentNode( 
            init.createIdentifierNode( obj ), 
            init.createCalleeNode(
                init.createStaticMemberNode([
                    ctx.createIdentifierNode('System'),
                    ctx.createIdentifierNode('getIterator')
                ]),
                [
                    init.createToken(stack.right)
                ]
            )
        );
        init.declarations.push( init.createIdentifierNode( res ) );
        init.declarations.push( object );
        const condition = node.createChunkNode(`${obj} && (${res}=${obj}.next()) && !${res}.done`, false);
        node.init = init;
        node.condition = condition;
        node.update = null;
        node.body  = node.createToken(stack.body);
        const block = node.body; 
        const assignment = block.createStatementNode(
            block.createAssignmentNode(
                block.createIdentifierNode( init.declarations[0].id.value, null, true ),
                block.createMemberNode([
                    block.createIdentifierNode( res , null, true),
                    block.createIdentifierNode('value')
                ])
            )
        );
        block.body.splice(0,0,assignment);
        return node;
    }
    const node = ctx.createNode(stack);
    node.left  = node.createToken(stack.left);
    node.right = node.createToken(stack.right);
    node.body  = node.createToken(stack.body);
    return node;
}