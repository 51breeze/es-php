import {canUseNullCoalescingOperator} from '../core/Common';

function toRefs(ctx, node, stack){
    if(node.type==="CallExpression"){
        const name = ctx.genLocalRefName(stack, "ref");
        const refs = ctx.createVarIdentifier(name);
        ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression(
                refs,
                node
            )
        );
        return refs;
    }
    return node;
}


export default function(ctx,stack){
    const node = ctx.createNode(stack);
    if(stack.expression.isCallExpression || stack.expression.isNewExpression){
        let chain = toRefs(ctx,ctx.createToken(stack.expression.callee),stack);
        const test = ctx.createCallExpression(
            ctx.createIdentifier('isset'),
            [
                chain
            ],
            stack
        );
        node.expression = ctx.createConditionalExpression(test, ctx.createToken(stack.expression), ctx.createLiteral(null));
    }else{
        if(stack.expression.computed){
            let chain = toRefs(ctx,ctx.createToken(stack.expression.object),stack);
            const test = ctx.createCallExpression(
                ctx.createIdentifier('isset'),
                [
                    chain
                ],
                stack
            );
            node.expression = ctx.createConditionalExpression(test, ctx.createToken(stack.expression), ctx.createLiteral(null));
        }else{
            node.expression = ctx.createToken(stack.expression)
            if(node.expression.type!=="CallExpression" && canUseNullCoalescingOperator(stack)){
                node.expression = ctx.createBinaryExpression(node.expression, ctx.createLiteral(null),'??');
            }
        }
    }
    return node;
}