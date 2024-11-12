module.exports = function(ctx,stack){
   const node = ctx.createNode(stack);
   node.condition = node.createToken( stack.condition );
   if( node.condition && node.condition.type==="ConditionalExpression" ){
      node.condition = node.createParenthesNode( node.condition );
   }
   node.consequent = stack.consequent.map( item=>node.createToken(item) );
   return node;
}