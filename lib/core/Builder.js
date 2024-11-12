import Utils from "easescript/lib/core/Utils";
import Context from "./Context";
import Generator from "./Generator";
import {isVModule,getVirtualModuleManager, VirtualModule} from "./VirtualModule";
import {createESMExports, createESMImports ,callAsyncSequence} from "./Common"
import {getVariableManager} from '@easescript/transform/lib/core/Variable';
import {getBuildGraphManager} from '@easescript/transform/lib/core/BuildGraph';
import {getAssetsManager, Asset} from "@easescript/transform/lib/core/Asset";
import {getCacheManager} from "@easescript/transform/lib/core/Cache";
import * as tokens from '../tokens';
import Glob from "glob-path";

async function buildProgram(ctx, compilation, graph){
    let root = compilation.stack;
    if(!root){
        throw new Error('Build program failed')
    }

    let body = [];
    let externals = [];
    let imports = [];
    let exports = [];
    let emitFile = ctx.options.emitFile;

    ctx.setNode(root, body);

    root.body.forEach( item=>{
        if( item.isClassDeclaration || 
            item.isEnumDeclaration || 
            item.isInterfaceDeclaration || 
            item.isStructTableDeclaration || 
            item.isPackageDeclaration )
        {
            const child = ctx.createToken(item);
            if(child){
                body.push(child);
            }
        }
    });

    if(root.imports && root.imports.length > 0){
        root.imports.forEach( item=>{
            if(item.isImportDeclaration){
                ctx.createToken(item)
            }
        });
    }

    if( root.externals.length > 0 ){
        root.externals.forEach( item=>{
            if(item.isImportDeclaration){
                ctx.createToken(item)
            }else{
                const node = ctx.createToken(item);
                if(node){
                    externals.push(node);
                }
            }
        });
    }

    if( root.exports.length > 0 ){
        root.exports.forEach( item=>{
            ctx.createToken(item);
        });
    }

    ctx.removeNode(root);

    if(emitFile){
        await ctx.buildDeps();
    }

    ctx.crateRootAssets();
    ctx.createAllDependencies();

    let exportNodes = null
    let importNodes = null
    importNodes = createESMImports(ctx, ctx.imports)
    exportNodes = createESMExports(ctx, ctx.exports, graph)

    imports.push(...importNodes, ...exportNodes.imports);
    body.push(...exportNodes.declares)
    exports.push(...exportNodes.exports)

    let generator = new Generator(ctx);
   
    let doc = compilation.mainModule || compilation;
    let mainModule = compilation.mainModule;
    let layout = [
        ...imports,
        ...Array.from(ctx.usings.values()),
        ...ctx.statments,
        ...ctx.beforeBody,
        ...body,
        ...ctx.afterBody,
        ...externals,
        ...exports,
    ];
    
    if(mainModule){
        let ns = mainModule.namespace;
        ns = ctx.getModuleMappingNamespace(mainModule) || ns.getChain().join("\\");
        if(ns){
            layout.unshift(ctx.createNamespaceStatement(ns));
        }
    }

    if(layout.length>0){
        layout.forEach(item=>generator.make(item));
        if(ctx.options.strict){
            graph.code = '<?php\r\ndeclare (strict_types = 1);\r\n'+generator.code;
        }else{
            graph.code = '<?php\r\n'+generator.code;
        }
        graph.sourcemap = generator.sourceMap;
        if(emitFile){
            graph.outfile = ctx.getOutputAbsolutePath(doc)
        }
    }
    return graph;
}

async function buildAssets(ctx, buildGraph){
    let assets = buildGraph.assets;
    if(!assets)return;
    await Promise.all(
        Array.from(assets.values()).map( asset=>asset.build(ctx))
    );
}

function getTokenManager(options){
    let _createToken = options.transform.createToken;
    let _tokens = options.transform.tokens;
    let getToken = (type)=>{
        return tokens[type];
    }
    let createToken = (ctx, stack, type)=>{
        const token = getToken(type);
        if(!token){
            throw new Error(`Token '${type}' is not exists.`);
        }
        try{
            return token(ctx, stack, type)
        }catch(e){
            console.error(e)
        }
    }

    if(_tokens && typeof _tokens ==='object' && Object.keys(_tokens).length>0){
        getToken = (type)=>{
            if(Object.prototype.hasOwnProperty.call(_tokens, type)){
                return _tokens[type]
            }
            return tokens[type];
        }
    }
    if(_createToken && typeof _createToken ==='function' ){
        createToken = (ctx, stack, type)=>{
            try{
                return _createToken(ctx, stack, type)
            }catch(e){
                console.error(e)
            }
        }
    }
    return {
        get:getToken,
        create:createToken
    }
}

