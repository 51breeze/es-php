function createCommonCalledNode(name,ctx, object, args, called, params){
    if(!called){
        return createCalleeFunctionNode(ctx, params || ['value'], name)
    }
    let len = 1;
    if(params && Array.isArray(params)){
        len = params[0]==='...' ? args.length : params.length;
    }
    return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
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
        return ctx.createIdentifierNode(name,null,true)
    });
    return ctx.createFunctionNode((ctx)=>{
        ctx.body.push( 
            ctx.createReturnNode( 
                ctx.createCalleeNode(
                    ctx.createIdentifierNode(callName), 
                    cratePparams()
                ) 
            ) 
        )
    },cratePparams());
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

    abs(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('abs', ctx, object, args, called);
    },

    acos(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('acos', ctx, object, args, called);
    },
    asin(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('asin', ctx, object, args, called);
    },
    atan2(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('atan2', ctx, object, args, called, ['a','b']);
    },
    ceil(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('ceil', ctx, object, args, called);
    },
    cos(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('cos', ctx, object, args, called);
    },
    log(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('log', ctx, object, args, called);
    },
    max(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('max', ctx, object, args, called, ['...']);
    },
    min(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('min', ctx, object, args, called, ['...']);
    },
    pow(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('pow', ctx, object, args, called, ['a','b']);
    },
    sin(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('sin', ctx, object, args, called);
    },
    sqrt(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('sqrt', ctx, object, args, called);
    },
    tan(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('tan', ctx, object, args, called);
    },
    round(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('round', ctx, object, args, called);
    },
    floor(ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('floor', ctx, object, args, called);
    },
    random(ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createChunkNode(`function(){return mt_rand(1,2147483647) / 2147483647;}`)
        }
        return ctx.createChunkNode(`(mt_rand(1,2147483647) / 2147483647)`)
    }
}