import { createStaticReferenceNode } from '../core/Common';
import AddressVariable from '../core/AddressVariable';
const methods = {
    merge(stack, ctx, object, args){
        let target = object;
        if( object.type !== 'Identifier' ){
            target = ctx.createAssignmentExpression(
                ctx.createVarIdentifier(
                    ctx.genLocalRefName(stack, AddressVariable.REFS_FUN_ARG)
                ),
                object
            );
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'merge'),
            [target].concat( args )
        );
    },
};

export default methods;