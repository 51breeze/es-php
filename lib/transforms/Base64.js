export default{
    decode(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkExpression(`function($value){return base64_decode( $value );}`)
        }
        return ctx.createCallExpression(
            ctx.createIdentifier('base64_decode'),
            args
        );
    },
    encode(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkExpression(`function($value){return base64_encode( $value );}`)
        }
        return ctx.createCallExpression(
            ctx.createIdentifier('base64_encode'),
            args
        );
    },
    
}
