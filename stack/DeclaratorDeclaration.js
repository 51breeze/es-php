const Syntax = require("../core/Syntax");
const Polyfill = require("../core/Polyfill");
class DeclaratorDeclaration extends Syntax{
    emitter(){
        const module = this.module;
        const polyfillModule = Polyfill.modules.get(module.id);
        if( !polyfillModule || !polyfillModule.content || !polyfillModule.export ){
            return null;
        }
        const content = polyfillModule.content.toString();
        const refs = [];
        const requires  = [];
        polyfillModule.require.forEach( name=>{
            this.addDepend(name);
        });

        this.createDependencies(module,refs,requires);
        return content.replace(/\/\/\/\/\[(require|namespace|reference)\](\r?\n)/g,(all,name,line)=>{
            let result = '';
            switch( name ){
                case 'require' :
                    result = requires.join("\r\n");
                    break;
                case 'namespace' :
                    const namespace = (polyfillModule.namespace || '').replace(/\./g,'\\');
                    if( namespace ){
                        result = `namespace ${namespace};`;
                    }
                    break;
                case 'reference' :
                    result = refs.join("\r\n"); 
                    break;
            }
            return result ? result+line : '';
        });
    }
}

module.exports = DeclaratorDeclaration;