
import Namespace from 'easescript/lib/core/Namespace';
import Utils from 'easescript/lib/core/Utils';
import {createAddressRefsNode as createAddressNode, createExpressionTransformTypeNode, createStaticReferenceNode} from '../core/Common';

function createConditionNode(ctx, obj, refs){
    const assignment = ctx.createAssignmentPattern(
        ctx.createVarIdentifier(refs),
        createExpressionTransformTypeNode(ctx, 'object', ctx.createCallExpression(
            ctx.createMemberExpression([
                ctx.createVarIdentifier(obj),
                ctx.createIdentifier('next')
            ])
        ))
    );
    const init = ctx.createVarIdentifier(obj)
    const next = ctx.createParenthesizedExpression( assignment );
    const done = ctx.createUnaryExpression(
        ctx.createMemberExpression([
            ctx.createVarIdentifier(refs),
            ctx.createIdentifier('done')
        ]),
        '!',
        true
    );
    const left = ctx.createLogicalExpression(init, next)
    return ctx.createLogicalExpression(left, done);
}


function createAddressRefsNode(addressRefObject, ctx, desc, value, stack){
    const index = addressRefObject.add( stack );
    const name = addressRefObject.getName( desc );
    const left = addressRefObject.createIndexName(stack, desc);
    const key = ctx.createAssignmentExpression( 
        ctx.createVarIdentifier(left), 
        ctx.createLiteral(index)
    );
    key.computed = true;
    ctx.addVariableRefs(stack, left );
    return ctx.createAssignmentExpression( 
        ctx.createVarIdentifier(name), 
        ctx.createObjectExpression([
            ctx.createProperty(key, value)
        ])
    );
}


export default function(ctx,stack){
    let type = stack.right.type();
    if( !(type.isLiteralArrayType || type.isTupleType || type === Namespace.globals.get('array') || ctx.isArrayMappingType( Utils.getOriginType(type) ) ) ){
        let node = ctx.createNode(stack,'ForStatement');
        let isIterableIteratorType = Utils.isIterableIteratorType(type, Namespace.globals.get('Iterator'));
        let declDesc = stack.left.isVariableDeclaration ? stack.left.declarations[0] : null;
        let init = ctx.createToken(stack.left);
        let obj = ctx.genLocalRefName(stack,'_o');
        let res = ctx.genLocalRefName(stack,'_v');
        let object = ctx.createAssignmentExpression( 
            ctx.createVarIdentifier(obj), 
            isIterableIteratorType ? ctx.createToken(stack.right) : ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, 'System', 'getIterator'),
                [
                    ctx.createToken(stack.right)
                ]
            )
        );
        let rewind = ctx.createCallExpression(
            ctx.createMemberExpression([
                ctx.createVarIdentifier( obj),
                ctx.createIdentifier( 'rewind' )
            ])
        );
        let decl = init.declarations[0];
        init.declarations=[object, rewind];

        let isAddress = false;
        if( decl.type ==='AddressReferenceExpression' ){
            isAddress = true;
            decl = decl.argument;
        }

        let condition = createConditionNode(ctx, obj, res);
        let assignment = null;
        let forValue =  ctx.createMemberExpression([
            ctx.createVarIdentifier(res),
            ctx.createIdentifier('value')
        ]);

        let address = ctx.getAssignAddressRef(declDesc);
        if( address ){
            forValue = ctx.creaateAddressRefsNode( forValue );
            assignment = ctx.createExpressionStatement(
                createAddressRefsNode(address, ctx, declDesc, forValue, stack)
            );
        }else{
            if(isAddress){
                forValue = createAddressNode(ctx, forValue);
            }
            assignment = ctx.createExpressionStatement(
                ctx.createAssignmentExpression(
                    ctx.createVarIdentifier( decl.id.value ),
                    forValue,
                )
            );
        }

        node.init = init;
        node.condition = condition;
        node.update = null;
        node.body  = ctx.createToken(stack.body);
        if( stack.body.isBlockStatement ){
            node.body.body.splice(0,0,assignment);
        }else{
            const block = ctx.createNode('BlockStatement');
            block.body=[
                assignment,
                node.body
            ];
            node.body = block;
        }
        return node;
    }
    let node = ctx.createNode(stack);
    node.left  = ctx.createToken(stack.left);
    node.right = ctx.createToken(stack.right);
    node.body  = ctx.createToken(stack.body);
    return node;
}