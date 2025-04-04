export default function(ctx,stack){
    if( stack.parentStack.isExpressionStatement ){
        return ctx.createToken(stack.expression);
    }

    if( stack.expression.isCallExpression && stack.expression.callee.isFunctionExpression ){
        return ctx.createToken(stack.expression);
    }   

    const node = ctx.createNode( stack );
    node.expression = ctx.createToken(stack.expression)
    return node;
}