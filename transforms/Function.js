const ObjectMethod = require("./Object");


function createCallNode(ctx, target, args){
    ctx.addDepend( ctx.builder.getGlobalModuleById('Reflect') );
    return ctx.createCalleeNode(
        ctx.createStaticMemberNode([
            ctx.createIdentifierNode('Reflect'),
            ctx.createIdentifierNode('apply')
        ]),
        [target].concat(args)
    );
}


const methods = {

    apply(ctx, object, args, called=false, isStatic=false){
        const callee = object.type==="MemberExpression" ? object.object : object;
        if( !called ){
            return callee;
        }
        const _arguments =  [args[0]];
        if( args.length >1 ){
            _arguments.push(ctx.createArrayNode( args.slice(1) ) );
        } 
        return createCallNode(ctx, callee, _arguments);
    },

    call(ctx, object, args, called=false, isStatic=false){
        const callee = object.type==="MemberExpression" ? object.object : object;
        if( !called ){
            return callee;
        }
        const _arguments =  [args[0]];
        if( args.length >1 ){
            _arguments.push(ctx.createArrayNode( args.slice(1) ) );
        } 
        return createCallNode(ctx, callee, _arguments);
    },

    bind(ctx, object, args, called=false, isStatic=false){
        args = args.slice();
        ctx.addDepend( ctx.builder.getGlobalModuleById('System') );
        if(!called){
            return ctx.createArrayNode([
                ctx.createClassRefsNode( ctx.builder.getGlobalModuleById('System') ),
                ctx.createLiteralNode('bind')
            ]);  
        }
        const arguments = ctx.stack.arguments || [];
        let flagNode = ctx.createLiteralNode(null);
        if( arguments[0] ){
            const type = ctx.inferType(arguments[0]);
            if( type.isLiteralArrayType || ctx.builder.getGlobalModuleById('Array') === ctx.stack.compiler.callUtils('getOriginType', type) ){
                flagNode = ctx.createLiteralNode(true);
            }else if( !type.isAnyType ){
                flagNode = ctx.createLiteralNode(false);
            }
        }
        args.splice(1, 0, flagNode );
        if( object.type === 'MemberExpression'){
            object = ctx.createArrayNode([object.object, object.createLiteralNode(object.property.value )]);
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