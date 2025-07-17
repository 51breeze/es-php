
import Namespace from 'easescript/lib/core/Namespace';
import ObjectMethod from './Object';

function createMethodFunctionNode(ctx, name){
    return ctx.createLiteral(name);
}

function createCommonCalledNode(name, ctx, object, args, called){
    if(!called)return createMethodFunctionNode(ctx,name);
    return ctx.createCallExpression(
        ctx.createIdentifier(name),
        object ? [object].concat(args) : args
    );
}

const methods={
    fromCodePoint(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_from_code_point');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    raw(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_raw');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    fromCharCode(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            const module = Namespace.globals.get('String');
            ctx.addDepend( module );
            return ctx.createChunkExpression(`function(...$code){return es_string_from_char_code(...$code);}`)
        }
        if( args.length ===1 ){
            return createCommonCalledNode('chr', ctx, null, args, true);
        }
        const module = Namespace.globals.get('String');
        const name = ctx.getModuleNamespace( module, 'es_string_from_char_code');
        ctx.addDepend( module );
        return createCommonCalledNode(name, ctx, null, args, true);
    },
    charAt(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_char_at');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    charCodeAt(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_char_code_at');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    concat(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_concat');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    includes(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_includes');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    indexOf(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_index_of');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    lastIndexOf(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_last_index_of');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    localeCompare(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_locale_compare');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    match(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_match');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    matchAll(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_match_all');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    search(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_search');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    replace(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_replace');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    replaceAll(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_replace_all');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    slice(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_slice');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    repeat(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('str_repeat', ctx, object, args, called);
    },
    length(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strlen', ctx, object, args, true);
    },
    substr(stack,ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_substr', ctx, object, args, called);
    },
    substring(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_substring');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    toLowerCase(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtolower', ctx, object, args, called);
    },
    toLocaleLowerCase(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtolower', ctx, object, args, called);
    },
    toUpperCase(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtoupper', ctx, object, args, called);
    },
    toLocaleUpperCase(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('mb_strtoupper', ctx, object, args, called);
    },
    trim(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('trim', ctx, object, args, called);
    },
    trimEnd(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('rtrim', ctx, object, args, called);
    },
    trimStart(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('ltrim', ctx, object, args, called);
    },
    split(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkExpression(`function($target,$delimit){return explode($delimit,$target);}`)
        }
        return ctx.createCallExpression(
            ctx.createIdentifier('explode'),
            [args[0], object]
        );
    },

    padStart(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('str_pad', ctx, object, [args[0], ctx.createIdentifier('STR_PAD_LEFT')], called);
    },

    padEnd(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('str_pad', ctx, object, [args[0], ctx.createIdentifier('STR_PAD_RIGHT')], called);
    },

    normalize(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_normalize');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    valueOf(stack, ctx, object, args, called=false, isStatic=false){
        if(called && stack.callee.isIdentifier && stack.isCallExpression &&  stack.callee.value() === 'String'){
            const module = Namespace.globals.get('System');
            ctx.addDepend( module );
            const name = ctx.getModuleReferenceName(module);
            return createCommonCalledNode(name+'::toString', ctx, object, [], called);
        }
        return createCommonCalledNode('strval', ctx, object, [], called);
    },
    startsWith(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_starts_with');
        return createCommonCalledNode(name, ctx, object, args, called);
    },
    endsWith(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('String');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_string_ends_with');
        return createCommonCalledNode(name, ctx, object, args, called);
    }
    
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

export default methods;