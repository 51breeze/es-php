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
    valueOf(stack,ctx, object, args, called=false, isStatic=false){
        return createCommonCalledNode('boolval', stack, ctx, object, args, called);
    },
};


['propertyIsEnumerable','hasOwnProperty','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

export default methods;