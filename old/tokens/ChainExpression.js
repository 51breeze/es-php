module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    if(stack.expression.isCallExpression || stack.expression.isNewExpression){
        const test = ctx.createCalleeNode(
            ctx.createIdentifierNode('isset'),
            [
                ctx.createToken(stack.expression.callee)
            ],
            stack
        );
        node.expression = ctx.createConditionalNode(test, ctx.createToken(stack.expression), ctx.createLiteralNode(null));
    }else{
        if(stack.expression.computed){
            const test = ctx.createCalleeNode(
                ctx.createIdentifierNode('isset'),
                [
                    ctx.createToken(stack.expression.object)
                ],
                stack
            );
            node.expression = ctx.createConditionalNode(test, ctx.createToken(stack.expression), ctx.createLiteralNode(null));
        }else{
            node.expression = ctx.createBinaryNode('??', ctx.createToken(stack.expression), ctx.createLiteralNode(null) );
        }
    }
    return node;
}