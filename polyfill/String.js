const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/String.php") ),
    export:"String",
    require:[],
    namespace:"es.core",
    method(target, name, args){
        let object = target.make(target.stack.callee.object);
        switch( name ){
            case "charAt" :
                return `mb_substr(${object},${args[0]},1)`;
            case "charCodeAt" :
                return `mb_ord(mb_substr(${object},${args[0]},1),'UTF-8')`;
            case "concat" :
                return `(${[object].concat(args).join(" . ")})`;
            case "includes" :
                return `strpos(${[object].concat(args).join(",")}) !== false`;
            case "indexOf" :
                return `es_string_indexOf(${[object].concat(args).join(",")})`;
            case "localeCompare" :
                return `strcmp(${[object].concat(args).join(",")})`;
            case "match" :
                target.addDepend( target.stack.getModuleById('RegExp') );
                return `(new RegExp(${args[0]}))->match(${object})`;
            case "matchAll" :
                target.addDepend( target.stack.getModuleById('RegExp') );
                return `(new RegExp(${args[0]}))->matchAll(${object})`;
            case "replace" :
                target.addDepend( target.stack.getModuleById('RegExp') );
                return `(new RegExp(${args[0]}))->replace(${object},${args[1]})`;
            case "replaceAll" :
                target.addDepend( target.stack.getModuleById('RegExp') );
                return `(new RegExp(${args[0]}))->replaceAll(${object},${args[1]})`;
            case "search" :
                target.addDepend( target.stack.getModuleById('RegExp') );
                return `(new RegExp(${args[0]}))->search(${object})`;
            case "slice" :
                return `mb_substr(${[object].concat(args).join(",")})`;
            case "repeat" :
                return `str_repeat(${[object].concat(args).join(",")})`;
            case "length" :
                return `mb_strlen(${object})`;
            case "substr" :
                return `mb_substr(${[object].concat(args).join(",")})`;
            case "substring" :
                return `es_string_substring(${[object].concat(args).join(",")})`;
            case "toLowerCase" :
            case "toLocaleLowerCase" :
                return `mb_strtolower(${object})`;
            case "toUpperCase" :
            case "toLocaleUpperCase" :
                return `mb_strtoupper(${object})`;
            case "trim" :
                return `trim(${object})`;
            case "trimEnd" :
                return `rtrim(${object})`;
            case "trimStart" :
                return `ltrim(${object})`;
            case "valueOf" :
                return `${object}`;
            case "toString" :
                return `${object}`;
            case "split" :
                return `explode(${args[0]},${object})`;
            case "padStart" :
                return `str_pad(${[object].concat(args).join(",")}, STR_PAD_LEFT)`;
            case "padEnd" :
                return `str_pad(${[object].concat(args).join(",")}, STR_PAD_RIGHT)`;
            case "normalize" :
                return `es_array_normalize(${[object].concat(args).join(",")})`;
        }
    }
}