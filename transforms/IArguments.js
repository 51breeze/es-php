const ObjectMethod = require("./Object");
const methods = {

    length(ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeNode( ctx.createIdentifierNode('func_num_args') );
    },

    $computed(ctx, object, args, called=false, isStatic=false){
        return ctx.createCalleeNode( ctx.createIdentifierNode('func_get_arg'), args );
    },
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports=methods;