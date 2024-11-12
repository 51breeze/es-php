module.exports={

    parse(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function($target){return json_decode($target);}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('json_decode'),
            args.slice(0,1)
        );
    },

    stringify(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function($target){return json_encode($target,JSON_UNESCAPED_UNICODE);}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('json_encode'),
            args.slice(0,1).concat( ctx.createIdentifierNode(`JSON_UNESCAPED_UNICODE`) )
        );
    }
}