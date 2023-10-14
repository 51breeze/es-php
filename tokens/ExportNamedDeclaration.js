module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    node.specifiers = stack.specifiers ? stack.specifiers.map( item=>node.createToken(item) ) : null;
    node.declaration = node.createToken(stack.declaration);
    if( stack.source ){
        const compilation = stack.getResolveCompilation();
        if( compilation ){
            const resolve = stack.getResolveFile();
            const source = ctx.builder.getModuleImportSource(resolve, stack.compilation.file);
            node.source = node.createLiteralNode(source);
            node.builder.make(compilation, compilation.stack);
        }
    }
    return node;
 }