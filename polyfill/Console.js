module.exports={
    content: null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    method(target, thisObject, name, args){
        switch( name ){
            case "log" :
                const format = [];
                args = args.map( (item,index)=>{
                    const obj = target.stack.arguments[ index ];
                    const type = obj.type().toString().toLowerCase();
                    switch( type ){
                        case "string" :
                            format.push("%s");
                            return item;
                        case "number" :    
                        case "int" :    
                        case "uint" :  
                        case "inter" :  
                        case "bigint" :   
                        case "float" :   
                        case "double" : 
                            format.push("%f");
                            return item;
                        default :
                            format.push("%s");
                            return `json_encode(${item},JSON_UNESCAPED_UNICODE)`;  
                    }
                });
                return `printf("\\r\\n${format.join(" ")}",${args.join(",")})`;
        }
    }
}