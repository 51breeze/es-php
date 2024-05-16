function createNode(ctx, item, isKey=false, toLower=false){
    if(!item)return null;
    if(item.isIdentifier){
        let value = item.value();
        if(toLower)value = value.toLowerCase();
        return ctx.createIdentifierNode(isKey? '`'+value+'`' : value, item);
    }
    return  item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
}
module.exports = function(ctx, stack){
    const node = ctx.createNode(stack);
    const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
    node.key = createNode(node, key, false);
    const isKey = stack.parentStack.isStructTableKeyDefinition;
    node.params = (stack.params||[]).map( item=>createNode(node, item, isKey) );
    return node;
};