function addResolveRule(glob, resolve){
    Object.keys(resolve.namespaces).forEach( key=>{
        glob.addRuleGroup(key, resolve.namespaces[key],'namespaces');
    });

    Object.keys(resolve.folders).forEach( key=>{
        glob.addRuleGroup(key, resolve.folders[key], 'folders');
    });

    const trueCallback=()=>true;
    if(Array.isArray(resolve.usings)){
        resolve.usings.forEach( key=>{
            if(typeof key ==='object'){
                if(key.test === void 0 || key.value === void 0){
                    throw new TypeError(`options.resolve.usings the each rule item should is {test:'rule', value:true} object`)
                }else{
                    if(typeof key.value === 'function'){
                        glob.addRuleGroup(key.test, key.value, 'usings');
                    }else{
                        glob.addRuleGroup(key.test, ()=>key.value, 'usings');
                    }
                }
            }else{
                glob.addRuleGroup(key, trueCallback, 'usings');
            }
        });
    }else{
        Object.keys(resolve.usings).forEach( key=>{
            if(typeof resolve.usings[key] ==='function'){
                glob.addRuleGroup(key, resolve.usings[key], 'usings');
            }else{
                throw new TypeError(`options.resolve.usings the '${key}' rule, should assignmented a function`)
            }
        });
    }
}


function createBuildContext(plugin, records=new Map()){
    let assets = getAssetsManager(Asset)
    let virtuals = getVirtualModuleManager(VirtualModule)
    let variables = getVariableManager();
    let graphs = getBuildGraphManager();
    let token = getTokenManager(plugin.options);
    let cache = getCacheManager();
    let glob = new Glob();
    addResolveRule(glob, plugin.options.resolve || {});

    async function builder(compiOrVModule){
        
        if(records.has(compiOrVModule)){
            return records.get(compiOrVModule);
        }

        let ctx = new Context(
            compiOrVModule,
            plugin,
            variables,
            graphs,
            assets,
            virtuals,
            glob,
            cache,
            token
        );

        let buildGraph = ctx.getBuildGraph(compiOrVModule);
        records.set(compiOrVModule, buildGraph);
        
        if(isVModule(compiOrVModule)){
            await compiOrVModule.build(ctx,buildGraph);
        }else{
            if(!compiOrVModule.parserDoneFlag){
                await compiOrVModule.ready();
            }
            await buildProgram(ctx, compiOrVModule, buildGraph);
        }

        if(ctx.options.emitFile){
            await ctx.emit(buildGraph);
            await buildAssets(ctx, buildGraph, true);
        }else{
            const deps = ctx.getAllDependencies();
            deps.forEach(dep=>{
                if(Utils.isModule(dep) && dep.isStructTable){
                    dep.getStacks().forEach(stack=>{
                        ctx.createToken(stack)
                    })
                }
            });
            await buildAssets(ctx, buildGraph);
        }
        return buildGraph;
    }

    async function buildDeps(ctx){
        const deps = new Set()
        ctx.dependencies.forEach(dataset=>{
            dataset.forEach(dep=>{
                if(Utils.isModule(dep)){
                    if(dep.isDeclaratorModule){
                        dep = ctx.getVModule(dep.getName())
                        if(dep){
                            deps.add(dep)
                        }
                    }else if(dep.compilation){
                        deps.add(dep.compilation)
                    }
                }else if(isVModule(dep)){
                    deps.add(dep)
                }else if(Utils.isCompilation(dep)){
                    deps.add(dep)
                }
            })
        });
        await callAsyncSequence(Array.from(deps.values()), async(dep)=>{
            await builder(dep)
        });
    }

    return {
        builder,
        buildDeps,
        buildAssets,
        assets,
        virtuals,
        variables,
        graphs,
        glob,
        token
    }
}

export {
    buildProgram,
    createBuildContext
}