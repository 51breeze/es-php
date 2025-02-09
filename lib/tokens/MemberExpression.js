import Utils from 'easescript/lib/core/Utils';
import { createClassRefsNode,createComputedPropertyNode,createScopeIdNode,createStaticReferenceNode,canUseNullCoalescingOperator} from '../core/Common';
import Transform from '../transforms';
import AddressVariable from '../core/AddressVariable';

function trans(ctx, stack, description, aliasAnnotation, objectType){

    var type = objectType;
    var name = ctx.getAvailableOriginType( type ) || type.toString();
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
                    stack,
                    ctx, 
                    ctx.createToken(stack.object), 
                    [ctx.createToken(stack.property)],
                    false,
                    false
                );
            }
            if( description.static ){
                return object[key](
                    stack,
                    ctx,
                    null,
                    [], 
                    false,
                    true
                );
            }else{
                return object[key](
                    stack,
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


function getAliasAnnotation(desc){
    if(!desc || !desc.isStack)return null;
    return desc.getAnnotationAlias();
}

function MemberExpression(ctx,stack){
    let refs = ctx.getWasLocalRefName(stack, AddressVariable.REFS_ASSIGN);
    if(refs){
        return ctx.createVarIdentifier(refs);
    }
    
    let module = stack.module;
    let description = stack.descriptor();
    let computed = false;
    if(description && Utils.isTypeModule(description)){
        ctx.addDepend( description );
        let pp = stack.parentStack;
        if(pp.isMemberExpression && pp.object === stack || (pp.isNewExpression||pp.isCallExpression) && pp.callee === stack){
            return ctx.createIdentifier( ctx.getModuleReferenceName(description,module), stack );
        }else{
            return createClassRefsNode(ctx, description, stack);
        }
    }

    let objCtx = stack.object.getContext();
    let objectType = ctx.inferType(stack.object, objCtx);
    let objectDescription = stack.object.descriptor();
    let rawObjectType = objectType;
    let isWrapType = false;
    if( objectType.isClassGenericType && objectType.inherit.isAliasType ){
        objectType = ctx.inferType(objectType.inherit.inherit.type(), objCtx);
        isWrapType = true;
    }
    
    if(objectType.isNamespace && !stack.parentStack.isMemberExpression){
        let mappingNs = ctx.getMappingNamespace( stack.value() );
        if(mappingNs===false)return ctx.createLiteral(null);
        if(mappingNs){
            return ctx.createIdentifier(mappingNs);
        }
        return ctx.createIdentifier( '\\'+stack.value().replace(/\./g,'\\') );
    }

    if(!description || description.isType && description.isAnyType){
        let isCall = stack.parentStack.parentStack.isCallExpression;
        if(!description && isCall){
            let mappingNs = ctx.getMappingNamespace( stack.value() );
            if(mappingNs===false)return ctx.createLiteral(null);
            if(mappingNs){
                return ctx.createLiteral(mappingNs.replace(/\\/g,'\\\\'));
            }
            return ctx.createLiteral( '\\\\'+stack.value().replace(/\./g,'\\\\') );
        }

        let isReflect = !!objectType.isAnyType;
        let hasDynamic = description && description.isComputeType && description.isPropertyExists();
        if( !hasDynamic && !Utils.isLiteralObjectType(objectType)){
            isReflect = true;
        }
        if(isReflect){
            let object = ctx.createToken(stack.object);
            let node = ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, 'Reflect', 'get'),
                [
                    createScopeIdNode(ctx, module,stack), 
                    object,
                    createComputedPropertyNode(ctx, stack)
                ],
                stack
            );
            return node;
        }
        computed = true;
    }

    let isNewObject = !!stack.object.isNewExpression;
    if( !isNewObject && stack.object.isParenthesizedExpression ){
        let op = stack.object.expression;
        while( op.isParenthesizedExpression ){
            op = op.expression
        }
        isNewObject = !!op.isNewExpression;
    }
    
    let isStatic = stack.object.isSuperExpression || objectType.isClassType || (!isNewObject && stack.compiler.callUtils("isClassType", objectDescription));
    let objectNode = null;
    let propertyNode = null;
    if( isStatic && !(objectType.isClassType || stack.object.isSuperExpression) ){
        if( stack.object.isCallExpression ){
            isStatic = false;
        }
    }

    let aliasAnnotation = null;
    let isMember = description && description.isEnumProperty;
    if( description && (description.isMethodGetterDefinition || description.isMethodSetterDefinition) ){
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if(result)return result;
        const members = [
            ctx.createToken(stack.object), 
            ctx.createIdentifier( ctx.getAccessorName(aliasAnnotation || stack.property.value(), description,  description.isMethodGetterDefinition ? 'get' : 'set') )
        ];
        const callee = isStatic ? ctx.createStaticMemberExpression(members,stack) : ctx.createMemberExpression(members,stack);
        return description.isMethodGetterDefinition ? ctx.createCallExpression(callee,[],stack) : callee;
    }else if( description && description.isMethodDefinition ){
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if( result )return result;
        let pp = stack.parentStack;
        while(pp && (pp.isTypeAssertExpression || pp.isParenthesizedExpression)){
            pp = pp.parentStack
        }
        if(pp && !(pp.isCallExpression || pp.isMemberExpression)){
            return ctx.createArrayExpression([
                ctx.createToken(stack.object),
                ctx.createLiteral( aliasAnnotation || stack.property.value() )
            ]);
        }
        const pStack = stack.getParentStack( stack=>!!(stack.jsxElement || stack.isBlockStatement || stack.isCallExpression || stack.isExpressionStatement));
        if( pStack && pStack.jsxElement ){
            return ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, 'System', 'bind'),
                [ 
                    ctx.createArrayExpression([
                        ctx.createToken(stack.object), 
                        ctx.createLiteral(aliasAnnotation || stack.property.value(), void 0,stack.property)
                    ]),
                    ctx.createThisExpression()
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
            propertyNode = ctx.createVarIdentifier(stack.property.value(), stack.property);
        }
    }
    
    const node = ctx.createNode(stack);
    node.computed = computed;
    node.optional = stack.optional;
    if( aliasAnnotation ){
        propertyNode = ctx.createIdentifier( aliasAnnotation, stack.property);
    }
    
    if( stack.computed ){
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if( result )return result;
        if( !isStatic && rawObjectType && ctx.isArrayAccessor(rawObjectType) /*check(objectType)*/ ){
            node.computed = true;
        }else if(rawObjectType){
            node.computed = !ctx.isObjectAccessor(rawObjectType);
        }
    }else if( !isStatic && rawObjectType && (rawObjectType.isEnumType || ctx.isArrayAccessor(rawObjectType)) /*check(objectType)*/){
        node.computed = true;
        propertyNode = ctx.createLiteral(stack.property.value());
    }

    if( stack.object.isNewExpression ){
        objectNode = ctx.createParenthesizedExpression( ctx.createToken( stack.object ) );
    }

    node.object = objectNode || ctx.createToken( stack.object );
    node.property = propertyNode || ctx.createToken( stack.property );
    node.isStatic = isStatic;

    if(node.computed || !isMember){
        if(canUseNullCoalescingOperator(stack)){
            return ctx.createBinaryExpression(node, ctx.createLiteral(null), '??');
        }
    }

    return node;
}

export default MemberExpression;