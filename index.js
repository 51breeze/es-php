const path = require("path");
const fs = require("fs-extra");
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
const mergeWith = require("lodash/mergeWith");
const modules = require("./tokens/index.js");
const VirtualModule = require("./core/VirtualModule");

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
    assets:/\.(gif|png|jpeg|jpg|svg|bmp|icon|font|css|less|sass|scss|js|mjs|cjs|vue|ts)$/i,
    bundle:{
        enable:false,
        extensions:['.js','.mjs','.cjs','.vue','.es','.ts'],
    },
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
        folders:{
            "*.global":"escore",
        },
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

function merge(...args){
    return mergeWith(...args,(objValue, srcValue)=>{
        if(Array.isArray(objValue) && Array.isArray(srcValue)){
            if(srcValue[0]===null)return srcValue.slice(1);
            srcValue.forEach( value=>{
                if( !objValue.includes(value) ){
                    objValue.push(value)
                }
            })
            return objValue;
        }
   });
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
            Merge:merge,
            VirtualModule
        };
    }

    #builders = new Map();

    constructor(compiler,options){
        this.compiler = compiler;
        this.options = merge({},defaultConfig, options);
        this.generatedCodeMaps = generatedCodeMaps;
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'server';
        registerError(compiler.diagnostic.defineError, compiler.diagnostic.LANG_CN, compiler.diagnostic.LANG_EN );
        this.glob=new Glob();
        this.addGlobRule();
        compiler.on('onChanged', (compilation)=>{
            this.#builders.delete(compilation);
        });
    }

    addGlobRule(){
        const resolve = this.options.resolve;
        Object.keys(resolve.namespaces).forEach( key=>{
            this.glob.addRuleGroup(key, resolve.namespaces[key],'namespaces');
        });

        Object.keys(resolve.folders).forEach( key=>{
            this.glob.addRuleGroup(key, resolve.folders[key], 'folders');
        });

        const trueCallback=()=>true;
        if(Array.isArray(resolve.usings)){
            resolve.usings.forEach( key=>{
                if(typeof key ==='object'){
                    if(key.test === void 0 || key.value === void 0){
                        throw new TypeError(`options.resolve.usings the each rule item should is {test:'rule', value:true} object`)
                    }else{
                        if(typeof key.value === 'function'){
                            this.glob.addRuleGroup(key.test, key.value, 'usings');
                        }else{
                            this.glob.addRuleGroup(key.test, ()=>key.value, 'usings');
                        }
                    }
                }else{
                    this.glob.addRuleGroup(key, trueCallback, 'usings');
                }
            });
        }else{
            Object.keys(resolve.usings).forEach( key=>{
                if(typeof resolve.usings[key] ==='function'){
                    this.glob.addRuleGroup(key, resolve.usings[key], 'usings');
                }else{
                    throw new TypeError(`options.resolve.usings the '${key}' rule, should assignmented a function`)
                }
            });
        }
    }

    resolveSourcePresetFlag(id, group){
        return !!this.glob.dest(id, {group,failValue:false});
    }

    resolveSourceId(id, group, delimiter='/'){
        if( group==='namespaces' || group==='usings'){
            delimiter = '\\';
        }
        let data = {group, delimiter, failValue:null};
        if(typeof group ==='object'){
            data = group;
        }
        return this.glob.dest(id, data);
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

    getClassModuleBuilder(){
        return ClassBuilder;
    }

    getAssets(){
        return Assets.getAssets();
    }

    getVirtualModule(id){
        return VirtualModule.getVModule(id);
    }

    async start(compilation, done=()=>null){
        const builder = this.getBuilder( compilation );
        await builder.start(done);
        return builder;
    }

    async build(compilation, done=()=>null){
        const builder = this.getBuilder(compilation);
        await builder.build(done);
        return builder;
    }

    async batch(compilations){
        if(!Array.isArray(compilations)){
            throw new Error('compilations is not array')
        }
        const len = compilations.length-1;
        await Promise.allSettled(compilations.map( async (compilation,index)=>{
            await compilation.ready();
            const builder = this.getBuilder(compilation)
            if( compilation.isDescriptorDocument() ){
                compilation.modules.forEach( module=>{
                    const stack = compilation.getStackByModule(module);
                    if(stack){
                        builder.buildForModule(compilation, stack, module);
                    }
                })
            }else{
                if( compilation.isCompilationGroup ){
                    compilation.children.forEach( compilation=>{
                        builder.buildForModule(compilation, compilation.stack, compilation.mainModule);
                    });
                }else{
                    builder.buildForModule(compilation, compilation.stack, compilation.mainModule);
                }
            }
            await builder.buildAfter();
            if(index === len){
                await builder.buildIncludes();
                await builder.emitSql();
                await builder.emitManifest();
                await builder.emitAssets();
            }
        }));
        const Assets = this.getVirtualModule('asset.Assets');
        if(Assets.using){
            await Assets.make();
        }
    }

    getBuilder(compilation, builderFactory=Builder ){
        let builder = this.#builders.get(compilation);
        if(builder)return builder;
        builder = new builderFactory(compilation);
        builder.name = this.name;
        builder.platform = this.platform;
        builder.plugin = this;
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