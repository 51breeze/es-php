module.exports={
    content: null,
    export:false,
    require:[],
    isClass:false,
    namespace:"es.core",
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        const object = target.make(thisObject);
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
                    target.addDepend("System");
                    return `System::isFinite(${object})`;
                case "isInteger" :
                    return `is_int(${object})`;
                case "isNaN" :
                    target.addDepend("System");
                    return `System::isNaN(${object})`;
                case "isSafeInteger" :
                    return `is_int(${object})`;
                case "parseFloat" :
                    return `floatval(${object})`;
                case "parseInt" :
                    return `intval(${object})`;
            }
            return null;
        }

        switch( name ){
            case "toFixed" :
                if( getter )return `function($number,$decimals=0){return floatval(number_format($number,$decimals,'.',''));}`
                return `floatval(number_format(${[object].concat(args,'.','').join(",")}))`
            case "toExponential" :
                if( getter )return `function($decimals=0){return sprintf('%'.$decimals.'e',${object});}`
                if( args.length > 0 ){
                    return `sprintf('%${args[0]}e',${object})`;
                }else{
                    return `sprintf('%e',${object})`;
                }
            case "toPrecision" :
                `function($decimals=null){
                    $value = ${object};
                    if( !($decimals > 1) )return strval($value);
                    if( $decimals * 10 < $value){
                        return sprintf('%'.($decimals-1).'e',$value);
                    }
                    return number_format($value,$decimals,'.','');
                }`;

                if( getter )return `function($decimals=1){return    is_numberic($decimals) ? number_format(${object},$decimals,'.','') : strval(${object});}`
                if( args.length > 0 ){
                    return `number_format(${object},${args[0]},'.','')`;
                }else{
                    return `strval(${object})`;
                }
            case "valueOf" :
                if( getter )return `function(){return ${object};}`;
                return `${object}`;
            case "toString" :
                if( getter )return `function(){return strval(${object});}`;
                return `strval(${object})`;
        }
    }
}