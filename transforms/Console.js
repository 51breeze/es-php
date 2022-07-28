module.exports={
    log(ctx, object, desc, args, module, called=true){
        ctx.addDepend("System");
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
    trace(ctx, object, desc, args, module, called=true){
        return this.log(ctx, object, desc, args, module, called);
    },
    
}
