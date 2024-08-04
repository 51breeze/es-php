const Transform = require('../core/Transform');

function trans(ctx, stack, description, aliasAnnotation, objectType){

    const type = objectType; //stack.object.type( stack.object.getContext() );
    let name = ctx.builder.getAvailableOriginType( type ) || type.toString();
    if( objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule ){
        name = description.module.id;
    }
    if( Transform.has(name) ){
        const object = Transform.get(name);
        let key = stack.computed ? '$computed' : stack.property.value();
        if(description && (description.isPropertyDefinition || description.isMethodDefinition)){
            if(description.value() === stack.property.value()){
                key = stack.property.value()
            }
        }

        if( Object.prototype.hasOwnProperty.call(object, key) ){
            if( stack.computed ){
                return object[key](
                    ctx, 
                    ctx.createToken(stack.object), 
                    [ctx.createToken(stack.property)],
                    false,
                    false
                );
            }
            if( description.static ){
                return object[key](
                    ctx,
                    null,
                    [], 
                    false,
                    true
                );
            }else{
                return object[key](
                    ctx, 
                    ctx.createToken(stack.object), 
                    [],
                    false,
                    false
                );
            }
        }
    }
    return null;
}

function isDynamicProperty(stack, objectType, propertyType ){
    propertyType = stack.compiler.callUtils("getOriginType",propertyType);
    objectType = stack.compiler.callUtils("getOriginType",objectType);
    const every=(parentType)=>{
        while( parentType && parentType.isModule ){
            if( parentType.dynamic ){
                for( let item of parentType.dynamicProperties.entries() ){
                    const [type] = item;
                    if( type.is( propertyType ) ){
                        return true;
                    }
                }
            }
            if( parentType.implements && parentType.implements.some( every ) ){
                return true;
            }
            parentType = parentType.inherit;
        }
        return false;
    }
    return every( objectType );
}

function getAliasAnnotation(desc){
    if( !desc || !desc.isStack || !desc.annotations )return null;
    const result = desc.annotations.find( annotation=>{
        return annotation.name.toLowerCase() === 'alias';
    });
    if(result){
        const args = result.getArguments();
        if( args[0] )return args[0].value;
    }
    return null;
}

