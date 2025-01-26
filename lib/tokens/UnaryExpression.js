import { createExpressionTransformBooleanValueNode, createStaticReferenceNode } from "../core/Common";
export default function(ctx,stack){
   const operator = stack.node.operator;
   const prefix   = stack.node.prefix;
   if( operator==='delete' || operator==="typeof"){
      if( operator ==='typeof' ){
         return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'typeof'),
            [
               ctx.createToken(stack.argument)
            ]
         );
      }
      return ctx.createCallExpression(
         ctx.createIdentifier('unset', stack),
         [
            ctx.createToken(stack.argument)
         ]
      );
   }else if(operator==='void'){
      if(stack.argument.isIdentifier || stack.argument.isLiteral){
         return ctx.createLiteral(null);
      }
      return ctx.createParenthesNode(
         ctx.createSequenceExpression([
            ctx.createToken(stack.argument),
            ctx.createLiteral(null)
         ]),
      );
   }
   const node = ctx.createNode(stack);
   if( operator.charCodeAt(0) === 33 ){
      node.argument = createExpressionTransformBooleanValueNode(ctx, stack.argument);
   }else{
      node.argument = ctx.createToken(stack.argument);
   }
   node.operator = operator;
   node.prefix = prefix;
   return node;
}