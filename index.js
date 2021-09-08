const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const modules = new Map();
const loadStack=()=>{
    const dirname = path.join(__dirname,"stack");
    fs.readdirSync( dirname ).forEach( (filename)=>{
        const info = path.parse( filename );
        modules.set(info.name, require( path.join(dirname,filename) ) );
    });
}
const defaultConfig ={
    target:7,
    suffix:'.php',
}

const plugin = {
    name:'php',
    platform:'server',
    make(stack, flag=false){
        const stackModule = modules.get( stack.toString() );
        if( stackModule ){
            if( flag ){
                return new stackModule(stack);
            }
            return (new stackModule(stack)).emitter();
        }
        throw new Error(`Stack '${stack.toString()}' is not found.`);
    }
};

const Syntax = require("./core/Syntax");
Syntax.prototype.configuration = defaultConfig;

for(var name in plugin){
    Object.defineProperty(Syntax.prototype, name, {
        value:plugin[name],
        enumerable:false,
        configurable:false
    });
}

plugin.config=function config(options){
    Syntax.prototype.configuration = Object.assign({}, defaultConfig, Syntax.prototype.configuration||{},  options||{});
}

plugin.start=function start(compilation, done, options){
    if( options )this.config(options);
    if( modules.size === 0 ){
        loadStack();
    }
    if( compilation.stack && compilation.stack.isStack ){
        const builder = new Builder( compilation.stack );
        builder.start(done);
    }else{
        done( new Error('Not found stack') );
    }
}

plugin.build=function build(compilation, done, options){
    if( options )this.config(options);
    if( modules.size === 0 ){
        loadStack();
    }
    if(compilation.stack && compilation.stack.isStack){
        const builder = new Builder(compilation.stack);
        builder.build(done);
    }else{
        done( new Error('Not found stack') );
    }
}

module.exports = plugin;