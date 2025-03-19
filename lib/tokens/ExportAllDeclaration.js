export default function(ctx,stack){
    if(stack.getResolveJSModule()){
        return null
    }
    if(!stack.source){
        let program = stack.parentStack;
        if(program && program.isProgram && program.externals){
            let externals = program.externals;
            externals.forEach(child=>{
                if(child.isVariableDeclaration){
                    child.declarations.forEach(declaration=>{
                        ctx.addExport(declaration.id.value(), declaration.id.value(), null, declaration.id)
                    })
                }else if(child.isFunctionDeclaration){
                    ctx.addExport(child.key.value(), child.key.value(), null, child.key)
                }
            });
        }
        return null;
    }
    let source = stack.source.value()
    const compilation = stack.getResolveCompilation();
    if(compilation && compilation.stack){
        ctx.addDepend(compilation)
        source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
    }else{
        source = ctx.getModuleImportSource(source, stack.compilation.file)
    }
    let importSource = ctx.getImport(source, true)
    if(!importSource){
        importSource = ctx.addImport(source, null, '*');
        importSource.setExportSource()
        importSource.setSourceTarget(compilation);
    }
    ctx.addExport(stack.exported ? stack.exported.value() : null, '*', importSource, stack)
}