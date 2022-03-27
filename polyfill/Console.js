module.exports={
    content: null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    usePolyfill:false,
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        const throwError=()=>{
            if( getter ){
                target.error('Console static method can only called.');
            } 
        }
        switch( name ){
            case "log" :
                throwError();
                target.addDepend("System");
                return `System::print(${args.join(",")})`;
        }
    }
}