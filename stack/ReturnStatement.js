const Syntax = require("../core/Syntax");
class ReturnStatement extends Syntax{
    emitter(){

        const argument = this.stack.argument;
        if( !argument ){
            return this.semicolon(`return`);
        }

        const desc = argument.description();
        const addressCrossRefs = this.getAssignAddressCrossRefs(desc);
        if( addressCrossRefs && desc.isVariableDeclarator && this.hasRefAddressVariables( desc ) ){
            const ref = this.make( desc.id );
            const content = [];
            const indent = this.getIndent();
            addressCrossRefs.forEach( (item)=>{
                const address = this.getGeneratorVarName( item.description() ,"_RD");
                const refs = address ? `\$${address}` : this.make( item );
                content.push(`${indent}\tcase ${refs} :`);
                content.push(`${indent}\t\treturn ${refs};`);
            });
            content.push(`${indent}\tdefault :`);
            content.push(`${indent}\t\treturn ${ref};`);
            this.insertExpression(this.stack, [
                `${indent}switch(${ref}){`, 
                content.join("\r\n"), 
                `${indent}}`,
            ].join("\r\n"));
            return null;
        }

        const addressRef = this.getAssignAddressRef(desc);
        if( addressRef ){
            const refs = this.getGeneratorVarName( addressRef.description() ,"_RD");
            if( refs ){
                return this.semicolon(`return \$${refs}`);
            }
        }
        return this.semicolon(`return ${this.make( addressRef || argument)}`);
    }
}

module.exports = ReturnStatement;