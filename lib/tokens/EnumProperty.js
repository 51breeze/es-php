import Utils from 'easescript/lib/core/Utils';
import {createCommentsNode} from '../core/Common';
export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.key = ctx.createToken(stack.key);
    node.init = ctx.createToken(stack.init);
    node.comments = createCommentsNode(ctx, stack, node)
    node.modifier = ctx.createIdentifier( Utils.getModifierValue(stack) || "public" );
    return node;
}