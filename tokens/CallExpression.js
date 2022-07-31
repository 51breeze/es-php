const Transform = require('../core/Transform');
module.exports = function(ctx,stack){
    const isMember = stack.callee.isMemberExpression;
    const desc = stack.callee.description();
    const module = stack.module;
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
                    ctx.createArrayNode( stack.arguments.map( item=>ctx.createToken(item) ) )
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
                            stack.arguments.map( item=>ctx.createToken(item) ), 
                            desc.module 
                        );
                    }else{
                        return object[key](
                            ctx, 
                            ctx.createToken(stack.callee.object), 
                            desc, 
                            stack.arguments.map( item=>ctx.createToken(item) ), 
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
                    ].concat( stack.arguments.map( item=>ctx.createToken(item) ) )
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

    const node = ctx.createNode( stack );
    if( desc && stack.callee.isSuperExpression && desc.isConstructor ){
        node.callee = node.createStaticMemberNode([
            node.createToken( stack.callee ),
            node.createIdentifierNode('__construct')
        ]);
    }else{
        node.callee = node.createToken( stack.callee );
    }
    node.arguments = stack.arguments.map( item=>node.createToken(item) );
    return node;
}