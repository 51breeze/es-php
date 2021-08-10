const fs = require("fs");
const path = require("path");
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
                    return `${object} === Infinity`;
                case "isInteger" :
                    return `is_int(${object})`;
                case "isNaN" :
                    return `${object} === NaN`;
                case "isSafeInteger" :
                    return `is_int(${object})`;
                case "parseFloat" :
                    return `floatval(${object})`;
                case "parseInt" :
                    return `intval(${object})`;
            }
            return null;
        }

        const getObject = ()=>{
            let use = '';
            if( thisObject.isCallExpression || thisObject.isMemberExpression ){
                const refs = '$'+target.generatorVarName(target.stack, '_AR');
                target.insertExpression(target.semicolon(`${refs} = ${object}`));
                object = refs;
                use = `use(${object})`;
            }else if( thisObject.isIdentifier ){
                use = `use(${object})`;
            }
            return {target:object,use};
        }

        switch( name ){
            case "toFixed" :
                if( getter ){
                    const {target,use} = getObject();
                    return `function($decimals=0)${use}{return floatval(number_format(${target},$decimals,'.',''));}`
                }
                return `floatval(number_format(${[object].concat(args,'.','').join(",")}))`
            case "toExponential" :
                if( getter ){
                    return `function($__bindThisObject__,$decimals=0,$f=null){return sprintf('%.'.$decimals.'e',$__bindThisObject__);}`
                }
                if( args.length > 0 ){
                    return `sprintf('%.${args[0]}e',${object})`;
                }else{
                    return `sprintf('%e',${object})`;
                }
            case "toPrecision" :
                target.addDepend("Number");
                if( getter ){
                    return this.getMethodName( this.getName(`es_number_to_precision`) );
                }
                if( args.length > 0 ){
                    return this.getName(`es_number_to_precision`)+`(${object},${args[0]})`;
                }else{
                    return `strval(${object})`;
                }
            case "valueOf" :
                if( getter ){
                    const {target,use} = getObject();
                    return `function()${use}{return ${target};}`;
                }
                return `${object}`;
            case "toString" :
                if( getter ){
                    const {target,use} = getObject();
                    return `function()${use}{return strval(${target});}`;
                }
                return `strval(${object})`;
        }
    }
}