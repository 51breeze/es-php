module.exports = function(ctx,stack){
    const node = ctx.createIdentifierNode('this',stack,true);
    return node;
}