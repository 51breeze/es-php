const ObjectMethod = require("./Object");
function createCommonCalledNode(name,ctx, object, args, called=true){
    if(!called){
        return ctx.createLiteralNode( name.replace(/\\/g,'\\\\') );
    }
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        [object].concat(args)
    );
}

const methods = {

    MAX_VALUE(ctx){
        return ctx.createLiteralNode(`1.79E+308`,`1.79E+308`);
    },
    MIN_VALUE(ctx){
        return ctx.createLiteralNode(`5e-324`,`5e-324`);
    },
    MAX_SAFE_INTEGER(ctx){
        return ctx.createLiteralNode(`9007199254740991`,`9007199254740991`);
    },
    POSITIVE_INFINITY(ctx){
        return ctx.createIdentifierNode(`Infinity`);
    },
    EPSILON(ctx){
        return ctx.createLiteralNode(`2.220446049250313e-16`,`2.220446049250313e-16`);
    },

    isFinite(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_finite', ctx, object, args, called);
    },

    isNaN(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_nan', ctx, object, args, called);
    },

    isInteger(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_int', ctx, object, args, called);
    },

    isSafeInteger(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_int', ctx, object, args, called);
    },
    parseFloat(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('floatval', ctx, object, args, called);
    },
    parseInt(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('intval', ctx, object, args, called);
    },

    toFixed(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Number');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_number_to_fixed')
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    toExponential(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Number');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_number_to_exponential')
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    toPrecision(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Number');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_number_to_precision')
        return createCommonCalledNode(name, ctx, object, args, called);
    },

    valueOf(ctx, object, args, called=false, isStatic=false){
        const module = ctx.builder.getGlobalModuleById('Number');
        ctx.addDepend( module );
        const name = ctx.builder.getModuleNamespace( module, 'es_number_value_of')
        return createCommonCalledNode(name, ctx, object, args, called);
    },
};


['propertyIsEnumerable','hasOwnProperty','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports=methods;