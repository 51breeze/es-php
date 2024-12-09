import Namespace from 'easescript/lib/core/Namespace';
import Utils from 'easescript/lib/core/Utils';
import Transform from '../transforms';
import {createStaticReferenceNode, createScopeIdNode} from '../core/Common';
function createArgumentNodes(ctx, stack, args, declareParams){
    return args.map( (item,index)=>{
        const node = ctx.createToken(item)
        if( declareParams && declareParams[index] && !item.isIdentifier ){
            const declareParam = declareParams[index];
            if( !(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern) ){
                if( ctx.isAddressRefsType(declareParam.type()) ){
                    const name = ctx.getLocalRefName(stack, "arg" );
                    ctx.insertTokenToBlock(
                        stack,
                        ctx.createAssignmentExpression( ctx.createVarIdentifier(name), node )
                    );
                    return ctx.createVarIdentifier(name);
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

    if(!type || !type.isModule || wrapType){
        let Reflect = Namespace.globals.get("Reflect");
        ctx.addDepend(Reflect, stack.module);
        let target = ctx.createToken(stack.callee);
        if(!wrapType && !stack.callee.isIdentifier ){
            let refs = ctx.getLocalRefName(stack, 'ref');
            ctx.insertTokenToBlock(
                stack,
                ctx.createExpressionStatement(
                    ctx.createAssignmentExpression( ctx.createVarIdentifier(refs), target)
                )
            );
            target = ctx.createVarIdentifier(refs);
        }

        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'Reflect', 'construct'),
            [
                createScopeIdNode(ctx, stack.module, stack),
                target,
                ctx.createArrayExpression(
                    createArgumentNodes(ctx, stack, stack.arguments||[], desc && desc.params),
                    stack
                )
            ],
            stack
        );
    }

    let node = ctx.createNode( stack );
    node.callee = ctx.createToken( stack.callee );
    if(node.callee.type === 'ParenthesizedExpression'){
        let name = ctx.getLocalRefName(stack, '_refClass');
        ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression(
                ctx.createVarIdentifier(name),
                node.callee.expression
            )
        );
        node.callee = ctx.createVarIdentifier(name);
    }
    node.arguments = createArgumentNodes(ctx, stack, stack.arguments||[], desc && desc.params );
    return node;
}