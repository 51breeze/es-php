const mapset = {
     'String':'is_string',
     'Number':'is_numeric',
     'Array':'is_array',
     'Function':'is_callable',
     'Object':'is_object',
     'Boolean':'is_bool',
};

function createNode(ctx, stack){
     let maybeArrayRef = stack.isMemberExpression || stack.isCallExpression || stack.isIdentifier;
     if(maybeArrayRef ){
          if( stack.isIdentifier || stack.isMemberExpression ){
               const desc = stack.description(); 
               if( stack.compiler.callUtils("isTypeModule", desc) ){
                    return ctx.createToken( stack );
               }
          }
          const originType = ctx.builder.getAvailableOriginType( ctx.inferType(stack) );
          if( originType && originType.toLowerCase() === "array"){
               var desc = stack.description();
               if( stack.isIdentifier ){
                    return ctx.createArrayAddressRefsNode(desc, stack.value());
               }else{
                    const name = ctx.getDeclareRefsName(stack,"_RD");
                    const left = ctx.createIdentifierNode(name, null, true);
                    const right = ctx.creaateAddressRefsNode( ctx.createToken(stack) );
                    ctx.insertNodeBlockContextAt( ctx.createAssignmentNode( left, right ) );
                    return ctx.createIdentifierNode(name, null, true);
               }
          }
     }
     return ctx.createToken(stack);
}

module.exports = function(ctx,stack){
     var operator = stack.node.operator;
     if( operator ==="is" || operator==="instanceof" ){
          const type = stack.right.type();
          const name = ctx.builder.getAvailableOriginType( type );
          if( mapset[name] ){
               return ctx.createCalleeNode(
                    ctx.createIdentifierNode( mapset[name] ),
                    [
                         ctx.createToken(stack.left)
                    ],
                    stack
               );
          }else if( operator ==="is" ){
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

     if( operator.charCodeAt(0) === 43 ){
          
          var leftType = ctx.inferType(stack.left);
          var rightType = ctx.inferType(stack.right);
          var oLeftType = leftType;
          var oRightType = rightType;
          var isNumber = leftType.isLiteralType && rightType.isLiteralType;
          if(isNumber){
               leftType = ctx.builder.getAvailableOriginType(leftType);
               rightType = ctx.builder.getAvailableOriginType(rightType);
               isNumber = leftType ==='Number' && leftType === rightType;
          }
          if( !isNumber ){
               if( oLeftType.toString() ==='string' || oRightType.toString() ==='string' ){
                    operator = operator.length > 1 ? '.'+operator.substr(1) : '.';
               }else{
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
          }
     }

     const node = ctx.createNode(stack);
     node.left  = createNode(node,stack.left);
     node.right = createNode(node,stack.right);
     node.operator = operator;

     if( stack.left && stack.left.isMemberExpression && node.left && node.left.type ==='BinaryExpression' ){
          node.left = node.createParenthesNode( node.left );
     }

     if( stack.right && stack.right.isMemberExpression && node.right && node.right.type ==='BinaryExpression' ){
          node.right = node.createParenthesNode( node.right );
     }

     return node;
}