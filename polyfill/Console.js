module.exports={
    content: null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    method(target, thisObject, name, args){
        switch( name ){
            case "log" :
                target.addDepend("System");
                return `System::print(${args.join(",")})`;
        }
    }
}