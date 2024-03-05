const fs = require("fs");
const Generator = require("./Generator");
const Token = require("./Token");
const Polyfill = require("./Polyfill");
const PATH = require("path");
const Router = require("./Router");
const Sql = require("./Sql");
const staticAssets = require("./Assets");
const moduleDependencies = new Map();
const moduleIdMap=new Map();
const namespaceMap=new Map();
const createAstStackCached = new WeakSet();
const composerDependencies = new Map();
const outputAbsolutePathCached = new Map();
const resolveModuleTypeCached = new Map();
const fileAndNamespaceMappingCached = new Map();
const routerInstance  = new Router();
const sqlInstance  = new Sql();
const fileContextScopes = new Map();
const privateKey = Symbol('key');
const hasOwn = Object.prototype.hasOwnProperty;
class Builder extends Token{

    static MODULE_TYPE_CONTROLLER = 1;
    static MODULE_TYPE_MODEL = 2;
    static MODULE_TYPE_ASSET = 3;
    static MODULE_TYPE_CONFIG = 4;
    static MODULE_TYPE_LANG = 5;
    static MODULE_TYPE_UNKNOWN = 9;

    constructor(compilation){
        super(null);
        this.scope = compilation.scope;
        this.compilation = compilation;
        this.compiler = compilation.compiler;
        this.builder = this;
        this.plugin = null;
        this.name = null;
        this.platform = null;
        this.buildModules = new Set();
        this.staticAssets = staticAssets;
        this.fileContextScopes = fileContextScopes;
        staticAssets.setContext(this);
        sqlInstance.builder = this;
        routerInstance.builder = this;
        this.esSuffix = new RegExp( this.compiler.options.suffix.replace('.','\\')+'$', 'i' );
    }

    createScopeId(context, source ){
        if( !context || !source || !context.file)return null;
        const file = context.isModule ? context.file+'?id='+context.getName() : context.file;
        const key = context.isModule ? file +'&scope='+source : file +'?scope='+source;
        let dataset = this.fileContextScopes.get( context );
        if(!dataset)this.fileContextScopes.set( dataset = {} );
        if( dataset[key] ){
            return dataset[key];
        }
        return dataset[key] = String( this.createHash( key ) );
    }

    createHash(str){
        str = str.toLowerCase();
        var hash=Number.MAX_VALUE,i,ch;
        for (i = str.length - 1; i >= 0; i--) {
            ch = str.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }
        return  (hash & 0x7FFFFFFF);
    }

    addSqlTableNode(id, node, stack){
        sqlInstance.addTable(id,node,stack);
    }

    hasSqlTableNode(id){
        return sqlInstance.has(id);
    }

    getRouterInstance(){
        return routerInstance;
    }

    addFileAndNamespaceMapping(file, namespace){
        if( namespace && file ){
            fileAndNamespaceMappingCached.set(file, namespace);
        }
    }

    addRouterConfig(module, method, path, action, params){
        const outputFolder = this.getModuleMappingFolder(module, 'router');
        if(!outputFolder)return;
        const className = this.getModuleNamespace(module, module.id, false);
        this.getRouterInstance().addItem( PATH.join(this.getOutputPath(), outputFolder), className, action, path, method, params);
    }

    addDependencyForComposer(identifier, version, env='prod'){
        composerDependencies.set(identifier, {name:identifier, version, env});
    }

    emitPackageDependencies(){
        const items = Array.from( composerDependencies.values() );
        const output = this.getComposerPath();
        const jsonFile = PATH.join(output, 'composer.json');
        const object = fs.existsSync( jsonFile ) ? require( jsonFile ) : {};
        items.forEach( item=>{
            const key = item.env ==='prod' ? 'require-dev' : 'require';
            if( !Object.prototype.hasOwnProperty(object, key) ){
                object[ key ] = {};
            }
            object[key][item.name] = item.version;
        });
        if( output ){
            this.emitFile( jsonFile , JSON.stringify(object) );
        }
    }

    emitManifest(){
        if( fileAndNamespaceMappingCached.size > 0 ){
            const items = [];
            const root = this.plugin.options.resolve.mapping.folder.root;
            const file  = PATH.isAbsolute(root) ? root : PATH.join(this.getOutputPath(), root, 'manifest.php');
            this.resolveSourceFileMappingPath( )
            fileAndNamespaceMappingCached.forEach( (ns,file)=>{
                items.push(`'${ns}'=>'${file}'`)
            });
            this.emitFile( file , `return [\r\n\t${items.join(',\r\n\t')}\r\n];`);
        }
    }

