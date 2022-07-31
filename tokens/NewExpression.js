function createParamsNode(ctx, stack, arguments, declareParams){
    return arguments.map( (item,index)=>{
        const node = ctx.createToken(item)
        if( declareParams && declareParams[index] &&  item.isArrayExpression ){
            const declareType = declareParams[index].type( stack.getContext() );
            if( declareType ){
                const originType = ctx.builder.getAvailableOriginType( declareType );
                if( originType === "Array" ){
                    const name = ctx.checkRefsName("_V" );
                    ctx.insertNodeBlockContextAt(
                        ctx.createAssignmentNode( ctx.createIdentifierNode(name, null, true), node )
                    );
                    return ctx.createIdentifierNode(name, null, true);
                }
            }
        }
        if( item.isIdentifier ){
            return ctx.createArrayAddressRefsNode(item.description(), node.value);
        }
        return node;
    });
}

module.exports = function(ctx,stack){
    const desc = stack.callee.description();
    if( stack.compiler.callUtils("isTypeModule",desc) ){
        ctx.addDepend( desc );
    }
    const node = ctx.createNode( stack );
    node.callee = node.createToken( stack.callee );
    node.arguments = createParamsNode(node, stack, stack.arguments, desc && desc.params );
    return node;
}