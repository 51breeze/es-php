import ObjectMethod from './Object';
const methods = {

    length(stack, ctx, object, args, called=false, isStatic=false){
        return ctx.createCallExpression( ctx.createIdentifier('func_num_args') );
    },

    $computed(stack, ctx, object, args, called=false, isStatic=false){
        return ctx.createCallExpression( ctx.createIdentifier('func_get_arg'), args );
    },
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

export default methods;