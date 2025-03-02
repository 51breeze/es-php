import Compilation from 'easescript/lib/core/Compilation'
import {getOptions, Plugin as BasePlugin} from "@easescript/transform/lib/index";
import {createBuildContext} from "./Builder";
import {createPolyfillModule} from '@easescript/transform/lib/core/Polyfill';
import vms from './vms';
import path from "path";

function defineError(complier){
    if(defineError.loaded || !complier || !complier.diagnostic)return;
    defineError.loaded=true;
    let define = complier.diagnostic.defineError
    define(20000,'',[
        '类(%s)命名空间必须与文件路径一致',
        "The '%s' class namespace must be consistent with the file path"
    ]);
}

class Plugin extends BasePlugin{
    
    #context = null;
    get context(){
        return this.#context;
    }

    async init(){
        defineError(this.complier);
        this.#context = createBuildContext(this, this.records);
        createPolyfillModule(
            path.join(__dirname, "./polyfills"),
            this.#context.virtuals.createVModule
        );
        Object.keys(vms).forEach(key=>{
            let vm = this.#context.virtuals.createVModule(key, vms[key])
            this.#context.addBuildAfterDep(vm);
        });
        //this.buildIncludes();
    }

    async buildIncludes(){
        const includes = this.options.includes || [];
        if(!(includes.length>0))return;
        const files = includes.map( file=>this.complier.resolveRuleFiles(file) ).flat().filter(file=>this.complier.checkFileExt(file));
        await Promise.allSettled(files.map( async file=>{
            const compilation = await this.complier.createCompilation(file,null,true);
            if(compilation){
                await compilation.ready();
            }
        }));
    }

    async run(compilation){
        if(!Compilation.is(compilation)){
            throw new Error('compilation is invalid')
        }
        if(!this.initialized){
            await this.beforeStart(compilation.compiler);
        }
        return await this.#context.buildDeps(compilation);
    }

    async build(compilation, vmId){
        if(!Compilation.is(compilation)){
            throw new Error('compilation is invalid')
        }
        if(!this.initialized){
            await this.beforeStart(compilation.compiler);
        }
        if(vmId){
            let vm = this.#context.virtuals.getVModule(vmId);
            if(vm){
                compilation = vm;
            }else{
                throw new Error(`The '${vmId}' virtual module does not exists.`)
            }
        }
        return await this.#context.build(compilation);
    }
}

export {getOptions, Plugin}

export default Plugin;