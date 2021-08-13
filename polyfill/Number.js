const fs = require("fs");
const path = require("path");
const ObjectMethod = require("./Object");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Number.php") ),
    export:'Number',
    require:[],
    isClass:false,
    namespace:"es.core",
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    getMethodName(name){
        return `'${name}'`;
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        let object = target.make(thisObject);
        if( isStatic ){
            const throwError=()=>{
                if( getter ){
                    target.error('Number static method can only called.');
                } 
            }
            switch( name ){
                case "MAX_VALUE" :
                    return `1.79E+308`;
                case "MIN_VALUE" :
                    return `5e-324`;
                case "MAX_SAFE_INTEGER" :
                    return `9007199254740991`;
                case "MIN_SAFE_INTEGER" :
                    return `-9007199254740991`;
                case "POSITIVE_INFINITY" :
                    return `Infinity`;
                case "EPSILON" :
                    return `2.220446049250313e-16`;
                case "isFinite" :
                    throwError();
                    return `${object} === Infinity`;
                case "isInteger" :
                    throwError();
                    return `is_int(${object})`;
                case "isNaN" :
                    throwError();
                    return `${object} === NaN`;
                case "isSafeInteger" :
                    throwError();
                    return `is_int(${object})`;
                case "parseFloat" :
                    throwError();
                    return `floatval(${object})`;
                case "parseInt" :
                    throwError();
                    return `intval(${object})`;
            }
            return null;
        }

        switch( name ){
            case "toFixed" :
                if( getter ){
                    target.addDepend("Number");
                    return this.getMethodName( this.getName(`es_number_to_fixed`) );
                }
                return `floatval(number_format(${[object].concat(args,"'.'","''").join(",")}))`
            case "toExponential" :
                if( getter ){
                    target.addDepend("Number");
                    return this.getMethodName( this.getName(`es_number_to_exponential`) );
                }
                if( args.length > 0 ){
                    return `sprintf('%.${args[0]}e',${object})`;
                }else{
                    return `sprintf('%e',${object})`;
                }
            case "toPrecision" :
                if( getter ){
                    target.addDepend("Number");
                    return this.getMethodName( this.getName(`es_number_to_precision`) );
                }
                if( args.length > 0 ){
                    return this.getName(`es_number_to_precision`)+`(${object},${args[0]})`;
                }else{
                    return `strval(${object})`;
                }
            case "valueOf" :
                if( getter ){
                    target.addDepend("Number");
                    return this.getMethodName( this.getName(`es_number_value_of`) );
                }
                return `intval(${object})`;
            case "toLocaleString" :
            case "toString" :
                if( getter ){
                    target.addDepend("Number");
                    return this.getMethodName( this.getName(`es_number_to_string`) );
                }
                return `strval(${object})`;
            default :
                return ObjectMethod.method(target, thisObject, name, args, desc, isStatic, getter, object );

        }
    }
}