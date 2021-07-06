const Syntax = require("../core/Syntax");
class CallExpression extends Syntax{

    array_method(args, property){
        let target = this.make(this.stack.callee.object);
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
            case "filter" :
                const body = [];
                this.addDepend( this.stack.getModuleById("System") );
                body.push( this.semicolon(`\t$thisArg = ${args[1] || null}`) );
                body.push( this.semicolon(`\t$callback = ${args[0].replace(/\r\n/g,'\r\n\t')}`) );
                body.push( this.semicolon(`\t$callback = $thisArg ? System::bind($callback,$thisArg) : $callback`) );
                body.push( this.semicolon(`\treturn is_callback($callback) ? $callback($value,$key,${target}) : false`) );
                const useVar = [target];
                if( args[1] && !this.stack.arguments[1].isThisExpression ){
                    useVar.push( args[1] );
                }
                return `array_filter(${target},function($value,$key)use(&${useVar.join(",&")}){\r\n${body.join("\r\n")}\r\n${this.getIndent()}},ARRAY_FILTER_USE_BOTH)`;
            case "indexOf" :
                const refs = '$'+this.generatorVarName(this.stack,"_index");
                return `((${refs} = array_search(${args[0]},${target})) === false ? -1 : ${refs})`;
            case "includes" :
                return `array_search(${args[0]},${target}) !== false`;
            case "length" :
                return `count(${target})`;
            case "concat" :
                return `array_values(${[target].concat(args).map( item=>`(array)${item}`).join(' + ')})`;
            case "entries" :
                return `array_values(${[target]})`;
        }
    }

    intercept(args){
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
            switch( name ){
                case "string" :
                    return null;
                case "array"  :
                    return this.array_method(args,property);
            }
        }
        return null;
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