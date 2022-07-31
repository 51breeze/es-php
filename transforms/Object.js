
function createMethodFunctionNode(ctx, name){
    return ctx.createLiteralNode(name);
}

function createObjectNodeRefs(ctx, object, desc){
    if( object.type ==="Identifier"){
        return ctx.createArrayAddressRefsNode(desc, object.value);
    }else if( object.type === "ArrayExpression" ){
        const refs = ctx.checkRefsName('_AR', false, null, (name)=>{
            return object;
        });
        return ctx.createIdentifierNode(refs,null,true);
    }
    return object;
}

function createCommonCalledNode(name,ctx, object, desc, args, called=true){
    if(!called)return createMethodFunctionNode(ctx,name);
    const obj = createObjectNodeRefs(ctx, object, desc );
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        [obj].concat(args)
    );
}

module.exports={
    
    assign(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_assign');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCalleeNode(
            ctx.createIdentifierNode(name),
            args
        );
    },

    keys(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_keys');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCalleeNode(
            ctx.createIdentifierNode(name),
            args
        );
    },

    values(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_values');
        if(!called)return createMethodFunctionNode(ctx,name);
        return ctx.createCalleeNode(
            ctx.createIdentifierNode(name),
            args
        );
    },
   
    propertyIsEnumerable(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_property_is_enumerable');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    hasOwnProperty(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_has_own_property');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    valueOf(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_value_of');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    toLocaleString(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_to_string');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    toString(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Object') );
        const name = ctx.builder.getModuleNamespace( module, 'es_object_to_string');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    }

}