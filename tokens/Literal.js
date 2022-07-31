module.exports = function(ctx,stack){

    const node = ctx.createNode(stack);
    node.value = stack.value();
    node.raw = stack.raw();

    const type = stack.type();
    if( type.toString()==="regexp" ){
        ctx.addDepend( type.inherit );
        node.raw = `"${node.raw}"`;
        const newNode = ctx.createNewNode( ctx.createIdentifierNode( ctx.getModuleReferenceName(type.inherit) ) , [node] );
        if( stack.parentStack.isMemberExpression ){
            return ctx.createParenthesNode( newNode );
        }else{
            return newNode;
        }
    }

    return node;
}