    emitSql(){
        const root = this.plugin.options.resolve.mapping.folder.root || '';
        const file  = PATH.isAbsolute(root) ? root : PATH.join(this.getOutputPath(), root, 'app.sql');
        this.emitFile(file,sqlInstance.toString());
    }

    getOutputPath(){
        return this.compiler.pathAbsolute( this.plugin.options.output || this.compiler.options.output );
    }

    getComposerPath(){
        return this.compiler.pathAbsolute( this.plugin.options.composer || this.plugin.options.output || this.compiler.options.output );
    }

    emitAssets(){
       staticAssets.emit( this.getOutputPath() );
    }

    emitContent(file, content, output=null){
        this.plugin.generatedCodeMaps.set(file, content);
        if(output){
            this.emitFile( output, content );
        }
    }

    emitFile(file, content){
        if( content=== null )return;
        var dir = file;
        const paths = [];
        while( dir && !fs.existsSync( dir = PATH.dirname(dir) ) ){
            paths.push( dir );
        }
        while( paths.length > 0 ){
            fs.mkdirSync( paths.pop() );
        }
        if( file.endsWith('.php') ){
            if( this.plugin.options.strict ){
                fs.writeFileSync(file, '<?php\r\ndeclare (strict_types = 1);\r\n'+content);
            }else{
                fs.writeFileSync(file, '<?php\r\n'+content);
            }
        }else{
            fs.writeFileSync(file, content);
        }
    }

    emitCopyFile(from, to){
        fs.createReadStream(from).pipe( fs.createWriteStream(to) );
    }

    buildForModule(compilation, stack, module){
        if( !this.make(compilation, stack, module) )return;
        this.getDependencies(module).forEach( depModule=>{
            if( this.isNeedBuild(depModule) && !this.buildModules.has(depModule) ){
                this.buildModules.add(depModule);
                const compilation = depModule.compilation;
                if( depModule.isDeclaratorModule ){
                    const stack = compilation.getStackByModule(depModule);
                    if( stack ){
                        this.buildForModule( compilation, stack, depModule );
                    }else{
                        throw new Error(`Not found stack by '${depModule.getName()}'`);
                    }
                }else{
                    this.buildForModule(compilation, compilation.stack, depModule);
                }
            }
        });
    }

