import path from 'path';
import Compilation from 'easescript/lib/core/Compilation'
import BasePlugin, {getAllPlugin} from "@easescript/transform/lib/core/Plugin";
import {createBuildContext} from "./Builder";
import {getAllBuilder} from "@easescript/transform/lib/core/TableBuilder";
import vms from './vms';
import { createPolyfillModule } from '@easescript/transform/lib/core/Polyfill';
import { nextTick } from 'process';

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
    #records = null;
    #initialized = false;
    #context = null;
    #complier = null;

    constructor(name, version, options={}){
        super(name, version, options)
    }

    get complier(){
        return this.#complier;
    }

    get context(){
        return this.#context;
    }

    init(complier){
        if(!this.#initialized){
            this.#initialized = true;
            this.#complier = complier;
            this.#records = new Map();
            defineError(complier);
            if(this.options.mode==='development'){
                let tableBuilders = null;
                complier.on('onChanged', (compilation)=>{
                    this.#records.delete(compilation)
                    let mainModule = compilation.mainModule;
                    if(mainModule.isStructTable){
                        tableBuilders = tableBuilders || getAllBuilder();
                        compilation.modules.forEach(module=>{
                            if(module.isStructTable){
                                tableBuilders.forEach(builder=>{
                                    builder.removeTable(module.id)
                                })
                            }
                        })
                    }
                });
            }

            let context = createBuildContext(this, this.#records)
            this.#context = context;

            createPolyfillModule(
                path.join(__dirname, "./polyfills"),
                context.virtuals.createVModule
            );

            Object.keys(vms).forEach(key=>{
               let vm = context.virtuals.createVModule(key, vms[key])
               context.addBuildAfterDep(vm);
            });

            //this.buildIncludes();
        }
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

    async done(){
    }

    async run(compilation){
        if(!Compilation.is(compilation)){
            throw new Error('compilation is invalid')
        }
        if(!this.#initialized){
            this.init(compilation.complier)
        }
        let result = await this.#context.buildDeps(compilation)
        await this.done();
        return result;
    }

    async build(compilation, vmId){
        if(!Compilation.is(compilation)){
            throw new Error('compilation is invalid')
        }
        if(!this.#initialized){
            this.init(compilation.complier)
        }
        if(vmId){
            let vm = this.#context.virtuals.getVModule(vmId);
            if(vm){
                compilation = vm;
            }else{
                throw new Error(`The '${vmId}' virtual module does not exists.`)
            }
        }
        let result = await this.#context.build(compilation);
        await this.done();
        return result;
    }
}

export {getAllPlugin, Plugin}

export default Plugin;