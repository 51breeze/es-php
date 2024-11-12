export default function(ctx,stack){
    const node = ctx.createToken( stack );
    node.label = ctx.createToken( stack.label );
    return node;
};