const Syntax = require("../core/Syntax");
class ForOfStatement extends Syntax{
    emitter(){
        const left = this.make(this.stack.left.declarations[0].id);
        const right = this.make(this.stack.right);
        const body = this.stack.body && this.make(this.stack.body);
        const indent = this.getIndent();
        const type = this.stack.right.type();
        if( type.isAnyType ){
            const refs = '$'+this.generatorVarName( this.stack.right.description(), 'IRV' );
            const target = '$'+this.generatorVarName(this.stack.right.description(),"ITO");
            const expre = this.semicolon(`\t${left}=${refs}->value`);
            this.insertExpression( this.semicolon(`${target} = System::getIterator(${right})`) );
            this.addDepend("System");
            return `${indent}for(call_user_func([${target},'rewind']);(${refs} = call_user_func([${target},'next'])) && !${refs}->done;){\r\n${expre}\r\n${body}\r\n${indent}}`;
        }else{
            const typeModule = this.compiler.callUtils('getOriginType', type);
            if( typeModule && !typeModule.isDeclaratorModule ){
                const check = ( module )=>{
                    if( this.isIteratorInterface(module) ){
                        return true;
                    }
                    if( (module.implements || []).some( module=>check(module) ) ){
                        return true;
                    }
                    if( (module.extends || []).some( module=>check(module) ) ){
                        return true;
                    }
                    return false;
                }
                const has = check(typeModule);
                if( has ){
                    const refs = '$'+this.generatorVarName( this.stack.right.description(), 'IRV' );
                    const expre = this.semicolon(`\t${left}=${refs}->value`);
                    return `${indent}for(${right}->rewind();(${refs} = ${right}->next()) && !${refs}->done;){\r\n${expre}\r\n${body}\r\n${indent}}`;
                }
            }
        }
        const condition = `${right} as ${left}`;
        if( !this.stack.body ){
            return this.semicolon(`${indent}foreach(${condition})`);
        }
        if( body ){
            return `${indent}foreach(${condition}){\r\n${body}\r\n${indent}}`;
        }
        return `${indent}foreach(${condition}){\r\n${indent}}`;
    }
}

module.exports = ForOfStatement;