function MemberExpression(ctx,stack){
    const module = stack.module;
    const description = stack.descriptor();
    let computed = false;
    if( description && description.isModule && stack.compiler.callUtils("isTypeModule",description) ){
        ctx.addDepend( description );
        if( stack.parentStack.isMemberExpression || stack.parentStack.isNewExpression || stack.parentStack.isCallExpression ){
            return ctx.createIdentifierNode( ctx.getModuleReferenceName(description,module), stack );
        }else{
            return ctx.createClassRefsNode(description, stack);
        }
    }

    var objCtx = stack.object.getContext();
    var objectType = ctx.inferType(stack.object, objCtx);
    var objectDescription = stack.object.descriptor();
    var rawObjectType = objectType;
    var isWrapType = false;
    if( objectType.isClassGenericType && objectType.inherit.isAliasType ){
        objectType = ctx.inferType( objectType.inherit.inherit.type(), objCtx );
        isWrapType = true;
    }
    
    if(objectType.isNamespace && !stack.parentStack.isMemberExpression){
        const mappingNs = ctx.builder.getMappingNamespace( stack.value() );
        if( mappingNs !== null ){
            return mappingNs ? ctx.createIdentifierNode( mappingNs +'\\'+ stack.property.value(), stack.property) : ctx.createToken(stack.property);
        }
        return ctx.createIdentifierNode( '\\'+stack.value().replace(/\./g,'\\') );
    }

    if( description && description.isType && description.isAnyType ){
        let isReflect = !!objectType.isAnyType;
        const hasDynamic = description.isComputeType && description.isPropertyExists();
        if( !hasDynamic && !stack.compiler.callUtils("isLiteralObjectType", objectType ) ){
            isReflect = true;
        }
        if( isReflect ){
            const Reflect = stack.getGlobalTypeById("Reflect");
            ctx.addDepend(Reflect);
            return ctx.createCalleeNode(
                ctx.createStaticMemberNode([
                    ctx.createIdentifierNode( ctx.getModuleReferenceName( Reflect ) ), ctx.createIdentifierNode('get')
                ]),
                [
                    ctx.createClassRefsNode(module), 
                    ctx.createToken(stack.object), 
                    stack.computed ? ctx.createToken(stack.property) : ctx.createLiteralNode(stack.property.value(), void 0, stack.property),
                ],
                stack
            );
        }
        computed = true;
    }

    var isNewObject = !!stack.object.isNewExpression;
    if( !isNewObject && stack.object.isParenthesizedExpression ){
        let op = stack.object.expression;
        while( op.isParenthesizedExpression ){
            op = op.expression
        }
        isNewObject = !!op.isNewExpression;
    }
    
    var isStatic = stack.object.isSuperExpression || objectType.isClassType || (!isNewObject && stack.compiler.callUtils("isClassType", objectDescription));
    var objectNode = null;
    var propertyNode = null;
    if( isStatic && !(objectType.isClassType || stack.object.isSuperExpression) ){
        if( stack.object.isCallExpression ){
            isStatic = false;
        }
    }
    let aliasAnnotation = null;
    let isMember = false;
    if( description && (description.isMethodGetterDefinition || description.isMethodSetterDefinition) ){
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if( result )return result;
        const members = [
            ctx.createToken(stack.object), 
            ctx.createIdentifierNode( ctx.getAccessorName(aliasAnnotation || stack.property.value(), description,  description.isMethodGetterDefinition ? 'get' : 'set') )
        ];
        const callee = isStatic ? ctx.createStaticMemberNode(members,stack) : ctx.createMemberNode(members,stack);
        return description.isMethodGetterDefinition ? ctx.createCalleeNode(callee,[],stack) : callee;
    }else if( description && description.isMethodDefinition ){
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if( result )return result;
        if( !stack.parentStack.isCallExpression && !stack.parentStack.isMemberExpression ){
            return ctx.createArrayNode([
                ctx.createToken(stack.object),
                ctx.createLiteralNode( aliasAnnotation || stack.property.value() )
            ]);
        }
        const pStack = stack.getParentStack( stack=>!!(stack.jsxElement || stack.isBlockStatement || stack.isCallExpression || stack.isExpressionStatement));
        if( pStack && pStack.jsxElement ){
            const System = stack.getGlobalTypeById("System");
            ctx.addDepend( System );
            return ctx.createCalleeNode(
                ctx.createStaticMemberNode([
                    ctx.createIdentifierNode(ctx.getModuleReferenceName( System )),
                    ctx.createIdentifierNode('bind')
                ]),
                [ 
                    ctx.createArrayNode([
                        ctx.createToken(stack.object), 
                        ctx.createLiteralNode(aliasAnnotation || stack.property.value(), void 0,stack.property)
                    ]),
                    ctx.createThisNode()
                ]
            );
        }
        isMember = true;
    }else if(description && description.isPropertyDefinition){
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if( result )return result;
        isMember = true;
        if(isStatic && description.kind !=='const'){
            propertyNode = ctx.createIdentifierNode(stack.property.value(), stack.property, true);
        }
    }

    // let isObjectProtectorFlag = void 0;
    // const isObjectProtector = ()=>{
    //     if( isObjectProtectorFlag !== void 0 )return isObjectProtectorFlag;
    //     return isObjectProtectorFlag = isWrapType && stack.getGlobalTypeById('ObjectProtector') === rawObjectType.inherit;
    // }

    // const check = (type)=>{
    //     if( type.isLiteralObjectType || 
    //         type.isLiteralType || 
    //         type.isLiteralArrayType || 
    //         type.isTupleType || 
    //         stack.compiler.callUtils("getOriginType",type)===stack.getGlobalTypeById('Array') ||
    //         (isWrapType && stack.getGlobalTypeById('ArrayProtector') === rawObjectType.inherit) ||
    //         ctx.isArrayMappingType( stack.compiler.callUtils("getOriginType",type) ) 
    //     ){  
    //         return isWrapType ? !isObjectProtector() : true;
    //     }
    //     return false
    // }

    const node = ctx.createNode(stack);
    node.computed = computed;
    node.optional = stack.optional;
    if( aliasAnnotation ){
        propertyNode = node.createIdentifierNode( aliasAnnotation, stack.property);
    }
    if( stack.computed ){
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if( result )return result;
        if( !isStatic && rawObjectType && ctx.isArrayAccessor(rawObjectType) /*check(objectType)*/ ){
            node.computed = true;
        }else if(rawObjectType){
            node.computed = !ctx.isObjectAccessor(rawObjectType);
            //const propertyType = stack.property.type( objCtx );
            //node.computed = isDynamicProperty(stack, objectType, propertyType );
        }
    }else if( !isStatic && rawObjectType && ctx.isArrayAccessor(rawObjectType) /*check(objectType)*/){
        node.computed = true;
        propertyNode = node.createLiteralNode(stack.property.value(), void 0,  stack.property);
    }

    if( stack.object.isNewExpression ){
        objectNode = node.createParenthesNode( node.createToken( stack.object ) );
    }

    node.object = objectNode || node.createToken( stack.object );
    node.property = propertyNode || node.createToken( stack.property );
    node.isStatic = isStatic;

    if( node.computed || !isMember ){
        let pStack = stack.getParentStack(p=>!p.isMemberExpression);
        if( !(pStack.isCallExpression||pStack.isNewExpression||pStack.isAssignmentExpression||pStack.isChainExpression) ){
            return node.createBinaryNode('??', node, node.createLiteralNode(null) );
        }
    }

    return node;
}

module.exports = MemberExpression;