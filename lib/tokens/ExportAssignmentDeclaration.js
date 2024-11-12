export default function(ctx,stack){
    let declaration =  ctx.createToken(stack.expression);
    if(declaration){
        ctx.addExport('default', declaration, null, stack)
    }
}