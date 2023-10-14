const FunctionExpression = require("./FunctionExpression");
module.exports = function(ctx,stack,type){
    const node = FunctionExpression(ctx,stack,type);
    if( type ==='FunctionDeclaration' ){
        node.type = 'FunctionExpression';
        return node.createStatementNode(
            node.createAssignmentNode( 
                node.createIdentifierNode(stack.key.value(), stack.key, true),
                node
            )
        );
    }
    if( stack.isConstructor ){
        node.key = node.createIdentifierNode('__construct', stack.key);
    }else{
        node.key = node.createIdentifierNode(stack.key.value(), stack.key);
    }
    return node;
};