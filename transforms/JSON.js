module.exports={

    parse(ctx, object, desc, args, module, called=true){
        ctx.addDepend("System");
        if(!called){
            return ctx.createChunkNode(`function($target){return json_decode($target);}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('json_decode'),
            args
        );
    },

    stringify(ctx, object, desc, args, module, called=true){
        ctx.addDepend("System");
        if(!called){
            return ctx.createChunkNode(`function($target){return json_encode($target,JSON_UNESCAPED_UNICODE);}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('json_encode'),
            [ args[0] ].concat( ctx.createIdentifierNode(`JSON_UNESCAPED_UNICODE`) )
        );
    }
}