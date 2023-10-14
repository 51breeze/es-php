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
    const desc = stack.callee.description();
    if( stack.compiler.callUtils("isTypeModule",desc) ){
        ctx.addDepend( desc );
    }

    if( desc && desc.isModule ){
        if( desc === ctx.builder.getGlobalModuleById("Array") ){
            return Transform.get('Array').of( 
                ctx, 
                null,
                createArgumentNodes(ctx, stack, stack.arguments, desc && desc.params ),
                true,
                false
            );
        }
    }

    const node = ctx.createNode( stack );
    node.callee = node.createToken( stack.callee );
    if( stack.callee.isParenthesizedExpression ){
        const name = ctx.checkRefsName('_refClass');
        node.insertNodeBlockContextAt( ctx.createAssignmentNode( ctx.createIdentifierNode(name,null,true), node.callee.expression ) );
        node.callee = ctx.createIdentifierNode(name,null,true);
    }
    node.arguments = createArgumentNodes(node, stack, stack.arguments, desc && desc.params );
    return node;
}