import _System from '../transforms/System'
export default function(ctx,stack){
    const node = ctx.createNode( stack );
    let spreadIndex = [];
    node.properties = stack.properties.map( (stack,index)=> {
        let item = ctx.createToken(stack) 
        if( item && stack.isSpreadElement ){
            spreadIndex.push( index );
        }
        return item;
    });
    if( spreadIndex.length>0 ){
        const segs = [];
        let start =0;
        let end = 0;
        while( end = spreadIndex.shift() && end > start ){
            segs.push(ctx.createObjectExpression(node.properties.slice(start, end)));
            segs.push(node.properties[end]);
            start = end+1;
        }
        if( start < node.properties.length ){
            if( node.properties.length===1){
                segs.push(node.properties[0]);
            }else{
                segs.push(ctx.createObjectExpression(node.properties.slice(start, node.properties.length)));
            }
        }
        return _System.merge(stack, ctx, ctx.createArrayExpression(), segs);
    }
    return node;
}