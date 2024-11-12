export default function(ctx,stack){
    const node = ctx.createNode( stack );
    node.left  = ctx.createVarIdentifier(stack.left.value(), stack.left);
    node.right = ctx.createToken( stack.right );
    return node;
}