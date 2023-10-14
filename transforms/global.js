const createDateNode = require('../helper/date');

const dateset = new Map();
function cache(module){
    if( !dateset.has(module) ){
        dateset.set(module,{});
    }
    return dateset.get(module);
}

function createImport(ctx, module, source, local, flag=false){
    const data = cache(module);
    if( !Object.prototype.hasOwnProperty.call(data, source) ){
        data[ source ] = local;
        ctx.insertNodeBlockContextTop( ctx.createUsingStatementNode( ctx.createIdentifierNode(source) ) );
    }
    return data[ source ];
}


module.exports={
    // date(ctx, object, args, called=false, isStatic=false){

    //     if( args[0] && args[0].type === 'Literal' && !/(?![\\])(DDDo|Mo|do|dd|wo|Wo)/.test( args[0].value ) ){
    //         return createDateNode(ctx, args);
    //     }else{
    //         const module = ctx.builder.getGlobalModuleById('System');
    //         ctx.addDepend( module );
    //         const dependencies = ctx.builder.plugin.options.dependencies || {};
    //         ctx.builder.addDependencyForComposer( dependencies['moment'] );
    //         ctx.callee = ctx.createStaticMemberNode([
    //             ctx.createIdentifierNode( ctx.getModuleReferenceName(module) ),
    //             ctx.createIdentifierNode('date')
    //         ]);
    //         ctx.arguments = args;
    //         return ctx;
    //     }
    // },

    setInterval(ctx, object, args, called=false, isStatic=false){
        ctx.callee = ctx.createIdentifierNode('call_user_func');
        ctx.arguments = args.slice(0,1)
        return ctx;
    },

    setTimeout(ctx, object, args, called=false, isStatic=false){
        ctx.callee = ctx.createIdentifierNode('call_user_func');
        ctx.arguments = args.slice(0,1)
        return ctx;
    },

    clearTimeout(ctx, object, args, called=false, isStatic=false){
        return null;
    },

    clearInterval(ctx, object, args, called=false, isStatic=false){
       return null;
    },

    parseInt(ctx, object, args, called=false, isStatic=false){
        if( called ){
            ctx.callee = ctx.createIdentifierNode('intval');
            ctx.arguments = args.slice(0,2);
            return ctx;
        }else{
            return null;
        }
    },

    parseFloat(ctx, object, args, called=false, isStatic=false){
        if( called ){
            ctx.callee = ctx.createIdentifierNode('floatval');
            ctx.arguments = args.slice(0,1);
            return ctx;
        }else{
            return null;
        }
    }
}