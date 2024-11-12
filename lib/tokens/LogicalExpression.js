import AddressVariable from '../core/AddressVariable';
import { createAddressRefsNode , createExpressionTransformBooleanValueNode} from '../core/Common';

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

export default function(ctx,stack){
     const node = ctx.createNode(stack);
     const isAnd = stack.node.operator.charCodeAt(0) === 38;
     const isBoolean = isBooleanExpression(stack);      
     if( !isBoolean ){ 

          const needRefs = !stack.parentStack.isSwitchCase;
          const type = stack.left.type()
          const createRefs = !isAnd && !stack.left.isIdentifier;
          let refs = null;
          if( needRefs ){

               let left = ctx.createToken(stack.left);
               let right = ctx.createToken(stack.right);
               let condition = left;
               let isAddress = false;
               if( !isAnd && ctx.isPassableReferenceExpress(stack.left,type) ){
                    isAddress = true;
               }

               if( createRefs ){
                    refs = ctx.getLocalRefName(stack, '__REF');
                    ctx.insertTokenToBlock( 
                         stack,
                         ctx.createAssignmentExpression(
                              ctx.createVarIdentifier(refs),
                              isAddress ? createAddressRefsNode(ctx, left) : left
                         )
                    );
                    left = ctx.createVarIdentifier(refs);
                    condition = createExpressionTransformBooleanValueNode(ctx, stack.left, null, type, null, left);
               }else{
                    condition = createExpressionTransformBooleanValueNode(ctx, stack.left, null, type, null, left);
               }

               if( isAddress ){
                    left = createAddressRefsNode(ctx, left);
               }

               let rightInitial = null
               if( ctx.isPassableReferenceExpress(stack.right, stack.right.type()) ){
                    if(right.type==='ParenthesizedExpression'){
                         right = right.expression
                    }
                    if(right.type==='AssignmentExpression'){
                         rightInitial =  right;
                         right = right.left
                    }
                    right = createAddressRefsNode(ctx, right );
                    isAddress = true;
               }

               if( isAddress ){
                    
                    const result = ctx.getLocalRefName(stack, AddressVariable.REFS_NAME);
                    const assignName = ctx.getLocalRefName(stack, AddressVariable.REFS_INDEX);
                    const key0 = ctx.createAssignmentExpression( 
                         ctx.createVarIdentifier(assignName), 
                         ctx.createLiteral(0)
                    );
                    const key1 = ctx.createAssignmentExpression( 
                         ctx.createVarIdentifier(assignName), 
                         ctx.createLiteral(1)
                    );
                    const key2 = ctx.createAssignmentExpression( 
                         ctx.createVarIdentifier(assignName), 
                         ctx.createLiteral(2)
                    );
                    ctx.insertTokenToBlock(
                         stack,
                         ctx.createAssignmentExpression( 
                         ctx.createComputeMemberExpression([
                              ctx.createVarIdentifier(result),
                             key0
                         ]), 
                         ctx.createLiteral(null)
                    ));

                    let consequent = ctx.createAssignmentExpression( 
                         ctx.createComputeMemberExpression([
                              ctx.createVarIdentifier(result),
                             key1
                         ]), 
                         right
                    );

                    if(rightInitial){
                         const block = ctx.createNode('BlockStatement');
                         block.body = [
                              ctx.createExpressionStatement(rightInitial),
                              ctx.createExpressionStatement(consequent)
                         ];
                         consequent = block;
                    }

                    let alternate = null;
                    if( !isAnd ){
                         alternate = consequent;
                         consequent =  ctx.createAssignmentExpression( 
                              ctx.createComputeMemberExpression([
                                   ctx.createVarIdentifier(result),
                                  key2
                              ],null, true), 
                              left
                         );
                    }
                    ctx.insertTokenToBlock(
                         stack,
                         ctx.createIfStatement(condition,consequent,alternate) 
                    );
                    return ctx.createComputeMemberExpression([
                         ctx.createVarIdentifier(result),
                         ctx.createVarIdentifier(assignName)
                    ]);
               }
          }
          
          if( isAnd || stack.left.isIdentifier ){
               if( isAnd ){
                    return ctx.createConditionalExpression(
                         createExpressionTransformBooleanValueNode(ctx, stack.left, null, type),
                         ctx.createToken(stack.right),
                         ctx.createLiteral(null)
                    );
               }
               return ctx.createConditionalExpression(
                    createExpressionTransformBooleanValueNode(ctx, stack.left, null, type),
                    ctx.createToken(stack.left),
                    ctx.createToken(stack.right)
               );
          }else{

               return ctx.createConditionalExpression(
                    createRefs && needRefs ? 
                    createExpressionTransformBooleanValueNode(ctx, stack.left, null, type, null, ctx.createVarIdentifier(refs) ) : 
                    createExpressionTransformBooleanValueNode(ctx, stack.left, refs, type),
                    ctx.createVarIdentifier(refs),
                    ctx.createToken(stack.right)
               );
          }
     }

     node.left  = createExpressionTransformBooleanValueNode(ctx, stack.left);
     node.right  = createExpressionTransformBooleanValueNode(ctx, stack.right);
     node.operator = stack.operator;
     return node;
}
