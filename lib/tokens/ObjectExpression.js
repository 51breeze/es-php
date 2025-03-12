import _System from '../transforms/System'
export default function(ctx,stack){
    const node = ctx.createNode( stack );
    let spreadIndex = [];
    node.properties = stack.properties.map( (stack,index)=> {
        if(stack.isSpreadElement ){
            spreadIndex.push( index );
            return ctx.createToken(stack);
        }
        return ctx.createToken(stack);
    });
    if( spreadIndex.length>0 ){
        const segs = [];
        let start = 0;
        while(spreadIndex.length>0){
            let index = spreadIndex.shift();
            if(start>0 && start < index){
                segs.push(ctx.createObjectExpression(node.properties.slice(start, index)));
            }
            start = index+1;
            segs.push(node.properties[index]);
        }
        if(start<node.properties.length){
            segs.push(ctx.createObjectExpression(node.properties.slice(start, node.properties.length)));
        }
        return _System.combine(stack, ctx, null, segs);
    }
    return node;
}