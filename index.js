const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const Polyfill = require("./core/Polyfill");
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
const configData = Object.assign({}, defaultConfig);
const package = require('./package.json');
const properties ={
    name:package.name,
    version:package.version,
    platform:'server',
    config(options){
        const target = configData;
        if(options){
            merge(target, options);
        }
        return target;
    },
    getPolyfill(name){
        return Polyfill.modules.get(name);
    },
    getStack(name){
        return modules.get(name);
    },
    start(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.version = this.version;
        builder.start(done);
    },
    build(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.version = this.version;
        builder.build(done);
    }
}

function plugin(complier){
    if( modules.size === 0 ){
        loadStack();
    }
    this.complier = complier;
    const defaultOptions = {};
    const config = complier.options[this.name] || {};
    if( complier.options.commandLineEntrance ){
        defaultOptions.emitFile = true;
    }
    this.config( merge(defaultOptions,config) );
    //complier.loadTypes([require.resolve('./types/web.es')],true,this);
};

Object.defineProperty(plugin.prototype, 'constructor', {
    value:plugin,
    enumerable:false,
    configurable:false
});

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