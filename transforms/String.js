
const ObjectMethod = require("./Object");

function createMethodFunctionNode(ctx, name){
    return ctx.createLiteralNode(name);
}

function createCommonCalledNode(name,ctx, object, desc, args, called=true){
    if(!called)return createMethodFunctionNode(ctx,name);
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        [object].concat(args)
    );
}

const methods={
   
    charAt(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_char_at');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    charCodeAt(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_char_code_at');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    concat(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_concat');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    includes(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_includes');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    indexOf(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_index_of');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    lastIndexOf(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_last_index_of');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    localeCompare(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_locale_compare');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    match(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_math');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    matchAll(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_math_all');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    search(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_search');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    replace(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_replace');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    replaceAll(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_replace_all');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    slice(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_slice');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    repeat(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('str_repeat', ctx, object, desc, args, called);
    },
    length(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('mb_strlen', ctx, object, desc, args, called);
    },
    substr(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('mb_substr', ctx, object, desc, args, called);
    },
    substring(ctx, object, desc, args, module, called=true){
        ctx.addDepend("String");
        const name = ctx.builder.getModuleNamespace( module, 'es_string_substring');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
    toLowerCase(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('mb_strtolower', ctx, object, desc, args, called);
    },
    toLocaleLowerCase(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('mb_strtolower', ctx, object, desc, args, called);
    },
    toUpperCase(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('mb_strtoupper', ctx, object, desc, args, called);
    },
    toLocaleUpperCase(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('mb_strtoupper', ctx, object, desc, args, called);
    },
    trim(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('trim', ctx, object, desc, args, called);
    },
    trimEnd(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('rtrim', ctx, object, desc, args, called);
    },
    trimStart(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('ltrim', ctx, object, desc, args, called);
    },
    split(ctx, object, desc, args, module, called=true){
        if(!called){
            return ctx.createChunkNode(`function($target,$delimit){return explode($delimit,$target);}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('explode'),
            [args[0], object]
        );
    },

    padStart(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('str_pad', ctx, object, desc, [args[0], ctx.createIdentifierNode('STR_PAD_LEFT')], called);
    },

    padEnd(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('str_pad', ctx, object, desc, [args[0], ctx.createIdentifierNode('STR_PAD_RIGHT')], called);
    },

    normalize(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('String') );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_normalize');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    }
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports = methods;