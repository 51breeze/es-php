module.exports={
    message(ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeNode(
            ctx.createMemberNode([
                object,
                ctx.createIdentifierNode('getMessage')
            ])
        );
    },
    cause(ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeNode(
            ctx.createMemberNode([
                object,
                ctx.createIdentifierNode('getPrevious')
            ])
        );
    },
    name(ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('get_class'),
            [
                object
            ]
        );
    },
    toString(ctx, object, args, called=false, isStatic=false){
        if( !called ){
            const Reflect = ctx.builder.getGlobalModuleById("Reflect");
            ctx.addDepend( Reflect );
            return ctx.createCalleeNode(
                ctx.createStaticMemberNode(
                    [
                        ctx.createIdentifierNode(
                            ctx.getModuleReferenceName( Reflect )
                        ),
                        ctx.createIdentifierNode('get')
                    ]
                ),
                [
                    ctx.createLiteralNode(null),
                    object,
                    ctx.createIdentifierNode('__toString')
                ]
            );
        }
        return ctx.createCalleeNode(
            ctx.createMemberNode([
                object,
                ctx.createIdentifierNode('__toString')
            ])
        );
    }
}