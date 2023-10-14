const FunctionDeclaration = require("./FunctionDeclaration");
module.exports = function(ctx,stack,type){
   const node = FunctionDeclaration(ctx,stack,type);
   node.async = stack.expression.async ? true : false;
   node.static = stack.static ? ctx.createIdentifierNode('static') : null;
   node.final = stack.final ? ctx.createIdentifierNode('final') : null;
   node.modifier = ctx.createIdentifierNode( ctx.compiler.callUtils('getModifierValue', stack) ); 
   node.kind = 'method';
   return node;
}