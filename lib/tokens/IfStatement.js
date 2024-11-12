import { createExpressionTransformBooleanValueNode } from "../core/Common";

export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.condition  = createExpressionTransformBooleanValueNode(ctx, stack.condition);
    node.consequent = ctx.createToken(stack.consequent);
    node.alternate  = ctx.createToken(stack.alternate);
    return node;
}