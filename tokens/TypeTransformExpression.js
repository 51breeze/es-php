
function createTransformNode(ctx, method, expression ){
     return ctx.createCalleeNode( 
          ctx.createIdentifierNode(method),
          [ ctx.createToken(expression) ]
     );
}

module.exports = function(ctx,stack){
     const type = stack.typeExpression.type();
     var name = null;
     if( type ){
          const value = ctx.builder.getAvailableOriginType( type );
          name = type.toString();
          if( value ==="Number" ){
               const method = name ==='float' || name==="double" ? 'floatval' : 'intval';
               return createTransformNode(ctx, method, stack.referExpression);
          }else if( value ==="String" ){
               return createTransformNode(ctx, 'strval', stack.referExpression);
          }else if( value ==="Boolean" ){
               return createTransformNode(ctx, 'boolval', stack.referExpression);
          }else if( value ==="RegExp" ){
               const regexp = stack.getGlobalTypeById("RegExp");
               const refs = ctx.getModuleReferenceName( regexp );
               ctx.addDepend( regexp );
               const test = ctx.createBinaryNode('instanceof', ctx.createToken(stack.referExpression), ctx.createIdentifierNode(refs) );
               const consequent = ctx.createIdentifierNode(refs);
               const alternate = ctx.createNewNode( 
                    ctx.createIdentifierNode(refs), [
                         ctx.createCalleeNode( ctx.createIdentifierNode('strval'), [ctx.createToken(stack.referExpression)])
                    ]
               );
               return ctx.createParenthesNode( ctx.createConditionalNode(test,consequent,alternate) );
          }else if( value ==="Function" ){
               return ctx.createToken(stack.referExpression);
          }else if( value ==='Array' ){
               name = 'array';
          }else if(value==="Object"){
               name = 'object';
          }
     }
     
     const node = ctx.createNode(stack);
     node.typeName = name;
     node.expression = node.createToken(stack.referExpression);
     return node;
}