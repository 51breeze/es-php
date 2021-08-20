const Syntax = require("../core/Syntax");
const Polyfill = require("../core/Polyfill");
class CallExpression extends Syntax{

    intercept(args){
        if( this.stack.callee.isMemberExpression ){
            const desc = this.stack.callee.object.description();
            const property = this.stack.callee.property.value();
            const type = this.compiler.callUtils("getOriginType",this.stack.callee.object.type());
            if( type && this.compiler.callUtils("isTypeModule",type) ){
                const typeName = type.id.toString();
                for(var name of [typeName,'Object']){
                    let polyModule = Polyfill.modules.get(name);
                    if( polyModule && polyModule.method ){
                        const result = polyModule.method(this, this.stack.callee.object, property, args, desc, this.compiler.callUtils("isTypeModule",desc) );
                        if( result ){
                            return result;
                        }
                    }
                };
            }
        }
        return null;
    }

    emitter(){
        const desc = this.stack.description();
        if( this.compiler.callUtils("isTypeModule", desc) ){
            this.addDepend( desc );
        }
        const hasAssignmentExpression = this.stack.arguments.some( item=>!!item.isAssignmentExpression );
        const declareParams = desc.params;
        const args = this.stack.arguments.map( (item,index)=>{
            let value = this.make( item );
            if( declareParams && declareParams[index] && (hasAssignmentExpression || item.isArrayExpression) ){
                const declareType = declareParams[index].type();
                if( declareType ){
                    const originType = this.compiler.callUtils("getOriginType", declareType );
                    if( originType.id === "Array" ){
                        const name = '$'+this.generatorVarName(item,"_V" );
                        this.insertExpression( this.semicolon(`${name} = ${value}`) );
                        return name;
                    }
                }
            }
            if( item.isIdentifier ){
                return this.createArrayRefs(item.description(), value);
            }
            return value;
        });
        
        const result = this.intercept(args);
        if( result ){
            return result === true ? null : result;
        }

        if( desc && desc.isDeclaratorFunction ){
            switch( desc ){
                case this.getGlobalModuleById('setTimeout') :
                case this.getGlobalModuleById('setInterval') :
                    if( args.length > 2 ){
                        return `call_user_func(${args[0]},${args.slice(3).join(',')})`;
                    }else{
                        return `call_user_func(${args[0]})`;
                    }
                case this.getGlobalModuleById('clearTimeout') :
                case this.getGlobalModuleById('clearInterval') :
                    return `null`;
            }
        }


        if( this.stack.callee.isMemberExpression ){
            if( desc && desc.isType && desc.isAnyType  ){
                this.addDepend("Reflect");
                const property = this.stack.callee.property.isIdentifier && !this.stack.callee.computed ? `'${this.stack.callee.property.value()}'` : this.make(this.stack.callee.property);
                if( args.length > 0 ){
                    return `${this.checkRefsName("Reflect")}::call(${this.getClassStringName(this.module)},${this.make(this.stack.callee.object)},${property},[${args.join(",")}])`;
                }else{
                    return `${this.checkRefsName("Reflect")}::call(${this.getClassStringName(this.module)},${this.make(this.stack.callee.object)},${property})`;
                }
            }
            if( desc && !desc.isMethodDefinition && (desc.isFunctionExpression || desc.isFunctionType) ){
                if( args.length > 0 ){
                    return `call_user_func(${this.make(this.stack.callee)},${args.join(",")})`;
                }else{
                    return `call_user_func(${this.make(this.stack.callee)})`;
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