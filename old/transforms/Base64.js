module.exports={
    decode(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function($value){return base64_decode( $value );}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('base64_decode'),
            args
        );
    },
    encode(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function($value){return base64_encode( $value );}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('base64_encode'),
            args
        );
    },
    
}
