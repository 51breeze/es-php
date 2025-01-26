
import ObjectMethod from './Object';
import { createStaticReferenceNode } from '../core/Common';
import Namespace from 'easescript/lib/core/Namespace';
const refsMethods = ['array_push','array_unshift','array_pop','array_shift','array_splice'];
function createMethodFunctionNode(ctx, name){
    return ctx.createLiteral(name);
}

function createObjectNodeRefs(ctx, object, name){
    // if( object.type ==="Identifier" && object.stack ){
    //     return ctx.createArrayAddressRefsNode(object.stack.description(), object.value);
    // }else if( object.type === "ArrayExpression" ){
    //     if( refsMethods.includes(name) ){
    //         const refs = ctx.checkRefsName('_AR', false, Token.SCOPE_REFS_DOWN | Token.SCOPE_REFS_UP_FUN, null, (name)=>{
    //             return object;
    //         });
    //         if( refs instanceof Token )return refs;
    //         return ctx.createIdentifier(refs,null,true);
    //     }
    // }
    return object;
}

function createCommonCalledNode(name, stack, ctx, object, args, called=true, checkRefs=false){
    if(!called)return createMethodFunctionNode(ctx,name);

    if(checkRefs && object && object.type==='ArrayExpression'){
        const refs = ctx.genLocalRefName(stack, 'ref');
        ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression( ctx.createVarIdentifier(refs), object )
        );
        object = ctx.createVarIdentifier(refs);
    }

    const obj = createObjectNodeRefs(ctx, object, name );
    return ctx.createCallExpression(
        ctx.createIdentifier(name),
        [obj].concat(args).filter( v=>!!v )
    );
}

const methods = {

    isArray(stack, ctx, object, args, called=false, isStatic=false){
        return ctx.createCallExpression(
            ctx.createIdentifier('is_array'),
            args
        );
    },

    from(stack, ctx, object, args, called=false, isStatic=false){
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'toArray'),
            args
        );
    },

    of(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array')
        ctx.addDepend( module );
        return ctx.createCallExpression(
            ctx.createIdentifier(ctx.getModuleNamespace( module, 'es_array_new')),
            args
        );
    },

    push(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_push', stack, ctx, object, args, called, true);
    },

    unshift(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_unshift',stack, ctx, object, args, called, true);
    },

    pop(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_pop',stack, ctx, object, args, called, true);
    },

    shift(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_shift',stack, ctx, object, args, called);
    },

    splice(stack, ctx, object, args, called=false, isStatic=false){
        if( args.length > 3 ){
            args = args.slice(0,2).concat( ctx.createArrayExpression( args.slice(2) ) );
        }
        return createCommonCalledNode('array_splice',stack, ctx, object, args, called, true);
    },

    slice(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_slice',stack, ctx, object, args, called);
    },

    map(stack, ctx, object, args, called=false, isStatic=false){
         const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_map');
        return createCommonCalledNode(name, stack, ctx, object, args, called);
    },

    find(stack, ctx, object, args, called=false, isStatic=false){
         const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_find');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    findIndex(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_find_index');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    filter(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_filter');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    indexOf(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_find_index');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    lastIndexOf(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_search_last_index');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    copyWithin(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_copy_within');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    concat(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_concat');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    every(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_every');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    some(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_some');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    forEach(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_foreach');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    flat(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_flat');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    flatMap(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_flat_map');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    reduce(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_reduce');
        return createCommonCalledNode(name,stack, ctx, object, args, called);
    },

    reduceRight(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_reduce_right');
        return createCommonCalledNode(name, stack, ctx, object, args, called);
    },

    fill(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_fill');
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    sort(stack, ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Array');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_array_sort');
        return createCommonCalledNode(name,stack, ctx, object, args, called, true);
    },

    join(stack, ctx, object, args, called=false, isStatic=false){
        if(!called)return ctx.createChunkExpression(`function($target,$delimiter){return implode($delimiter,$target);}`)
        object = createObjectNodeRefs(ctx, object, 'implode' );
        return ctx.createCallExpression(
            ctx.createIdentifier('implode'),
            args.concat( object )
        );
    },

    entries(stack, ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_values');
        object = createObjectNodeRefs(ctx, object, 'array_values' );
        return ctx.createCallExpression(
            ctx.createIdentifier('array_values'),
            [object]
        );
    },

    values(stack, ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_values');
        object = createObjectNodeRefs(ctx, object, 'array_values' );
        return ctx.createCallExpression(
            ctx.createIdentifier('array_values'),
            [object]
        );
    },

    keys(stack, ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_keys');
        object = createObjectNodeRefs(ctx, object, 'array_keys' );
        return ctx.createCallExpression(
            ctx.createIdentifier('array_keys'),
            [object]
        );
    },

    reverse(stack, ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_reverse');
        object = createObjectNodeRefs(ctx, object, 'array_reverse' );
        return ctx.createCallExpression(
            ctx.createIdentifier('array_reverse'),
            args.concat(object)
        );
    },

    includes(stack, ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'in_array');
        object = createObjectNodeRefs(ctx, object, 'in_array' );
        return ctx.createCallExpression(
            ctx.createIdentifier('in_array'),
            args.concat(object)
        );
    },

    length(stack, ctx, object, args, called=false, isStatic=false){
        const obj = createObjectNodeRefs(ctx, object, 'count');
        return ctx.createCallExpression(
            ctx.createIdentifier('count'),
            [obj]
        );
    }
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

export default methods;