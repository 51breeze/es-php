module.exports = function(ctx,stack){

    const annotations = stack.annotations || [];
    var embeds = annotations.filter( item=>{
        return item.name.toLowerCase() ==='embed';
    });

    var init = null;
    if( embeds.length > 0  ){
        var items = [];
        embeds.forEach( embed=>{
            const args = embed.getArguments();
            args.forEach( item=>{
                if( item.resolveFile ){
                    const value = ctx.builder.getAssetFileReferenceName(stack.module, item.resolveFile);
                    items.push(value);
                }
            });
        });
        init = items.length > 1 ? ctx.createArrayNode( items.map( value=>ctx.createLiteralNode(value) ) ) : ctx.createLiteralNode(items[0]);
    }

    const node = ctx.createNode(stack);
    node.declarations = (stack.declarations || []).map( item=>node.createToken(item) );
    node.modifier = ctx.createIdentifierNode( stack.compiler.callUtils('getModifierValue', stack) );
    if( stack.static && stack.kind ==='const' ){
        node.kind = stack.kind;
    }else if(stack.static){
        node.static = ctx.createIdentifierNode('static');
    }
    node.key =  node.declarations[0].id;
    node.init = init || node.declarations[0].init || ctx.createLiteralNode(null);
    return node;
}