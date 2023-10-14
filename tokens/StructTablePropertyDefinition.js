function createNode(ctx, item){
    if(!item)return null;
    return item.isIdentifier ? 
    ctx.createIdentifierNode(item.value().toLowerCase(), item) : 
    item.isLiteral ? 
    ctx.createLiteralNode(item.value()) : 
    ctx.createToken(item);
}
module.exports = function(ctx, stack){
    const node = ctx.createNode(stack);
    node.assignment = !!stack.assignment;
    node.key = createNode(node, stack.key);
    node.init = createNode(node, stack.init);
    return node;
};