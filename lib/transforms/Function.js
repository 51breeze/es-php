import Namespace from 'easescript/lib/core/Namespace';
import Utils from 'easescript/lib/core/Utils';
import { createClassRefsNode, createStaticReferenceNode } from '../core/Common';
import ObjectMethod from './Object';

function createCallNode(stack, ctx, target, args){
    return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, 'Reflect', 'apply'),
        [target].concat(args)
    );
}


const methods = {

    apply(stack, ctx, object, args, called=false, isStatic=false){
        const callee = object.type==="MemberExpression" ? object.object : object;
        if( !called ){
            return callee;
        }
        const _arguments =  [args[0]];
        if( args.length >1 ){
            _arguments.push(ctx.createArrayExpression( args.slice(1) ) );
        } 
        return createCallNode(stack, ctx, callee, _arguments);
    },

    call(stack, ctx, object, args, called=false, isStatic=false){
        const callee = object.type==="MemberExpression" ? object.object : object;
        if( !called ){
            return callee;
        }
        const _arguments =  [args[0]];
        if( args.length >1 ){
            _arguments.push(ctx.createArrayExpression( args.slice(1) ) );
        } 
        return createCallNode(stack, ctx, callee, _arguments);
    },

    bind(stack, ctx, object, args, called=false, isStatic=false){
        args = args.slice();
        let System = Namespace.globals.get('System');
        ctx.addDepend(System);
        if(!called){
            return ctx.createArrayExpression([
                createClassRefsNode(ctx, System, stack),
                ctx.createLiteral('bind')
            ]);
        }
        const _arguments = stack.arguments || [];
        let flagNode = ctx.createLiteral(null);
        if( _arguments[0] ){
            const type = ctx.inferType(_arguments[0]);
            if( type.isLiteralArrayType || Namespace.globals.get('Array') === Utils.getOriginType(type) ){
                flagNode = ctx.createLiteral(true);
            }else if( !type.isAnyType ){
                flagNode = ctx.createLiteral(false);
            }
        }
        args.splice(1, 0, flagNode);
        if( object.type === 'MemberExpression'){
            object = ctx.createArrayExpression([
                object.object,
                object.createLiteral(object.property.value )
            ]);
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'bind'),
            [object].concat(args)
        );
    }
    
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

export default methods;