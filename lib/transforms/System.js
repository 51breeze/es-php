import { createStaticReferenceNode } from '../core/Common';
import AddressVariable from '../core/AddressVariable';
const methods = {
    merge(stack, ctx, object, args){
        let target = object;
        if( object.type !== 'Identifier' ){
            let refs = ctx.genLocalRefName(stack, AddressVariable.REFS_FUN_ARG);
            target = ctx.createAssignmentExpression(
                ctx.createVarIdentifier(refs),
                object
            );
            ctx.insertTokenToBlock(stack, 
                ctx.createExpressionStatement(
                    target
                )
            );
            target =  ctx.createVarIdentifier(refs);
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'merge'),
            [target].concat( args )
        );
    },
    combine(stack, ctx, object, args){
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'combine'),
            args
        );
    }
};

export default methods;