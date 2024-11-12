import FunctionExpression from './FunctionExpression';
export default function(ctx,stack,type){
    const node = FunctionExpression(ctx,stack,type);
    if( type ==='FunctionDeclaration' ){
        node.type = 'FunctionExpression';
        let _node = ctx.createExpressionStatement(
            ctx.createAssignmentExpression( 
                ctx.createVarIdentifier(stack.key.value(), stack.key),
                node
            )
        );
        _node.isFunctionDeclaration = true
        _node.key = stack.key.value();
        return _node
    }
    if( stack.isConstructor ){
        node.key = ctx.createIdentifier('__construct', stack.key);
    }else if(stack.key){
        node.key = ctx.createIdentifier(stack.key.value(), stack.key);
    }
    return node;
};