import { createStaticReferenceNode } from '../core/Common';
const methods = {
    merge(stack, ctx, object, args){
        let target = object;
        if( object.type !== 'Identifier' ){
            const refs = ctx.getLocalRefName(stack, 'ref');
            ctx.insertTokenToBlock(
                stack,
                ctx.createAssignmentExpression( ctx.createVarIdentifier(refs), object )
            );
            target = ctx.createVarIdentifier(refs);
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'merge'),
            [target].concat( args )
        );
    },
};

export default methods;