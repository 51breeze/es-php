module.exports = function(ctx,stack){
   const operator = stack.node.operator;
   const prefix   = stack.node.prefix;
   if( operator==='delete' || operator==="typeof"){
      if( operator ==='typeof' ){
         const systemModule = ctx.builder.getGlobalModuleById('System');
         const promiseRefs   = ctx.getModuleReferenceName( systemModule );
         ctx.addDepend( systemModule );
         return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
               ctx.createIdentifierNode(promiseRefs),
               ctx.createIdentifierNode('typeof',stack)
            ]),
            [
               ctx.createToken(stack.argument)
            ]
         );
      }
      return ctx.createCalleeNode(
         ctx.createIdentifierNode('unset', stack),
         [
            ctx.createToken(stack.argument)
         ]
      );
   }else if(operator==='void'){
      if(stack.argument.isIdentifier || stack.argument.isLiteral){
         return ctx.createLiteralNode(null);
      }
      return ctx.createParenthesNode(
         ctx.createSequenceNode([
            ctx.createToken(stack.argument),
            ctx.createLiteralNode(null)
         ]),
      );
   }

   const node = ctx.createNode(stack);
   if( operator.charCodeAt(0) === 33 ){
      node.argument = node.createTransformBooleanTypeNode( stack.argument );
   }else{
      node.argument = node.createToken(stack.argument);
   }
   node.operator = operator;
   node.prefix = prefix;
   return node;
}