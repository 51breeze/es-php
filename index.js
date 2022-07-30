const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const {merge} = require("lodash");
const modules = new Map();
const dirname = path.join(__dirname,"tokens");
fs.readdirSync( dirname ).forEach( (filename)=>{
    const info = path.parse( filename );
    modules.set(info.name, require( path.join(dirname,filename) ) );
});

const defaultConfig ={
    target:7,
    emitFile:true,
    requireFile:true,
    namespaceAlias:null,
    outputRoutePath:null,
    suffix:'.php',
    ns:'es.core',
}

const pkg = require("./package.json");
const generatedCodeMaps = new Map();

class Plugin{

    constructor(complier,options){
        this.complier = complier;
        this.options = merge({},defaultConfig, options);
        this.generatedCodeMaps = generatedCodeMaps;
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'server';
        const dir = path.join(__dirname,'types');
        const files = fs.readdirSync( dir ).filter( item=>!(item === '.' || item === '..') ).map( item=>path.join(dir,item) );
        complier.loadTypes(files,true,null,true);
    }

    getGeneratedCodeByFile(file){
        return this.generatedCodeMaps.get(file);
    }

    getGeneratedSourceMapByFile(file){
        return null;
    }

    getTokenNode(name){
        return modules.get(name);
    }

    start(compilation, done){
        const builder = this.getBuilder( compilation );
        builder.start(done);
        return builder;
    }

    build(compilation, done){
        const builder = this.getBuilder( compilation );
        builder.build(done);
        return builder;
    } 

    getBuilder( compilation ){
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.plugin = this;
        return builder;
    }
}


module.exports = Plugin;