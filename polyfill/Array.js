const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Array.php") ),
    export:"ArrayList",
    require:[],
    namespace:"es.core",
    method(target, name, args, isStatic){
        let object = target.make(target.stack.callee.object);
        if( isStatic ){
            switch( name ){
                case "isArray" :
                    return `is_array(${args.join(",")})`;
                case "from" :
                    return `array_slice(${args.join(",")},0)`;
                case "of" :
                    return `es_array_new(${args.join(",")})`;
            }
            return null;
        }
        if( target.stack.callee.object.isArrayExpression ){
            const refs = '$'+target.generatorVarName(target.stack, '_array');
            target.insertExpression(target.stack, target.semicolon(`${refs} = ${object}`));
            object = refs;
        }
        switch( name ){
            case "push" :
                return `array_push(${[object].concat(args).join(",")})`;
            case "unshift" :
                return `array_unshift(${[object].concat(args).join(",")})`;
            case "pop" :
                return `array_pop(${object})`;
            case "shift" :
                return `array_shift(${object})`;
            case "slice" :
                return `array_slice(${[object].concat(args).join(",")})`;
            case "splice" :
                return `array_splice(${[object].concat(args).join(",")})`;
            case "map" :
                return `es_array_map(${[object].concat(args).join(",")})`;
            case "find" :
                return `es_array_find(${[object].concat(args).join(",")})`;
            case "findIndex" :
                return `es_array_find_index(${[object].concat(args).join(",")})`;
            case "filter" :
                return `es_array_filter(${[object].concat(args).join(",")})`;
            case "indexOf" :
                return `es_array_search_index(${[object].concat(args).join(",")})`;
            case "includes" :
                return `in_array(${args[0]},${object})`;
            case "length" :
                return `count(${object})`;
            case "concat" :
                return `es_array_concat(${[object].concat(args).join(',')})`;
            case "entries" :
                return `array_values(${[object]})`;
            case "every" :
                return `es_array_every(${[object].concat(args).join(",")})`;
            case "some" :
                return `es_array_some(${[object].concat(args).join(",")})`;
            case "fill" :
                return `es_array_fill(${[object].concat(args).join(",")})`;
            case "values" :
                return `array_values(${object})`;
            case "forEach" :
                return `es_array_foreach(${[object].concat(args).join(",")})`;
            case "flat" :
                return `es_array_flat(${[object].concat(args).join(",")})`;
            case "flatMap" :
                return `es_array_flat_map(${[object].concat(args).join(",")})`;
            case "reduce" :
                return `es_array_reduce(${[object].concat(args).join(",")})`;
            case "reduceRight" :
                return `es_array_reduce_right(${[object].concat(args).join(",")})`;
            case "join" :
                return `implode(${args[0]}, ${object})`;
            case "sort" :
                return `es_array_sort(${[object].concat(args).join(",")})`;
            case "keys" :
                return `array_keys(${object})`;
            case "reverse" :
                return `array_reverse(${object})`;
            case "lastIndexOf" :
                return `es_array_search_last_index(${object})`;
            case "toLocaleString" :
            case "toString" :
                return `implode(', ',${object})`;
            case "valueOf" :
                return `json_encode(${object}, true)`;
            case "copyWithin" :
                return `es_array_copy_within(${[object].concat(args).join(",")})`;
            case "hasOwnProperty" :
                return `array_key_exists(${[object].concat(args).join(",")})`;
            case "propertyIsEnumerable" :
                return `array_key_exists(${[object].concat(args).join(",")})`;
        }
    }
}