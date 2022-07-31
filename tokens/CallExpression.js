const Transform = require('../core/Transform');
function createParamsNode(ctx, stack, arguments, declareParams){
    return arguments.map( (item,index)=>{
        const node = ctx.createToken(item)
        if( declareParams && declareParams[index] &&  item.isArrayExpression ){
            const declareType = declareParams[index].type( stack.getContext() );
            if( declareType ){
                const originType = ctx.builder.getAvailableOriginType( declareType );
                if( originType === "Array" ){
                    const name = ctx.checkRefsName("_V" );
                    ctx.insertNodeBlockContextAt(
                        ctx.createAssignmentNode( ctx.createIdentifierNode(name, null, true), node )
                    );
                    return ctx.createIdentifierNode(name, null, true);
                }
            }
        }
        if( item.isIdentifier ){
            return ctx.createArrayAddressRefsNode(item.description(), node.value);
        }
        return node;
    });
}

module.exports = function(ctx,stack){
    const isMember = stack.callee.isMemberExpression;
    const desc = stack.callee.description();
    const module = stack.module;
    const declareParams = desc && desc.params;
    const node = ctx.createNode( stack );
    const args = createParamsNode(node, stack, stack.arguments, declareParams);

    if( !stack.callee.isSuperExpression && isMember ){
        if( desc && desc.isType && desc.isAnyType ){
            ctx.addDepend( stack.getGlobalTypeById("Reflect") );
            const propValue = stack.callee.property.value();
            const property = ctx.createLiteralNode( propValue, void 0, stack.callee.property);
            return ctx.createCalleeNode(
                ctx.createStaticMemberNode([
                    ctx.createIdentifierNode("Reflect"),
                    ctx.createIdentifierNode("call")
                ]),
                [
                    ctx.createClassRefsNode(module),
                    ctx.createToken(stack.callee.object),
                    property,
                    ctx.createArrayNode( args )
                ],
                stack
            );
        }else if( desc && desc.isStack ){
            const type = stack.callee.object.type();
            const name = ctx.builder.getAvailableOriginType( type );
            if( Transform.has(name) ){
                const object = Transform.get(name);
                const key = stack.callee.property.value();
                if( Object.prototype.hasOwnProperty.call(object, key) ){
                    if( desc.static ){
                        return object[key](
                            ctx, 
                            args, 
                            desc.module 
                        );
                    }else{
                        return object[key](
                            ctx, 
                            ctx.createToken(stack.callee.object), 
                            desc, 
                            args, 
                            desc.module 
                        );
                    }
                }
            }
        }
    }else if( !isMember && !stack.callee.isSuperExpression ){
        if( desc.isDeclarator  ){
            if( stack.arguments.length > 0 ){
                return ctx.createCalleeNode(
                    ctx.createIdentifierNode('call_user_func_array'),
                    [
                        ctx.createToken( stack.callee ),
                    ].concat( args )
                );
            }else{
                return ctx.createCalleeNode(
                    ctx.createIdentifierNode('call_user_func'),
                    [
                        ctx.createToken( stack.callee )
                    ]
                );
            }
        }
    }

    
    if( desc && stack.callee.isSuperExpression && desc.isConstructor ){
        node.callee = node.createStaticMemberNode([
            node.createToken( stack.callee ),
            node.createIdentifierNode('__construct')
        ]);
    }else{
        node.callee = node.createToken( stack.callee );
    }
    node.arguments = args;
    return node;
}