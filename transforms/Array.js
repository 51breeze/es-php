
const ObjectMethod = require("./Object");
const Token = require("../core/Token");
const refsMethods = ['array_push','array_unshift','array_pop','array_shift','array_splice'];

function createMethodFunctionNode(ctx, name){
    return ctx.createLiteralNode(name);
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
    //         return ctx.createIdentifierNode(refs,null,true);
    //     }
    // }
    return object;
}

function createCommonCalledNode(name, ctx, object, args, called=true){
    if(!called)return createMethodFunctionNode(ctx,name);
    const obj = createObjectNodeRefs(ctx, object, name );
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        [obj].concat(args).filter( v=>!!v )
    );
}

const methods = {

    isArray(ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('is_array'),
            args
        );
    },

    from(ctx, object, args, called=false, isStatic=false){
        ctx.addDepend( ctx.builder.getGlobalModuleById('System') );
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode('System'),
                ctx.createIdentifierNode('toArray'),
            ]),
            args
        );
    },

    of(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array')
        ctx.addDepend( module );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode( ctx.builder.getModuleNamespace( module, 'es_array_new') ),
            args
        );
    },

    push(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_push', ctx, object, args, called);
    },

    unshift(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_unshift', ctx, object, args, called);
    },

    pop(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_pop', ctx, object, args, called);
    },

    shift(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_shift', ctx, object, args, called);
    },

    splice(ctx, object, args, called=false, isStatic=false){
        if( args.length > 3 ){
            args = args.slice(0,2).concat( ctx.createArrayNode( args.slice(2) ) );
        }
        return createCommonCalledNode('array_splice', ctx, object, args, called);
    },

    slice(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('array_slice', ctx, object, args, called);
    },

    map(ctx, object, args, called=false, isStatic=false){
         const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_map');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    find(ctx, object, args, called=false, isStatic=false){
         const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_find');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    findIndex(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_find_index');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    filter(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_filter');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    indexOf(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_find_index');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    lastIndexOf(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_search_last_index');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    copyWithin(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_copy_within');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    concat(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_concat');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    every(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_every');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    some(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_some');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    forEach(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_foreach');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    flat(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_flat');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    flatMap(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_flat_map');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    reduce(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_reduce');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    reduceRight(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_reduce_right');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    fill(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_fill');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    sort(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Array');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_array_sort');
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    join(ctx, object, args, called=false, isStatic=false){
        if(!called)return ctx.createChunkNode(`function($target,$delimiter){return implode($delimiter,$target);}`)
        object = createObjectNodeRefs(ctx, object, 'implode' );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('implode'),
            args.concat( object )
        );
    },

    entries(ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_values');
        object = createObjectNodeRefs(ctx, object, 'array_values' );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_values'),
            [object]
        );
    },

    values(ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_values');
        object = createObjectNodeRefs(ctx, object, 'array_values' );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_values'),
            [object]
        );
    },

    keys(ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_keys');
        object = createObjectNodeRefs(ctx, object, 'array_keys' );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_keys'),
            [object]
        );
    },

    reverse(ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'array_reverse');
        object = createObjectNodeRefs(ctx, object, 'array_reverse' );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_reverse'),
            args.concat(object)
        );
    },

    includes(ctx, object, args, called=false, isStatic=false){
        if(!called)return createMethodFunctionNode(ctx,'in_array');
        object = createObjectNodeRefs(ctx, object, 'in_array' );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('in_array'),
            args.concat(object)
        );
    },

    length(ctx, object, args, called=false, isStatic=false){
        const obj = createObjectNodeRefs(ctx, object, 'count');
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('count'),
            [obj]
        );
    }
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports=methods;