const fs = require("fs");
const path = require("path");
const Syntax = require("./Syntax");
const Polyfill = require("./Polyfill");
class Builder extends Syntax{

    start( done ){
        const compilation = this.compilation;
        const buildModules = new Set();
        const buildCompilations = new Set();
        const builder = ( module )=>{
            if( !buildModules.has(module) && this.isNeedBuild(module) ){
                buildModules.add(module);
                if( !module.compilation.completed(this.name) ){
                    const stack = compilation.getStackByModule(module);
                    if( stack ){
                        const file = this.getOutputAbsolutePath(module);
                        buildCompilations.add( module.compilation );
                        this.emitFile(file, this.make(stack) );
                    }else{
                        done( new Error(`Not found stack by '${module.getName()}'`) );
                    }
                }
            }
        };
        
        const builderAll=(module)=>{
            if( !buildModules.has(module) ){
                builder(module);
                this.getDependencies(module).forEach( depModule=>{
                    builderAll(depModule);
                });
            }
        }

        compilation.completed(this.name,false);
        compilation.modules.forEach( module =>builderAll(module) );

        buildCompilations.forEach( compilation=>{
            compilation.completed(this.name,true);
        });

        done();
    }

    build(done){
        const compilation = this.compilation;
        compilation.completed(this.name,false);
        try{
            compilation.modules.forEach( module =>{
                if( this.isNeedBuild(module) ){
                    const stack = compilation.getStackByModule(module);
                    if( stack ){
                        const file = this.getOutputAbsolutePath(module);
                        this.emitFile(file, this.make(stack) );
                    }else{
                        done( new Error(`Not found stack by '${module.getName()}'`) );
                    }
                }
            });
        }catch(e){
            done(e);
        }
        compilation.completed(this.name,true);
        done();
    }

    isNeedBuild(module){
        if(!module)return false;
        const isDeclaratorModule = module.isDeclaratorModule;
        const isPolyfill = isDeclaratorModule && Polyfill.modules.has( module.id );
        return !isDeclaratorModule || isPolyfill;
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
        if( content=== null )return;
        var dir = file;
        const paths = [];
        while( dir && !fs.existsSync( dir = path.dirname(dir) ) ){
            paths.push( dir );
        }
        while( paths.length > 0 ){
            fs.mkdirSync( paths.pop() );
        }
        fs.writeFileSync(file, content);
    }
}

module.exports = Builder;