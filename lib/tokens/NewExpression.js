import Namespace from 'easescript/lib/core/Namespace';
import Utils from 'easescript/lib/core/Utils';
import Transform from '../transforms';
import AddressVariable from '../core/AddressVariable';
import {createStaticReferenceNode} from '../core/Common';
function createArgumentNodes(ctx, stack, args, declareParams){
    return args.map( (item,index)=>{
        const node = ctx.createToken(item)
        if( declareParams && declareParams[index] && !item.isIdentifier ){
            const declareParam = declareParams[index];
            if( !(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern) ){
                if( ctx.isAddressRefsType(declareParam.type()) ){
                    const name = ctx.genLocalRefName(item, AddressVariable.REFS_ARG);
                    return ctx.createAssignmentExpression(
                        ctx.createVarIdentifier(name),
                        node
                    );
                } 
            }
        }
        return node;
    });
}

export default function(ctx,stack){
    let type = stack.callee.type();
    let [classModule,desc] = stack.getConstructMethod(type);
    let wrapType = null;
    if(desc && desc.isNewDefinition && desc.module){
        type = desc.module;
    }

    if(type){
        type =  Utils.getOriginType(type)
        if(Utils.isTypeModule(type)){
            ctx.addDepend(type);
        }
        if(type === Namespace.globals.get("Array") ){
            return Transform.get('Array').of(
                stack,
                ctx, 
                null,
                createArgumentNodes(ctx, stack, stack.arguments, desc && desc.params ),
                true,
                false
            );
        }
        if(type === Namespace.globals.get("String")){
            wrapType = 'String';
        }else if(type === Namespace.globals.get("Number")){
            wrapType = 'Number';
        }else if(type === Namespace.globals.get("Boolean")){
            wrapType = 'Boolean';
        }else if(type === Namespace.globals.get("Object")){
            wrapType = 'Object';
        }
    }

    let node = ctx.createNode( stack );
    node.callee = ctx.createToken( stack.callee );
    node.arguments = createArgumentNodes(ctx, stack, stack.arguments||[], desc && desc.params );
    while(node.callee.type === 'ParenthesizedExpression'){
        node.callee = node.callee.expression
    }

    if(!type || !type.isModule || wrapType || !(node.callee.type =='Identifier' || node.callee.type =='MemberExpression')){
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'Reflect', 'construct'),
            [
                node.callee,
                ctx.createArrayExpression(
                    node.arguments,
                    stack
                )
            ],
            stack
        );
    }
    return node;
}