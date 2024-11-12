const AddressVariable = require('../core/AddressVariable');

function createConditionalNode(ctx,stack){
     const node = ctx.createNode('IfStatement');
     const result = ctx.getDeclareRefsName(stack,AddressVariable.REFS_NAME);
     let consequent = ctx.createToken(stack.consequent);
     let alternate = ctx.createToken(stack.alternate);
     let assignName = ctx.getDeclareRefsName(stack,AddressVariable.REFS_INDEX);
     const key0 = node.createAssignmentNode( 
          node.createIdentifierNode(assignName,null,true), 
          node.createLiteralNode(0)
     );
     const key1 = node.createAssignmentNode( 
          node.createIdentifierNode(assignName,null,true), 
          node.createLiteralNode(1)
     );

     if( ctx.isPassableReferenceExpress(stack.consequent, ctx.inferType(stack.consequent) ) ){
          consequent = ctx.creaateAddressRefsNode(consequent);
     }

     if( ctx.isPassableReferenceExpress(stack.alternate, ctx.inferType(stack.alternate) ) ){
          alternate = ctx.creaateAddressRefsNode(alternate);
     }
     
     node.condition = ctx.createTransformBooleanTypeNode( stack.test );
     node.consequent = ctx.createAssignmentNode( 
          node.createMemberNode([
               node.createIdentifierNode(result,null,true),
               key0
          ],null, true), 
          consequent
     );
     node.alternate = ctx.createAssignmentNode( 
          node.createMemberNode([
               node.createIdentifierNode(result,null,true),
               key1
          ],null, true),
          alternate
     );

     ctx.insertNodeBlockContextAt( node );
     return node.createMemberNode([
          node.createIdentifierNode(result,null,true),
          node.createIdentifierNode(assignName,null,true)
     ],null, true);
}

function check(ctx, stack ){
     if( stack.isConditionalExpression ){
          return check(ctx,stack.consequent) || check(ctx,stack.alternate);
     }
     const type = ctx.inferType(stack);
     return ctx.isAddressRefsType(type, stack);
}

module.exports = function(ctx,stack){
     const node = ctx.createNode(stack);
     if( check(node,stack) ){
          return createConditionalNode(node, stack);
     }else{
          node.test = node.createTransformBooleanTypeNode( stack.test );
          node.consequent = node.createToken(stack.consequent);
          node.alternate = node.createToken(stack.alternate);
          return node;
     }
}