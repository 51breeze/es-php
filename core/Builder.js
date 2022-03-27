const fs = require("fs");
const path = require("path");
const Syntax = require("./Syntax");
const buildCaches = new WeakSet();
const Metadata = new Map([
    ['route', new Map()]
]);
class Builder extends Syntax{
    start(done){
        try{
            const compilation = this.compilation;
            const buildModules = new Set();
            const builder = ( module )=>{
                const builded = module.compilation.completed(this.name) && buildCaches.has(module);
                if( this.isNeedBuild(module) && !builded ){
                    buildCaches.add( module );
                    const stack = compilation.getStackByModule(module);
                    if( stack ){
                        const file = this.getOutputAbsolutePath(module);
                        this.emitFile(file, this.make(stack));
                    }else{
                        throw new Error(`Not found stack by '${module.getName()}'`);
                    }
                }
            };
            const builderAll=(module)=>{
                if( !buildModules.has(module) ){
                    buildModules.add(module);
                    builder(module);
                    this.getDependencies(module).forEach( depModule=>{
                        builderAll(depModule);
                    });
                }
            }
            compilation.completed(this.name,false);
            compilation.modules.forEach( module =>builderAll(module) );
            buildModules.forEach( module=>{
                module.compilation.completed(this.name,true);
            });
            this.emitRoute();
            done();
        }catch(e){
            done(e);
        }
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
                        throw new Error(`Not found stack by '${module.getName()}'`);
                    }
                }
            });
            compilation.completed(this.name,true);
            this.emitRoute();
            done();
        }catch(e){
            done(e);
        }
    }

    emitRoute(){
        const config = this.getConfig();
        const options = this.getOptions();
        const suffix = config.suffix||".php";
        const output = config.output || options.output;
        const routes = Array.from( Metadata.get('route').values() ) || [];
        const content = routes.map( item=>{
            return `Route::${item.method}('${item.path}', '${item.controller}')`
        }).join(';\r\n');
        var routePath = config.outputRoutePath || path.join(output, 'route'+suffix );
        if( !routePath.endsWith(suffix) ){
            routePath = path.join( routePath, `route${suffix}`);
        }
        this.emitFile(routePath,`<?php\r\nuse think\\facade\\Route;\r\n${content};`);
    }

    bootstrap(mainId, modules){
        const bootstrap = fs.readFileSync( path.join(__dirname,"../bootstrap.js") ).toString();
        return bootstrap.replace(/\[CODE\[([A-Z|_]+?)\]\]/g,function(a,name){
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

Builder.Metadata = Metadata;


module.exports = Builder;