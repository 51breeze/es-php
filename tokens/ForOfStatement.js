function createConditionNode(ctx, obj, refs){
    const assignment = ctx.createNode('AssignmentPattern');
    assignment.left = assignment.createIdentifierNode(refs,null,true);
    assignment.right = assignment.createTypeTransformNode('object', assignment.createCalleeNode(
        assignment.createMemberNode([
            assignment.createIdentifierNode(obj,null,true),
            assignment.createIdentifierNode('next')
        ]),
        []
    ));
    const init =  ctx.createIdentifierNode(obj,null,true)
    const next = ctx.createParenthesNode( assignment );
    const done = ctx.createNode('UnaryExpression');
    done.prefix = true;
    done.operator ='!';
    done.argument = ctx.createMemberNode([
        assignment.createIdentifierNode(refs,null,true),
        assignment.createIdentifierNode('done')
    ]);
    const logical = ctx.createNode('LogicalExpression');
    const left = logical.createNode('LogicalExpression');
    init.parent = logical.left;
    next.parent = logical.left;
    done.parent = logical;

    left.left = init;
    left.operator = '&&';
    left.right = next;

    logical.operator = '&&';
    logical.left = left;
    logical.right = done;
    return logical;
}


function createAddressRefsNode(addressRefObject, ctx, desc, value, stack){
    const index = addressRefObject.add( stack );
    const name = addressRefObject.getName( desc );
    const left = addressRefObject.createIndexName(desc);
    const key = ctx.createAssignmentNode( 
        ctx.createIdentifierNode(left,null,true), 
        ctx.createLiteralNode(index)
    );
    key.computed = true;
    ctx.addVariableRefs(stack, left );
    return ctx.createAssignmentNode( 
        ctx.createIdentifierNode(name,null,true), 
        ctx.createObjectNode([
            ctx.createPropertyNode(key, value)
        ])
    );
}


module.exports = function(ctx,stack){
    var type = ctx.inferType(stack.right);
    if( !(type.isLiteralArrayType || type.isTupleType || type === ctx.builder.getGlobalModuleById('array') || ctx.isArrayMappingType( stack.compiler.callUtils("getOriginType",type) ) ) ){
        const node = ctx.createNode(stack,'ForStatement');
        const SystemModule = node.builder.getGlobalModuleById('System');
        const IteratorModule = node.builder.getGlobalModuleById('Iterator');
        node.addDepend( SystemModule );
        const isIterableIteratorType = stack.compiler.callUtils('isIterableIteratorType', type, IteratorModule);
        const declDesc = stack.left.isVariableDeclaration ? stack.left.declarations[0] : null;
        const init = node.createToken(stack.left);
        const obj = init.checkRefsName('_o');
        const res = init.checkRefsName('_v');
        const object = init.createAssignmentNode( 
            init.createIdentifierNode( obj, null, true ), 
            isIterableIteratorType ? init.createToken(stack.right) : init.createCalleeNode(
                init.createStaticMemberNode([
                    ctx.createIdentifierNode( node.getModuleReferenceName( SystemModule ) ),
                    ctx.createIdentifierNode('getIterator')
                ]),
                [
                    init.createToken(stack.right)
                ]
            )
        );
        const rewind = ctx.createCalleeNode(
            ctx.createMemberNode([
                ctx.createIdentifierNode( obj, null, true ),
                ctx.createIdentifierNode( 'rewind' )
            ])
        );
        var decl = init.declarations[0];
        init.declarations=[object, rewind];
        object.parent  = init;

        var isAddress = false;
        if( decl.type ==='AddressReferenceExpression' ){
            isAddress = true;
            decl = decl.argument;
        }

        const condition = createConditionNode(node, obj, res, true);
        let assignment = null;
        let forValue =  node.createMemberNode([
            node.createIdentifierNode( res , null, true),
            node.createIdentifierNode('value')
        ]);

        const address = node.getAssignAddressRef(declDesc);
        if( address ){
            forValue = node.creaateAddressRefsNode( forValue );
            assignment = node.createStatementNode( createAddressRefsNode(address, node, declDesc, forValue, stack) );
        }else{
            if( isAddress ){
                forValue = node.creaateAddressRefsNode( forValue );
            }
            assignment = node.createStatementNode(
                node.createAssignmentNode(
                    node.createIdentifierNode( decl.id.value, null, true ),
                    forValue,
                )
            );
        }

        node.init = init;
        node.condition = condition;
        node.update = null;
        node.body  = node.createToken(stack.body);
        if( stack.body.isBlockStatement ){
            node.body.body.splice(0,0,assignment);
        }else{
            const block = node.createNode('BlockStatement');
            block.body=[
                assignment,
                node.body
            ];
            node.body = block;
        }
        return node;
    }
    const node = ctx.createNode(stack);
    node.left  = node.createToken(stack.left);
    node.right = node.createToken(stack.right);
    node.body  = node.createToken(stack.body);
    return node;
}