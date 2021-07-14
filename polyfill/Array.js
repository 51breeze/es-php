const fs = require("fs");
const path = require("path");

const push = (content, name, object, args, indent, refs, result)=>{
   
    switch( name ){
        case "push" :
            if( result ){
                content.push(`${indent}${result} = array_push(${[object].concat(args).join(",")});`);
            }else{
                content.push(`${indent}array_push(${[object].concat(args).join(",")});`);
            }
            refs && content.push(`${indent}${refs} = ${object};`);
        break;
    }
}

const isExpressionStatement=(target)=>{
    const parent = target.stack.getParentStack( stack=>{
        return  !!(stack.isExpressionStatement || 
                    stack.isArrayExpression   || 
                    stack.isObjectExpression  || 
                    stack.isCallExpression    || 
                    stack.isBlockStatement);
    });
    return parent && parent.isExpressionStatement;
}

const createMethod = (target,desc,object,args,name)=>{
    const addressCrossRefs = target.getAssignAddressCrossRefs(desc);
    const content = [];
    const ref = desc.isVariableDeclarator && target.hasRefAddressVariables( desc ) ? target.make( desc.id ) : null;
    const indent = target.getIndent();
    const result = !isExpressionStatement(target) ? '$'+target.generatorVarName(target.stack,"_RV",true) : null;
    if( addressCrossRefs && ref ){
        addressCrossRefs.forEach( (item)=>{
            const address = target.getGeneratorVarName( item.description() ,"_RD");
            const refs = address ? `\$${address}` : target.make( item );
            content.push(`${indent}\tcase ${refs} :`)
            push(content, name, refs, args, `${indent}\t\t`, ref, result);
            content.push(`${indent}\tbreak;`)
        });
        target.insertExpression(target.stack, [`${indent}switch(${ref}){`, content.join("\r\n"), `${indent}}` ].join("\r\n") );
        return result || true;
    }
    push(content, name, object, args, indent, ref, result);
    target.insertExpression(target.stack, content.join("\r\n") );
    return result || true;
}


module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Array.php") ),
    export:"ArrayMethod",
    require:[],
    namespace:"es.core",
    method(target, name, args, desc, isStatic){
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

        const addressRef = target.getAssignAddressRef(desc);
        let refsName = addressRef ? target.getGeneratorVarName( addressRef.description() ,"_RD") : null;
        refsName = refsName ? '$'+refsName : null;
        let object = refsName || target.make(addressRef || target.stack.callee.object);
        if( target.stack.callee.object.isArrayExpression ){
            const refs = '$'+target.generatorVarName(target.stack, '_AR');
            target.insertExpression(target.stack, target.semicolon(`${refs} = ${object}`));
            object = refs;
        }

        switch( name ){
            case "push" :
                return createMethod(target,desc,object,args,name);
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