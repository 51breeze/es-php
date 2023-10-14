module.exports = function(ctx,stack){

    if( stack.parentStack.isArrayExpression ){
        const type = stack.argument.type();
        const _Array = stack.getGlobalTypeById("Array");
        const _array = stack.getGlobalTypeById("array");
        if( type && (type.isLiteralArrayType || type===_Array || type === _array)){
            return ctx.createToken(stack.argument);
        }
        const _System = stack.getGlobalTypeById("System");
        ctx.addDepend( _System );
        const node = ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.getModuleReferenceName( _System ),
                ctx.createIdentifierNode("toArray")
            ]),
            [
                ctx.createToken(stack.argument)
            ]
        );
        return node;
    }else if( stack.parentStack.isObjectExpression ){
        return ctx.createToken(stack.argument);
    }

    const node = ctx.createNode(stack);
    node.argument = node.createToken(stack.argument);
    return node;
}