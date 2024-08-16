const FunctionDeclaration = require("./FunctionDeclaration");
module.exports = function(ctx,stack,type){
   const alias = stack.getAnnotationAlias()
   const node = FunctionDeclaration(ctx,stack,type);
   node.async = stack.expression.async ? true : false;
   node.static = stack.static ? ctx.createIdentifierNode('static') : null;
   node.final = stack.final ? ctx.createIdentifierNode('final') : null;
   node.modifier = ctx.createIdentifierNode( ctx.compiler.callUtils('getModifierValue', stack) ); 
   node.kind = 'method';
   if(alias && node.key){
      node.key.value = alias;
      node.key.raw   = alias;
   }
   return node;
}