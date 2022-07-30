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

    
    if( description && (description.isMethodGetterDefinition || description.isMethodSetterDefinition) ){
        return ctx.createCalleeNode(
            ctx.createMemberNode([
                ctx.createToken(stack.object), 
                ctx.createIdentifierNode( ctx.getAccessorName(stack.property.value(), description,  description.isMethodGetterDefinition ? 'get' : 'set') )
            ]),
            [],
            stack
        );
    }

    if( description && (!description.isAccessor && description.isMethodDefinition) ){
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
    node.isStatic = stack.object.isSuperExpression || stack.compiler.callUtils("isClassType", stack.object.type() );
    return node;
}

module.exports = MemberExpression;