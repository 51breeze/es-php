const path = require("path");
const Builder = require("./core/Builder");
const Token = require('./core/Token');
const Polyfill = require('./core/Polyfill');
const ClassBuilder = require('./core/ClassBuilder');
const Constant = require('./core/Constant');
const Router = require('./core/Router');
const Sql = require('./core/Sql');
const Transform = require('./core/Transform');
const JSXTransform = require('./core/JSXTransform');
const JSXClassBuilder = require('./core/JSXClassBuilder');
const Assets = require('./core/Assets');
const Glob = require('glob-path');

const merge = require("lodash/merge");
const modules = require("./tokens/index.js");
const defaultConfig ={
    target:7,
    strict:true,
    emit:true,
    useAbsolutePathImport:false,
    import:true,
    suffix:'.php',
    context:{
        include:null,
        exclude:null,
        only:false
    },
    dependencies:{
        'moment':{
            name:'fightbulc/moment',
            version:'^1.33.0',
            env:'prod'
        }
    },
    metadata:{
        env:{}
    },
    composer:null,
    consistent:true,
    assets:/\.(gif|png|jpeg|jpg|svg|bmp|icon|font|css|less|sass|js|mjs|mp4)$/i,
    lessOptions:{},
    sassOptions:{},
    rollupOptions:{
        input:{
            plugins:[]
        },
        output:{
            format:'cjs',
            exports:'auto',
        }
    },
    resolve:{
        usings:{},
        folders:{},
        routes:{},
        namespaces:{},
    },
    folderAsNamespace:true,
    publicPath:'public',
    externals:[],
    excludes:[],
    includes:[]
}

const pkg = require("./package.json");
const generatedCodeMaps = new Map();

function registerError(define, cn, en){
    if(registerError.loaded)return;
    registerError.loaded=true;
    define(20000,'',[
        '类(%s)命名空间必须与文件路径一致',
        "The '%s' class namespace must be consistent with the file path"
    ]);
}

class PluginEsPhp{

    static getPluginCoreModules(){
        return{
            Builder,
            Token,
            Polyfill,
            ClassBuilder,
            Constant,
            Router,
            Sql,
            Transform,
            JSXTransform,
            JSXClassBuilder,
            Assets,
            Merge:merge
        };
    }

    constructor(compiler,options){
        this.compiler = compiler;
        this.options = merge({},defaultConfig, options);
        this.generatedCodeMaps = generatedCodeMaps;
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'server';
        if( !compiler.options.scanTypings ){
            compiler.loadTypes([
                path.join(__dirname,'types','index.d.es')
            ],{
                scope:'es-php',
                inherits:[]
            });
        }
        registerError(compiler.diagnostic.defineError, compiler.diagnostic.LANG_CN, compiler.diagnostic.LANG_EN );
        this._builders = new Map();
        this.glob=new Glob();
        this.addGlobRule();
    }

    addGlobRule(){
        const resolve = this.options.resolve;
        Object.keys(resolve.namespaces).forEach( key=>{
            this.glob.addRule(key, resolve.namespaces[key], 0, 'namespaces');
        });

        Object.keys(resolve.folders).forEach( key=>{
            this.glob.addRule(key, resolve.folders[key], 0, 'folders');
        });

        Object.keys(resolve.routes).forEach( key=>{
            this.glob.addRule(key, resolve.routes[key], 0, 'routes');
        });

        const trueCallback=()=>true;
        if(Array.isArray(resolve.usings)){
            resolve.usings.forEach( key=>{
                this.glob.addRule(key, trueCallback, 0, 'usings');
            });
        }else{
            Object.keys(resolve.usings).forEach( key=>{
                if(typeof resolve.usings[key] ==='function'){
                    this.glob.addRule(key, resolve.usings[key], 0, 'usings');
                }else{
                    throw new TypeError(`options.resolve.usings the '${key}' rule, should assignmented a function`)
                }
            });
        }
    }

    resolveSourcePresetFlag(id, group){
        return !!this.glob.dest(id, {group, failValue:false});
    }

    resolveSourceId(id, group, delimiter='/'){
        if( group==='namespaces' || group==='usings'){
            delimiter = '\\';
        }
        return this.glob.dest(id, {group, delimiter, failValue:null});
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

    getBuilder( compilation, builderFactory=Builder ){
        let builder = this._builders.get(compilation);
        if( builder )return builder;
        builder = new builderFactory(compilation);
        builder.name = this.name;
        builder.platform = this.platform;
        builder.plugin = this;
        this._builders.set(compilation,builder);
        return builder;
    }

    toString(){
        return pkg.name;
    }
}

PluginEsPhp.toString=function toString(){
    return pkg.name;
}

module.exports = PluginEsPhp;