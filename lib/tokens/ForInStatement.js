import Transform from '../transforms';
export default function(ctx,stack){
   const node = ctx.createNode(stack);
   node.right = ctx.createToken(stack.right);
   const type = stack.right.type();
   if( type.isAnyType || type.toString() ==='string' ){
      node.right = Transform.get('Object').keys(stack, ctx, null, [node.right], true, false );
      node.value = ctx.createToken(stack.left);
   }else{
      node.left  = ctx.createToken(stack.left);
   }
   node.body  = ctx.createToken(stack.body);
   return node;
}