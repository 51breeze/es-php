const ClassBuilder = require("../core/ClassBuilder");
module.exports = function(ctx, stack, type){

    const module = stack.module;
    const polyfillModule = ctx.builder.getPolyfillModule( module.getName() );
    if( !polyfillModule ){
        return null;
    }

    const node = new ClassBuilder(stack, ctx, type);
    const content = polyfillModule.content;

    polyfillModule.require.forEach( name=>{
        const module = stack.getModuleById(name);
        if( module ){
            node.addDepend( module );
        }else{
            node.error(`the '${name}' dependency does not exist`);
        }
    });

    module.extends.forEach( dep=>{
        if( dep.isClass ){
            node.addDepend( dep );
        }
    });

    if( node.isActiveForModule(module.inherit) ){
        node.inherit = module.inherit;
    }

    const body = node.body;
    node.imports = [];
    node.createDependencies(module).forEach( item=>node.imports.push( item ) );
    node.createModuleAssets(module).forEach( item=>node.imports.push( item ) );
    body.push( node.createChunkNode( content ) );

    return node;
}