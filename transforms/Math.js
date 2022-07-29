function createCommonCalledNode(name,ctx, object, desc, args, called=true){
    if(!called){
        return ctx.createChunkNode(`function(...$args){return ${name}(...$args);}`)
    }
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        args
    );
}

module.exports={
   
    E(ctx){
        return ctx.createLiteralNode(2.718281828459045);
    },
    LN10(ctx){
        return ctx.createLiteralNode(2.302585092994046);
    },
    LN2(ctx){
        return ctx.createLiteralNode(0.6931471805599453);
    },
    LOG2E(ctx){
        return ctx.createLiteralNode(1.4426950408889634);
    },
    LOG10E(ctx){
        return ctx.createLiteralNode(0.4342944819032518);
    },
    PI(ctx){
        return ctx.createLiteralNode(3.141592653589793);
    },
    SQRT1_2(ctx){
        return ctx.createLiteralNode(0.7071067811865476);
    },
    SQRT2(ctx){
        return ctx.createLiteralNode(1.4142135623730951);
    },

    abs(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('abs', ctx, object, desc, args, called);
    },

    acos(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('acos', ctx, object, desc, args, called);
    },
    asin(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('asin', ctx, object, desc, args, called);
    },
    atan2(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('atan2', ctx, object, desc, args, called);
    },
    ceil(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('ceil', ctx, object, desc, args, called);
    },
    cos(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('cos', ctx, object, desc, args, called);
    },
    log(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('log', ctx, object, desc, args, called);
    },
    max(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('max', ctx, object, desc, args, called);
    },
    min(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('min', ctx, object, desc, args, called);
    },
    pow(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('pow', ctx, object, desc, args, called);
    },
    sin(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('sin', ctx, object, desc, args, called);
    },
    sqrt(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('sqrt', ctx, object, desc, args, called);
    },
    tan(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('tan', ctx, object, desc, args, called);
    },
    round(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('round', ctx, object, desc, args, called);
    },
    floor(ctx, object, desc, args, module, called=true){
        return createCommonCalledNode('floor', ctx, object, desc, args, called);
    },
    random(ctx, object, desc, args, module, called=true){
        if(!called){
            return ctx.createChunkNode(`function(){return mt_rand(1,2147483647) / 2147483647;}`)
        }
        return ctx.createChunkNode(`(mt_rand(1,2147483647) / 2147483647)`)
    }
}