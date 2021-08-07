module.exports={
    content:null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    method(target, thisObject, name, args, isStatic){
        if( isStatic ){
            switch( name ){
                case "assign" :
                    target.addDepend("System");
                    let targetObject = args.shift();
                    const first = target.stack.arguments && target.stack.arguments[0];
                    if( first){
                        if( first.isArrayExpression || first.isObjectExpression || first.isLiteral ){
                            const refs = '$'+target.generatorVarName(target.stack, '_AR');
                            target.insertExpression(target.semicolon(`${refs} = ${targetObject}`));
                            targetObject = refs; 
                        }
                    }
                    return `System::merge(${[targetObject].concat(args).join(",")})`;
                case "keys" :
                    return `array_keys(${args.map(item=>`(array)${item}`).join(",")})`;
                case "values" :
                    return `array_values(${args.map(item=>`(array)${item}`).join(",")})`;
            }
        }
        let object = target.make(thisObject);
        switch( name ){
            case "propertyIsEnumerable" :
                return `property_exists(${[object].concat(args).join(",")})`;
            case "hasOwnProperty" :
                return `property_exists(${[object].concat(args).join(",")})`;
            case "valueOf" :
                return `${object}`;
            case "toLocaleString" :
            case "toString" :
                return `sprintf('[object %s]', get_class(${object}))`;
        }
    }
}