const fs = require("fs");
const path = require("path");

const push = (content, name, object, args, indent, refs, result)=>{
    switch( name ){
        case "push" :
        case "unshift" :
        case "pop" :
        case "shift" :
        case "splice" :
            if( content ){
                if( result ){
                    content.push(`${indent}${result} = array_${name}(${[object].concat(args).join(",")});`);
                    if( refs ){
                        content.push(`${indent}${refs} = ${object};`);
                    }
                    content.push(`${indent}return ${result};`);
                }else{
                    content.push(`${indent}return array_${name}(${[object].concat(args).join(",")});`); 
                }
            }else{
                return `array_${name}(${[object].concat(args).join(",")})`;
            }
        break;
    }
    return content;
}

const createMethod = (target,desc,object,args,name)=>{
    const assignAddress = target.getAssignAddressRef(desc);
    if( assignAddress && target.hasCrossScopeAssignment( desc.assignItems ) ){
        const origin = desc.isVariableDeclarator ? target.make( desc.id ) : desc.isAssignmentPattern ? target.make( desc.left ) : target.make( desc );
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
            let itemIndex = 0;
            desc.assignItems.forEach( (item)=>{
                const desc = item.description();
                if( assignAddress.hasName(desc) ){
                    const refs = '$'+assignAddress.getName(desc);
                    uses.push( refs );
                    content.push(`${indent}\t\tcase ${itemIndex++} :`);
                    push(content, name, refs, push_args_name ? [push_args_name] : [], `${indent}\t\t\t`, origin, result);
                }
            });

            content.push(`${indent}\t\tdefault:`);
            push(content, name, origin, push_args_name ? [push_args_name] : [], `${indent}\t\t\t`);
            
            const push_method = [
                `function(${push_args_name})use(&${uses.join(',&')}){`,
                `${indent}\tif(${assert}===null)${assert}=${itemIndex};`,
                `${indent}\tswitch(${assert}){`, 
                content.join("\r\n"), 
                `${indent}\t}`,
                `${indent}};`
            ].join("\r\n");
            target.insertExpression(`${indent}${push_method_name} = ${push_method}`);
            dataset[ origin+name ] = push_method_name;
        }
        return `${push_method_name}(${args.join(",")})`;
    }
    return push(null, name, object, args);
}


module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Array.php") ),
    export:"ArrayMethod",
    require:['System'],
    isClass:false,
    namespace:"es.core",
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        if( isStatic ){
            switch( name ){
                case "isArray" :
                    return `is_array(${args.join(",")})`;
                case "from" :
                    target.addDepend("System");
                    return `System::toArray(${args.join(",")})`;
                case "of" :
                    target.addDepend("Array");
                    return `${this.getName('es_array_new')}(${args.join(",")})`;
            }
            return null;
        }

        const object = target.createArrayRefs(desc, target.make(thisObject) );
        const getObject=()=>{
            if( thisObject.isArrayExpression ){
                const refs = '$'+target.generatorVarName(target.stack, '_AR');
                target.insertExpression(target.semicolon(`${refs} = ${object}`));
                return refs;
            }
            return object;
        }

        const getMethodName=(name)=>{
            return `'${name}'`;
        };

        switch( name ){
            case "push" :
                if( getter )return getMethodName(`array_push`);
                return `array_push(${getObject()},${args.join(',')})`
            case "unshift" :
                if( getter )return getMethodName(`array_unshift`);
                return `array_unshift(${getObject()},${args.join(',')})`
            case "pop" :
                if( getter )return getMethodName(`array_pop`);
                return `array_pop(${getObject()},${args.join(',')})`
            case "shift" :
                if( getter )return getMethodName(`array_shift`);
                return `array_shift(${getObject()},${args.join(',')})`
            case "splice" :
                if( getter )return getMethodName(`array_splice`);
                if( args.length > 3 ){
                    args = args.slice(0,2).concat(`[${args.slice(2).join(',')}]`);
                }
                return `array_splice(${getObject()},${args.join(',')})`
            case "slice" :
                if( getter )return getMethodName(`array_slice`);
                return `array_slice(${[object].concat(args).join(",")})`;
            case "map" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_map'));
                return `${this.getName('es_array_map')}(${[object].concat(args).join(",")})`;
            case "find" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_find'));
                return `${this.getName('es_array_find')}(${[object].concat(args).join(",")})`;
            case "findIndex" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_find_index'));
                return `${this.getName('es_array_find_index')}(${[object].concat(args).join(",")})`;
            case "filter" :
                target.addDepend( "Array" );
                if( getter )return getMethodName(this.getName('es_array_filter'));
                return `${this.getName('es_array_filter')}(${[object].concat(args).join(",")})`;
            case "indexOf" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_search_index'));
                return `${this.getName('es_array_search_index')}(${[object].concat(args).join(",")})`;
            case "includes" :
                if( getter )return getMethodName(`in_array`);
                return `in_array(${args[0]},${object})`;
            case "length" :
                return `count(${object})`;
            case "concat" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_concat'));
                return `${this.getName('es_array_concat')}(${[object].concat(args).join(',')})`;
            case "entries" :
                if( getter )return getMethodName(`array_values`);
                return `array_values(${[object]})`;
            case "every" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_every'));
                return `${this.getName('es_array_every')}(${[object].concat(args).join(",")})`;
            case "some" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_some'));
                return `${this.getName('es_array_some')}(${[object].concat(args).join(",")})`;
            case "fill" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_fill'));
                return `${this.getName('es_array_fill')}(${[object].concat(args).join(",")})`;
            case "values" :
                if( getter )return getMethodName(`array_values`);
                return `array_values(${object})`;
            case "forEach" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_foreach'));
                return `${this.getName('es_array_foreach')}(${[object].concat(args).join(",")})`;
            case "flat" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_flat'));
                return `${this.getName('es_array_flat')}(${[object].concat(args).join(",")})`;
            case "flatMap" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_flat_map'));
                return `${this.getName('es_array_flat_map')}(${[object].concat(args).join(",")})`;
            case "reduce" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_reduce'));
                return `${this.getName('es_array_reduce')}(${[object].concat(args).join(",")})`;
            case "reduceRight" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_reduce_right'));
                return `${this.getName('es_array_reduce_right')}(${[object].concat(args).join(",")})`;
            case "join" :
                if( getter )return `function($obj,$val){return implode($val,$obj);}`;
                return `implode(${args[0]}, ${object})`;
            case "sort" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_sort'));
                return `${this.getName('es_array_sort')}(${[getObject()].concat(args).join(",")})`;
            case "keys" :
                if( getter )return getMethodName(`array_keys`);
                return `array_keys(${object})`;
            case "reverse" :
                if( getter )return getMethodName(`array_reverse`);
                return `array_reverse(${object})`;
            case "lastIndexOf" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_search_last_index'));
                return `${this.getName('es_array_search_last_index')}(${object})`;
            case "toLocaleString" :
            case "toString" :
                if( getter )return `function($obj){return implode(', ',$obj);}`;
                return `implode(', ',${object})`;
            case "valueOf" :
                if( getter )return object;
                return `${object}`;
            case "copyWithin" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_copy_within'));
                return `${this.getName('es_array_copy_within')}(${[object].concat(args).join(",")})`;
            case "hasOwnProperty" :
                if( getter )return getMethodName(`array_key_exists`);
                return `array_key_exists(${args.concat(object).join(",")})`;
            case "propertyIsEnumerable" :
                if( getter )return getMethodName(`array_key_exists`);
                return `array_key_exists(${args.concat(object).join(",")})`;
        }
    }
}