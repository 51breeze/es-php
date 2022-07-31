const ObjectMethod = require("./Object");
const methods = {

    apply(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('Reflect') );
        if(!called){
            return ctx.createArrayNode([
                ctx.createClassRefsNode( ctx.builder.getGlobalModuleById('Reflect') ),
                ctx.createLiteralNode('apply')
            ]);
        }
        const target = args.shift();
        const params = [object, target];
        if( args.length > 0 ){
            args =  ctx.createArrayNode( args );
            params.push( args );
        }
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode('Reflect'),
                ctx.createIdentifierNode('apply')
            ]),
            params
        );
    },

    call(ctx, object, desc, args, module, called=true){
        return this.apply(ctx, object, desc, args, module, called);
    },

    bind(ctx, object, desc, args, module, called=true){
        ctx.addDepend( ctx.builder.getGlobalModuleById('System') );
        if(!called){
            return ctx.createArrayNode([
                ctx.createClassRefsNode( ctx.builder.getGlobalModuleById('System') ),
                ctx.createLiteralNode('bind')
            ]);  
        }
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode('System'),
                ctx.createIdentifierNode('bind')
            ]),
            [object].concat( args )
        );
    }
    
};

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !Object.prototype.hasOwnProperty.call(methods,name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports=methods;