const Syntax = require("../core/Syntax");
class CallExpression extends Syntax{

    array_method(args, property, isStatic){
        let target = this.make(this.stack.callee.object);
        if( isStatic ){
            switch( property ){
                case "isArray" :
                    return `is_array(${args.join(",")})`;
                case "from" :
                    return `array_slice(${args.join(",")},0)`;
                case "of" :
                    return `es_array_new(${args.join(",")})`;
            }
            return null;
        }

        if( this.stack.callee.object.isArrayExpression ){
            const refs = '$'+this.generatorVarName(this.stack, '_array');
            this.insertExpression(this.stack, this.semicolon(`${refs} = ${target}`));
            target = refs;
        }
        switch( property ){
            case "push" :
                return `array_push(${[target].concat(args).join(",")})`;
            case "unshift" :
                return `array_unshift(${[target].concat(args).join(",")})`;
            case "pop" :
                return `array_pop(${target})`;
            case "shift" :
                return `array_shift(${target})`;
            case "slice" :
                return `array_slice(${[target].concat(args).join(",")})`;
            case "splice" :
                return `array_splice(${[target].concat(args).join(",")})`;
            case "map" :
                return `es_array_map(${[target].concat(args).join(",")})`;
            case "find" :
                return `es_array_find(${[target].concat(args).join(",")})`;
            case "findIndex" :
                return `es_array_find_index(${[target].concat(args).join(",")})`;
            case "filter" :
                return `es_array_filter(${[target].concat(args).join(",")})`;
            case "indexOf" :
                return `es_array_search_index(${[target].concat(args).join(",")})`;
            case "includes" :
                return `array_search(${args[0]},${target}) !== false`;
            case "length" :
                return `count(${target})`;
            case "concat" :
                return `es_array_concat(${[target].concat(args).join(',')})`;
            case "entries" :
                return `array_values(${[target]})`;
            case "every" :
                return `es_array_every(${[target].concat(args).join(",")})`;
            case "some" :
                return `es_array_some(${[target].concat(args).join(",")})`;
            case "fill" :
                return `es_array_fill(${[target].concat(args).join(",")})`;
            case "values" :
                return `array_values(${target})`;
            case "forEach" :
                return `es_array_foreach(${[target].concat(args).join(",")})`;
            case "flat" :
                return `es_array_flat(${[target].concat(args).join(",")})`;
            case "flatMap" :
                return `es_array_flat_map(${[target].concat(args).join(",")})`;
            case "reduce" :
                return `es_array_reduce(${[target].concat(args).join(",")})`;
            case "reduceRight" :
                return `es_array_reduce_right(${[target].concat(args).join(",")})`;
            case "join" :
                return `implode(${args[0]}, ${target})`;
            case "sort" :
                return `es_array_sort(${[target].concat(args).join(",")})`;
            case "keys" :
                return `array_keys(${target})`;
            case "reverse" :
                return `array_reverse(${target})`;
            case "lastIndexOf" :
                return `es_array_search_last_index(${target})`;
            case "toLocaleString" :
            case "toString" :
                return `var_export(${target},true)`;
            case "copyWithin" :
                return `es_array_copy_within(${[target].concat(args).join(",")})`;
        }
    }

    console_method(args, property){
        let target = this.make(this.stack.callee.object);
        switch( property ){
            case "log" :
                return `${target}::log(${args.join(",")})`;
        }
    }

    intercept(args){
        var result = null;
        if( this.stack.callee.isMemberExpression ){
            const desc = this.stack.callee.object.description();
            const property = this.stack.callee.property.value();
            const type = desc.type();
            let name = type.toString();
            switch( true ){
                case type.isTupleType :
                case type.isLiteralArrayType :
                    name =  'array';
                break;
            }
            name = name.toLowerCase();
            const interceptor = this[`${name}_method`];
            result = interceptor ? interceptor.call(this, args,property, this.compiler.callUtils("isTypeModule",desc) ) : null;
            if( result ){
                switch( name ){
                    case "string" :
                        this.addDepend( this.stack.getModuleById("String") );
                        break;
                    case "array"  :
                        this.addDepend( this.stack.getModuleById("Array") );
                        break;
                    case "console"  :
                        this.addDepend( this.stack.getModuleById("Console") );
                        break;
                }
            }
        }
        return result;
    }

    emitter(){
        const args = this.stack.arguments.map( item=>this.make(item));
        const desc = this.stack.callee.description();
        if( this.compiler.callUtils("isTypeModule", desc) ){
            this.addDepend( desc );
        }
        const result = this.intercept(args);
        if( result ){
            return result;
        }
        if( this.stack.callee.isMemberExpression ){
            if( desc && desc.isType && desc.isAnyType  ){
                this.addDepend( this.stack.getModuleById("Reflect") );
                if( args.length > 0 ){
                    return `${this.checkRefsName("Reflect")}::call(${this.module.id},${this.make(this.stack.callee.object)},"${this.stack.callee.property.value()}",[${args.join(",")}])`;
                }else{
                    return `${this.checkRefsName("Reflect")}::call(${this.module.id},${this.make(this.stack.callee.object)},"${this.stack.callee.property.value()}")`;
                }
            }
        }
        if( this.stack.callee.isSuperExpression && !this.isDependModule(this.module.inherit) ){
            return null;
        }
        const callee= this.make(this.stack.callee);
        return `${callee}(${args.join(",")})`;
    }
}
module.exports = CallExpression;