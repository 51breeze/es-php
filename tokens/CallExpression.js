const Transform = require('../core/Transform');
const Token = require('../core/Token');
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

function CallExpression(ctx,stack){
    const isMember = stack.callee.isMemberExpression;
    const desc =stack.doGetDeclareFunctionType(stack.callee.description());
    const module = stack.module;
    const declareParams = desc && desc.params;
    const node = ctx.createNode( stack );
    const args = createArgumentNodes(node, stack, stack.arguments, declareParams);
    if( stack.callee.isFunctionExpression ){
        node.callee = node.createIdentifierNode('call_user_func');
        node.arguments = [ node.createToken(stack.callee) ].concat( args );
        return node;
    }

    if( !stack.callee.isSuperExpression ){
        const context = isMember ? stack.callee.object.getContext() : stack.callee.getContext();
        let objectType = isMember ? ctx.inferType(stack.callee.object, context) : null;
        if( objectType && objectType.isClassGenericType && objectType.inherit.isAliasType ){
            objectType = ctx.inferType( objectType.inherit.inherit.type(),context);
        }
        if( isMember && desc && !objectType.isNamespace ){
            if( desc.isType && desc.isAnyType ){
                const Reflect = stack.getGlobalTypeById("Reflect");
                node.addDepend( Reflect );
                const propValue = stack.callee.property.value();
                const property = node.createLiteralNode( propValue, void 0, stack.callee.property);
                let target = node.createToken(stack.callee.object);
                if( !stack.callee.object.isIdentifier ){
                    const refs = node.checkRefsName('ref');
                    node.insertNodeBlockContextAt(
                        node.createAssignmentNode( node.createIdentifierNode(refs, null, true), target )
                    );
                    target = node.createIdentifierNode(refs, null, true);
                }

                return node.createCalleeNode(
                    node.createStaticMemberNode([
                        node.createIdentifierNode( node.getModuleReferenceName( Reflect ) ),
                        node.createIdentifierNode("call")
                    ]),
                    [
                        node.createClassRefsNode(module),
                        target,
                        property,
                        args.length >0 ? node.createArrayNode( args ) : null
                    ],
                    stack
                );
            }else if( desc.isStack ){
                let name = node.builder.getAvailableOriginType( objectType ) || objectType.toString();
                let descModule = null;
                if( (objectType.isUnionType || objectType.isIntersectionType) && (desc.isMethodDefinition || desc.isCallDefinition) && desc.module && desc.module.isModule ){
                    name = desc.module.id;
                    descModule = desc.module;
                }

                let newWrapObject = null;
                let isStringNewWrapObject = null;
                if(objectType.isInstanceofType && !objectType.isThisType){
                    const origin = objectType.inherit.type();
                    isStringNewWrapObject = origin === ctx.builder.getGlobalModuleById("String");
                    if( 
                        isStringNewWrapObject || 
                        origin === ctx.builder.getGlobalModuleById("Number") || 
                        origin === ctx.builder.getGlobalModuleById("Boolean")){
                            newWrapObject = true;
                    }
                }

                if( Transform.has(name) ){
                    const object = Transform.get(name);
                    const key = stack.callee.property.value();
                    if( Object.prototype.hasOwnProperty.call(object, key) ){
                        if( desc.static ){
                            return object[key](
                                node, 
                                null,
                                args,
                                true,
                                true
                            );
                        }else{
                            let callee = node.createToken(stack.callee.object);
                            if(newWrapObject && isStringNewWrapObject){
                                callee = node.createCalleeNode(node.createMemberNode([callee, 'toString']))
                            }
                            return object[key](
                                node, 
                                callee,
                                args,
                                true,
                                false
                            );
                        }
                    }
                }
                if(!(desc.isMethodDefinition ||  desc.isCallDefinition)){
                    node.callee = node.createIdentifierNode('call_user_func');
                    node.arguments = [ node.createToken(stack.callee) ].concat( args );
                    return node;
                }
            }
        }else if(desc){
            if( desc.isType && desc.isAnyType ){
                const Reflect = stack.getGlobalTypeById("Reflect");
                node.addDepend( Reflect );
                let target = node.createToken(stack.callee);
                if( !stack.callee.isIdentifier ){
                    const refs = node.checkRefsName('ref');
                    ctx.insertNodeBlockContextAt(
                        ctx.createAssignmentNode( ctx.createIdentifierNode(refs, null, true), target )
                    );
                    target = ctx.createIdentifierNode(refs, null, true);
                }

                return node.createCalleeNode(
                    node.createStaticMemberNode([
                        node.createIdentifierNode( node.getModuleReferenceName( Reflect ) ),
                        node.createIdentifierNode("apply")
                    ]),
                    [
                        node.createClassRefsNode(module),
                        target,
                        args.length >0 ? node.createArrayNode( args ) : null
                    ],
                    stack
                );
            }else if( desc.isStack && desc.isDeclaratorFunction ){
                const callee = node.createToken( stack.callee );
                const object = Transform.get('global');
                if( Object.prototype.hasOwnProperty.call(object, callee.value) ){
                    return object[callee.value](
                        node, 
                        callee, 
                        args, 
                        true,
                        false
                    );
                }
            }else if((desc.isCallDefinition || desc.isType && desc.isModule) && args.length === 1 ){
                const name = desc.isCallDefinition && desc.module ? desc.module.id :(node.builder.getAvailableOriginType( desc ) || desc.toString());
                if( name && Transform.has(name) ){
                    const object = Transform.get(name);
                    return object.valueOf(
                        node, 
                        args[0],
                        [], 
                        true,
                        false
                    );
                }
            }
        }
    }

    if( stack.callee.isSuperExpression ){
        if( !node.isActiveForModule(module.inherit, module, true) ){
            return null;
        }
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

module.exports = CallExpression;