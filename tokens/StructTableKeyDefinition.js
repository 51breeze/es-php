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
    node.key = createNode(node,stack.key);
    node.prefix = node.key.value ==='primary' || node.key.value ==='key' ? null : node.createIdentifierNode('key');
    node.local = node.createToken(stack.local);
    node.properties = (stack.properties||[]).map( item=>createNode(node, item) );
    return node;
};