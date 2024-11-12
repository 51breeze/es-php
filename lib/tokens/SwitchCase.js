export default function(ctx,stack){
   const node = ctx.createNode(stack);
   node.condition = ctx.createToken( stack.condition );
   if( node.condition && node.condition.type==="ConditionalExpression" ){
      node.condition = ctx.createParenthesizedExpression( node.condition );
   }
   node.consequent = stack.consequent.map( item=>ctx.createToken(item) );
   return node;
}