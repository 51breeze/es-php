import { createStaticReferenceNode } from "../core/Common";

export default{
    message(stack,ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeExpression(
            ctx.createMemberExpression([
                object,
                ctx.createIdentifier('getMessage')
            ])
        );
    },
    cause(stack,ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeExpression(
            ctx.createMemberExpression([
                object,
                ctx.createIdentifier('getPrevious')
            ])
        );
    },
    name(stack,ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeExpression(
            ctx.createIdentifier('get_class'),
            [
                object
            ]
        );
    },
    toString(stack,ctx, object, args, called=false, isStatic=false){
        if( !called ){
            return ctx.createCalleeExpression(
                createStaticReferenceNode(ctx, object.stack, 'Reflect', 'get'),
                [
                    ctx.createLiteral(null),
                    object,
                    ctx.createIdentifier('__toString')
                ]
            );
        }
        return ctx.createCalleeExpression(
            ctx.createMemberExpression([
                object,
                ctx.createIdentifier('__toString')
            ])
        );
    }
}