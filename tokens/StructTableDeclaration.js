function createNode(ctx, item){
    if(!item)return null;
    return item.isIdentifier ? 
    ctx.createIdentifierNode(item.value(), item) : 
    item.isLiteral ? 
    ctx.createLiteralNode(item.value()) : 
    ctx.createToken(item);
}

function normalName( name ){
    return name.replace(/([A-Z])/g, (a,b,i)=>{
        return i > 0 ? '_'+b.toLowerCase() : b.toLowerCase();
    });
}

module.exports = function(ctx, stack){
    if(ctx.builder.hasSqlTableNode(stack.module)){
        return null;
    }
    const node = ctx.createNode(stack);
    node.id = node.createIdentifierNode( '`'+normalName(stack.id.value())+'`', stack.id);
    node.properties = [];
    node.body = [];
    stack.body.forEach( item=>{
        const token = createNode(node,item);
        if( item.isStructTablePropertyDefinition ){
            node.properties.push(token);
        }else{
            node.body.push(token);
        }
    });
    node.builder.addSqlTableNode(stack.module, node, stack);
    return null;
};