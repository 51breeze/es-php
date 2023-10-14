const methods = {

    merge(ctx, object, args){
        const _System = ctx.builder.getGlobalModuleById('System');
        ctx.addDepend(_System);
        let target = object;
        if( object.type !== 'Identifier' ){
            const refs = ctx.checkRefsName('ref');
            ctx.insertNodeBlockContextAt(
                ctx.createAssignmentNode( ctx.createIdentifierNode(refs, null, true), object )
            );
            target = ctx.createIdentifierNode(refs, null, true);
        }
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode( ctx.getModuleReferenceName(_System) ),
                ctx.createIdentifierNode('merge'),
            ]),
            [target].concat( args )
        );
    },

};

module.exports=methods;