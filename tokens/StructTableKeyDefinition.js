function createNode(ctx, item){
    if(!item)return null;
    return item.isIdentifier ? 
    ctx.createIdentifierNode(item.value(), item) : 
    item.isLiteral ? 
    ctx.createLiteralNode(item.value()) : 
    ctx.createToken(item);
}
module.exports = function(ctx, stack){
    const node = ctx.createNode(stack);
    node.key = createNode(node,stack.key);
    const key = stack.key.value().toLowerCase();
    node.prefix = key==='primary' || key==='key' ? null : node.createIdentifierNode('key');
    node.local = node.createToken(stack.local);
    node.properties = (stack.properties||[]).map( item=>createNode(node, item) );
    return node;
};