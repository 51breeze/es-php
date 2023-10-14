const MethodDefinition = require("./MethodDefinition");
module.exports = module.exports = function(ctx,stack,type){
    const node = MethodDefinition(ctx,stack,type);
    node.isAccessor = true;
    node.kind = 'get'; 
    node.key.value = ctx.getAccessorName(node.key.value, stack, 'get');
    return node;
 };