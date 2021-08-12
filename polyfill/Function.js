module.exports={
    content:null,
    export:false,
    require:[],
    namespace:"es.core",
    isClass:false,
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    getMethodName(name){
        return `'${name}'`;
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        let object = target.make(thisObject);
        let targetObject = args.shift();
        const first = target.stack.arguments && target.stack.arguments[0];
        if( first){
            if( first.isArrayExpression || first.isObjectExpression ){
                const refs = '$'+target.generatorVarName(target.stack, '_AR');
                target.insertExpression(target.semicolon(`${refs} = ${targetObject}`));
                targetObject = refs;
            }
            if( first.isLiteral && name==="bind" ){
                target.error("Cannot bind a literal as an object", first);
            }
        }

        const intercept = ()=>{
            const firstArg = target.stack.arguments && target.stack.arguments[0];
            const targetType =firstArg && firstArg.type();
            if( targetType ){
                const type = target.compiler.callUtils("getOriginType",targetType);
                if(type && type.id ==="Array"){
                    object = object.replace(/[\'\"]/g,'');
                    switch( object ){
                        case "array_splice" :
                            if( args.length > 3 ){
                                args = args.slice(0,2).concat(`[${args.slice(2).join(',')}]`);
                            }
                        break;
                        case "in_array" :
                            return `${object}(${args.concat(targetObject).join(",")})`;
                    }
                    return `${object}(${[targetObject].concat(args).join(",")})`;
                }
            }
        };

        switch( name ){
            case "apply" :
            case "call" :
                if( getter )return object;
                const method = intercept();
                if( method )return method;
                target.addDepend("Reflect");
                if(args.length > 0){
                    return `Reflect::apply(${object},${targetObject},[${args.join(",")}])`;
                }else{
                    return `Reflect::apply(${object},${targetObject})`;
                }
            case "bind" :
                target.addDepend("Reflect");
                return `System::bind(${[object,targetObject].concat(args).join(",")})`;
            case "toLocaleString" :
            case "toString" :
                target.addDepend("Object");
                if( getter ){
                    return this.getMethodName( this.getName(`es_object_to_string`) );
                }
                return this.getName(`es_object_to_string`)+`(${object})`;
        }
    }
    
}