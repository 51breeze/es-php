import { createAddressRefsNode, createExpressionTransformTypeNode } from "../core/Common";
function getSpreadRefName(ctx, target){
    let name = ctx.getWasLocalRefsName(target, 'S');
    if(!name){
        name = ctx.getLocalRefName(target, 'S', target);
        let refNode = ctx.createVariableDeclaration('const', [
            ctx.createVariableDeclarator(
                ctx.createIdentifier(name),
                createExpressionTransformTypeNode(ctx, 'object',expression),
            )
        ]);
        ctx.insertTokenToBlock(target, refNode);
    }
    return ctx.createVarIdentifier(name);
}

export default function(ctx,stack){
    let node = ctx.createNode(stack);
    node.computed = !!stack.computed;
    if( stack.parentStack.isObjectPattern ){
        let target = stack.parentStack.parentStack.init;
        let key = stack.value();
        let name = null;
        let value = null;
        if(stack.hasAssignmentPattern){
            value = ctx.createToken(stack.init.right);
            name = stack.init.left.value();
        }else{
            value = ctx.createLiteral(null);
            name = stack.init.value();
        }
  
        if( target.isObjectExpression || target.isArrayExpression){
            let init = target.attribute( key );
            return ctx.createExpressionStatement(
                ctx.createAssignmentExpression( 
                    ctx.createVarIdentifier(name),
                    init ? ctx.createBinaryExpression(
                        ctx.createToken(init.init),
                        init.init.isLiteral ? ctx.createLiteral(null) : value,
                        '??'
                    ) : value
                )
            );
        }else{
            let obj =  getSpreadRefName(ctx, target);
            return ctx.createExpressionStatement(
                ctx.createAssignmentExpression( 
                    ctx.createVarIdentifier(name),
                    ctx.createBinaryExpression(
                        ctx.createMemberExpression(
                            [
                                obj,
                                ctx.createIdentifier(key)
                            ],
                        ),
                        value,
                        '??'
                    )
                )
            );
        }
    }

    if(!node.computed && stack.parentStack.isObjectExpression){
        node.key = ctx.createLiteral( stack.key.value() );
    }else{
        node.key = ctx.createToken(stack.key);
        if(node.computed && node.key.type ==="Identifier"){
            node.key.isVariable = true;
        }
    }
    node.init = ctx.createToken(stack.init);
    if( stack.hasInit && ctx.isPassableReferenceExpress(stack.init, stack.type()) ){
        if( stack.init.isCallExpression || stack.init.isAwaitExpression ){
            let name = ctx.getLocalRefName(stack.init, 'R', stack.init);
            let refNode = ctx.createVariableDeclaration('const', [
                ctx.createVariableDeclarator(
                    ctx.createIdentifier(name),
                    createAddressRefsNode( node.init ),
                )
            ]);
            ctx.insertTokenToBlock(stack, refNode);
            node.init = createAddressRefsNode(ctx, ctx.createVarIdentifierNode(name) );
        }else{
            node.init = createAddressRefsNode(ctx, node.init);
        }
    }
    return node;
}