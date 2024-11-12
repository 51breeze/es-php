import Namespace from "easescript/lib/core/Namespace";

function createTransformNode(ctx, method, expression){
     return ctx.createCallExpression( 
          ctx.createIdentifier(method),
          [
               ctx.createToken(expression)
          ]
     );
}

export default function(ctx,stack){
     const type = stack.argument.type();
     var name = null;
     if( type ){
          const value = ctx.getAvailableOriginType( type );
          name = type.toString();
          if( value ==="Number" ){
               const method = name ==='float' || name==="double" ? 'floatval' : 'intval';
               return createTransformNode(ctx, method, stack.expression);
          }else if( value ==="String" ){
               return createTransformNode(ctx, 'strval', stack.expression);
          }else if( value ==="Boolean" ){
               return createTransformNode(ctx, 'boolval', stack.expression);
          }else if( value ==="RegExp" ){
               const regexp = Namespace.globals.get("RegExp");
               const refs = ctx.getModuleReferenceName( regexp );
               ctx.addDepend( regexp );
               const test = ctx.createBinaryExression(
                    ctx.createToken(stack.expression), 
                    ctx.createIdentifier(refs),
                    'instanceof'
               );
               const consequent = ctx.createIdentifier(refs);
               const alternate = ctx.createNewExpression( 
                    ctx.createIdentifier(refs), [
                         ctx.createCallExpression(
                              ctx.createIdentifier('strval'),
                              [
                                   ctx.createToken(stack.expression)
                              ]
                         )
                    ]
               );
               return ctx.createParenthesizedExpression(
                    ctx.createConditionalExpression(test,consequent,alternate)
               );
          }else if( value ==="Function" ){
               return ctx.createToken(stack.expression);
          }else if( value ==='Array' ){
               name = 'array';
          }else if(value==="Object"){
               name = 'object';
          }
     }
     
     const node = ctx.createNode(stack);
     node.typeName = name;
     node.expression = ctx.createToken(stack.expression);
     return node;
}