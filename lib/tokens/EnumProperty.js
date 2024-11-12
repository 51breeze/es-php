export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.key = ctx.createToken(stack.key);
    node.init = ctx.createToken(stack.init);
    return node;
}