import {VirtualModule as BaseVirtualModule, getVirtualModuleManager, isVModule} from "@easescript/transform/lib/core/VirtualModule";
import {createESMImports,createESMExports} from './Common.js';
import Generator from "./Generator";
class VirtualModule extends BaseVirtualModule{
    #disableUse = false;
    constructor(id, ns, file){
        super(id, ns, file)
        if(id==="ESX" && ns && ns[0]==='web'){
            this.#disableUse = true;
        }
    }

    get disableUse(){
        return this.#disableUse;
    }

    gen(ctx, graph, body=[]){
        let imports = [];
        let exports = [];
        let exportNodes = null
        let importNodes = null
        importNodes = createESMImports(ctx, ctx.imports)
        exportNodes = createESMExports(ctx, ctx.exports, graph)
        imports.push(...importNodes, ...exportNodes.imports);
        body.push(...exportNodes.declares)
        exports.push(...exportNodes.exports)
        const generator = new Generator(ctx, false)
        const layout = [
            ...imports,
            ...Array.from(ctx.usings.values()),
            ...ctx.statments,
            ctx.createChunkExpression(this.getContent()),
            ...body,
            ...exports
        ];
        
        let ns = this.ns;
        ns = ctx.getModuleMappingNamespace(this.bindModule||this) || ns.join("\\");
        if(ns){
            layout.unshift(ctx.createNamespaceStatement(ns))
        }
        
        layout.forEach(item=>generator.make(item));
        return generator;
    }

    setContent(value){
        value = String(value).replace(/^([\s\r\n]+)?<\?php/, '')
        super.setContent(value);
    }

    async build(ctx, graph){
        graph = graph || ctx.getBuildGraph(this)
        const module = this.bindModule;
        let emitFile = ctx.options.emitFile;
        if(!this.changed && graph.code)return graph;
        this.changed = false;
        this.createImports(ctx)
        this.createReferences(ctx)
        let body = [];
        if(module){
            ctx.createModuleImportReferences(module);
        }
        ctx.createAllDependencies();
        graph.code = ctx.getFormatCode(this.gen(ctx, graph, body).code);
        graph.sourcemap = this.getSourcemap();
        if(emitFile){
            graph.outfile=ctx.getOutputAbsolutePath(module||this);
        }
        return graph;
    }
}

export {
    getVirtualModuleManager,
    isVModule,
    VirtualModule
}