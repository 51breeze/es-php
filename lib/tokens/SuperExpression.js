export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.value = 'parent';
    node.raw = 'parent';
    return node;
}