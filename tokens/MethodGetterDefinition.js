const MethodDefinition = require("./MethodDefinition");
module.exports = function(ctx,stack,type){
    const alias = stack.getAnnotationAlias()
    const node = MethodDefinition(ctx,stack,type);
    node.isAccessor = true;
    node.kind = 'get'; 
    node.key.value = ctx.getAccessorName(alias || node.key.value, stack, 'get');
    return node;
 };