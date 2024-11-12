import ObjectMethod from './Object';
import { createStaticReferenceNode } from '../core/Common';
import Namespace from 'easescript/lib/core/Namespace';
function createCommonCalledNode(name,stack,ctx, object, args, called=true){
    if(!called){
        return ctx.createLiteral( name.replace(/\\/g,'\\\\') );
    }
    return ctx.createCallExpression(
        ctx.createIdentifier(name),
        [object].concat(args)
    );
}

const methods = {

    MAX_VALUE(stack,ctx){
        return ctx.createLiteral(`1.79E+308`,`1.79E+308`);
    },
    MIN_VALUE(stack,ctx){
        return ctx.createLiteral(`5e-324`,`5e-324`);
    },
    MAX_SAFE_INTEGER(stack,ctx){
        return ctx.createLiteral(`9007199254740991`,`9007199254740991`);
    },
    POSITIVE_INFINITY(stack,ctx){
        return ctx.createIdentifier(`Infinity`);
    },
    EPSILON(stack,ctx){
        return ctx.createLiteral(`2.220446049250313e-16`,`2.220446049250313e-16`);
    },

    isFinite(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_finite',stack, ctx, object, args, called);
    },

    isNaN(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            ctx.addDepend(Namespace.globals.get('System'));
            ctx.createChunkExpression(`function($target){return System::isNaN($target);}`)
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, object.stack, 'System', 'isNaN'),
            [object].concat(args)
        );
    },

    isInteger(stack,ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_int',stack, ctx, object, args, called);
    },

    isSafeInteger(stack,ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('is_int',stack, ctx, object, args, called);
    },
    parseFloat(stack,ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('floatval',stack, ctx, object, args, called);
    },
    parseInt(stack,ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('intval',stack, ctx, object, args, called);
    },

    toFixed(stack,ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Number');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_number_to_fixed')
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    toExponential(stack,ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Number');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_number_to_exponential')
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    toPrecision(stack,ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Number');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace( module, 'es_number_to_precision')
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },

    valueOf(stack,ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('Number');
        ctx.addDepend( module );
        const name = ctx.getModuleNamespace(module, 'es_number_value_of')
        return createCommonCalledNode(name, stack,ctx, object, args, called);
    },
};


['propertyIsEnumerable','hasOwnProperty','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

export default methods;