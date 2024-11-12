function createNode(ctx, item, isKey=false, toLower=false, type=null){
    if(!item)return null;
    if(type ==='enum'){
        if(item.isIdentifier || item.isMemberExpression){
            const type = item.compilation.getGlobalTypeById(item.value())
            const list = []
            if(type && type.isModule && type.isEnum){
                Array.from(type.descriptors.keys()).forEach( key=>{
                    const items = type.descriptors.get(key)
                    const item = items.find(item=>item.isEnumProperty)
                    if(item){
                        list.push(ctx.createLiteralNode(item.init.value()))
                    }
                })
            }
            return list;
        }
    }
    if(item.isIdentifier){
        let value = item.value();
        if(toLower)value = value.toLowerCase();
        return ctx.createIdentifierNode(isKey? '`'+value+'`' : value, item);
    }
    return  item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
}
module.exports = function(ctx, stack){
    const node = ctx.createNode(stack);
    const name = stack.key.value().toLowerCase();
    if(name ==='text' || name==='longtext' || name==='tinytext' || name==='mediumtext'){
        return ctx.createIdentifierNode(stack.key.value(), stack.key);
    }
    const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
    node.key = createNode(node, key, false);
    const isKey = stack.parentStack.isStructTableKeyDefinition;
    node.params = (stack.params||[]).map( item=>createNode(node, item, isKey, false, name)).flat().filter(Boolean)
    return node;
};