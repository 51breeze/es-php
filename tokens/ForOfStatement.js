function createConditionNode(ctx, obj, refs){
    const assignment = ctx.createNode('AssignmentPattern');
    assignment.left = assignment.createIdentifierNode(refs,null,true);
    assignment.right = assignment.createCalleeNode(
        assignment.createMemberNode([
            assignment.createIdentifierNode(obj,null,true),
            assignment.createIdentifierNode('next')
        ]),
        []
    );
    const init =  ctx.createIdentifierNode(obj,null,true)
    const next = ctx.createParenthesNode( assignment );
    const done = ctx.createNode('UnaryExpression');
    done.prefix = true;
    done.operator ='!';
    done.argument = ctx.createMemberNode([
        assignment.createIdentifierNode(refs,null,true),
        assignment.createIdentifierNode('done')
    ]);

    const logical = ctx.createNode('LogicalExpression');
    const left = logical.createNode('LogicalExpression');
    init.parent = logical.left;
    next.parent = logical.left;
    done.parent = logical;

    left.left = init;
    left.operator = '&&';
    left.right = next;

    logical.operator = '&&';
    logical.left = left;
    logical.right = done;
    return logical;
}


module.exports = function(ctx,stack){
    const type = stack.compiler.callUtils('getOriginType',stack.right.type());
    if( stack.compiler.callUtils('isLocalModule', type) || stack.right.type().isAnyType ){
        const node = ctx.createNode(stack,'ForStatement');
        const init = node.createToken(stack.left);
        const obj = init.checkRefsName('_i');
        const res = init.checkRefsName('_v');
        const object = init.createAssignmentNode( 
            init.createIdentifierNode( obj, null, true ), 
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
        const decl = init.declarations[0];
        init.declarations=[object];
        object.parent  = init;

        const condition = createConditionNode(node, obj, res);
        node.init = init;
        node.condition = condition;
        node.update = null;
        node.body  = node.createToken(stack.body);
        const block = node.body; 
        const assignment = block.createStatementNode(
            block.createAssignmentNode(
                block.createIdentifierNode( decl.id.value, null, true ),
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