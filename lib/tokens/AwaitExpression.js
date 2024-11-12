import {createStaticReferenceNode} from '../core/Common';
export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.argument = ctx.createCallExpression( 
        createStaticReferenceNode(ctx, stack, 'Promise', 'sent'),
        [
            ctx.createToken( stack.argument ) 
        ]
    );
    return node;
 }