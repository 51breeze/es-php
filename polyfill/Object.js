module.exports={
    content:null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    method(target, thisObject, name, args, isStatic){
        let object = target.make(thisObject);
        if( isStatic ){
            switch( name ){
                case "assign" :
                    return `array_merge(${args.map(item=>`(array)${item}`).join(",")})`;
                case "keys" :
                    return `array_keys(${args.map(item=>`(array)${item}`).join(",")})`;
                case "values" :
                    return `array_values(${args.map(item=>`(array)${item}`).join(",")})`;
            }
        }
        switch( name ){
            case "propertyIsEnumerable" :
                return `property_exists(${[object].concat(args).join(",")})`;
            case "hasOwnProperty" :
                return `property_exists(${[object].concat(args).join(",")})`;
            case "valueOf" :
                return `${object}`;
            case "toLocaleString" :
            case "toString" :
                return `sprintf('[object %s]', get_class(${object})`;
        }
    }
}