import AddressVariable from '../core/AddressVariable';
import {createAddressRefsNode, createExpressionTransformBooleanValueNode} from '../core/Common';

function createConditionalNode(ctx,stack){
     const node = ctx.createNode('IfStatement');
     const result = ctx.getLocalRefName(stack,AddressVariable.REFS_NAME, stack);
     let consequent = ctx.createToken(stack.consequent);
     let alternate = ctx.createToken(stack.alternate);
     let assignName = ctx.getLocalRefName(stack,AddressVariable.REFS_INDEX, stack);
     const key0 = ctx.createAssignmentExpression( 
          ctx.createVarIdentifier(assignName), 
          ctx.createLiteral(0)
     );
     const key1 = ctx.createAssignmentExpression( 
          ctx.createVarIdentifier(assignName), 
          ctx.createLiteral(1)
     );

     if( ctx.isPassableReferenceExpress(stack.consequent, stack.consequent.type()) ){
          consequent = createAddressRefsNode(ctx, consequent);
     }

     if( ctx.isPassableReferenceExpress(stack.alternate, stack.alternate.type()) ){
          alternate = createAddressRefsNode(ctx, alternate);
     }
     
     node.condition = createExpressionTransformBooleanValueNode(ctx, stack.test);
     node.consequent = ctx.createAssignmentExpression( 
          ctx.createComputeMemberExpression([
               ctx.createVarIdentifier(result),
               key0
          ]), 
          consequent
     );
     node.alternate = ctx.createAssignmentExpression( 
          ctx.createComputeMemberExpression([
               ctx.createVarIdentifier(result),
               key1
          ]),
          alternate
     );

     ctx.insertTokenToBlock(stack, node);
     return ctx.createComputeMemberExpression([
          ctx.createVarIdentifier(result),
          ctx.createVarIdentifier(assignName)
     ]);
}

function check(ctx, stack ){
     if( stack.isConditionalExpression ){
          return check(ctx,stack.consequent) || check(ctx,stack.alternate);
     }
     const type = stack.type();
     return ctx.isAddressRefsType(type, stack);
}

export default function(ctx,stack){
     const node = ctx.createNode(stack);
     if( check(ctx,stack) ){
          return createConditionalNode(ctx, stack);
     }else{
          node.test = createExpressionTransformBooleanValueNode(ctx, stack.test);
          node.consequent = ctx.createToken(stack.consequent);
          node.alternate = ctx.createToken(stack.alternate);
          return node;
     }
}