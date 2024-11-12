import Namespace from "easescript/lib/core/Namespace";
export default function(ctx,stack){
   const node = ctx.createNode(stack);
   node.block = ctx.createToken(stack.block);
   node.param = ctx.createNode('ParamDeclarator');
   node.param.argument = ctx.createToken(stack.param);
   node.param.argument.isVariable = true;
   node.param.type = 'ParamDeclarator';
   node.param.prefix = '\\Exception';
   const acceptType = stack.param.acceptType ? stack.param.acceptType.type() : null;
   if( acceptType && acceptType.isModule ){
      const Throwable = Namespace.globals.get('Throwable');
      if( Throwable && Throwable.type().is( acceptType ) ){
         node.param.prefix = ctx.getModuleReferenceName( acceptType );
      }
   }
   node.handler = ctx.createToken(stack.handler);
   node.finalizer = ctx.createToken(stack.finalizer);
   return node;
}