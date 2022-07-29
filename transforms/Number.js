const ObjectMethod = require("./Object");
function createCommonCalledNode(name,ctx, object, desc, args, called=true){
    if(!called){
        return ctx.createChunkNode(`function(...$args){return ${name}(...$args);}`)
    }
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        args
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
        return ctx.createLiteralNode(`-9007199254740991`,`-9007199254740991`);
    },
    POSITIVE_INFINITY(ctx){
        return ctx.createIdentifierNode(`Infinity`);
    },
    EPSILON(ctx){
        return ctx.createLiteralNode(`2.220446049250313e-16`,`2.220446049250313e-16`);
    },

    isFinite(ctx, object, desc, args, module, called=true){
        if(!called){
            return ctx.createChunkNode(`function($value){return $value === Infinity;}`)
        }
        const node = ctx.createNode('LogicalExpression');
        node.operator = '===';
        node.left = args[0];
        node.right = node.createIdentifierNode(`Infinity`);
        return node;
    },

    isNaN(ctx, object, desc, args, module, called=true){
        if(!called){
            return ctx.createChunkNode(`function($value){return $value === NaN;}`)
        }
        const node = ctx.createNode('LogicalExpression');
        node.operator = '===';
        node.left = args[0];
        node.right = node.createIdentifierNode(`NaN`);
        return node;
    },

    isInteger(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('isInteger', ctx, object, desc, args, called);
    },

    isSafeInteger(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('is_int', ctx, object, desc, args, called);
    },
    parseFloat(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('floatval', ctx, object, desc, args, called);
    },
    parseInt(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('intval', ctx, object, desc, args, called);
    },

    toFixed(ctx, object, desc, args, module, called=true){
        ctx.addDepend("Number");
        const name = ctx.builder.getModuleNamespace( module, 'es_number_to_fixed')
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    toExponential(ctx, object, desc, args, module, called=true){
        ctx.addDepend("Number");
        const name = ctx.builder.getModuleNamespace( module, 'es_number_to_exponential')
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    toPrecision(ctx, object, desc, args, module, called=true){
        ctx.addDepend("Number");
        const name = ctx.builder.getModuleNamespace( module, 'es_number_to_precision')
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },

    valueOf(ctx, object, desc, args, module, called=true){
        ctx.addDepend("Number");
        const name = ctx.builder.getModuleNamespace( module, 'es_number_value_of')
        return createCommonCalledNode(name, ctx, object, desc, args, called);
    },
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !methods.hasOwnProperty(name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports=methods;