function createCommonCalledNode(name,stack, ctx, object, args, called, params){
    if(!called){
        return createCalleeFunctionNode(ctx, params || ['value'], name)
    }
    let len = 1;
    if(params && Array.isArray(params)){
        len = params[0]==='...' ? args.length : params.length;
    }
    return ctx.createCallExpression(
        ctx.createIdentifier(name),
        args.slice(0, len)
    );
}

function createCalleeFunctionNode(ctx, args, callName){
    const cratePparams = ()=>args.map(name=>{
        if(name==='...'){
           const node = ctx.createNode('RestElement');
           node.value = 'args';
           node.raw   = 'args';
           return node;
        }
        return ctx.createVarIdentifier(name)
    });
    return ctx.createFunctionExpression(
        ctx.createReturnStatement( 
            ctx.createCallExpression(
                ctx.createIdentifier(callName), 
                cratePparams()
            ) 
        ),
        cratePparams()
    );
}

export default{
   
    E(stack, ctx){
        return ctx.createLiteral(2.718281828459045);
    },
    LN10(stack, ctx){
        return ctx.createLiteral(2.302585092994046);
    },
    LN2(stack, ctx){
        return ctx.createLiteral(0.6931471805599453);
    },
    LOG2E(stack, ctx){
        return ctx.createLiteral(1.4426950408889634);
    },
    LOG10E(stack, ctx){
        return ctx.createLiteral(0.4342944819032518);
    },
    PI(stack, ctx){
        return ctx.createLiteral(3.141592653589793);
    },
    SQRT1_2(stack, ctx){
        return ctx.createLiteral(0.7071067811865476);
    },
    SQRT2(stack, ctx){
        return ctx.createLiteral(1.4142135623730951);
    },

    abs(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('abs', stack,ctx, object, args, called);
    },

    acos(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('acos', stack,ctx, object, args, called);
    },
    asin(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('asin', stack,ctx, object, args, called);
    },
    atan2(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('atan2', stack,ctx, object, args, called, ['a','b']);
    },
    ceil(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('ceil',stack, ctx, object, args, called);
    },
    cos(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('cos', stack,ctx, object, args, called);
    },
    log(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('log', stack,ctx, object, args, called);
    },
    max(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('max', stack,ctx, object, args, called, ['...']);
    },
    min(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('min',stack, ctx, object, args, called, ['...']);
    },
    pow(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('pow', stack,ctx, object, args, called, ['a','b']);
    },
    sin(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('sin',stack, ctx, object, args, called);
    },
    sqrt(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('sqrt', stack,ctx, object, args, called);
    },
    tan(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('tan', stack,ctx, object, args, called);
    },
    round(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('round',stack, ctx, object, args, called);
    },
    floor(stack, ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('floor',stack, ctx, object, args, called);
    },
    random(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkExpression(`function(){return mt_rand(1,2147483647) / 2147483647;}`)
        }
        return ctx.createChunkExpression(`(mt_rand(1,2147483647) / 2147483647)`)
    }
}