module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    node.computed = !!stack.computed;
    if(!node.computed && stack.parentStack.isObjectExpression){
        node.key = node.createLiteralNode( stack.key.value() );
    }else{
        node.key = node.createToken(stack.key);
    }
    node.init = node.createToken(stack.init);
    return node;
}