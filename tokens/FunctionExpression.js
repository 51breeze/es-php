module.exports = function(ctx,stack,type){
   const node = ctx.createNode(stack,type);
   node.async = stack.async ? true : false;
   node.params = stack.params.map( item=>node.createToken(item) );
   node.body = [];
   const block = node.createToken( stack.body );
   if( node.body.length>0){
      node.body.forEach( item=>{
         item.parent = block;
      })
      block.body.unshift( ...node.body );
   }
   node.body = block;
   return node;
};