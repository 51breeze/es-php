module.exports = function(ctx,stack){
    const node = ctx.createNode( stack );
    node.left  = node.createIdentifierNode(stack.left.value(), stack.left, true);
    node.right = node.createToken( stack.right );
    return node;
}