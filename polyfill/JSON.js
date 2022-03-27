module.exports={
    content:null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    usePolyfill:false,
    method(target, thisObject, name, args, isStatic){
        if( isStatic ){
            switch( name ){
                case "parse" :
                    return `json_decode(${args[0]})`;
                case "stringify" :
                    return `json_encode(${args[0]},JSON_UNESCAPED_UNICODE)`;
            }
        }
    }
}