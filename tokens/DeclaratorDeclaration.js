module.exports = function(ctx, stack, type){
    const ClassBuilder = ctx.plugin.getClassModuleBuilder();
    const module = stack.module;
    const polyfillModule = ctx.builder.getPolyfillModule( module.getName() );
    if( !polyfillModule ){
        return null;
    }

    const node = new ClassBuilder(stack, ctx, type);
    const content = polyfillModule.content;
    if( !node.checkSyntaxPresetForClass() ){
        return null;
    }
    const ns =  ctx.builder.getModuleNamespace( module );
    if( ns ){
        node.namespace = node.createIdentifierNode(ns);
    }
    node.key = node.createIdentifierNode( polyfillModule.export || module.id );
    node.comments = polyfillModule.comment ? node.createChunkNode( polyfillModule.comment ) : null;
    polyfillModule.require.forEach( name=>{
        const module = stack.getModuleById(name);
        if( module ){
            node.addDepend( module );
        }else{
            node.error(`the '${name}' dependency does not exist`);
        }
    });

    module.extends.forEach( dep=>{
        if( dep.isClass && dep.isModule ){
            node.addDepend( dep );
        }
    });

    node.createDependencies(module);
    node.createModuleAssets(module);
    node.body.push( node.createChunkNode( content ) );
    return node;
}