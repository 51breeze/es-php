module.exports={
    content:null,
    export:false,
    require:[],
    namespace:"es.core",
    isClass:false,
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        let object = target.make(thisObject);
        if( isStatic ){
            switch( name ){
                case "name" :
                    return `''`;
            }
        }

        switch( name ){
            case "apply" :
            case "call" :
                if( getter ){
                    return object;
                }
                const firstArg = target.stack.arguments && target.stack.arguments[0];
                const targetType =firstArg && firstArg.type();
                if( targetType ){
                    const type = target.compiler.callUtils("getOriginType",targetType);
                    if(type && type.id ==="Array"){
                        switch( object ){
                            case "array_splice" :
                                if( args.length > 4 ){
                                    args = args.slice(0,3).concat(`[${args.slice(3).join(',')}]`);
                                }
                            break;
                        }
                        return `${object}(${args.join(",")})`;
                    }
                }
                target.addDepend( target.stack.getModuleById("Reflect") );
                return `Reflect::apply('${object}',${args[0]},[${args.slice(1).join(",")}])`;
            case "bind" :
                target.addDepend( target.stack.getModuleById("Reflect") );
                return `System::bind(${[object].concat(args).join(",")})`;
            case "toString" :
                return `''`;
        }
    }
    
}