module.exports = function(ctx,stack){

    const alias = stack.getAnnotationAlias()
    const annotations = stack.annotations;
    var embeds = annotations && annotations.filter( item=>{
        return item.name.toLowerCase() ==='embed';
    });

    var init = null;
    var hasEmbed = false;
    if(embeds && embeds.length > 0  ){
        var items = [];
        embeds.forEach( embed=>{
            const args = embed.getArguments();
            args.forEach( item=>{
                if( item.resolveFile ){
                    const asset = ctx.builder.getAsset(item.resolveFile);
                    if(asset){
                        const Assets = ctx.builder.getVirtualModule('asset.Assets');
                        ctx.addDepend(Assets);
                        const value = ctx.createCalleeNode(
                            ctx.createStaticMemberNode([
                                ctx.createIdentifierNode(ctx.getModuleReferenceName(Assets)),
                                ctx.createIdentifierNode("get")
                            ]),
                            [
                                ctx.createLiteralNode(asset.getResourceId())
                            ],
                        );
                        items.push(value);
                    }
                }
            });
        });

        const value = items.length > 1 ? ctx.createArrayNode( items ) : items[0];
        if(stack.static){
            const program = ctx.getParentByType('Program');
            if(program && Array.isArray(program.afterBody)){
                const left = ctx.createStaticMemberNode([
                    ctx.createIdentifierNode(ctx.getModuleReferenceName(stack.module)),
                    ctx.createIdentifierNode(stack.value(), void 0, true)
                ]);
                program.beforeExternals.push(ctx.createStatementNode(ctx.createAssignmentNode(left, value)));
            }
        }else{
            const parent = ctx.getParentByType('ClassDeclaration', true)
            if(parent && Array.isArray(ctx.initProperties)){
                const left = ctx.createMemberNode([
                    ctx.createIdentifierNode('this',void 0,true),
                    ctx.createIdentifierNode(stack.value())
                ]);
                ctx.initProperties.push(ctx.createStatementNode(ctx.createAssignmentNode(left, value)));
            }
        }
    }

    const node = ctx.createNode(stack);
    node.declarations = (stack.declarations || []).map( item=>node.createToken(item) );
    node.modifier = ctx.createIdentifierNode( stack.compiler.callUtils('getModifierValue', stack) );
    if( stack.static && stack.kind ==='const' && !hasEmbed){
        node.kind = stack.kind;
    }else if(stack.static){
        node.static = ctx.createIdentifierNode('static');
    }
    node.key = alias ? ctx.createIdentifierNode(alias) : node.declarations[0].id;
    node.init = init || node.declarations[0].init || ctx.createLiteralNode(null);
    return node;
}