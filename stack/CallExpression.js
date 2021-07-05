const Syntax = require("../core/Syntax");
class CallExpression extends Syntax{

    replace(args){
        if( this.stack.callee.isMemberExpression ){
            if( this.stack.callee.object.isLiteral && this.stack.callee.object.node.regex){
                const callName = this.stack.callee.property.value();
                let pattern;
                switch( callName ){
                    case "test" : 
                        pattern = this.make(this.stack.callee.object);
                        return `!!preg_match('${pattern}',${args[0]})`;
                    case "exec" :
                        pattern = this.make(this.stack.callee.object);
                        const global  = /\/\g/.test(pattern);
                        const refs = '$'+this.generatorVarName(this.stack.callee, "matches");
                        if( global ){
                            return `(preg_match_all('${pattern}',${args[0]},${refs}), ${refs})`;
                        }
                        return `(preg_match('${pattern}',${args[0]},${refs}), ${refs})`;
                }
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
        const result = this.replace(args);
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