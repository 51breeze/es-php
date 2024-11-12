const Transform = require('../core/Transform');

function trans(ctx, stack, description, aliasAnnotation, objectType){
    const type = objectType; //stack.object.type( stack.object.getContext() );
    let name = ctx.builder.getAvailableOriginType( type ) || type.toString();
    if( objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule ){
        name = desc.module.id;
    }
    if( Transform.has(name) ){
        const object = Transform.get(name);
        const key = stack.computed ? '$computed' : stack.property.value();
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

module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    const operator = stack.node.operator;
    const prefix = stack.node.prefix;
    const isMember = stack.argument.isMemberExpression;
    if( isMember ){
        const desc = stack.argument.description();
        const module = stack.module;
        let isReflect = false;
        if( stack.argument.computed ){
            const hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
            if( !hasDynamic && !node.compiler.callUtils("isLiteralObjectType",stack.argument.object.type() ) ){
                isReflect = true;
            }
        }else if( desc && desc.isAnyType ){
            isReflect = !node.compiler.callUtils("isLiteralObjectType", stack.argument.object.type() )
        }

        if(isReflect){
            const method = operator ==='++' ? 'incre' : 'decre';
            const Reflect = stack.getGlobalTypeById("Reflect");
            node.addDepend( Reflect );
            const callee = node.createStaticMemberNode([
                node.createIdentifierNode( node.getModuleReferenceName( Reflect ) ),
                node.createIdentifierNode(method)
            ]);
            let object = node.createToken(stack.argument.object);
            if( !stack.argument.object.isIdentifier ){
                const refs = node.checkRefsName('ref');
                node.insertNodeBlockContextAt(
                    node.createAssignmentNode( node.createIdentifierNode(refs, null, true), object )
                );
                object = node.createIdentifierNode(refs, null, true);
                if( node.isPassableReferenceExpress(stack.argument.object,stack.argument.object.type()) ){
                    object = node.creaateAddressRefsNode(object);
                }
            }
            return node.createCalleeNode( callee, [
                node.createCallReflectScopeNode( module ),
                object, 
                node.createCallReflectPropertyNode(stack.argument),
                node.createLiteralNode( !!prefix ),
            ], stack);
        }else if(desc && desc.isMethodDefinition && desc.isAccessor){
            stack = stack.argument 
            var objectDescription = stack.object.description();
            var objectType = ctx.inferType( stack.object );
            var isNewObject = !!stack.object.isNewExpression;
            var isStatic = stack.object.isSuperExpression || objectType.isClassType || (!isNewObject && stack.compiler.callUtils("isClassType", objectDescription));
            const aliasAnnotation = getAliasAnnotation(desc);
            const result = trans(node, stack, desc, aliasAnnotation, objectType);
            if( result )return result;
            const getMember = [
                node.createToken(stack.object), 
                node.createIdentifierNode( node.getAccessorName(aliasAnnotation ||  stack.property.value(), desc, 'get') )
            ];

            const setMember = [
                node.createToken(stack.object), 
                node.createIdentifierNode( node.getAccessorName(aliasAnnotation ||  stack.property.value(), desc, 'set') )
            ];

            const getCallee = isStatic ? node.createStaticMemberNode(getMember) : node.createMemberNode(getMember);
            const setCallee = isStatic ? node.createStaticMemberNode(setMember) : node.createMemberNode(setMember);

            if( stack.parentStack.parentStack.isExpressionStatement ){
                const value = node.createBinaryNode(operator ==='++' ? '+' : '-', node.createCalleeNode(getCallee),  node.createLiteralNode(1) );
                return node.createCalleeNode(setCallee, [value]);
            }else{
                const System = stack.getGlobalTypeById("System")
                node.addDepend( System );
                const sequence = node.createStaticMemberNode([
                    node.createIdentifierNode( node.getModuleReferenceName( System ) ), 
                    node.createIdentifierNode('sequences')
                ]);

                const refs = node.checkRefsName('V');
                let update = node.createBinaryNode(operator ==='++' ? '+' : '-', node.createIdentifierNode(refs, null, true),  node.createLiteralNode(1) );
                if( prefix ){
                    update = node.createAssignmentNode( 
                        node.createIdentifierNode(refs, null, true),
                        update
                    );
                }

                return node.createCalleeNode(sequence,[
                    node.createAssignmentNode( node.createIdentifierNode(refs, null, true), node.createCalleeNode(getCallee) ),
                    node.createCalleeNode(setCallee, [update]),
                    node.createIdentifierNode(refs, null, true)
                ]);
            }
        }
    }

    node.argument = node.createToken(stack.argument);
    node.operator = operator;
    node.prefix = prefix;
    return node;
}