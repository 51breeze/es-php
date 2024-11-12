
function createMethodFunctionNode(ctx, name){
    return ctx.createLiteralNode(name);
}

function createCommonCalledNode(name,ctx, object, args, called){
    if(!called)return createMethodFunctionNode(ctx,name);
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        object ? [object].concat(args) : args
    );
}

module.exports={
    
    assign(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_assign');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCalleeNode(
            ctx.createIdentifierNode(name),
            args
        );
    },

    keys(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_keys');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCalleeNode(
            ctx.createIdentifierNode(name),
            args
        );
    },

    values(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_values');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCalleeNode(
            ctx.createIdentifierNode(name),
            args
        );
    },
   
    propertyIsEnumerable(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_property_is_enumerable');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    hasOwnProperty(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_has_own_property');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    valueOf(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_value_of');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    toLocaleString(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_to_string');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    toString(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Object')
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_to_string');
        return createCommonCalledNode(name, ctx, object, args, called);
    }

}