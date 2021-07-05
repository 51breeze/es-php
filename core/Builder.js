const fs = require("fs");
const path = require("path");
const Syntax = require("./Syntax");
const Constant = require("./Constant");
const Polyfill = require("./Polyfill");
class Builder extends Syntax{

    start( done ){

        const compilation = this.compilation;
        const buildModules = new Set();
        const config      = this.getConfig();
        const fileSystem  = this.compiler.getOutputFileSystem(this.name); 
        const isNeedBuild=(module)=>{
            const isDeclaratorModule = module.isDeclaratorModule;
            const isPolyfill = isDeclaratorModule && Polyfill.modules.has( module.id );
            return !isDeclaratorModule || isPolyfill;
        }
        const builder = ( module )=>{
            if( !buildModules.has(module) ){
                buildModules.add(module);
                if( isNeedBuild(module) ){
                    const stack = compilation.getStackByModule(module);
                    const file = this.getOutputAbsolutePath(module);
                    this.emitFile( file, this.make(stack) );
                }
            }
        };
        if( config.build === Constant.BUILD_ALL_FILE ){
            const builderAll=(module)=>{
                if( !buildModules.has(module) ){
                    builder(module);
                    this.getDependencies(module).forEach( depModule=>{
                        builderAll(depModule);
                    });
                }
            }
            compilation.modules.forEach( module =>builderAll(module) )
        }else if(config.build === Constant.BUILD_ORIGIN_FILE){
            compilation.modules.forEach( module =>{
                builder(module);
            });
        }
        done();
    }

    bootstrap(mainId, modules){
        const bootstrap = fs.readFileSync( path.join(__dirname,"../bootstrap.js") ).toString();
        return bootstrap.replace(/\[CODE\[([A-Z|_]+?)\]\]/g,function(a,name){
                 console.log( name )
                switch(name){
                    case "MAIN_IDENTIFIER" :
                        return mainId;
                    case "MODULES":
                        return modules;
                }
                return '';
        });
    }

    emitFile(file, content){
        const dir = path.dirname(file);
        if( !fs.existsSync(dir) ){
            fs.mkdirSync( dir );
        }
        fs.writeFileSync(file, content);
    }
}

module.exports = Builder;