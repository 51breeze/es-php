const Syntax = require("../core/Syntax");
const Polyfill = require("../core/Polyfill");
class DeclaratorDeclaration extends Syntax{
    emitter(){
        const module = this.module;
        const polyfillModule = Polyfill.modules.get(module.id);
        if( !polyfillModule ){
            return null;
        }
        const content = [polyfillModule.content];
        const refs = [];
        polyfillModule.require.forEach( name=>{
            this.addDepend( this.stack.getModuleById(name) );
        });
        this.createDependencies(module,refs);
        return `${refs.concat(content).join("\r\n")}`;
    }
}

module.exports = DeclaratorDeclaration;