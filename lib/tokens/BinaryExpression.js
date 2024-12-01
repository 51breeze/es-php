import Utils from 'easescript/lib/core/Utils';
import AddressVariable from '../core/AddressVariable';
import {createStaticReferenceNode, createArrayAddressRefsNode, createAddressRefsNode} from '../core/Common';

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
          if(stack.isIdentifier || stack.isMemberExpression){
               let desc = stack.description(); 
               if(Utils.isTypeModule(desc)){
                    return ctx.createToken( stack );
               }
          }
          let originType = ctx.getAvailableOriginType(stack.type());
          if( originType && originType.toLowerCase() === "array"){
               let desc = stack.description();
               if( stack.isIdentifier ){
                    return createArrayAddressRefsNode(ctx, stack, desc, stack.value());
               }else{
                    let name = ctx.getLocalRefName(stack, AddressVariable.REFS_MEMORY, stack);
                    let left = ctx.createVarIdentifier(name);
                    let right = createAddressRefsNode(ctx, ctx.createToken(stack));
                    ctx.insertTokenToBlock(stack, ctx.createAssignmentExpression(left, right));
                    return ctx.createVarIdentifier(name);
               }
          }
     }
     return ctx.createToken(stack);
}

export default function(ctx,stack){
     let operator = stack.node.operator;
     if(operator ==="is" || operator==="instanceof"){
          let type = stack.right.type();
          let name = ctx.getAvailableOriginType(type);
          if( mapset[name] ){
               return ctx.createCallExpression(
                    ctx.createIdentifier(mapset[name]),
                    [
                         ctx.createToken(stack.left)
                    ],
                    stack
               );
          }else if( operator ==="is" ){
               ctx.addDepend( type );
               return ctx.createCallExpression(
                    ctx.createIdentifier( 'is_a' ),
                    [
                         ctx.createToken(stack.left),
                         ctx.createToken(stack.right)
                    ],
                    stack
               );
          } 
     }

     if( operator.charCodeAt(0) === 43 ){
          let leftType = stack.left.type();
          let rightType = stack.right.type();
          let oLeftType = leftType;
          let oRightType = rightType;
          let isNumber = leftType.isLiteralType && rightType.isLiteralType;
          if(isNumber){
               leftType = ctx.getAvailableOriginType(leftType);
               rightType = ctx.getAvailableOriginType(rightType);
               isNumber = leftType ==='Number' && leftType === rightType;
          }
          if( !isNumber ){
               if( oLeftType.toString() ==='string' || oRightType.toString() ==='string' ){
                    operator = operator.length > 1 ? '.'+operator.substr(1) : '.';
               }else{
                    return ctx.createCallExpression(
                         createStaticReferenceNode(ctx, stack, 'System', 'addition'),
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
     node.left  = createNode(ctx,stack.left);
     node.right = createNode(ctx,stack.right);
     node.operator = operator;
     if( stack.left && stack.left.isMemberExpression && node.left && node.left.type ==='BinaryExpression' ){
          node.left = ctx.createParenthesizedExpression(node.left);
     }

     if( stack.right && stack.right.isMemberExpression && node.right && node.right.type ==='BinaryExpression' ){
          node.right = ctx.createParenthesizedExpression(node.right);
     }

     return node;
}