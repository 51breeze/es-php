const FunctionExpression = require("./FunctionExpression");
module.exports = function(ctx,stack,type){
    const node = FunctionExpression(ctx,stack,type);
    if( type ==='FunctionDeclaration' ){
        node.type = 'FunctionExpression';
        let _node = node.createStatementNode(
            node.createAssignmentNode( 
                node.createIdentifierNode(stack.key.value(), stack.key, true),
                node
            )
        );
        _node.isFunctionDeclaration = true
        _node.key = stack.key.value();
        return _node
    }
    if( stack.isConstructor ){
        node.key = node.createIdentifierNode('__construct', stack.key);
    }else if(stack.key){
        node.key = node.createIdentifierNode(stack.key.value(), stack.key);
    }
    return node;
};