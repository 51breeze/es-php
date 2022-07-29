const ObjectMethod = require("./Object");
const methods = {

    apply(ctx, object, desc, args, module, called=true){
        ctx.addDepend("Reflect");
        if(!called){
            return ctx.createChunkNode(`function($calleed, &$target, ...$args){return Reflect::apply($calleed, $target, $args);}`)
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
        ctx.addDepend("System");
        if(!called){
            return ctx.createChunkNode(`function($calleed, &$target, ...$args){return System::bind($calleed, $target, ...$args);}`)
        }
        return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
                ctx.createIdentifierNode('System'),
                ctx.createIdentifierNode('bind')
            ]),
            [object].concat( args )
        );
    }
    
}

['propertyIsEnumerable','hasOwnProperty','valueOf','toLocaleString','toString'].forEach( name=>{
    if( !methods.hasOwnProperty(name) ){
        methods[name] =  ObjectMethod[name];
    }
});

module.exports=methods;