    async buildIncludes(){
        const includes = this.plugin.options.includes || [];
        const files = [];
        const push = (file, readdir)=>{
            if(!file)return;
            if( fs.existsSync(file) ){
                const stat = fs.statSync( file );
                if(stat.isFile()){
                    files.push( file );
                }else if( readdir && stat.isDirectory() ){
                    resolve(file, readdir);
                }
            }
        };
        const resolve = (file,readdir)=>{
            if( file.endsWith('*') ){
                const resolveFile = this.compiler.getFileAbsolute( PATH.dirname(file), null, false );
                if(!resolveFile)return;
                readdir = readdir || file.endsWith('**');
                (this.compiler.callUtils('readdir',resolveFile,true)||[]).forEach( file=>{
                    push(file, !!readdir);
                });
            }else{
                const resolveFile = this.compiler.getFileAbsolute( file, null, false );
                push(resolveFile,!!readdir);
            }
        };
        includes.forEach( file=>resolve(file) );

        await Promise.allSettled(files.map( async file=>{
            if(!this.esSuffix.test( file ))return;
            const compilation = await this.compiler.createCompilation(file,null,true);
            if( compilation && !compilation.completed(this.plugin) ){
                await compilation.parserAsync();
                if( compilation.isDescriptorDocument() ){
                    compilation.modules.forEach( module=>{
                        const stack = compilation.getStackByModule(module);
                        if(stack){
                            this.buildForModule(compilation, stack, module);
                        }
                    });
                }else{
                    if(compilation.modules.size>0){
                        this.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift() );
                    }else{
                        this.buildForModule(compilation, compilation.stack );
                    }
                }
                compilation.completed(this.plugin,true);
            }else if(!compilation){
                this.emitCopyFile(file, this.getOutputAbsolutePath(file) );
            }
        }));
    }

    async start( done ){
        try{
            const compilation = this.compilation;
            if( compilation.isDescriptorDocument() ){
                compilation.modules.forEach( module=>{
                    const stack = compilation.getStackByModule(module);
                    if(stack){
                        this.buildForModule(compilation, stack, module);
                    }
                })
            }else{
                if( compilation.isCompilationGroup ){
                    compilation.children.forEach( compilation=>{
                        this.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift() );
                    });
                }else{
                    this.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift() );
                }
            }

            await this.buildIncludes();

            this.buildModules.forEach(module=>{
                module.compilation.completed(this.plugin,true);
            });

            this.getRouterInstance().create().forEach( item=>{
                this.emitFile(item.file, item.content);
            });
            this.emitSql();
            this.emitManifest();
            staticAssets.emit( (error)=>{
                compilation.completed(this.plugin,true);
                done( error ? error : null );
            });

        }catch(e){
            done(e);
        }
    }

    async build(done){
        const compilation = this.compilation;
        if( compilation.completed(this.plugin) ){
            return done(null, this);
        }
        try{
            compilation.completed(this.plugin,false);
            if( compilation.isDescriptorDocument() ){
                compilation.modules.forEach( module=>{
                    const stack = compilation.getStackByModule(module);
                    if(stack){
                        this.make(compilation, stack, module);
                    }
                });
            }else{
                this.make(compilation, compilation.stack, Array.from(compilation.modules.values()).shift() );
            }

            await this.buildIncludes();

            this.getRouterInstance().create().forEach( item=>{
                this.emitFile(item.file, item.content);
            });

            this.emitSql();
            this.emitManifest();

            staticAssets.emit( (error)=>{
                compilation.completed(this.plugin,true);
                done( error ? error : null );
            });

        }catch(e){
            done(e);
        }
    }

    make(compilation, stack, module){
        if(createAstStackCached.has(stack))return false;
        createAstStackCached.add( stack );

        const config = this.plugin.options;
        const isRoot = compilation.stack === stack;
        if( isRoot ){
            compilation.modules.forEach( module=>{
                this.getModuleAssets(module)
            });
            this.getProgramAssets(compilation);
        }else if( module ){
            this.getModuleAssets(module);
        }

        const ast = this.createAstToken(stack);
        const gen = ast ? this.createGenerator(ast, compilation, module) : null;

        if( gen ){
            const file = this.getModuleFile( module || compilation );
            const content = gen.toString();
            if( content ){
                this.emitContent(
                    file, 
                    content,  
                    config.emit ? this.getOutputAbsolutePath(module ? module : compilation.file, compilation) : null
                );
            }
        }

        compilation.children.filter( child=>{
            return child.import === 'reference';
        }).forEach( child=>{
            if( child !== compilation ){
                if( child.modules.size > 0 ){
                    this.make(child, child.stack, Array.from(child.modules.values()).shift() );
                }else{
                    this.make(child, child.stack);
                }
            }
        });

        return true;
    }

    isNeedBuild(module){
        if(!module || !this.compiler.callUtils('isTypeModule', module))return false;
        if( !this.compiler.isPluginInContext(this.plugin, module) ){
            return false;
        }
        return true;
    }

    isUsed(module, ctxModule){
        ctxModule = ctxModule || this.compilation;
        if( !module )return false;
        if( ctxModule && moduleDependencies.has(ctxModule) && moduleDependencies.get(ctxModule).has(module) ){
            return true;
        }
        return !!(this.compiler.callUtils("isTypeModule", module) && module.used);
    }

    getModuleById( id, flag=false ){
        return this.compilation.getModuleById(id, flag);
    }

    getGlobalModuleById( id ){
        return this.compilation.getGlobalTypeById(id);
    }

    isRuntime( name ){
        switch( name.toLowerCase() ){
            case "client" :
                return this.platform === "client";
            case  "server" :
                return this.platform === "server";
        }
        return false;
    }

    isSyntax( name ){
        return name.toLowerCase() === this.name;
    }

    isEnv(name, value){
        const metadata = this.plugin.options.metadata;
        const env = metadata.env || {};
        if( value !== void 0 ){
            return env[name] === value;
        }
        return false;
    }

    isVersion(name, version, operator='elt'){
        const metadata = this.plugin.options.metadata;
        const right = String(metadata[name] || '0.0.0').trim();
        const left = String(version || '0.0.0').trim();
        const rule = /^\d+\.\d+\.\d+$/;
        if( !rule.test(left) || !rule.test(right) ){
            console.warn('Invalid version. in check metadata');
            return false;
        }
        return this.isCompareVersion(left, right, operator);
    }

    isCompareVersion(left, right, operator='elt'){
        operator = operator.toLowerCase();
        if( operator === 'eq' && left == right)return true;
        left = String(left).split('.',3).map( val=> parseInt(val) );
        right = String(right).split('.',3).map( val=> parseInt(val) );
        for(let i=0;i<left.length;i++){
            let l = left[i] || 0;
            let r = right[i] || 0;
            if( operator === 'eq' && l != r ){
                return false;
            }else if( operator === 'gt' && !(l > r) ){
                return false;
            }else if( operator === 'egt' && !(l >= r) ){
                return false;
            }else if( operator === 'lt' && !(l < r) ){
                return false;
            }else if( operator === 'elt' && !(l <= r) ){
                return false;
            }else if( operator === 'neq' && !(l != r) ){
                return false;
            }
        }
        return true;
    }

    getOutputAbsolutePath(module, compilation){
        if(outputAbsolutePathCached.has(module)){
            return outputAbsolutePathCached.get(module);
        }
        const config = this.plugin.options;
        const suffix = config.suffix||".php";
        const workspace = config.workspace || this.compiler.workspace;
        const output = this.getOutputPath();
        const isStr = typeof module === "string";
        if( !module )return output;
        const folder = isStr ? this.getSourceFileMappingFolder(module, compilation) : this.getModuleMappingFolder( module );
        if( !isStr && module && module.isModule ){
            if( module.isDeclaratorModule ){
                const polyfillModule = Polyfill.modules.get( module.getName() );
                const filename = module.id+suffix;
                if( polyfillModule ){
                    return this.compiler.normalizePath( PATH.join(output,(folder||polyfillModule.namespace||config.ns).replace(/\./g,'/'),filename) );
                }
                return this.compiler.normalizePath( PATH.join(output, (folder ? folder : module.getName("/"))+suffix) );
            }else if( module.compilation.isDescriptorDocument() ){
                return this.compiler.normalizePath( PATH.join(output, (folder ? folder : module.getName("/"))+suffix) );
            }
        }
        let filepath = '';
        if( isStr ){
            filepath = PATH.resolve(output, folder ? PATH.join(folder, PATH.parse(module).name+suffix) : PATH.relative( workspace, module ) );
        }else if( module && module.isModule && module.compilation.modules.size===1 && this.compiler.normalizePath(module.file).includes(workspace) ){
            filepath = PATH.resolve(output, folder ? PATH.join(folder, module.id+suffix) : PATH.relative( workspace, module.file ) );
        }else if(module && module.isModule){
            filepath = PATH.join(output, folder ? PATH.join(folder, module.id+suffix) : module.getName("/")+suffix );
        }
        const info = PATH.parse(filepath);
        if( info.ext === '.es' ){
            filepath = PATH.join(info.dir, info.name+suffix);
        }
        filepath = this.compiler.normalizePath(filepath);
        outputAbsolutePathCached.set(module,filepath);
        return filepath;
    }

    recursionModule(module, callback, imps=false){
        var current = module; 
        while( current && current.isModule ){
            let res = callback(current);
            if( res !== false ){
                return res;
            }
            if(imps){
                for(var i=0; i<module.implements.length ;i++){
                    let res = this.recursionModule(module.implements[i], callback, true);
                    if( res !== false ){
                        return res;
                    }
                }
            }
            current = current.inherit;
        }
        return false;
    }

    findDefineAnnotationForType(annotations){
        if(!annotations)return null;
        const annotation = annotations.find( annotation=>{
            if( annotation.name.toLowerCase()==='define' ){
                const args = annotation.getArguments();
                if( args[0] ){
                    return String(args[0].key).toLowerCase() === 'type' && args[0].value;
                }
            }
            return false;
        });
        if( annotation ){
            const args = annotation.getArguments();
            const resolveType = args[0].value;
            if( resolveType ){
                return resolveType.toLowerCase();
            }
        }
        return null;
    }

    resolveModuleType(module){
        if( resolveModuleTypeCached.has( module ) ){
            return resolveModuleTypeCached.get( module );
        }
        const resolve = !module.isModule && module.stack ? this.findDefineAnnotationForType(module.stack.annotations) : this.recursionModule(module,(current)=>{
            const stack = this.compilation.getStackByModule( current );
            if( stack ){
                const annotation = this.findDefineAnnotationForType(stack.annotations);
                if( annotation ){
                    return annotation;
                }
            }
            return false;
        },true);
        switch( resolve ){
            case 'controller' : 
                resolveModuleTypeCached.set( module, Builder.MODULE_TYPE_CONTROLLER );
                break;
            case 'model' : 
                resolveModuleTypeCached.set( module, Builder.MODULE_TYPE_MODEL );
                break;
            case 'asset' : 
                resolveModuleTypeCached.set( module, Builder.MODULE_TYPE_ASSET );
                break;
            case 'config' : 
                resolveModuleTypeCached.set( module, Builder.MODULE_TYPE_CONFIG );
                break;
            case 'lang' : 
                resolveModuleTypeCached.set( module, Builder.MODULE_TYPE_LANG );
                break;
            default :
                resolveModuleTypeCached.set( module, Builder.MODULE_TYPE_UNKNOWN );
        }
        return resolveModuleTypeCached.get( module );
    }

    resolveModuleTypeName(module){
        switch( this.resolveModuleType(module) ){
            case Builder.MODULE_TYPE_CONTROLLER :
                return 'controller';
            case Builder.MODULE_TYPE_MODEL :
                return 'model';
            case Builder.MODULE_TYPE_ASSET :
                return 'asset';
            case Builder.MODULE_TYPE_CONFIG :
                return 'config';
            case Builder.MODULE_TYPE_LANG :
                return 'lang';
        }
        return '*';
    }

    checkResolveRuleMatch(rule, relative, type, fileExt, fileName, delimiter='/'){
        let test = rule.test;
        if( test.charCodeAt(0) ===46 ){
            test = test.substring(1);
        }
        if( test.charCodeAt(0) ===47 ){
            test = test.substring(1);
        }

        if( type ){
            let match = '::'+type;
            let len = match.length;
            if( test.slice( -len ) !== match )return false;
            test = test.slice(0, -len);
        }

        if( fileExt ){
            let suffixPos = test.lastIndexOf('.');
            if( suffixPos>0  ){
                const ruleSuffix = test.slice( suffixPos );
                if( ruleSuffix !=='.*' && test.slice( suffixPos ) !== fileExt )return false;
                test = test.slice(0, suffixPos);
            }else{
                if( test.slice(-1) !== '*' )return false;
                test = test.slice(0, -1);
            }
        }

        if( fileName ){
            let filenamePos = test.lastIndexOf('/');
            if( test.slice( filenamePos+1 ) === fileName ){
                test = filenamePos >=0 ? test.slice(0, filenamePos) : '';
            }else{
                let token = test.slice(-1);
                if( !(token === '*') )return false;
                test = test.slice(0, -1);
            }
            if( test.charCodeAt(test.length-1)===47 ){
                test = test.slice(0,-1);
            }
        }

        if( !relative && !test ){
            return [[], []];
        }

        const segments = test.split('/');
        const parts = relative.split( delimiter );
        let rest = false;
        const flag = segments.every( (seg,index)=>{
            if( !seg && !test)return true;
            if( seg.includes('**') ){
                rest= true;
                return true;
            }
            return seg === '*' || parts[index] === seg;
        });
        const count = rest ? segments.length - 1 :  segments.length;
        if( count > parts.length )return false;
        if( flag ){
            if( rest ){
                return [segments, parts];
            }else if( segments.length === parts.length ){
                return [segments, parts];
            }
        }
        return false;
    }

    getSourceFileMappingFolder(file, compilation){
        if( this.plugin.options.assets.test(file) ){
            return this.resolveSourceFileMappingPath(file, this.plugin.options.resolve.mapping.folder, 'asset');
        }else{
            var type = 'general';
            if( compilation && file === compilation.file && compilation.stack){
                const annotation = this.findDefineAnnotationForType( compilation.stack.annotations );
                if( annotation ){
                    type = annotation;
                }
            }
            return this.resolveSourceFileMappingPath(file, this.plugin.options.resolve.mapping.folder, type);
        }
    }

    getModuleMappingFolder(module, typeName=null){
        if( module && module.isModule ){
            typeName = typeName || this.resolveModuleTypeName(module);
            let file = module.compilation.file;
            if( module.isDeclaratorModule ){
                let ns = module.namespace.parent ? module.namespace : null;
                if( (!typeName || typeName ==='*') && !ns ){
                    typeName = 'global';
                }
                if( ns ){
                    file = module.namespace.getChain().join('/') + module.id+PATH.extname(file);
                    
                }else{
                    file =  module.id+PATH.extname(file);
                }
            }
            return this.resolveSourceFileMappingPath(file, this.plugin.options.resolve.mapping.folder, typeName);
        }
        return null;
    }

    getModuleMappingNamespace(module){
        if(!module || !module.isModule)return null;
        var ns = module.id;
        var assignment = null;
        if( module.isDeclaratorModule ){
            const polyfill = this.getPolyfillModule( module.getName() );
            if( polyfill ){
                assignment = polyfill.namespace || this.plugin.options.ns;
                ns = [assignment, polyfill.export || module.id].join('.');
            }else{
                ns = module.getName();
            }
        }else{
            ns = module.getName();
        }

        if( ns ){
            const result = this.geMappingNamespace(ns, module);
            if( result )return result;
        }

        if( this.plugin.options.resolve.useFolderAsNamespace ){
            const folder = this.getModuleMappingFolder(module);
            if( folder ){
                return folder.replace(/[\.\\\\/]/g, '\\');
            }
        }

        if( assignment ){
            return assignment.replace(/\./g, '\\');
        }
        return null;
    }

    geMappingNamespace(ns, module){
        const namespace = this.plugin.options.resolve.mapping.namespace;
        if( !namespace.explicit ){
            for(let rule of namespace.rules){
                if( rule.vague > 0 || rule.dynamic){
                    const result = this.checkResolveRuleMatch(rule, ns, null, null, null, '.');
                    if( result ){
                        if( !rule.dynamic )return rule.value;
                        const [segments, parts] = result;
                        const restMatchPos = segments.findIndex( seg=> seg.includes('**') );
                        parts.pop();
                        return rule.segments.map( (item)=>{
                            if( item.includes('%') ){
                                return item.split('%').slice(1).map( key=>{
                                    if( key.includes('...') && restMatchPos >= 0 ){
                                        const range = restMatchPos === segments.length-1 ? parts.slice(restMatchPos, parts.length) : 
                                        parts.slice(restMatchPos, parts.length-(segments.length-restMatchPos));
                                        let startIndex = 0;
                                        let endIndex = range.length;
                                        if( key !== '...' ){
                                            let [start,end] = key.split('...').map( val=>parseInt(val) );
                                            if( start > 0 )startIndex = start;
                                            if( end > 0 )endIndex = end;
                                        }
                                        return range.slice(startIndex,endIndex).join('\\');
                                    }
                                    return parts[key] || null;
                                }).filter( item=>!!item ).join('');
                            }
                            return item;
                        }).filter(item=>!!item).join('\\');
                    }
                }else if(rule.raw === ns){
                    return rule.value;
                }
            }
        }else if( hasOwn.call(namespace.map, ns) ){
            return namespace.map[ns].value;
        }
        return null;
    }

    getModuleMappingRoute(module, data={}){
        if( module && module.isModule && !module.isDeclaratorModule ){
            if( this.resolveModuleType(module) !== Builder.MODULE_TYPE_CONTROLLER )return null;
            return this.resolveSourceFileMappingPath(module.compilation.file, this.plugin.options.resolve.mapping.route, 'controller', '/', data)
        }
        return null;
    }

    resolveSourceFileMappingPath(file, mapping, type, delimiter='/', dataset={}){
        if(!mapping || !file)return null;
        const rules = mapping.rules;
        if( !rules.length )return null;
        const isAbsolute = PATH.isAbsolute( file );
        const fileInfo = PATH.parse( file );
        const workspace = this.compiler.options.workspace;
        file = isAbsolute ? PATH.relative(workspace, fileInfo.dir) : file;
        const relative = this.compiler.normalizePath( file.replace(/^[\.\\\/]+/,'') );
        for( let rule of rules ){
            const result = this.checkResolveRuleMatch( rule, relative, type, fileInfo.ext, fileInfo.name );
            if( result ){
                const value = rule.value;
                if( !rule.dynamic )return value;
                const [segments, parts] = result;
                const restMatchPos = segments.findIndex( seg=> seg.includes('**') );
                return rule.segments.map( (item)=>{
                    if( item.includes('%') ){
                        return item.split('%').slice(1).map( key=>{
                            if( key.includes('...') && restMatchPos >= 0 ){
                                const range = restMatchPos === segments.length-1 ? parts.slice(restMatchPos, parts.length) : 
                                parts.slice(restMatchPos, parts.length-(segments.length-restMatchPos));
                                let startIndex = 0;
                                let endIndex = range.length;
                                if( key !== '...' ){
                                   let [start,end] = key.split('...', 2).map( val=>parseInt(val) );
                                   if( start > 0 )startIndex = start;
                                   if( end > 0 )endIndex = end;
                                }
                                return range.slice(startIndex,endIndex).join( delimiter );
                            }else if( key==='filename'){
                                return fileInfo.name;
                            }else if( key==='ext' ){
                                return fileInfo.ext;
                            }else if( key ==='classname' || key ==='method' ){
                                return dataset[key] || null;
                            }
                            return parts[key] || null;
                        }).filter( item=>!!item ).join('');
                    }
                    return item;
                }).filter(item=>!!item).join( delimiter );
            }
        }
    }

    getOutputRelativePath(module,context){
        const contextPath = this.getOutputAbsolutePath(context);
        const modulePath  = this.getOutputAbsolutePath(module);
        return this.compiler.normalizePath('/'+PATH.relative( PATH.dirname(contextPath), modulePath ) );
    }

    getFileRelativePath(currentFile, destFile){
        return this.compiler.normalizePath( '/'+PATH.relative( PATH.dirname(currentFile), destFile ) );
    }

    getFileRelativeOutputPath(module){
        const modulePath  = this.getOutputAbsolutePath(module);
        return this.compiler.normalizePath( '/'+PATH.relative(this.getOutputPath(), modulePath) );
    }

    getIdByModule( module ){
        const file = ( typeof module ==='string' ? module : this.getModuleFile(module) ).replace(/\\/g,'/');
        if( !moduleIdMap.has(file) ){
            moduleIdMap.set(file,moduleIdMap.size);
        }
        return moduleIdMap.get(file);
    }

    getIdByNamespace( namespace ){
        if( !namespaceMap.has(namespace) ){
            namespaceMap.set(namespace,namespaceMap.size);
        }
        return namespaceMap.get(namespace);
    }

    addDepend( depModule, ctxModule ){
        ctxModule = ctxModule || this.compilation;
        if( !depModule.isModule || depModule === ctxModule )return;
        if( !this.compiler.callUtils("isTypeModule", depModule) )return;
        var dataset = moduleDependencies.get(ctxModule);
        if( !dataset ){
            moduleDependencies.set( ctxModule, dataset = new Set() );
        }
        dataset.add( depModule );
    }

    getDependencies( ctxModule ){
        ctxModule = ctxModule || this.compilation;
        const compilation = this.compiler.callUtils("isTypeModule", ctxModule) ? this.compilation : ctxModule;
        const dataset = moduleDependencies.get(ctxModule);
        if( !dataset ){
            return compilation.getDependencies(ctxModule);
        }
        if( !dataset._merged ){
            dataset._merged = true;
            compilation.getDependencies(ctxModule).forEach( dep=>{
                dataset.add(dep);
            });
        }
        return Array.from( dataset.values() );
    }

    getPolyfillModule(id){
        return Polyfill.modules.get( id );
    }
    
    isActiveForModule(depModule,ctxModule){
        ctxModule = ctxModule || this.compilation;
        if( depModule && depModule.isStructTable ){
            return false;
        }
        const isUsed = this.isUsed(depModule, ctxModule);
        if( !isUsed )return false;
        const isRequire = this.compiler.callUtils("isLocalModule", depModule);         
        const isPolyfill = depModule.isDeclaratorModule && !!this.getPolyfillModule( depModule.getName() );
        if(isRequire || isPolyfill){
            return true;
        }
        return false;
    }

    isReferenceDeclaratorModule( depModule,ctxModule ){
        if( depModule && depModule.isDeclaratorModule ){

            if( depModule.isStructTable ){
                return false;
            }

            const disuse = this.plugin.options.resolve.disuse;
            if( this.checkModulePresetState(depModule,disuse) ){
                return false;
            }

            const using = this.plugin.options.resolve.using;
            if( this.checkModulePresetState(depModule,using) ){
                return true;
            }
        }
        return false;
    }

    checkModulePresetState(module, setting){
        if( !setting.explicit ){
            for(let rule of setting.rules){
                if( rule.vague > 0 ){
                    const result = this.checkResolveRuleMatch(rule, module.getName(), null, null, null, '.');
                    if( result ){
                       return true;
                    }
                }else if(rule.raw === module.getName() ){
                    return true;
                }
            }
        }else if( hasOwn.call(setting.map, module.getName()) ){
            return true;
        }
        return false;
    }

    getModuleFile(module, uniKey, type, resolve){
        return this.compiler.normalizeModuleFile(module, uniKey, type, resolve);
    }

    getAssetFileReferenceName(module, file){
        const asset = staticAssets.getAsset(file);
        if( asset ){
            return asset.getAssetFilePath();
        }
        return '';
    }

    getModuleReferenceName(module,context){
        context = context || this.compilation;
        if( !module )return null;
        if( context ){
            if( context.isDeclaratorModule ){
                const polyfill = this.getPolyfillModule( context.getName() );
                if( polyfill && polyfill.require.includes( module.getName() ) ){
                    return module.export;
                }
            }

            if( module === context ){
                return module.id 
            }

            if( context.importAlias && context.importAlias.has(module) ){
                return context.importAlias.get(module);
            }

            if( module.required || context.imports && context.imports.has( module.id ) ){
                return module.id;
            }

            const deps = moduleDependencies.get( context );
            if( deps && deps.has(module) ){
                return module.id;
            }

        }
        return this.getModuleNamespace(module, module.id, false);
    }

    getModuleNamespace(module, suffix=null, imported=true){
        if(!module)return '';
        let folder = this.getModuleMappingNamespace( module );
        if(folder){
            if( suffix ){
               return '\\'+folder+'\\'+suffix;
            }
            return folder;
        }
        if(module.namespace && module.namespace.isNamespace ){
            const items = module.namespace.getChain();
            if( items.length > 0 || !imported ){
                if( suffix ){
                    return '\\'+items.concat( suffix ).join('\\');
                }
                return items.join('\\');
            }
        }
        return !imported && suffix ? '\\'+suffix : '';
    }

    getProgramAssets(){
        const dataset = new Map();
        const config = this.plugin.options;
        const externals = config.externals;
        const assets = this.compilation.assets;
        const add = item=>{
            const source = item.getResolveFile(true);
            if( this.plugin.options.assets.test(source) ){
                if(item.specifiers && item.specifiers.length > 0){
                    const local = item.specifiers[0].value();
                    this.staticAssets.create(source, item.source.value(), local);
                }else{
                    this.staticAssets.create(source, item.source.value(), null);
                }
            } 
        };
        (this.compilation.imports || []).forEach( add );
        (this.compilation.externals || []).forEach( add );
        this.crateAssetItems(null, dataset, assets, externals, this.compilation);
        return Array.from( dataset.values() );
    }

    crateAssetItems(module, dataset, assets, externals, context){
        assets.forEach( asset=>{
            if( asset.file ){
                const external = externals && asset.file ? externals.find( name=>asset.file.indexOf(name)===0 ) : null;
                if( !external ){
                    const object = staticAssets.create(asset.resolve, asset.file, asset.assign, module||context);
                    dataset.add(object);
                }
            }else if( asset.type ==="style" ){
                const file = this.getModuleFile(module||context, asset.id, asset.type||'css', asset.resolve);
                const object = staticAssets.create(file, null, null, module||context);
                object.setContent(asset.content);
                dataset.add(object);
            }
        });
    }

    getModuleAssets(module, dataset, excludes){
        if(!module || !module.isModule)return [];
        dataset = dataset || new Set();
        excludes = excludes || new WeakSet();
        const config = this.plugin.options;
        const assets = module.assets;
        const externals = config.externals;
        const compilation = module.compilation;
        if( assets ){
           this.crateAssetItems(module, dataset , assets, externals);
        }
        if( compilation.modules.size > 1 ){
            if( Array.from( compilation.modules.values() )[0] === module ){
                this.crateAssetItems(module, dataset, compilation.assets, externals);
            }
        }else{
            this.crateAssetItems(module, dataset, compilation.assets, externals);
        }

        const requires = module.requires;
        if( requires && requires.size > 0 ){
            requires.forEach( item=>{
                const external = externals && item.from ? externals.find( name=>item.from.indexOf(name)===0 ) : null;
                const object = staticAssets.create(item.resolve, external || item.from, item.key, module);
                if( item.extract ){
                    object.extract = true;
                    object.local = item.name;
                    if( item.name !== item.key ){
                        data.imported = item.key;
                    }
                }
                dataset.add(object);
            });
        }

        excludes.add(module);
        this.getDependencies( module ).forEach( dep=>{
            if( !excludes.has(dep) ){
                if( !this.isActiveForModule(dep, module) && this.isUsed(dep) ){
                    this.getModuleAssets(dep, dataset, excludes);
                }
            }
        });
        
        return dataset;
    }

    isImportExclude(source){
        const excludes = this.plugin.options.resolve.excludes;
        if( excludes && excludes.length > 0 ){
            const isModule = typeof source !== 'string' && source.isModule ? true : false;
            source = String(isModule ? source.getName() : source);
            if( excludes.some( rule=>rule instanceof RegExp ? rule.test(source) : source === rule ) ){
                return true;
            }
        }
        return false;
    }

    getModuleImportSource(source,module){
        const config = this.plugin.options;
        const isString = typeof source === 'string';
        if( config.useAbsolutePathImport ){
            return isString ? source : this.getOutputAbsolutePath(source);
        }
        return module ? this.getOutputRelativePath(source, module) : source;
    }

    getAvailableOriginType( type ){
        if( type ){
            const originType = this.compiler.callUtils('getOriginType', type);
            switch( originType.id ){
                case 'String' :
                case 'Number' :
                case 'Array' :
                case 'Function' :
                case 'Object' :
                case 'Boolean' :
                case 'RegExp' :
                    return originType.id;
                case 'Uint' :
                case 'Int' :
                case 'Float' :
                case 'Double' :
                    return 'Number';
                default :
            }
        }
        return null;
    }

    createAstToken( stack ){
        return this.createToken( stack );
    }

    createGenerator(ast, compilation, module ){
        const gen = new Generator(compilation.file);
        gen.builder = this;
        gen.make( ast );
        return gen;
    }

    getGlobalModules(){
        if(this._globalModules)return this._globalModules;
        return this._globalModules = ['Array','Object','Boolean','Math','Number','String','Console'].map( name=>{
            return this.compilation.getGlobalTypeById(name);
        });
    }
}

module.exports = Builder;