module.exports={
    content: null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    method(target, thisObject, name, args){
        switch( name ){
            case "log" :
                const format = Array(args.length).fill("%s",0, args.length).join(" ");
                return `printf('${format}',${args.map( item=>`json_encode(${item},true)`).join(",")})`;
        }
    }
}