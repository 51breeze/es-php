import Namespace from "easescript/lib/core/Namespace";

function createMethodFunctionNode(ctx, name){
    return ctx.createLiteral(name);
}

function createCommonCalledNode(name, stack, ctx, object, args, called){
    if(!called)return createMethodFunctionNode(ctx,name);
    return ctx.createCallExpression(
        ctx.createIdentifier(name),
        object ? [object].concat(args) : args
    );
}

export default{
    
    assign(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace(module, 'es_object_assign');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCallExpression(
            ctx.createIdentifier(name),
            args
        );
    },

    keys(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_keys');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCallExpression(
            ctx.createIdentifier(name),
            args
        );
    },

    values(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_values');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCallExpression(
            ctx.createIdentifier(name),
            args
        );
    },
   
    propertyIsEnumerable(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_property_is_enumerable');
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    hasOwnProperty(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_has_own_property');
        return createCommonCalledNode(name, stack, ctx, object, args, called);
    },

    valueOf(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_value_of');
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    toLocaleString(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_to_string');
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    toString(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Object')
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_object_to_string');
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    }

}