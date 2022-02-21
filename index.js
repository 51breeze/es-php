const fs = require("fs");
const path = require("path");
const Syntax = require("./core/Syntax");
const Builder = require("./core/Builder");
const {merge} = require("lodash");
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

const profile={
    name:'php',
    platform:'server',
    configuration:defaultConfig,
    make(stack, ...args){
        const stackModule = modules.get( stack.toString() );
        if( stackModule ){
            const obj = new stackModule(stack);
            if( args.length > 0 ){
                return obj.emitter.apply(obj, args);
            }else{
                return obj.emitter();
            }
        }
        throw new Error(`Stack '${stack.toString()}' is not found.`);
    }
}

const properties ={
    name:profile.name,
    platform:profile.platform,
    version:require("./package.json").version,
    config(options){
        const target = Syntax.prototype.configuration;
        if(options){
            merge(target, options);
        }
        return target;
    },
    start(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.start(done);
    },
    build(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.build(done);
    }
}

function plugin(complier){
    if( modules.size === 0 ){
        loadStack();
    }
    this.complier = complier;
    //complier.loadTypes([require.resolve('./types/web.es')],true,this);
};

Object.defineProperty(plugin.prototype, 'constructor', {
    value:plugin,
    enumerable:false,
    configurable:false
});

for(var name in profile){
    Object.defineProperty(Syntax.prototype, name, {
        value:profile[name],
        enumerable:false,
        configurable:false
    });
}

for(var name in properties){
    Object.defineProperty(plugin.prototype,name,{
        value:properties[name],
        enumerable:false,
        configurable:false
    });
    if( ['name','platform','version'].includes( name ) ){
        Object.defineProperty(plugin,name,{
            value:properties[name],
            enumerable:true,
            configurable:false
        });
    }
}

Object.defineProperty(plugin,'modules',{
    value:modules,
    enumerable:true,
    configurable:false
});

module.exports = plugin;