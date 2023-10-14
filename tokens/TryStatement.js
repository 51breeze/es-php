module.exports = function(ctx,stack){
   const node = ctx.createNode(stack);
   node.block = node.createToken(stack.block);
   node.param = ctx.createNode('ParamDeclarator');
   node.param.argument = node.createToken(stack.param);
   node.param.argument.isVariable = true;
   node.param.type = 'ParamDeclarator';
   node.param.prefix = '\\Exception';
   const acceptType = stack.param.acceptType ? stack.param.acceptType.type() : null;
   if( acceptType && acceptType.isModule ){
      const Throwable = ctx.builder.getGlobalModuleById('Throwable');
      if( Throwable && Throwable.type().is( acceptType ) ){
         node.param.prefix = ctx.getModuleReferenceName( acceptType );
      }
   }
   node.handler = node.createToken(stack.handler);
   node.finalizer = node.createToken(stack.finalizer);
   return node;
}