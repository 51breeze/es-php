const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Array.php") ),
    export:"Array",
    require:['System'],
    isClass:false,
    namespace:"es.core",
    getName(name){
        return '\\'+this.namespace.split('.').concat( name ).join('\\');
    },
    getMethodName(name){
        return `'${name}'`;
    },
    method(target, thisObject, name, args, desc, isStatic, getter=false){
        if( isStatic ){
            const throwError=()=>{
                if( getter ){
                    target.error('Array static method can only called.');
                } 
            }
            switch( name ){
                case "isArray" :
                    throwError();
                    return `is_array(${args.join(",")})`;
                case "from" :
                    throwError();
                    target.addDepend("System");
                    return `System::toArray(${args.join(",")})`;
                case "of" :
                    throwError();
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

        switch( name ){
            case "push" :
                if( getter )return this.getMethodName(`array_push`);
                return `array_push(${getObject()},${args.join(',')})`
            case "unshift" :
                if( getter )return this.getMethodName(`array_unshift`);
                return `array_unshift(${getObject()},${args.join(',')})`
            case "pop" :
                if( getter )return this.getMethodName(`array_pop`);
                return `array_pop(${getObject()},${args.join(',')})`
            case "shift" :
                if( getter )return this.getMethodName(`array_shift`);
                return `array_shift(${getObject()},${args.join(',')})`
            case "splice" :
                if( getter )return this.getMethodName(`array_splice`);
                if( args.length > 3 ){
                    args = args.slice(0,2).concat(`[${args.slice(2).join(',')}]`);
                }
                return `array_splice(${getObject()},${args.join(',')})`
            case "slice" :
                if( getter )return this.getMethodName(`array_slice`);
                return `array_slice(${[object].concat(args).join(",")})`;
            case "map" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_map'));
                return `${this.getName('es_array_map')}(${[object].concat(args).join(",")})`;
            case "find" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_find'));
                return `${this.getName('es_array_find')}(${[object].concat(args).join(",")})`;
            case "findIndex" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_find_index'));
                return `${this.getName('es_array_find_index')}(${[object].concat(args).join(",")})`;
            case "filter" :
                target.addDepend( "Array" );
                if( getter )return this.getMethodName(this.getName('es_array_filter'));
                return `${this.getName('es_array_filter')}(${[object].concat(args).join(",")})`;
            case "indexOf" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_search_index'));
                return `${this.getName('es_array_search_index')}(${[object].concat(args).join(",")})`;
            case "includes" :
                if( getter )return this.getMethodName(`in_array`);
                return `in_array(${args[0]},${object})`;
            case "length" :
                return `count(${object})`;
            case "concat" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_concat'));
                return `${this.getName('es_array_concat')}(${[object].concat(args).join(',')})`;
            case "entries" :
                if( getter )return this.getMethodName(`array_values`);
                return `array_values(${[object]})`;
            case "every" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_every'));
                return `${this.getName('es_array_every')}(${[object].concat(args).join(",")})`;
            case "some" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_some'));
                return `${this.getName('es_array_some')}(${[object].concat(args).join(",")})`;
            case "fill" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_fill'));
                return `${this.getName('es_array_fill')}(${[object].concat(args).join(",")})`;
            case "values" :
                if( getter )return this.getMethodName(`array_values`);
                return `array_values(${object})`;
            case "forEach" :
                target.addDepend("Array");
                if( getter )return getMethodName(this.getName('es_array_foreach'));
                return `${this.getName('es_array_foreach')}(${[object].concat(args).join(",")})`;
            case "flat" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_flat'));
                return `${this.getName('es_array_flat')}(${[object].concat(args).join(",")})`;
            case "flatMap" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_flat_map'));
                return `${this.getName('es_array_flat_map')}(${[object].concat(args).join(",")})`;
            case "reduce" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_reduce'));
                return `${this.getName('es_array_reduce')}(${[object].concat(args).join(",")})`;
            case "reduceRight" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_reduce_right'));
                return `${this.getName('es_array_reduce_right')}(${[object].concat(args).join(",")})`;
            case "join" :
                if( getter )return `function($obj,$val){return implode($val,$obj);}`;
                return `implode(${args[0]}, ${object})`;
            case "sort" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_sort'));
                return `${this.getName('es_array_sort')}(${[getObject()].concat(args).join(",")})`;
            case "keys" :
                if( getter )return this.getMethodName(`array_keys`);
                return `array_keys(${object})`;
            case "reverse" :
                if( getter )return this.getMethodName(`array_reverse`);
                return `array_reverse(${object})`;
            case "lastIndexOf" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_search_last_index'));
                return `${this.getName('es_array_search_last_index')}(${object})`;
            case "copyWithin" :
                target.addDepend("Array");
                if( getter )return this.getMethodName(this.getName('es_array_copy_within'));
                return `${this.getName('es_array_copy_within')}(${[object].concat(args).join(",")})`;
            case "propertyIsEnumerable" :
                if( getter ){
                    target.addDepend("Object");
                    return this.getMethodName( this.getName(`es_object_property_is_enumerable`) );
                }
                return `isset(${object}[${args[0]}])`;
            case "hasOwnProperty" :
                if( getter ){
                    target.addDepend("Object");
                    return this.getMethodName( this.getName(`es_object_has_own_property`) );
                }
                return `isset(${object}[${args[0]}])`;
            case "valueOf" :
                if( getter ){
                    target.addDepend("Object");
                    return this.getMethodName( this.getName(`es_object_value_of`) );
                }
                return `${object}`;
            case "toLocaleString" :
            case "toString" :
                if( getter ){
                    target.addDepend("Object");
                    return this.getMethodName( this.getName(`es_object_to_string`) );
                }
                return `implode(', ', ${object})`;
        }
    }
}