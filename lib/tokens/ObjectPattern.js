import { createExpressionTransformTypeNode } from "../core/Common";
import AddressVariable from '../core/AddressVariable';
function createRefs(ctx, target, expression){
    let name = ctx.getLocalRefName(target, AddressVariable.REFS_VALUE, target)
    let refNode = ctx.createVariableDeclaration('const', [
        ctx.createVariableDeclarator(
            ctx.createIdentifier(name),
            createExpressionTransformTypeNode(ctx, 'object',expression),
        )
    ]);
    ctx.insertTokenToBlock(target, refNode);
}

export default function(ctx,stack){
    let node = ctx.createNode( stack );
    let target = stack.parentStack.init;
    if(target){
        if( !(target.isObjectExpression || target.isArrayExpression) ){
            createRefs(ctx, target, ctx.createToken(target));
        }
    }
    node.properties = stack.properties.map( item=> ctx.createToken(item) );
    return node;
}