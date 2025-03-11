import AddressVariable from "../core/AddressVariable";

export default function(ctx,stack){
    const node = ctx.createNode(stack);
    node.argument = ctx.createToken(stack.argument);
    if(node.argument && node.argument.type !== "Identifier"){
        let pp = stack.getParentStack(parent=>parent.isFunctionExpression);
        if(pp && pp.isFunctionExpression){
            const returnType = pp.getReturnedType();
            if(ctx.isAddressRefsType(returnType, pp)){
                let refs = ctx.getLocalRefName(stack, AddressVariable.REFS_ASSIGN);
                ctx.insertTokenToBlock(stack, ctx.createExpressionStatement(
                    ctx.createAssignmentExpression(
                        ctx.createVarIdentifier(refs),
                        node.argument
                    )
                ));
                node.argument = ctx.createVarIdentifier(refs);
            }
        }
    }
    return node;
}