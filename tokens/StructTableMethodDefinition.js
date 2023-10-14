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
    const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
    node.key = createNode(node, key);
    node.params = (stack.params||[]).map( item=>createNode(node, item) );
    return node;
};