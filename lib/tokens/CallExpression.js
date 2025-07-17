import Transform from '../transforms';
import {createStaticReferenceNode,createScopeIdNode,insertTokenToBlock} from '../core/Common';
import AddressVariable from '../core/AddressVariable';
import Utils from 'easescript/lib/core/Utils';
import Namespace from 'easescript/lib/core/Namespace';

function createArgumentNodes(ctx, stack, args, declareParams){
    return args.map( (item,index)=>{
        const node = ctx.createToken(item)
        if( declareParams && declareParams[index] && !item.isIdentifier ){
            const declareParam = declareParams[index];
            if( !(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern) ){
                if( ctx.isAddressRefsType(declareParam.type()) ){
                    return insertTokenToBlock(ctx, item, node)
                }
            }
        }
        return node;
    });
}

function CallExpression(ctx,stack){
    let refs = ctx.getWasLocalRefName(stack, AddressVariable.REFS_ASSIGN);
    if(refs){
        return ctx.createVarIdentifier(refs);
    }
    const isMember = stack.callee.isMemberExpression;
    const desc = stack.descriptor();
    const module = stack.module;
    const declareParams = desc && desc.params;
    const node = ctx.createNode( stack );
    const args = createArgumentNodes(ctx, stack, stack.arguments, declareParams);
    if( stack.callee.isFunctionExpression ){
        node.callee = ctx.createIdentifier('call_user_func');
        node.arguments = [ ctx.createToken(stack.callee) ].concat( args );
        return node;
    }

    if( !stack.callee.isSuperExpression ){
        let context = isMember ? stack.callee.object.getContext() : stack.callee.getContext();
        let objectType = isMember ? ctx.inferType(stack.callee.object, context) : null;
        if( objectType && objectType.isClassGenericType && objectType.inherit.isAliasType ){
            objectType = ctx.inferType( objectType.inherit.inherit.type(),context);
        }
        if( isMember && desc && !objectType.isNamespace ){
            if(desc.isType && desc.isAnyType){
                const propValue = stack.callee.property.value();
                const property = ctx.createLiteral(propValue);
                let target = ctx.createToken(stack.callee.object);
                if(target.type!=="Identifier"){
                    target = insertTokenToBlock(ctx, stack.callee.object, target);
                }
                let _args = [
                    createScopeIdNode(ctx,module,stack),
                    target,
                    property
                ];
                if(args.length >0){
                    _args.push(ctx.createArrayExpression( args ));
                }
                return ctx.createCallExpression(
                    createStaticReferenceNode(ctx, stack, 'Reflect', 'call'),
                    _args,
                    stack
                );
            }else if( Utils.isStack(desc) ){
                let name = ctx.getAvailableOriginType(objectType) || objectType.toString();
                if( (objectType.isUnionType || objectType.isIntersectionType) && (desc.isMethodDefinition || desc.isCallDefinition) && desc.module && desc.module.isModule ){
                    name = desc.module.id;
                    descModule = desc.module;
                }

                let newWrapObject = null;
                let isStringNewWrapObject = null;
                if(objectType.isInstanceofType && !objectType.isThisType){
                    const origin = objectType.inherit.type();
                    isStringNewWrapObject = origin === Namespace.globals.get('String');
                    if( 
                        isStringNewWrapObject || 
                        origin === Namespace.globals.get("Number") || 
                        origin === Namespace.globals.get("Boolean")){
                            newWrapObject = true;
                    }
                }

                if( Transform.has(name) ){
                    const object = Transform.get(name);
                    const key = stack.callee.property.value();
                    if( Object.prototype.hasOwnProperty.call(object, key) ){
                        if( desc.static ){
                            return object[key](
                                stack,
                                ctx,
                                null,
                                args,
                                true,
                                true
                            );
                        }else{
                            let callee = ctx.createToken(stack.callee.object);
                            if(newWrapObject && isStringNewWrapObject && stack.callee.property.value() !== 'toString'){
                                callee = ctx.createCallExpression(
                                    ctx.createMemberExpression([
                                        callee,
                                        ctx.createIdentifier('toString')
                                    ])
                                )
                            }
                            return object[key](
                                stack,
                                ctx, 
                                callee,
                                args,
                                true,
                                false
                            );
                        }
                    }
                }
                if(!(desc.isMethodDefinition ||  desc.isCallDefinition)){
                    node.callee = ctx.createIdentifier('call_user_func');
                    node.arguments = [
                        ctx.createToken(stack.callee)
                    ].concat( args );
                    return node;
                }
            }
        }else if(desc){
            if( desc.isType && desc.isAnyType ){
                let target = ctx.createToken(stack.callee);
                return ctx.createCallExpression(
                    createStaticReferenceNode(ctx, stack, 'Reflect', 'invoke'),
                    [target,...args],
                    stack
                );
            }else if( desc.isStack && desc.isDeclaratorFunction ){
                const callee = ctx.createToken( stack.callee );
                const object = Transform.get('global');
                if( Object.prototype.hasOwnProperty.call(object, callee.value) ){
                    return object[callee.value](
                        stack,
                        ctx, 
                        callee, 
                        args, 
                        true,
                        false
                    );
                }
            }else if((desc.isCallDefinition || Utils.isModule(desc)) && args.length === 1 ){
                const name = desc.isCallDefinition && desc.module ? desc.module.id :(ctx.getAvailableOriginType( desc ) || desc.toString());
                if( name && Transform.has(name) ){
                    const object = Transform.get(name);
                    return object.valueOf(
                        stack,
                        ctx,
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
        node.callee = ctx.createStaticMemberExpression([
            ctx.createToken( stack.callee ),
            ctx.createIdentifier('__construct')
        ]);
        node.isSuperExpression = true;
    }else{
        node.callee = ctx.createToken( stack.callee );
    }
    node.arguments = args;
    return node;
}

export default CallExpression;