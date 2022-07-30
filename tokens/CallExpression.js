module.exports = function(ctx,stack){
    const isMember = stack.callee.isMemberExpression;
    const desc = stack.callee.description();
    const module = stack.module;

    if( isMember && desc && desc.isType && desc.isAnyType  ){
        ctx.addDepend( stack.getGlobalTypeById("Reflect") );
        const propValue = stack.callee.property.value();
        const property = ctx.createLiteralNode( propValue, void 0, stack.callee.property);
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode("Reflect"),
                ctx.createIdentifierNode("call")
            ]),
            [
                ctx.createClassRefsNode(module),
                ctx.createToken(stack.callee.object),
                property,
                ctx.createArrayNode( stack.arguments.map( item=>ctx.createToken(item) ) )
            ],
            stack
        );
    }

    const node = ctx.createNode( stack );
    node.callee = node.createToken( stack.callee );
    node.arguments = stack.arguments.map( item=>node.createToken(item) );
    return node;
}