const fs = require("fs");
const path = require("path");
module.exports={
    content:fs.readFileSync( path.join(__dirname,"./files/Object.php") ),
    export:'Object',
    require:[],
    isClass:false,
    usePolyfill:false,
    namespace:"es.core",
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    getMethodName(name){
        return `'${name}'`;
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false,makedThisObject=null){
        let object = makedThisObject || target.make(thisObject);
        if( isStatic ){
            const throwError=()=>{
                if( getter ){
                    target.error('Object static method can only called.');
                } 
            }
            switch( name ){
                case "assign" :
                    target.addDepend("Object");
                    throwError();
                    return this.getName(`es_object_assign`)+`(${args.join(",")})`;
                case "keys" :
                    target.addDepend("Object");
                    throwError();
                    return this.getName(`es_object_keys`)+`(${args.join(",")})`;
                case "values" :
                    target.addDepend("Object");
                    throwError();
                    return this.getName(`es_object_values`)+`(${args.join(",")})`;
            }
            return null;
        }
        switch( name ){
            case "propertyIsEnumerable" :
                target.addDepend("Object");
                if( getter ){
                    return this.getMethodName( this.getName(`es_object_property_is_enumerable`) );
                }
                return this.getName(`es_object_property_is_enumerable`)+`(${[object].concat(args).join(",")})`;
            case "hasOwnProperty" :
                target.addDepend("Object");
                if( getter ){
                    return this.getMethodName( this.getName(`es_object_has_own_property`) );
                }
                return this.getName(`es_object_has_own_property`)+`(${[object].concat(args).join(",")})`;
            case "valueOf" :
                target.addDepend("Object");
                if( getter ){
                    return this.getMethodName( this.getName(`es_object_value_of`) );
                }
                return this.getName(`es_object_value_of`)+`(${[object].concat(args).join(",")})`;
            case "toLocaleString" :
            case "toString" :
                target.addDepend("Object");
                if( getter ){
                    return this.getMethodName( this.getName(`es_object_to_string`) );
                }
                return this.getName(`es_object_to_string`)+`(${[object].concat(args).join(",")})`;
        }
        return null;
    }
}