const Transform = require('../core/Transform');
function MemberExpression(ctx,stack){
    const module = stack.module;
    const description = stack.description();
    if( description && description.isModule && stack.compiler.callUtils("isTypeModule",description) ){
        ctx.addDepend( description );
        if( stack.parentStack.isMemberExpression || stack.parentStack.isNewExpression || stack.parentStack.isCallExpression ){
            return ctx.createIdentifierNode( ctx.getModuleReferenceName(description,module), stack );
        }else{
            return ctx.createClassRefsNode(description, stack);
        }
    }

    if( description && description.isType && description.isAnyType ){
        let isReflect = false
        const hasDynamic = description.isComputeType && description.isPropertyExists();
        if( !hasDynamic && !stack.compiler.callUtils("isLiteralObjectType", stack.object.type() ) ){
            isReflect = true;
        }
        if( isReflect ){
            ctx.addDepend( stack.getGlobalTypeById("Reflect") );
            return ctx.createCalleeNode(
                ctx.createMemberNode([
                    ctx.createIdentifierNode("Reflect"), ctx.createIdentifierNode('get')
                ]),
                [
                    ctx.createClassRefsNode(module), 
                    ctx.createToken(stack.object), 
                    stack.computed ? ctx.createToken(stack.property) : ctx.createLiteralNode(stack.property.value(), void 0, stack.property),
                ],
                stack
            );
        }
    }

    const isStatic = stack.object.isSuperExpression || stack.compiler.callUtils("isClassType", stack.object.description() );
    if( description && (description.isMethodGetterDefinition || description.isMethodSetterDefinition) ){
       const callee = isStatic ? ctx.createStaticMemberNode([
                ctx.createToken(stack.object), 
                ctx.createIdentifierNode( ctx.getAccessorName(stack.property.value(), description,  description.isMethodGetterDefinition ? 'get' : 'set') )
            ],stack) : ctx.createMemberNode([
                ctx.createToken(stack.object), 
                ctx.createIdentifierNode( ctx.getAccessorName(stack.property.value(), description,  description.isMethodGetterDefinition ? 'get' : 'set') )
            ],stack);
        return description.isMethodGetterDefinition ? ctx.createCalleeNode(callee,[],stack) : callee;
    }else if( description && description.isMethodDefinition ){

        const name = ctx.builder.getAvailableOriginType( stack.object.type( stack.object.getContext() ) );
        if( Transform.has(name) ){
            const object = Transform.get(name);
            const key = stack.property.value();
            if( Object.prototype.hasOwnProperty.call(object, key) ){
                if( description.static ){
                    return object[key](
                        ctx, 
                        [], 
                        description.module,
                        false 
                    );
                }else{
                    return object[key](
                        ctx, 
                        ctx.createToken(stack.object), 
                        description, 
                        [], 
                        description.module,
                        false
                    );
                }
            }
        }

        if( !stack.parentStack.isCallExpression && !stack.parentStack.isMemberExpression ){
            return ctx.createArrayNode([
                ctx.createToken(stack.object),
                ctx.createLiteralNode( stack.property.value() )
            ]);
        }

        const pStack = stack.getParentStack( stack=>!!(stack.jsxElement || stack.isBlockStatement || stack.isCallExpression || stack.isExpressionStatement));
        if( pStack && pStack.jsxElement ){
            ctx.addDepend( stack.getGlobalTypeById('System') );
            return ctx.createCalleeNode(
                ctx.createStaticMemberNode([
                    ctx.createIdentifierNode('System'),
                    ctx.createIdentifierNode('bind')
                ]),
                [ 
                    ctx.createArrayNode([
                        ctx.createToken(stack.object), 
                        ctx.createLiteralNode(stack.property.value(), void 0,stack.property)
                    ]),
                    ctx.createThisNode()
                ]
            );
        }
    }

    const node = ctx.createNode(stack);
    if( stack.computed ){
        const type = stack.object.type();
        if( type && (type.isLiteralType || type.isLiteralArrayType || type.isTupleType) ){
            node.computed = true;
        }
    }
    node.object = node.createToken( stack.object );
    node.property = node.createToken( stack.property );
    node.isStatic = isStatic;
    return node;
}

module.exports = MemberExpression;