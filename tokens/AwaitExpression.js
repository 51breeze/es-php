module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    const promiseModule = node.builder.getGlobalModuleById('Promise');
    const promiseRefs   = node.getModuleReferenceName( promiseModule );
    node.addDepend( promiseModule );
    node.argument = node.createCalleeNode( 
        node.createStaticMemberNode([
            node.createIdentifierNode(promiseRefs),
            node.createIdentifierNode('sent')
        ]),
        [
            node.createToken( stack.argument ) 
        ]
    )
    return node;
 }