module.exports = function(ctx, stack){
   const node = ctx.createNode( stack );
   node.condition = node.createTransformBooleanTypeNode(stack.condition);
   node.body = node.createToken( stack.body );
   return node;
};