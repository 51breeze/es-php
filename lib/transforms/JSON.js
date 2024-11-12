export default{

    parse(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkExpression(`function($target){return json_decode($target);}`)
        }
        return ctx.createCallExpression(
            ctx.createIdentifier('json_decode'),
            args.slice(0,1)
        );
    },

    stringify(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkExpression(`function($target){return json_encode($target,JSON_UNESCAPED_UNICODE);}`)
        }
        return ctx.createCallExpression(
            ctx.createIdentifier('json_encode'),
            args.slice(0,1).concat( ctx.createIdentifier(`JSON_UNESCAPED_UNICODE`) )
        );
    }
}