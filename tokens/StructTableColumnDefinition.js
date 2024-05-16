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
    node.key = node.createIdentifierNode( '`'+stack.key.value()+'`', stack.key);
    node.properties = [];
    const type = stack.typename ? node.createToken(stack.typename) : node.createIdentifierNode('varchar(255)');
    const unsigned = stack.unsigned ? node.createIdentifierNode('unsigned') : null;
    const notnull = !stack.question ? node.createIdentifierNode('not null') : null;
    node.properties.push(type);
    if( unsigned ){
        node.properties.push(unsigned);
    }
    if( notnull ){
        node.properties.push(notnull);
    }
    (stack.properties||[]).forEach( item=>{
        node.properties.push( createNode(node, item) ) 
    });
    return node;
};