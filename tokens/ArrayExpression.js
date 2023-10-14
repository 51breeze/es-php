const _Array = require('../transforms/Array')

module.exports = function(ctx,stack){
    const node = ctx.createNode( stack );
    let hasSpread = false;
    node.elements = stack.elements.map( (stack,index)=>{
        let item = node.createToken(stack);
        if( item && stack.isSpreadElement ){
            hasSpread = true;
        }else{
            if( ctx.isPassableReferenceExpress(stack, stack.type()) ){
                item = ctx.creaateAddressRefsNode( item );
            }
        }
        return item;
    });
    if( hasSpread ){
        if( node.elements.length === 1 ){
            return node.elements[0];
        }
        return _Array.concat(ctx, ctx.createArrayNode(), node.elements, true, false);
    }
    return node;
}