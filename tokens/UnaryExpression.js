module.exports = function(ctx,stack){
   const operator = stack.node.operator;
   const prefix   = stack.node.prefix;
   if( operator==='delete' ){
      return ctx.createCalleeNode(
         ctx.createIdentifierNode('unset', stack),
         [
            node.createToken(stack.argument)
         ]
      );
   }
   const node = ctx.createNode(stack);
   node.argument = node.createToken(stack.argument);
   node.operator = operator;
   node.prefix = prefix;
   return node;
}