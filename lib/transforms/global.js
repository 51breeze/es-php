import createDateNode from '../helper/date';
import {createStaticReferenceNode} from '../core/Common';
import Namespace from 'easescript/lib/core/Namespace';
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
        ctx.insertTokenToBlock( ctx.createUsingStatement( ctx.createIdentifier(source) ) );
    }
    return data[ source ];
}


export default{
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

    setInterval(stack, ctx, object, args, called=false, isStatic=false){
        ctx.callee = ctx.createIdentifier('call_user_func');
        ctx.arguments = args.slice(0,1)
        return ctx;
    },

    setTimeout(stack, ctx, object, args, called=false, isStatic=false){
        ctx.callee = ctx.createIdentifier('call_user_func');
        ctx.arguments = args.slice(0,1)
        return ctx;
    },

    clearTimeout(stack, ctx, object, args, called=false, isStatic=false){
        return null;
    },

    clearInterval(stack, ctx, object, args, called=false, isStatic=false){
       return null;
    },

    parseInt(stack, ctx, object, args, called=false, isStatic=false){
        if( called ){
            ctx.callee = ctx.createIdentifier('intval');
            ctx.arguments = args.slice(0,2);
            return ctx;
        }else{
            return null;
        }
    },

    parseFloat(stack, ctx, object, args, called=false, isStatic=false){
        if( called ){
            ctx.callee = ctx.createIdentifier('floatval');
            ctx.arguments = args.slice(0,1);
            return ctx;
        }else{
            return null;
        }
    },

    isNaN(stack, ctx, object, args, called=false, isStatic=false){
        ctx.addDepend(Namespace.globals.get('System'));
        if(!called){
            ctx.createChunkExpression(`function($target){return System::isNaN($target);}`)
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'isNaN'),
            args
        );
    },

    isFinite(stack, ctx, object, args, called=false, isStatic=false){
        if(!called){
            return ctx.createLiteral('is_finite')
        }
        ctx.callee = ctx.createIdentifier('is_finite');
        ctx.arguments = args.slice(0,1);
        return ctx;
    },

    renderToString(stack, ctx, object, args, called=false, isStatic=false){
        let vm = ctx.getVModule('web.ESX');
        ctx.addDepend(vm);
        let name = 'renderToString';
        let local = ctx.getGlobalRefName(stack, name);
        let ns = ctx.getModuleNamespace(vm, name);
        if(local !== name){
            ctx.addUsing(ns, local);
        }else{
            local = ns;
        }
        if(!called){
            return ctx.createLiteral(local)
        }
        return ctx.createCallExpression(
            ctx.createIdentifier(local),
            args
        );
    }
}