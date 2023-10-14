const Token = require('../core/Token');
const AddressVariable = require('../core/AddressVariable');

function isBooleanExpression(stack){
     if(!stack || !stack.parentStack)return false;
     if( stack.parentStack.isLogicalExpression || 
          stack.parentStack.isUnaryExpression || 
          stack.parentStack.isParenthesizedExpression){
          return isBooleanExpression(stack.parentStack);
     }
     return stack.parentStack.isIfStatement || 
          stack.parentStack.isWhileStatement || 
          stack.parentStack.isArrowFunctionExpression || 
          stack.parentStack.isForStatement || 
          stack.parentStack.isBinaryExpression || 
          stack.parentStack.isDoWhileStatement;
}

module.exports = function(ctx,stack){
     const node = ctx.createNode(stack);
     const isAnd = stack.node.operator.charCodeAt(0) === 38;
     const isBoolean = isBooleanExpression(stack);      
     if( !isBoolean ){ 

          const needRefs = !stack.parentStack.isSwitchCase;
          const type = ctx.inferType(stack.left);
          const createRefs = !isAnd && !stack.left.isIdentifier;
          let refs = null;
          if( needRefs ){

               let left = ctx.createToken(stack.left);
               let right = ctx.createToken(stack.right);
               let condition = left;
               let isAddress = false;
               if( !isAnd && node.isPassableReferenceExpress(stack.left,type) ){
                    isAddress = true;
               }

               if( createRefs ){
                    refs = node.checkRefsName('RE', false, Token.SCOPE_REFS_DOWN, stack);
                    node.insertNodeBlockContextAt( 
                         node.createAssignmentNode(
                              node.createIdentifierNode(refs, null, true),
                              isAddress ? node.creaateAddressRefsNode( left ) : left
                         )
                    );
                    left = node.createIdentifierNode(refs, null, true);
                    condition = node.createTransformBooleanTypeNode(stack.left, null, type, null, left);
               }else{
                    condition = node.createTransformBooleanTypeNode(stack.left, null, type, null, left);
               }

               if( isAddress ){
                    left = node.creaateAddressRefsNode( left );
               }

               

               if( node.isPassableReferenceExpress(stack.right, ctx.inferType(stack.right) ) ){
                    right = node.creaateAddressRefsNode( right );
                    isAddress = true;
               }

               if( isAddress ){
                    
                    const result = node.checkRefsName(AddressVariable.REFS_NAME, false, Token.SCOPE_REFS_DOWN, stack);
                    const assignName = node.checkRefsName(AddressVariable.REFS_INDEX, false, Token.SCOPE_REFS_DOWN, stack);
                    const key0 = node.createAssignmentNode( 
                         node.createIdentifierNode(assignName,null,true), 
                         node.createLiteralNode(0)
                    );
                    const key1 = node.createAssignmentNode( 
                         node.createIdentifierNode(assignName,null,true), 
                         node.createLiteralNode(1)
                    );
                    const key2 = node.createAssignmentNode( 
                         node.createIdentifierNode(assignName,null,true), 
                         node.createLiteralNode(2)
                    );
                    node.insertNodeBlockContextAt( ctx.createAssignmentNode( 
                         node.createMemberNode([
                             node.createIdentifierNode(result,null,true),
                             key0
                         ],null, true), 
                         node.createLiteralNode(null)
                    ));
                    let consequent = ctx.createAssignmentNode( 
                         node.createMemberNode([
                             node.createIdentifierNode(result,null,true),
                             key1
                         ],null, true), 
                         right
                    );
                    let alternate = null;
                    if( !isAnd ){
                         alternate = consequent;
                         consequent =  ctx.createAssignmentNode( 
                              node.createMemberNode([
                                  node.createIdentifierNode(result,null,true),
                                  key2
                              ],null, true), 
                              left
                         );
                    }
                    node.insertNodeBlockContextAt( node.createIfStatement(condition,consequent,alternate) );
                    return node.createMemberNode([
                         node.createIdentifierNode(result,null,true),
                         node.createIdentifierNode(assignName, null, true)
                    ],null, true);
               }
          }
          
          if( isAnd || stack.left.isIdentifier ){
               if( isAnd ){
                    return node.createConditionalNode(
                         node.createTransformBooleanTypeNode(stack.left, null, type),
                         node.createToken(stack.right),
                         node.createLiteralNode(null)
                    );
               }
               return node.createConditionalNode(
                    node.createTransformBooleanTypeNode(stack.left, null, type),
                    node.createToken(stack.left),
                    node.createToken(stack.right)
               );
          }else{

               return node.createConditionalNode(
                    createRefs && needRefs ? 
                    node.createTransformBooleanTypeNode(stack.left, null, type, null, node.createIdentifierNode(refs, null, true) ) : 
                    node.createTransformBooleanTypeNode(stack.left, refs, type),
                    node.createIdentifierNode(refs, null, true),
                    node.createToken(stack.right)
               );
          }
     }

     node.left  = node.createTransformBooleanTypeNode(stack.left);
     node.right  = node.createTransformBooleanTypeNode(stack.right);
     node.operator = stack.node.operator;
     return node;
}
