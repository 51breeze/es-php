const MethodDefinition = require("./MethodDefinition");
module.exports = module.exports = function(ctx,stack,type){
    const alias = stack.getAnnotationAlias()
    const node = MethodDefinition(ctx,stack,type);
    node.isAccessor = true;
    node.kind = 'set';
    node.key.value = ctx.getAccessorName(alias || node.key.value, stack, 'set');
    return node;
 };