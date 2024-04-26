
function createStatementMember(ctx, members){
    const items = [];
    const values = [];
    members.forEach( item =>{
        const node = ctx.createNode('PropertyDefinition');
        node.modifier =  node.createIdentifierNode('public');
        node.kind = 'const';
        node.key = node.createToken(item.key);
        node.init = node.createToken(item.init);
        node.declarations = [
            node.createDeclaratorNode(
                node.key, 
                node.init
            )
        ];
        items.push( node );
        const caseNode = ctx.createNode('SwitchCase');
        caseNode.condition = caseNode.createLiteralNode(item.init.value());
        caseNode.consequent = [
            caseNode.createReturnNode( caseNode.createLiteralNode(item.key.value()) )
        ];
        values.push( caseNode );
    });
    return [items, values];
}

module.exports = function(ctx,stack,type){

    const ClassBuilder = ctx.plugin.getClassModuleBuilder();
    if( stack.parentStack.isPackageDeclaration ){
        const node = new ClassBuilder(stack, ctx, 'ClassDeclaration');
        const module = stack.module;
        if( node.isActiveForModule(module.inherit) ){
            node.inherit = node.createIdentifierNode( node.getModuleReferenceName( module.inherit ) );
        }

        const ns = node.builder.getModuleNamespace(module);
        if( ns ){
            this.namespace = this.createIdentifierNode( ns );
        }

        node.key = node.createIdentifierNode(module.id);
        node.static = node.createIdentifierNode('static');

        node.createDependencies(module);
        node.createModuleAssets(module);

        const [items, values] = createStatementMember(node, stack.properties);
        node.body.push( ...items );

        const mtehod = node.createMethodNode( node.createIdentifierNode('getLabelByValue'), (ctx)=>{
            const node = ctx.createNode('SwitchStatement');
            node.condition = node.createIdentifierNode('value',null,true);
            node.cases = values.map( item=>{
                item.parent = node;
                return item;
            });
            ctx.body.push( node );
        }, [ node.createIdentifierNode('value',null,true) ] );

        mtehod.static = mtehod.createIdentifierNode('static');
        mtehod.modifier =  mtehod.createIdentifierNode('public');

        node.body.push( mtehod );
        return node;

    }else{
        const name = stack.value();
        const keys = [];
        const values = [];
        stack.properties.forEach( item =>{
            keys.push( ctx.createPropertyNode(ctx.createLiteralNode(item.key.value()), ctx.createLiteralNode(item.init.value())) );
            values.push( ctx.createPropertyNode(ctx.createLiteralNode(String(item.init.value())), ctx.createLiteralNode(item.key.value())) );
        });

        const transform = ctx.createNode(stack,'TypeTransformExpression');
        transform.typeName = 'object';
        transform.expression = transform.createObjectNode( values.concat(keys) );
        return ctx.createStatementNode( 
            ctx.createAssignmentNode( 
                ctx.createIdentifierNode(name,null,true), 
                transform
            )
        );
    }
}