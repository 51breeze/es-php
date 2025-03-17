import Diagnostic from 'easescript/lib/core/Diagnostic'
import {getOptions, Plugin as BasePlugin, execute, getAllPlugin} from "@easescript/transform/lib/index";
import {createBuildContext, getTokenManager} from "@easescript/transform/lib/core/Builder";
import {createPolyfillModule} from '@easescript/transform/lib/core/Polyfill';
import {buildProgram, addResolveRule} from "./Builder";
import {getVirtualModuleManager, VirtualModule} from "./VirtualModule";
import {getAssetsManager, Asset} from "./Asset";
import Context from "./Context";
import Generator from "./Generator";
import * as tokens from '../tokens';
import vms from './vms';
import path from "path";

Diagnostic.register("php", (definer)=>{
    definer(
        20000,
        '类(%s)命名空间必须与文件路径一致',
        "The '%s' class namespace must be consistent with the file path"
    );
});

class Plugin extends BasePlugin{
    
    #context = null;
    get context(){
        return this.#context;
    }

    getWidget(name){
        if(name==="context")return Context;
        if(name==="assets")return getAssetsManager(Asset);
        if(name==="virtual")return getVirtualModuleManager(VirtualModule);
        if(name==="token")return getTokenManager(this.options, tokens);
        if(name==="generator")return Generator;
        if(name==="program")return buildProgram;
    }

    async init(){
        if(this.#context)return;
        this.#context = createBuildContext(this, this.records);
        createPolyfillModule(
            path.join(__dirname, "./polyfills"),
            this.#context.virtuals.createVModule
        );
        Object.keys(vms).forEach(key=>{
            let vm = this.#context.virtuals.createVModule(key, vms[key])
            this.#context.addBuildAfterDep(vm);
        });
        addResolveRule(this.#context.glob, this.options.resolve || {});
        process.nextTick(()=>{
            this.buildIncludes();
        })
    }

    async buildIncludes(){
        const includes = this.options.includes || [];
        if(!(includes.length>0))return;
        const files = includes.map( file=>this.complier.resolveRuleFiles(file) ).flat().filter(file=>this.complier.checkFileExt(file));
        await Promise.allSettled(files.map( async file=>{
            const compilation = await this.complier.createCompilation(file,null,true);
            if(compilation){
                await compilation.ready();
                await this.build(compilation);
            }
        }));
    }
}

export {getOptions, Plugin, execute, getAllPlugin}

export default Plugin;