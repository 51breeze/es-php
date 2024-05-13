module.exports={
    log(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('System')
        ctx.addDepend( module );
        if(!called){
            return ctx.createChunkNode(`function(...$args){System::print(...$args);}`)
        }
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode('System'),
                ctx.createIdentifierNode('print')
            ]),
            args
        );
    },
    trace(ctx, object, args, called=false, isStatic=false){
        return this.log(ctx, object, args, called, isStatic);
    },
    
}
