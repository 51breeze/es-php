module.exports = function(ctx,stack){
   const operator = stack.node.operator;
   const prefix   = stack.node.prefix;
   if( operator==='delete' || operator==="typeof"){
      return ctx.createCalleeNode(
         ctx.createIdentifierNode(operator ==='typeof' ? 'gettype' : 'unset', stack),
         [
            ctx.createToken(stack.argument)
         ]
      );
   }
   const node = ctx.createNode(stack);
   node.argument = node.createToken(stack.argument);
   node.operator = operator;
   node.prefix = prefix;
   return node;
}