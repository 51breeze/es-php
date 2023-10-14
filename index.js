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

const merge = require("lodash/merge");
const modules = require("./tokens/index.js");
const defaultConfig ={
    target:7,
    strict:true,
    emit:true,
    useAbsolutePathImport:false,
    import:true,
    suffix:'.php',
    ns:'es.core',
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
    metadata:{},
    framework:'thinkphp6',
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
        useFolderAsNamespace:true,
        publicPath:'public',
        excludes:[],
        disuse:{},
        using:{},
        mapping:{
            folder:{},
            route:{},
            namespace:{},
        }
    },
    externals:[],
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

function replace(test, type){
    test = String(test).trim();
    if( type ==='namespace' || type==='disuse' || type==='using' ){
        return test.replace(/\./g, '/');
    }
    return test;
}

function makeConfig( object, type){
    if( Array.isArray(object) ){
        object = object.map( item=>{
            if( typeof item ==="string" ){
                return {
                    test:replace(item,type), 
                    raw:item.trim(), 
                    value:''
                };
            }
            if( !item.test )throw new Error(`Config the '${type}.item.test' property is not exists.`);
            if( typeof item.test !== 'string' )throw new Error(`Config the '${type}.item.rule' type must is string.`);
            if( item.value && typeof item.value !== 'string' )throw new Error(`Config the '${type}.item.value' type must is string.`);
            item.raw = item.test.trim();
            item.test = replace(item.test,type);
            return item;
        });
    }else if( typeof object ==='object' ){
        object = Object.keys(object).map( key=>{
            let test = replace(key,type);
            return {
                test:test,
                raw:key.trim(),
                value:object[key]
            }
        });
    }
    if( !Array.isArray(object) ){
        throw new Error(`Config the '${type}' cannot convert to an array`);
    }else{
        let explicit = true;
        const map = {};
        object.forEach( item=>{
            map[item.raw] = item;
            const vague = item.test.match(/\*/g);
            item.vague = vague ? vague.length : 0;
            if(vague)explicit=false;
            item.rawValue = item.value;
            if(item.value && typeof item.value ==='string'){
                item.value = item.value.trim();
                item.dynamic = item.value.includes('%');
                const restIndex = item.value.lastIndexOf('%...');
                if( restIndex > 0 ){
                    if( !item.raw.includes('**') ){
                        throw new Error(`Config the '${item.raw}' rule needs to be specified '**'. because the remaining parameters are used in the matching value`);
                    }
                    if( item.value.length !== restIndex+4 ){
                        throw new Error(`Config remaining '%...' must be at the end in the '${item.rawValue}'.`);
                    }
                }
                if( type ==='namespace' ){
                    if( restIndex > 0 ){
                        item.value = item.value.slice(0,-4);
                    }
                    item.segments = item.value.split('.').filter( v=>!!v );
                    if( restIndex > 0 )item.segments.push('%...');
                    if( !item.dynamic ){
                        item.value = item.value.replace(/\./g, '\\');
                    }
                }else{
                    item.segments = item.value.split('/');
                }
            }
        });
        object.sort( (a,b)=>{
            const a1 = a.test.split('/');
            const b1 = b.test.split('/');
            if(a1.length > b1.length)return -1;
            if(a.vague < b.vague)return -1;
            return 0;
        });
        return {
            map:map, 
            explicit:explicit,
            rules:object
        }
    }
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
        this.options.metadata.env = merge({}, compiler.options.env, this.options.env);
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
        const resolve = this.options.resolve;
        const mapping = resolve.mapping;
        mapping.namespace = makeConfig(mapping.namespace, 'namespace');
        mapping.folder = makeConfig(mapping.folder, 'folder');
        mapping.route = makeConfig(mapping.route, 'route');
        resolve.disuse = makeConfig(resolve.disuse, 'disuse');
        resolve.using = makeConfig(resolve.using, 'using');
        registerError(compiler.diagnostic.defineError, compiler.diagnostic.LANG_CN, compiler.diagnostic.LANG_EN );
        this._builders = new Map();
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