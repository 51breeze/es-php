const fs = require("fs");
const path = require("path");
const ObjectMethod = require("./Object");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/String.php") ),
    export:"String",
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
        switch( name ){
            case "charAt" :
                if( getter ){
                    target.addDepend("String");
                    return this.getMethodName( this.getName('es_string_char_at') );
                }
                return `mb_substr(${object},${args[0]},1)`;
            case "charCodeAt" :
                if( getter ){
                    target.addDepend("String");
                    return this.getMethodName( this.getName('es_string_char_code_at') );
                }
                return `mb_ord(mb_substr(${object},${args[0]},1),'UTF-8')`;
            case "concat" :
                if( getter ){
                    target.addDepend("String");
                    return this.getMethodName( this.getName('es_string_concat') );
                }
                return `(${[object].concat(args).join(" . ")})`;
            case "includes" :
                if( getter ){
                    target.addDepend("String");
                    return this.getMethodName( this.getName('es_string_includes') );
                }
                return `strpos(${[object].concat(args).join(",")}) !== false`;
            case "indexOf" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_index_of') );
                return `${this.getName('es_string_index_of')}(${[object].concat(args).join(",")})`;
            case "lastIndexOf" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_last_index_of') );
                return `${this.getName('es_string_last_index_of')}(${[object].concat(args).join(",")})`;
            case "localeCompare" :
                if( getter ){
                    target.addDepend("String");
                    return this.getMethodName( this.getName('es_string_locale_compare') );
                }
                return `strcmp(${[object].concat(args).join(",")})`;
            case "match" :
            case "matchAll" :
            case "search" :
                if( getter ){
                    target.addDepend("String");
                    const map = {"match":'es_string_math',"matchAll":'es_string_math_all','search':'es_string_search'};
                    return this.getMethodName( this.getName( map[name] ) );
                }
                target.addDepend("RegExp");
                if( target.stack.arguments[0].type().toString().toLowerCase()==="regexp" ){
                    return `${args[0]}->${name}(${object})`;
                }else{
                    return `(new RegExp(${args[0]}))->${name}(${object})`;
                }
            case "replace" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_replace') );
                return `${this.getName('es_string_replace')}(${[object].concat(args).join(",")})`;
            case "replaceAll" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_replace_all') );
                return `${this.getName('es_string_replace_all')}(${[object].concat(args).join(",")})`;
            case "slice" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_slice') );
                return `${this.getName('es_string_slice')}(${[object].concat(args).join(",")})`;
            case "repeat" :
                return `str_repeat(${[object].concat(args).join(",")})`;
            case "length" :
                return `mb_strlen(${object})`;
            case "substr" :
                return `mb_substr(${[object].concat(args).join(",")})`;
            case "substring" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_substring') );
                return `${this.getName('es_string_substring')}(${[object].concat(args).join(",")})`;
            case "toLowerCase" :
            case "toLocaleLowerCase" :
                if( getter )return this.getMethodName(`mb_strtolower`);
                return `mb_strtolower(${object})`;
            case "toUpperCase" :
            case "toLocaleUpperCase" :
                if( getter )return this.getMethodName(`mb_strtoupper`);
                return `mb_strtoupper(${object})`;
            case "trim" :
                if( getter )return this.getMethodName(`trim`);
                return `trim(${object})`;
            case "trimEnd" :
                if( getter )return this.getMethodName(`rtrim`);
                return `rtrim(${object})`;
            case "trimStart" :
                if( getter )return this.getMethodName(`ltrim`);
                return `ltrim(${object})`;
            case "split" :
                return `explode(${args[0]},${object})`;
            case "padStart" :
                return `str_pad(${[object].concat(args).join(",")}, STR_PAD_LEFT)`;
            case "padEnd" :
                return `str_pad(${[object].concat(args).join(",")}, STR_PAD_RIGHT)`;
            case "normalize" :
                target.addDepend("String");
                if( getter )return this.getMethodName( this.getName('es_string_normalize') );
                return `${this.getName('es_string_normalize')}(${[object].concat(args).join(",")})`;
            case "valueOf" :
            case "toString" :
                if( getter ){
                    return ObjectMethod.method(target, thisObject, name, args, desc, isStatic, getter, object);
                }
                return `${object}`;
            case "propertyIsEnumerable" :
            case "hasOwnProperty" :
                if( getter ){
                    return ObjectMethod.method(target, thisObject, name, args, desc, isStatic, getter, object);
                }
                return `isset(${object}[${args[0]}])`;
        }
    }
}