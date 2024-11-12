
const ObjectMethod = require("./Object");

function createMethodFunctionNode(ctx, name){
    return ctx.createLiteralNode(name);
}

function createCommonCalledNode(name, ctx, object, args, called){
    if(!called)return createMethodFunctionNode(ctx,name);
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        object ? [object].concat(args) : args
    );
}

const methods={
    fromCodePoint(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_from_code_point');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    raw(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_raw');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    fromCharCode(ctx, object, args, called=false, isStatic=false){
        if(!called){
            const module = ctx.builder.getGlobalModuleById('String');
            ctx.addDepend( module );
            return ctx.createChunkNode(`function(...$code){return es_string_from_char_code(...$code);}`)
        }
        if( args.length ===1 ){
            return createCommonCalledNode('chr', ctx, null, args, true);
        }
        const module = ctx.builder.getGlobalModuleById('String');
        const name = ctx.builder.getModuleNamespace( module, 'es_string_from_char_code');
        ctx.addDepend( module );
        return createCommonCalledNode(name, ctx, null, args, true);
    },


   
    charAt(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_char_at');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    charCodeAt(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_char_code_at');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    concat(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_concat');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    includes(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_includes');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    indexOf(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_index_of');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    lastIndexOf(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_last_index_of');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    localeCompare(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_locale_compare');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    match(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_match');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    matchAll(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_match_all');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    search(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_search');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    replace(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_replace');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    replaceAll(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_replace_all');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    slice(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_slice');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    repeat(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('str_repeat', ctx, object, args, called);
    },
    length(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strlen', ctx, object, args, true);
    },
    substr(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_substr', ctx, object, args, called);
    },
    substring(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_substring');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    toLowerCase(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtolower', ctx, object, args, called);
    },
    toLocaleLowerCase(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtolower', ctx, object, args, called);
    },
    toUpperCase(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtoupper', ctx, object, args, called);
    },
    toLocaleUpperCase(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtoupper', ctx, object, args, called);
    },
    trim(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('trim', ctx, object, args, called);
    },
    trimEnd(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('rtrim', ctx, object, args, called);
    },
    trimStart(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('ltrim', ctx, object, args, called);
    },
    split(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function($target,$delimit){return explode($delimit,$target);}`)
        }
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('explode'),
            [args[0], object]
        );
    },

    padStart(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('str_pad', ctx, object, [args[0], ctx.createIdentifierNode('STR_PAD_LEFT')], called);
    },

    padEnd(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('str_pad', ctx, object, [args[0], ctx.createIdentifierNode('STR_PAD_RIGHT')], called);
    },

    normalize(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_normalize');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    valueOf(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function($target){return $target;}`)
        }
        return createCommonCalledNode('strval', ctx, object, [], called);
    },
    startsWith(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_starts_with');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    endsWith(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('String');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_string_ends_with');
        return createCommonCalledNode(name, ctx, object, args, called);
    }
    
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports = methods;