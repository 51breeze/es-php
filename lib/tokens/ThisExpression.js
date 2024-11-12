export default function(ctx,stack){
    const node = ctx.createVarIdentifier('this',stack);
    return node;
}