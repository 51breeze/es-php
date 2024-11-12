import {createExpressionTransformBooleanValueNode} from '../core/Common';
export default function(ctx, stack){
   const node = ctx.createNode( stack );
   node.condition = createExpressionTransformBooleanValueNode(ctx, stack.condition);
   node.body = ctx.createToken( stack.body );
   return node;
};