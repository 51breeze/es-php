const Syntax = require("../core/Syntax");
class CallExpression extends Syntax{

    intercept(args){
        if( this.stack.callee.isMemberExpression ){
            const desc = this.stack.callee.object.description();
            const callName = this.stack.callee.property.value();
            const type = desc.type();
            let typeName = type.toString();
            switch( true ){
                case type.isTupleType :
                case type.isLiteralArrayType :
                    typeName =  'array';
                break;
            }

            switch( typeName ){
                case "string" :
                    return null;
                case "array"  :
                    let target = this.make(this.stack.callee.object);
                    if( this.stack.callee.object.isArrayExpression ){
                        const refs = '$'+this.generatorVarName(this.stack, '_array');
                        this.insertExpression(this.stack, this.semicolon(`${refs} = ${target}`));
                        target = refs;
                    }
                    switch( callName ){
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
                            return `array_filter(${target},function($value,$key)use(&${target}){$thisArg = ${args[1] || null};$callback = ${args[0]}; $callback = $thisArg ? System::bind($callback,$thisArg) : $callback;return is_callback($callback) ? $callback($value,$key,${target}) : false;},ARRAY_FILTER_USE_BOTH)`;
                        case "indexOf" :
                            const refs = this.generatorVarName(this.stack,"_i");
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
                    break;
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