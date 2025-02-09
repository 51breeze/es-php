import Utils from 'easescript/lib/core/Utils';
import { createStaticReferenceNode,createScopeIdNode,createComputedPropertyNode, getMethodOrPropertyAlias} from '../core/Common';
import Transform from '../transforms';
import AddressVariable from '../core/AddressVariable';
function trans(ctx, stack, description, alias, objectType){
    const type = objectType;
    let name = ctx.getAvailableOriginType( type ) || type.toString();
    if( objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule ){
        name = desc.module.id;
    }
    if( Transform.has(name) ){
        const object = Transform.get(name);
        const key = stack.computed ? '$computed' : stack.property.value();
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

export default function(ctx,stack){
    const node = ctx.createNode(stack);
    const operator = stack.node.operator;
    const prefix = stack.node.prefix;
    const isMember = stack.argument.isMemberExpression;
    if( isMember ){
        const desc = stack.argument.description();
        const module = stack.module;
        let isReflect = false;
        if(stack.argument.computed){
            const hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
            if( !hasDynamic && !Utils.isLiteralObjectType(stack.argument.object.type()) ){
                isReflect = true;
            }
        }else if( desc && desc.isAnyType ){
            isReflect = !Utils.isLiteralObjectType(stack.argument.object.type())
        }

        if(isReflect){
            let method = operator ==='++' ? 'incre' : 'decre';
            let object = ctx.createToken(stack.argument.object);
            return ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, 'Reflect', method),
                [
                    createScopeIdNode(ctx, module, stack),
                    object, 
                    createComputedPropertyNode(ctx, stack.argument),
                    ctx.createLiteral( !!prefix ),
                ],
                stack
            );
        }else if(desc && desc.isMethodDefinition && desc.isAccessor){
            stack = stack.argument 
            let objectDescription = stack.object.description();
            let objectType = ctx.inferType( stack.object );
            let isNewObject = !!stack.object.isNewExpression;
            let isStatic = stack.object.isSuperExpression || objectType.isClassType || (!isNewObject && Utils.isClassType(objectDescription));
            let alias = getMethodOrPropertyAlias(ctx, stack);
            let result = trans(ctx, stack, desc, alias, objectType);
            if( result )return result;
            let getMember = [
                ctx.createToken(stack.object), 
                ctx.createIdentifier( ctx.getAccessorName(alias || stack.property.value(), desc, 'get') )
            ];

            let setMember = [
                ctx.createToken(stack.object), 
                ctx.createIdentifier( ctx.getAccessorName(alias ||  stack.property.value(), desc, 'set') )
            ];

            let getCallee = isStatic ? ctx.createStaticMemberExpression(getMember) : ctx.createMemberExpression(getMember);
            let setCallee = isStatic ? ctx.createStaticMemberExpression(setMember) : ctx.createMemberExpression(setMember);

            if( stack.parentStack.parentStack.isExpressionStatement ){
                let value = ctx.createBinaryExpression(
                    ctx.createCallExpression(getCallee),
                    ctx.createLiteral(1),
                    operator ==='++' ? '+' : '-'
                );
                return ctx.createCallExpression(setCallee, [value]);
            }else{
                let sequence = createStaticReferenceNode(ctx, stack, 'System', 'sequences')
                let refs = ctx.genLocalRefName(stack, AddressVariable.REFS_ARG);
                let update = ctx.createBinaryExpression(
                    ctx.createVarIdentifier(refs),
                    ctx.createLiteral(1),
                    operator ==='++' ? '+' : '-'
                );
                if( prefix ){
                    update = ctx.createAssignmentExpression( 
                        ctx.createVarIdentifier(refs),
                        update
                    );
                }
                return ctx.createCallExpression(sequence,[
                    ctx.createAssignmentExpression(
                        ctx.createVarIdentifier(refs),
                        ctx.createCallExpression(getCallee)
                    ),
                    ctx.createCallExpression(setCallee, [update]),
                    ctx.createVarIdentifier(refs)
                ]);
            }
        }
    }

    node.argument = ctx.createToken(stack.argument);
    node.operator = operator;
    node.prefix = prefix;
    return node;
}