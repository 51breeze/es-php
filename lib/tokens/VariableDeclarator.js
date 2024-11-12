import { createAddressRefsNode } from "../core/Common";

export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.inFor = stack.parentStack.flag;
    if( stack.id.isIdentifier){
        node.id = ctx.createIdentifier(stack.id.value(),stack.id);
    }else{
        node.id = ctx.createToken(stack.id);
    }

    if( stack.parentStack.isVariableDeclaration && stack.id.isIdentifier ){
        const type = ctx.inferType( stack , stack.init && stack.init.getContext());
        if( ctx.isAddressRefsType(type, stack.init) ){
            if( ctx.hasCrossScopeAssignment(stack.assignItems, !!node.inFor ) ){
                const address = ctx.addAssignAddressRef(stack, stack.init);
                const name = stack.id.value();
                address.setName(stack.description(), name);
                const left = address.createIndexName( stack.description() );
                if( stack.init ){
                    let init = ctx.createToken(stack.init);
                    if( ctx.isPassableReferenceExpress(stack.init) ){
                        if(init.type==='ParenthesizedExpression'){
                            init = init.expression
                        }
                        if(init.type==='AssignmentExpression'){
                            ctx.insertTokenToBlock(stack, init);
                            init = init.left
                        }
                        init = createAddressRefsNode(ctx, init);
                    }
                    const index = address.getIndex( stack.init );
                    const key = ctx.createAssignmentExpression(
                        ctx.createVarIdentifier(left), 
                        ctx.createLiteral(index)
                    );
                    node.id = ctx.createStaticMemberExpression([
                        node.id,
                        key
                    ]);
                    node.init = init;
                    return node;
                }
            }else if( stack.init && ctx.isPassableReferenceExpress(stack.init) ){
                let init = ctx.createToken(stack.init)
                if(init){
                    if(init.type==='ParenthesizedExpression'){
                        init = init.expression
                    }
                    if(init.type==='AssignmentExpression'){
                        ctx.insertTokenToBlock(stack, init);
                        init = init.left
                    }
                }
                if( stack.parentStack.parentStack.isExportNamedDeclaration ){
                    let name = ctx.getLocalRefName(stack.init, '__REF', stack.init);
                    let refNode = ctx.createVariableDeclaration('const', [
                        ctx.createVariableDeclarator(
                            ctx.createIdentifier(name),
                            createAddressRefsNode(ctx, node.init),
                        )
                    ]);
                    ctx.insertTokenToBlock(stack, refNode);
                    node.init = createAddressRefsNode(ctx, ctx.createVarIdentifier(name) );
                }else{
                    node.init = createAddressRefsNode(ctx, init);
                }
                return node;
            }

            if( node.inFor ){
                node.init = ctx.createToken(stack.init);
                return createAddressRefsNode(ctx,node)
            }
        }
    }

    node.init = ctx.createToken(stack.init);
    return node;
}