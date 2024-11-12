
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
    if( !stack.isExpressionDeclare ){
        const ClassBuilder = ctx.plugin.getClassModuleBuilder();
        const node = new ClassBuilder(stack, ctx, 'ClassDeclaration');
        const [items, values] = createStatementMember(node, stack.properties);
        node.body.push( ...items );
        const classNode = node.create()
        return classNode;
    }else{
        const name = stack.value();
        const keys = [];
        const values = [];
        stack.properties.forEach( item =>{
            keys.push( ctx.createPropertyNode(ctx.createLiteralNode(item.key.value()), ctx.createLiteralNode(item.init.value())) );
            values.push( ctx.createPropertyNode(ctx.createLiteralNode(String(item.init.value())), ctx.createLiteralNode(item.key.value())) );
        });
        return ctx.createStatementNode( 
            ctx.createAssignmentNode( 
                ctx.createIdentifierNode(name,null,true), 
                ctx.createObjectNode( values.concat(keys) )
            )
        );
    }
}