const Transform = require("../core/Transform");
function createArgumentNodes(ctx, stack, arguments, declareParams){
    return arguments.map( (item,index)=>{
        const node = ctx.createToken(item)
        if( declareParams && declareParams[index] && !item.isIdentifier ){
            const declareParam = declareParams[index];
            if( !(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern) ){
                if( ctx.isAddressRefsType(declareParam.type()) ){
                    const name = ctx.checkRefsName("arg" );
                    ctx.insertNodeBlockContextAt(
                        ctx.createAssignmentNode( ctx.createIdentifierNode(name, null, true), node )
                    );
                    return ctx.createIdentifierNode(name, null, true);
                } 
            }
        }
        return node;
    });
}

module.exports = function(ctx,stack){
    let type = stack.callee.type();
    let [classModule,desc] = stack.getConstructMethod(type);
    let wrapType = null;
    if(desc && desc.isNewDefinition && desc.module){
        type = desc.module;
    }

    if(type){
        type = stack.compiler.callUtils('getOriginType', type)
        if(stack.compiler.callUtils("isTypeModule",type) ){
            ctx.addDepend(type);
        }
        if(type === ctx.builder.getGlobalModuleById("Array") ){
            return Transform.get('Array').of( 
                ctx, 
                null,
                createArgumentNodes(ctx, stack, stack.arguments, desc && desc.params ),
                true,
                false
            );
        }
        if(type === ctx.builder.getGlobalModuleById("String")){
            wrapType = 'String';
        }else if(type === ctx.builder.getGlobalModuleById("Number")){
            wrapType = 'Number';
        }else if(type === ctx.builder.getGlobalModuleById("Boolean")){
            wrapType = 'Boolean';
        }else if(type === ctx.builder.getGlobalModuleById("Object")){
            wrapType = 'Object';
        }
    }

    if(!type || !type.isModule || wrapType){
        const Reflect = stack.getGlobalTypeById("Reflect");
        const node = ctx.createNode( stack );
        node.addDepend( Reflect );
        let target = node.createToken(stack.callee);
        if(!wrapType && !stack.callee.isIdentifier ){
            const refs = node.checkRefsName('ref');
            ctx.insertNodeBlockContextAt(
                ctx.createAssignmentNode( ctx.createIdentifierNode(refs, null, true), target )
            );
            target = ctx.createIdentifierNode(refs, null, true);
        }
        return node.createCalleeNode(
            node.createStaticMemberNode([
                node.createIdentifierNode( node.getModuleReferenceName(Reflect) ),
                node.createIdentifierNode("construct")
            ]),
            [
                stack.module ? node.createClassRefsNode(stack.module) : node.createLiteralNode(null),
                target,
                node.createArrayNode(createArgumentNodes(ctx, stack, stack.arguments||[], desc && desc.params), stack)
            ],
            stack
        );
    }

    const node = ctx.createNode( stack );
    node.callee = node.createToken( stack.callee );
    if( stack.callee.isParenthesizedExpression ){
        const name = ctx.checkRefsName('_refClass');
        node.insertNodeBlockContextAt( ctx.createAssignmentNode( ctx.createIdentifierNode(name,null,true), node.callee.expression ) );
        node.callee = ctx.createIdentifierNode(name,null,true);
    }
    node.arguments = createArgumentNodes(node, stack, stack.arguments||[], desc && desc.params );
    return node;
}