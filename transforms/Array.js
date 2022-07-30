
const ObjectMethod = require("./Object");

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

const methods = {

    isArray(ctx, args){
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('is_array'),
            args
        );
    },

    from(ctx, args){
        ctx.addDepend('System');
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode('System'),
                ctx.createIdentifierNode('toArray'),
            ]),
            args
        );
    },

    of(ctx, args, module){
        ctx.addDepend('Array');
        return ctx.createCalleeNode(
            ctx.createIdentifierNode( ctx.builder.getModuleNamespace( module, 'es_array_new') ),
            args
        );
    },

    push(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('array_push', ctx, object, desc, args, called);
    },

    unshift(ctx, object, desc, args, module,  called=true){
        return createCommonCalledNode('array_unshift', ctx, object, desc, args, called);
    },

    pop(ctx, object, desc, args, module,  called=true){
        return createCommonCalledNode('array_pop', ctx, object, desc, args, called);
    },

    shift(ctx, object, desc, args, module,  called=true){
        return createCommonCalledNode('array_shift', ctx, object, desc, args, called);
    },

    splice(ctx, object, desc, args, module,  called=true){
        if( args.length > 3 ){
            args = args.slice(0,2).concat( ctx.createArrayNode( args.slice(2) ) );
        }
        return createCommonCalledNode('array_splice', ctx, object, desc, args, called);
    },

    slice(ctx, object, desc, args, module,  called=true){
        return createCommonCalledNode('array_slice', ctx, object, desc, args, called);
    },

    map(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_map');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    find(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_find');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    findIndex(ctx, object, desc, args,  module, called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_find_index');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    filter(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_filter');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    indexOf(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_find_index');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    lastIndexOf(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_search_last_index');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    copyWithin(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_copy_within');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    concat(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_concat');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    every(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_every');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    some(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_some');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    forEach(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_foreach');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    flat(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_flat');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    flatMap(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_flat_map');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    reduce(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_flat_reduce');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    reduceRight(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_flat_reduce_right');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    fill(ctx, object, desc, args, module,  called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_fill');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    sort(ctx, object, desc, args,  module, called=true){
        ctx.addDepend("Array");
        const name = ctx.builder.getModuleNamespace( module, 'es_array_sort');
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    join(ctx, object, desc, args,  module, called=true){
        if(!called)return ctx.createChunkNode(`function($target,$delimiter){return implode($delimiter,$target);}`)
        const obj = createObjectNodeRefs(ctx, object, desc );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('implode'),
            args.concat(obj)
        );
    },

    entries(ctx, object, desc, args,  module, called=true){
        if(!called)return createMethodFunctionNode(ctx,'array_values');
        const obj = createObjectNodeRefs(ctx, object, desc );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_values'),
            [obj]
        );
    },

    values(ctx, object, desc, args,  module, called=true){
        if(!called)return createMethodFunctionNode(ctx,'array_values');
        const obj = createObjectNodeRefs(ctx, object, desc );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_values'),
            [obj]
        );
    },

    keys(ctx, object, desc, args,  module,  called=true){
        if(!called)return createMethodFunctionNode(ctx,'array_keys');
        const obj = createObjectNodeRefs(ctx, object, desc );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_keys'),
            [obj]
        );
    },

    reverse(ctx, object, desc, args,  module, called=true){
        if(!called)return createMethodFunctionNode(ctx,'array_reverse');
        const obj = createObjectNodeRefs(ctx, object, desc );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('array_reverse'),
            args.concat(obj)
        );
    },

    includes(ctx, object, desc, args,  module, called=true){
        if(!called)return createMethodFunctionNode(ctx,'in_array');
        const obj = createObjectNodeRefs(ctx, object, desc );
        return ctx.createCalleeNode(
            ctx.createIdentifierNode('in_array'),
            args.concat(obj)
        );
    },

    length(ctx, object, desc, args,  module, called=true){
        const obj = createObjectNodeRefs(ctx, object, desc );
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