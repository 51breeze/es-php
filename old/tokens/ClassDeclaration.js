module.exports = function(ctx, stack, type){
    const ClassBuilder = ctx.plugin.getClassModuleBuilder();
    return ClassBuilder.createClassNode(stack,ctx,type);
};