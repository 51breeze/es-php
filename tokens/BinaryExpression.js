const mapset = {
     'String':'is_string',
     'Number':'is_numeric',
     'Array':'is_array',
     'Function':'is_callable',
     'Object':'is_object',
     'Boolean':'is_bool',
};

module.exports = function(ctx,stack){
     var operator = stack.node.operator;
     if( operator ==="is" || operator==="instanceof" ){
          const type = stack.right.type();
          if( operator === "is" ){
               const name = ctx.builder.getAvailableOriginType( type );
               if( mapset[name] ){
                    return ctx.createCalleeNode(
                         ctx.createIdentifierNode( mapset[name] ),
                         [
                              ctx.createToken(stack.left)
                         ],
                         stack
                    );
               }else{
                    ctx.addDepend( type );
                    return ctx.createCalleeNode(
                         ctx.createIdentifierNode( 'is_a' ),
                         [
                              ctx.createToken(stack.left),
                              ctx.createToken(stack.right)
                         ],
                         stack
                    );
               } 
          }
     }

     if( operator.charCodeAt(0) === 43 ){
          var leftType = stack.left.type( stack.left.getContext() );
          var rightType = stack.right.type( stack.right.getContext() );
          var isNumber = leftType.isLiteralType && rightType.isLiteralType;
          if(isNumber){
               leftType = ctx.builder.getAvailableOriginType(leftType);
               rightType = ctx.builder.getAvailableOriginType(rightType);
               isNumber = leftType ==='Number' || leftType === rightType;
          }
          if( !isNumber ){
               ctx.addDepend( stack.getGlobalTypeById("System") );
               return ctx.createCalleeNode(
                    ctx.createStaticMemberNode([
                         ctx.createIdentifierNode('System'),
                         ctx.createIdentifierNode('addition')
                    ]),
                    [
                         ctx.createToken(stack.left),
                         ctx.createToken(stack.right)
                    ],
                    stack
               );
          }
          operator = operator.length > 1 ? '.'+operator.substr(1) : operator;
     }

     const node = ctx.createNode(stack);
     node.left  = node.createToken(stack.left);
     node.right = node.createToken(stack.right);
     node.operator = operator;
     return node;
}