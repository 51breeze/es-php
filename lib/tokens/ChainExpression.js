export default function(ctx,stack){
    const node = ctx.createNode(stack);
    if(stack.expression.isCallExpression || stack.expression.isNewExpression){
        const test = ctx.createCallExpression(
            ctx.createIdentifier('isset'),
            [
                ctx.createToken(stack.expression.callee)
            ],
            stack
        );
        node.expression = ctx.createConditionalExpression(test, ctx.createToken(stack.expression), ctx.createLiteral(null));
    }else{
        if(stack.expression.computed){
            const test = ctx.createCallExpression(
                ctx.createIdentifier('isset'),
                [
                    ctx.createToken(stack.expression.object)
                ],
                stack
            );
            node.expression = ctx.createConditionalExpression(test, ctx.createToken(stack.expression), ctx.createLiteral(null));
        }else{
            node.expression = ctx.createBinaryExpression(ctx.createToken(stack.expression), ctx.createLiteral(null),'??');
        }
    }
    return node;
}