module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    var index = 0;
    if( stack.label ){
        const label = stack.label.value();
        stack.getParentStack( stack=>{
            if(stack.isForOfStatement || stack.isForInStatement || stack.isForStatement || stack.isSwitchStatement || stack.isDoWhileStatement || stack.isWhileStatement){
                index++;
            }
            if( stack.isLabeledStatement && stack.label.value() === label ){
                return true;
            }
            return !!stack.isFunctionExpression;
        });
    }
    if( index > 0 ){
        node.label = node.createLiteralNode(index);
    }else if(stack.label){
        node.label = node.createIdentifierNode(stack.label.value(), stack.label);
    }
    return node;
}