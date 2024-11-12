export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.inFor = stack.flag;
    node.kind = stack.kind;
    node.declarations = stack.declarations.map( item=>{
        return ctx.createToken(item)
    });
    return node;
}