import { createAddressRefsNode } from '../core/Common';
import _Array from '../transforms/Array'

export default function(ctx,stack){
    const node = ctx.createNode( stack );
    let hasSpread = false;
    node.elements = stack.elements.map( (stack,index)=>{
        let item = ctx.createToken(stack);
        if( item && stack.isSpreadElement ){
            hasSpread = true;
        }else{
            if( ctx.isPassableReferenceExpress(stack, stack.type()) ){
                item = createAddressRefsNode(ctx, item);
            }
        }
        return item;
    });
    if( hasSpread ){
        if( node.elements.length === 1 ){
            return node.elements[0];
        }
        return _Array.concat(stack, ctx, ctx.createArrayExpression(), node.elements, true, false);
    }
    return node;
}