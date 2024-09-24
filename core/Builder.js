const fs = require("fs-extra");
const crypto = require('crypto');
const Generator = require("./Generator");
const Token = require("./Token");
const Polyfill = require("./Polyfill");
const VirtualModule = require("./VirtualModule");
const PATH = require("path");
const Sql = require("./Sql");
const Manifest = require("./Manifest");
const Composer = require("./Composer");
const staticAssets = require("./Assets");
const moduleIdMap=new Map();
const namespaceMap=new Map();
const outputAbsolutePathCached = new Map();
const fileContextScopes = new Map();
const uniqueFileRecords = new Map();

VirtualModule.createVModule((module)=>{
    const data = {};
    staticAssets.getAssets().forEach( asset=>{
        const item = {};
        const content = asset.getContent();
        item.path=asset.getResourcePath();
        if(content){
            item.content = content.replace(/(?<!\\)\u0027/g,"\\'")
        }
        data[asset.getResourceId()]=item;
    });
    const items = [];
    Object.keys(data).forEach((key)=>{
        const item = data[key];
        const properties = Object.keys(item).map(name=>{
            return `'${name}'=>'${item[name]}'`
        });
        items.push(`'${key}'=>[\n\t\t\t\t${properties.join(',\n\t\t\t\t')}\n\t\t\t]`)
    });
    const content = `[\n\t\t\t${items.join(',\n\t\t\t')}\n\t\t]`;
    const ns = module.nsId ? `namespace ${module.nsId};` : '';
    const top = [];
    if(ns)top.push(ns);
    return top.concat([
        `class ${module.id}{`,
        `\tstatic function get(string $id, string $name='path'){`,
        `\t\t$assets = static::getAssets();`,
        `\t\treturn $assets[$id][$name] ?? null;`,
        `\t}`,
        `\tstatic function getAssets(){`,
        `\t\tstatic $assets=${content};`,
        `\t\treturn $assets;`,
        `\t}`,
        `}`
    ]).join('\n');

},'Assets', 'asset');

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
        this.fileContextScopes = fileContextScopes;
        this.checkRuntimeCache = new Map();
        this.checkPluginContextCache = new Map();
        this.moduleDependencies = new Map();
        this.createAstStackCached = new WeakSet();
    }

    getVirtualModule(name){
        return VirtualModule.getVModule(name);
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
        return crypto.createHash('md5').update(str).digest('hex').substring(0,8);
    }

    addSqlTableNode(module, node, stack){
        Sql.add(module, node, stack);
    }

    hasSqlTableNode(module){
        return Sql.has(module);
    }

    getRouterInstance(){
        return null
    }

    addFileAndNamespaceMapping(file, namespace, module){
        if( namespace && file ){
            Manifest.add(module, file, namespace);
        }
    }

    addDependencyForComposer(name, version, env='prod'){
        Composer.add(this, name, version, env);
    }

    emitPackageDependencies(){
        if(!Composer.isEmpty()){
            const output = this.getComposerPath();
            const jsonFile = PATH.join(output, 'composer.json');
            const object = fs.existsSync( jsonFile ) ? require( jsonFile ) : {};
            Composer.make(object);
            if( output ){
                this.emitFile(jsonFile , JSON.stringify(object) );
            }
        }
    }

    async emitManifest(){
        if(!Manifest.isEmpty() && Manifest.changed){
            let file = 'manifest.php';
            let folder = this.plugin.resolveSourceId('manifest.php', 'folders') || '.';
            file  = PATH.isAbsolute(folder) ? PATH.join(folder,file) : PATH.join(this.getOutputPath(), folder, file);
            this.emitFile(file, Manifest.emit());
        }
    }

    async emitSql(){
        if(!Sql.isEmpty() && Sql.changed){
            let file = 'app.sql';
            let folder = this.plugin.resolveSourceId(file, 'folders') || '.';
            file = PATH.isAbsolute(folder) ? PATH.join(folder,file) : PATH.join(this.getOutputPath(), folder, file);
            this.emitFile(file,Sql.emit());
        }
    }

    async emitAssets(){
        const error = await staticAssets.instance.emitAsync(this.getPublicPath());
        if(error){
            console.error(error);
        }
    }

    getPublicPath(){
        const value = this.__publicPath;
        if(value)return value;
        let publicPath = this.plugin.options.publicPath || 'public';
        if( !PATH.isAbsolute(publicPath) ){
            publicPath = PATH.join(this.getOutputPath(), publicPath)
        }
        return this.__publicPath = this.compiler.normalizePath(publicPath);
    }

    getOutputPath(){
        const value = this.__outputPath;
        if(value)return value;
        return this.__outputPath = this.compiler.pathAbsolute(this.plugin.options.output);
    }

    getComposerPath(){
        return this.compiler.pathAbsolute( this.plugin.options.composer || this.plugin.options.output);
    }

    emitContent(file, content, output=null){
        this.plugin.generatedCodeMaps.set(file, content);
        if(output){
            this.emitFile( output, content );
        }
    }

    emitFile(file, content){
        if( content=== null )return;
        fs.mkdirSync(PATH.dirname(file),{recursive: true});
        const config = this.plugin.options;
        const suffix = config.suffix||".php";
        if( file.endsWith(suffix) ){
            if( config.strict ){
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

    buildForVirtualModule(module, compilation){
        if(module.using)return;
        module.nsId = this.getModuleNamespace(module);
        module.outpath = this.getOutputAbsolutePath(module, compilation);
        module.context = this;
        module.using = true;
        module.emitFile = (content)=>{
            if( content ){
                const file = `virtual:${module.getName()}`;
                const config = this.plugin.options;
                this.emitContent(
                    file, 
                    content,  
                    config.emit ? module.outpath : null
                );
            }
        }
        module.make();
    }

    buildForModule(compilation, stack, module, cache=new WeakSet()){
        if(!compilation)return;
        if( module){
            if(this.buildModules.has(module)){
                return;
            }
            this.buildModules.add(module);
        }

        if(cache.has(module||compilation))return;
        cache.add(module||compilation)

        this.make(compilation, stack, module);
        this.getDependencies(module).forEach( depModule=>{
            if( this.isNeedBuild(depModule, module) ){
                if(depModule.isVirtualModule){
                    this.buildForVirtualModule(depModule, compilation);
                }else{
                    const compi = depModule.compilation;
                    const builder = this.plugin.getBuilder(compi);
                    if( depModule.isDeclaratorModule ){
                        const stack = compi.getStackByModule(depModule);
                        if( stack ){
                            builder.buildForModule( compi, stack, depModule, cache);
                        }else{
                            throw new Error(`Not found stack by '${depModule.getName()}'`);
                        }
                    }else{
                        builder.buildForModule(compi, compi.stack, depModule, cache);
                    }
                }
            }
        });
    }

    async buildAfter(){}

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
                        const builder = this.plugin.getBuilder(compilation);
                        builder.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift() );
                    });
                }else{
                    this.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift() );
                }
            }
            await this.emitSql();
            await this.emitManifest();
            await this.emitAssets();
            await this.buildAfter();
            done(null, this);
        }catch(e){
            done(e, this);
        }
    }

    async build(done){
        if(this.__buildDone){
            done(null, this);
            return;
        }
        const compilation = this.compilation;
        try{
            if( compilation.isDescriptorDocument() ){
                compilation.modules.forEach( module=>{
                    const stack = compilation.getStackByModule(module);
                    if(stack){
                        this.make(compilation, stack, module);
                        this.buildModules.add(module);
                    }
                });
            }else{
                const module = compilation.mainModule || Array.from(compilation.modules.values()).shift();
                this.make(compilation, compilation.stack, module);
                this.buildModules.add(module);
            }
            await this.emitSql();
            await this.emitManifest();
            await this.emitAssets();
            await this.buildAfter();
            this.__buildDone = true;
            done(null, this);
        }catch(e){
            done(e, this);
        }
    }

    make(compilation, stack, module){
        if(!stack || module && module.isVirtualModule)return false;
        if(this.createAstStackCached.has(stack))return false;
        this.createAstStackCached.add( stack );
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
                const builder = this.plugin.getBuilder(child);
                if( child.modules.size > 0 ){
                    const module = child.mainModule || Array.from(child.modules.values()).shift();
                    builder.make(child, child.stack, module);
                }else{
                    builder.make(child, child.stack);
                }
            }
        });

        return true;
    }

    isNeedBuild(module, ctxModule){
        if(!module || !(module.isVirtualModule || this.compiler.callUtils('isTypeModule', module)))return false;
        if(module.isStructTable)return true;
        if( !this.isActiveForModule(module, ctxModule) )return false;
        if( !this.isPluginInContext(module) ){
            return false;
        }
        return true;
    }

    isPluginInContext(module){
        if(module && module.isVirtualModule)return true;
        if(this.checkPluginContextCache.has(module)){
            return this.checkPluginContextCache.get(module);
        }
        let result = true;
        if(module && module.isModule && !this.checkRuntimeModule(module) ){
            result = false;
        }else{
            result = this.compiler.isPluginInContext(this.plugin, module||this.compilation);
        }
        this.checkPluginContextCache.set(module, result);
        return result;
    }

    checkRuntimeModule(module){
        if(this.checkRuntimeCache.has(module)){
            return this.checkRuntimeCache.get(module);
        }
        const result = this.checkAnnotationBuildTactics(this.getModuleAnnotations(module, ['runtime', 'syntax']));
        this.checkRuntimeCache.set(module, result);
        return result;
    }

    checkAnnotationBuildTactics(items){
        if( !items || !items.length )return true;
        return items.every( item=>{
            const name = item.name.toLowerCase();
            if(!['runtime', 'syntax','env','version'].includes(name)){
                return true;
            }
            const args = item.getArguments();
            const indexes = name==='version' ? [,,,'expect'] : (name==='env' ? [,,'expect'] : [,'expect']);
            const _expect = this.getAnnotationArgument('expect', args, indexes, true);
            const value = args[0].value;
            const expect = _expect ? String(_expect.value).trim() !== 'false' : true;
            switch( name ){
                case "runtime" :
                    return this.isRuntime(value) === expect;
                case "syntax" :
                    return this.isSyntax(value) === expect;
                case "env" :{
                    const name = this.getAnnotationArgument('name', args, ['name','value'], true);
                    const value = this.getAnnotationArgument('value', args, ['name','value'], true);
                    if(value && name){
                        return this.isEnv(name.value, value.value) === expect;
                    }else{
                        item.error(`Missing name or value arguments. the '${item.name}' annotations.`);
                    }
                }
                case 'version' :{
                    const name = this.getAnnotationArgument('name', args, ['name','version','operator'], true);
                    const version = this.getAnnotationArgument('version', args, ['name','version','operator'], true);
                    const operator = this.getAnnotationArgument('operator', args, ['name','version','operator'], true);
                    if(name && version){
                        return this.isVersion(name.value, version.value, operator ? operator.value : 'elt') === expect;
                    }else{
                        item.error(`Missing name or version arguments. the '${item.name}' annotations.`);
                    }
                }
            }
            return true;
        });
    }

    getModuleAnnotations(module, allows = ['get','post','put','delete','option','router'], inheritFlag=true){
        if(!module||!module.isModule||!module.isClass)return [];
        const stacks = module.getStacks();
        let _result = [];
        for(let i=0;i<stacks.length;i++){
            const stack = stacks[i];
            let annotations = stack.annotations;
            if(annotations){
                const result = annotations.filter( annotation=>allows.includes(annotation.name.toLowerCase()));
                if( result.length>0 ){
                    _result = result;
                    break;
                }
            }
        }
        if( !_result ){
            const impls = module.extends.concat( module.implements || [] );
            if( impls.length>0 && inheritFlag){
                for(let b=0;b<impls.length;b++){
                    const inherit = impls[b];
                    if( inherit !== module ){
                        const result = this.getModuleAnnotations(inherit, allows, inheritFlag);
                        if(result.length>0){
                            _result = result;
                            break;
                        }
                    }
                }
            }
        }
        return _result;
    }

    getAnnotationArgument(name, args=[], indexes=[], lowerFlag=false){
        let index = args.findIndex(item=>lowerFlag ? String(item.key).toLowerCase() === name : item.key===name);
        if( index < 0 ){
            index = indexes.indexOf(name);
            if( index>= 0 ){
                const arg = args[index];
                return arg && !arg.assigned ? arg : null;
            }
        }
        return args[index] || null;
    }

    isUsed(module, ctxModule){
        ctxModule = ctxModule || this.compilation;
        if( !module )return false;
        if( ctxModule && this.moduleDependencies.has(ctxModule) && this.moduleDependencies.get(ctxModule).has(module) ){
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
        const metadata = this.plugin.options.metadata || {};
        switch( name.toLowerCase() ){
            case "client" :
                return (metadata.platform || this.platform) === "client";
            case  "server" :
                return (metadata.platform || this.platform) === "server";
        }
        return false;
    }

    isSyntax( name ){
        return name && name.toLowerCase() === this.name;
    }

    isEnv(name, value){
        const metadata = this.plugin.options.metadata;
        const env = metadata.env || {};
        if( value !== void 0 ){
            if(name.toLowerCase()==='mode'){
                if(this.plugin.options.mode === value || env.NODE_ENV===value){
                    return true;
                }
            }
            return env[name] === value;
        }
        return false;
    }

    isVersion(name, version, operator='elt', flag=false){
        const metadata = this.plugin.options.metadata;
        const right = String(metadata[name] || '0.0.0').trim();
        const left = String(version || '0.0.0').trim();
        const rule = /^\d+\.\d+\.\d+$/;
        if( !rule.test(left) || !rule.test(right) ){
            console.warn('Invalid version. in check metadata');
            return false;
        }
        if( flag ){
            return this.isCompareVersion(right, left, operator);
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
        const origin = isStr ? module : module.file;
        if( !module )return output;
        const folder = isStr ? this.getSourceFileMappingFolder(module) : this.getModuleMappingFolder(module);
        let result = null;
        if( !isStr && module && module.isModule && !module.isVirtualModule){
            if( module.isDeclaratorModule ){
                const polyfillModule = Polyfill.modules.get( module.getName() );
                const filename = module.id+suffix;
                if( polyfillModule ){
                    return this.compiler.normalizePath( PATH.join(output,(folder||polyfillModule.namespace),filename) );
                }
                result = this.compiler.normalizePath( PATH.join(output, (folder ? folder : module.getName("/"))+suffix) );
            }else if( module.compilation.isDescriptorDocument() ){
                result = this.compiler.normalizePath( PATH.join(output, (folder ? folder : module.getName("/"))+suffix) );
            }
        }
        if( result === null ){
            let filepath = '';
            if( isStr ){
                filepath = PATH.resolve(output, folder ? PATH.join(folder, PATH.parse(module).name+suffix) : PATH.relative( workspace, module ) );
            }else if(module){
                if(module.isVirtualModule){
                    filepath = PATH.join(output, folder ? PATH.join(folder, module.file) : module.file );
                }else if( module.isModule && module.compilation.modules.size===1 && this.compiler.normalizePath(module.file).includes(workspace) ){
                    filepath = PATH.resolve(output, folder ? PATH.join(folder, module.id+suffix) : PATH.relative(workspace, module.file) );
                }else if(module.isModule){
                    filepath = PATH.join(output, folder ? PATH.join(folder, module.id+suffix) : module.getName("/")+suffix );
                }
            }
            const info = PATH.parse(filepath);
            if( this.compiler.isExtensionName(info.ext)){
                this.compiler.options.extensions.includes(info.ext)
                filepath = PATH.join(info.dir, info.name+suffix);
            }
            filepath = this.compiler.normalizePath(filepath);
            result = filepath;
        }

        let old = uniqueFileRecords.get(result);
        if(old && old !== origin){
            let index = 0;
            let _info = PATH.parse(result);
            while(index<10){
                index++;
                result = this.compiler.normalizePath(_info.dir +'/'+ (_info.name+index) + _info.ext);
                if(!uniqueFileRecords.has(result)){
                    break;
                }
            }
        }else{
            uniqueFileRecords.set(result, origin);
        }
        outputAbsolutePathCached.set(module,result);
        return result;
    }

    getSourceFileMappingFolder(file){ 
        return this.resolveSourceFileMappingPath(file, 'folders');
    }

    getModuleMappingFolder(module){
        if( module && module.isModule ){
            let file = module.isVirtualModule ? module.file : module.compilation.file;
            if( module.isDeclaratorModule ){
                file = module.getName('/');
                const compilation = module.compilation;
                if(compilation){
                    if(compilation.isGlobalFlag && compilation.pluginScopes.scope ==='global'){
                        file += '.global';
                    }
                }
            }
            return this.resolveSourceFileMappingPath(file,'folders');
        }
        return null;
    }

    getModuleMappingNamespace(module){
        if(!module || !module.isModule)return null;
        let ns = module.id;
        let assignment = null;
        if(module.isDeclaratorModule){
            const polyfill = this.getPolyfillModule(module.getName());
            if( polyfill ){
                assignment = (polyfill.namespace ? polyfill.namespace : '').replace(/[\\\\.]/g, '/');
                ns = [assignment, polyfill.export || module.id].filter(Boolean).join('/');
            }else{
                ns = module.getName('/');
            }
            const compilation = module.compilation;
            if(compilation){
                if(compilation.isGlobalFlag && compilation.pluginScopes.scope ==='global'){
                    ns += '.global';
                }
            }
            
        }else{
            ns = module.getName('/');
        }

        if(ns){
            const result = this.getMappingNamespace(ns);
            if(result)return result;
        }

        if( this.plugin.options.folderAsNamespace ){
            const folder = this.getModuleMappingFolder(module);
            if(folder){
                return folder.replace(/[\\\\/]/g, '\\');
            }
        }
        if( assignment ){
            return assignment.replace(/[\\\\/]/g, '\\');
        }
        return null;
    }

    getMappingNamespace(id){
        return this.plugin.resolveSourceId(id, 'namespaces')
    }

    resolveSourceFileMappingPath(file, type='folders'){
        return this.plugin.resolveSourceId(file, type)
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
        if( !(depModule.isModule || depModule.isVirtualModule) || depModule === ctxModule )return;
        let isModule = this.compiler.callUtils("isTypeModule", depModule);
        if(!depModule.isVirtualModule && !isModule )return;
        if(this.compilation.mainModule === depModule)return;
        if(!this.compilation.isDescriptorDocument() && this.compilation.modules.has(depModule.getName()))return;
        var dataset = this.moduleDependencies.get(ctxModule);
        if( !dataset ){
            this.moduleDependencies.set( ctxModule, dataset = new Set() );
        }
        if(isModule){
            depModule = depModule.type();
        }
        dataset.add(depModule);
    }

    getDependencies( ctxModule ){
        ctxModule = ctxModule || this.compilation;
        let compilation = this.compilation;
        if(!compilation){
            compilation = ctxModule.compilation;
        }
        if(!compilation)return [];
        let dataset = this.moduleDependencies.get(ctxModule);
        if( !dataset ){
            return []
            //return compilation.getDependencies(ctxModule);
        }
        // if( !dataset._merged ){
        //     dataset._merged = true;
        //     compilation.getDependencies(ctxModule).forEach( dep=>{
        //         dataset.add(dep);
        //     });
        // }
        return Array.from( dataset.values() );
    }

    getPolyfillModule(id){
        return Polyfill.modules.get(id);
    }
    
    isActiveForModule(depModule,ctxModule){
        ctxModule = ctxModule || this.compilation;
        if( depModule && depModule.isStructTable ){
            return false;
        }
        const isUsed = this.isUsed(depModule, ctxModule);
        if(!isUsed)return false;
        if(depModule.isVirtualModule)return true;
        if(depModule.isDeclaratorModule){
            return !!this.getPolyfillModule(depModule.getName());
        }else{
            return !this.compiler.callUtils("checkDepend", ctxModule, depModule);
        }
    }

    isReferenceDeclaratorModule(depModule){
        if( depModule && depModule.isDeclaratorModule ){
            if( depModule.isStructTable ){
                return false;
            }
            if( this.plugin.resolveSourcePresetFlag(depModule.getName('/'), 'usings') ){
                return true;
            }
        }
        return false;
    }

    getModuleFile(module, uniKey, type, resolve){
        return this.compiler.normalizeModuleFile(module, uniKey, type, resolve);
    }

    getAssetFileReferenceName(module, file){
        const asset = staticAssets.getAsset(file);
        if( asset ){
            return asset.getResourcePath();
        }
        return '';
    }

    getAsset(file){
        return staticAssets.getAsset(file);
    }

    getModuleUsingAliasName(module,context){
        if(!context || !this.compiler.callUtils('isModule', context))return null;
        const alias = context.getModuleAlias(module)
        if(alias){
            return alias;
        }
        // if(context.imports && context.imports.has(module.id)){
        //     if(context.imports.get(module.id) !== module){
        //         return '__'+module.getName('_');
        //     } 
        // }
        return null;
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
                if(context.imports.get( module.id ) !== module ){
                   return '__'+module.getName('_');
                }
                return module.id;
            }

            const deps = this.moduleDependencies.get( context );
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
        }else if(module.isVirtualModule && module.ns){
            if(suffix){
                return module.ns.split('.').concat(suffix).join('\\');
            }
            return module.ns.split('.').join('\\');
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
                    staticAssets.create(source, item.source.value(), local, this.compilation, this);
                }else{
                    staticAssets.create(source, item.source.value(), null, this.compilation, this);
                }
            } 
        };
        (this.compilation.stack.imports || []).forEach( add );
        (this.compilation.externals || []).forEach( add );
        this.crateAssetItems(null, dataset, assets, externals, this.compilation);
        return Array.from( dataset.values() );
    }

    crateAssetItems(module, dataset, assets, externals, context){
        assets.forEach( asset=>{
            if( asset.file ){
                const external = externals && asset.file ? externals.find( name=>asset.file.indexOf(name)===0 ) : null;
                if( !external ){
                    const object = staticAssets.create(asset.resolve, asset.file, asset.assign, module||context, this);
                    dataset.add(object);
                }
            }else if( asset.type ==="style" ){
                const file = this.getModuleFile(module||context, asset.id, asset.type||'css', asset.resolve);
                const object = staticAssets.create(file, null, null, module||context, this);
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
            if( compilation.mainModule === module ){
                this.crateAssetItems(module, dataset, compilation.assets, externals);
            }
        }else{
            this.crateAssetItems(module, dataset, compilation.assets, externals);
        }

        const requires = module.requires;
        if( requires && requires.size > 0 ){
            requires.forEach( item=>{
                const external = externals && item.from ? externals.find( name=>item.from.indexOf(name)===0 ) : null;
                const object = staticAssets.create(item.resolve, external || item.from, item.key, module, this);
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
        const excludes = this.plugin.options.excludes;
        if( excludes && excludes.length > 0 ){
            let file = source;
            let className = '';
            let test = (rule)=>{
                if(rule===file||rule===className)return true;
                if(rule instanceof RegExp){
                    if(rule.test(file))return true;
                    return className ? rule.test(className) : false;
                }
                return false;
            }
            if(typeof source !== 'string'){
                file = '';
                if(source.isModule){
                    file = source.file;
                    className = source.getName('/');
                }
            }
            if(excludes.some(test)){
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
        return this._globalModules = ['Array','Object','Boolean','Math','Number','String'].map( name=>{
            return this.compilation.getGlobalTypeById(name);
        });
    }
}

module.exports = Builder;