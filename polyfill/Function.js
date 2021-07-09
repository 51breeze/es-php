module.exports={
    content:null,
    export:false,
    require:['Reflect','System'],
    namespace:"es.core",
    method(target, name, args, isStatic){
        let object = target.make(target.stack.callee.object);
        if( isStatic ){
            switch( name ){
                case "name" :
                    return `''`;
            }
        }
        switch( name ){
            case "apply" :
                return `Reflect::apply(${[object].concat(args).join(",")})`;
            case "call" :
                return `Reflect::call(${[object].concat(args).join(",")})`;
            case "bind" :
                return `System::bind(${[object].concat(args).join(",")})`;
            case "toString" :
                return `''`;
        }
    }
}