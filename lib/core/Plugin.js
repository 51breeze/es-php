import Diagnostic from 'easescript/lib/core/Diagnostic'
import {getOptions, Plugin as BasePlugin, execute, getAllPlugin} from "@easescript/transform/lib/index";
import {createBuildContext} from "./Builder";
import {createPolyfillModule} from '@easescript/transform/lib/core/Polyfill';
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

    async init(){
        this.#context = createBuildContext(this, this.records);
        createPolyfillModule(
            path.join(__dirname, "./polyfills"),
            this.#context.virtuals.createVModule
        );
        Object.keys(vms).forEach(key=>{
            let vm = this.#context.virtuals.createVModule(key, vms[key])
            this.#context.addBuildAfterDep(vm);
        });
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