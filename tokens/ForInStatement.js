const Transform = require('../core/Transform');
module.exports = function(ctx,stack){
   const node = ctx.createNode(stack);
   node.right = node.createToken(stack.right);
   const type = ctx.inferType(stack.right);
   if( type.isAnyType || type.toString() ==='string' ){
      node.right = Transform.get('Object').keys( ctx, null, [node.right], true, false );
      node.value = node.createToken(stack.left);
   }else{
      node.left  = node.createToken(stack.left);
   }
   node.body  = node.createToken(stack.body);
   return node;
}