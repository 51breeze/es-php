module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    node.inFor = stack.parentStack.flag;
    if( stack.id.isIdentifier){
        node.id = node.createIdentifierNode(stack.id.value(),stack.id);
    }else{
        node.id = node.createToken(stack.id);
    }

    if( stack.parentStack.isVariableDeclaration && stack.id.isIdentifier ){
        const type = ctx.inferType( stack , stack.init && stack.init.getContext());
        if( node.isAddressRefsType(type, stack.init) ){
            if( node.hasCrossScopeAssignment(stack.assignItems, !!node.inFor ) ){
                const address = node.addAssignAddressRef(stack, stack.init);
                const name = stack.id.value();
                address.setName(stack.description(), name);
                const left = address.createIndexName( stack.description() );
                if( stack.init ){
                    let init = node.createToken(stack.init);
                    if( node.isPassableReferenceExpress(stack.init) ){
                        if(init.type==='ParenthesizedExpression'){
                            init = init.expression
                        }
                        if(init.type==='AssignmentExpression'){
                            node.insertNodeBlockContextAt(init);
                            init = init.left
                        }
                        init = node.creaateAddressRefsNode(init);
                    }
                    const index = address.getIndex( stack.init );
                    const key = node.createAssignmentNode(
                        node.createIdentifierNode(left,null,true), 
                        node.createLiteralNode(index)
                    );
                    node.id = node.createMemberNode([
                        node.id,
                        key
                    ], null,true);
                    node.init = init;
                    return node;
                }
            }else if( stack.init && node.isPassableReferenceExpress(stack.init) ){
                let init = node.createToken(stack.init)
                if(init.type==='ParenthesizedExpression'){
                    init = init.expression
                }
                if(init.type==='AssignmentExpression'){
                    node.insertNodeBlockContextAt(init);
                    init = init.left
                }
                if( stack.parentStack.parentStack.isExportNamedDeclaration ){
                    const name = ctx.getDeclareRefsName(stack.init, '__REF');
                    const refNode = ctx.createDeclarationNode('const', [
                        ctx.createDeclaratorNode(
                            ctx.createIdentifierNode(name),
                            ctx.creaateAddressRefsNode( init ),
                        )
                    ]);
                    ctx.insertNodeBlockContextAt(refNode);
                    node.init = ctx.creaateAddressRefsNode( ctx.createIdentifierNode(name,null,true) );
                }else{
                    node.init = node.creaateAddressRefsNode( init );
                }
                return node;
            }

            if( node.inFor ){
                node.init = node.createToken(stack.init);
                return node.creaateAddressRefsNode( node )
            }
        }
    }

    node.init = node.createToken(stack.init);
    return node;
}