const fs = require("fs");
const path = require("path");

const push = (content, name, object, args, indent, refs, result)=>{
    switch( name ){
        case "push" :
        case "unshift" :
        case "pop" :
        case "shift" :
        case "splice" :
            if( result && content ){
                content.push(`${indent}${result} = array_${name}(${[object].concat(args).join(",")});`);
                if( refs ){
                    content.push(`${indent}${refs} = ${object};`);
                }
                content.push(`${indent}return ${result};`);
            }else{
                return `array_${name}(${[object].concat(args).join(",")})`;
            }
        break;
    }
    return content;
}

const createMethod = (target,desc,object,args,name)=>{
    const assignAddress = target.getAssignAddressRef(desc);
    if( assignAddress && assignAddress.hasCross() && desc.isVariableDeclarator ){
        const origin = target.make( desc.id );
        const dataset = target.createDataByStack(desc);
        let push_method_name = dataset[ origin+name ];
        if( !push_method_name ){
            const content = [];
            const indent = target.getIndent();
            const assert =  '$'+target.generatorVarName(desc,"_ARV");
            const uses = [origin,assert];
            const result = '$'+target.generatorVarName(target.stack,"_RV",true);
            let push_args_name = '...$'+target.generatorVarName(desc,`_args`,true);
            if( name ==="pop" || name ==="shift"){
                push_args_name = ''
            }
            push_method_name = origin+target.generatorVarName(desc,`_${name}`,true);
            const defaultContent = [];

            assignAddress.dataset.forEach( (index,item)=>{
                const desc = item.description();
                const refs = '$'+target.generatorVarName(desc,"_RD");
                uses.push( refs );
                if( index == 0){
                    defaultContent.push(`${indent}\t\tdefault :`);
                    push(defaultContent, name, refs, push_args_name ? [push_args_name] : [], `${indent}\t\t\t`, origin, result);
                }else{
                    content.push(`${indent}\t\tcase ${index} :`);
                    push(content, name, refs, push_args_name ? [push_args_name] : [], `${indent}\t\t\t`, origin, result);
                }
            });
            
            const push_method = [
                `function(${push_args_name})use(&${uses.join(',&')}){`,
                `${indent}\tswitch(${assert}){`, 
                content.concat(defaultContent).join("\r\n"), 
                `${indent}\t}`,
                `${indent}};`
            ].join("\r\n");
            target.insertExpression(target.stack, `${indent}${push_method_name} = ${push_method}`);
            dataset[ origin+name ] = push_method_name;
        }
        return `${push_method_name}(${args.join(",")})`;
    }
    return push(null, name, object, args);
}


module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Array.php") ),
    export:"ArrayMethod",
    require:[],
    namespace:"es.core",
    method(target, thisObject, name, args, desc, isStatic){
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

        let object =  target.make(thisObject);
        if( thisObject.isArrayExpression ){
            const refs = '$'+target.generatorVarName(target.stack, '_AR');
            target.insertExpression(target.stack, target.semicolon(`${refs} = ${object}`));
            object = refs;
        }

        switch( name ){
            case "push" :
                return createMethod(target,desc,object,args,name);
            case "unshift" :
                return createMethod(target,desc,object,args,name);
            case "pop" :
                return createMethod(target,desc,object,args,name);
            case "shift" :
                return createMethod(target,desc,object,args,name);
            case "splice" :
                return createMethod(target,desc,object,args,name);
            case "slice" :
                return `array_slice(${[object].concat(args).join(",")})`;
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
                return `${object}`;
            case "copyWithin" :
                return `es_array_copy_within(${[object].concat(args).join(",")})`;
            case "hasOwnProperty" :
                return `array_key_exists(${[object].concat(args).join(",")})`;
            case "propertyIsEnumerable" :
                return `array_key_exists(${[object].concat(args).join(",")})`;
        }
    }
}