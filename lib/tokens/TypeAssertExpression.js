export default function(ctx,stack){
     if(stack.left.isParenthesizedExpression){
          return ctx.createToken(stack.left.expression);
     }
     return ctx.createToken(stack.left);
}