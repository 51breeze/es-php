const fs = require("fs");
const path = require("path");
module.exports={
    content: null,
    export:false,
    require:[],
    isClass:false,
    usePolyfill:false,
    namespace:"es.core",
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        const throwError=()=>{
            if( getter ){
                target.error('Array static method can only called.');
            } 
        }
        switch( name ){
            case "E" :
                return 2.718281828459045;
            case "LN10" :
                return 2.302585092994046;
            case "LN2" :
                return 0.6931471805599453;
            case "LOG2E" :
                return 1.4426950408889634;
            case "LOG10E" :
                return 0.4342944819032518;
            case "PI" :
                return 3.141592653589793;
            case "SQRT1_2" :
                return 0.7071067811865476;
            case "SQRT2" :
                return 1.4142135623730951;
            case "abs" :
            case "acos" :
            case "asin" :
            case "atan" :
            case "atan2" :
            case "ceil" :
            case "cos" :
            case "exp" :
            case "log" :
            case "max" :
            case "min" :
            case "pow" :
            case "sin" :
            case "sqrt" :
            case "tan" :
                throwError();
                return `${name}(${args.join(",")})`;
            case "random" :
                throwError();
                return `(mt_rand(1,2147483647) / 2147483647)`;
            case "round" :
                throwError();
                return `round(${args[0]})`;
            case "floor" :
                throwError();
                return `floor(${args[0]})`;
        }
    }
}