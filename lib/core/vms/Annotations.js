import {VirtualModule} from "../VirtualModule";
class Annotations extends VirtualModule{
    async build(ctx){
        const graph = ctx.getBuildGraph(this.bindModule||this)
        if(!this.changed && graph.code)return graph;
        this.changed = false;
        this.createImports(ctx)
        this.createReferences(ctx, graph)
        let body = [];
        ctx.createAllDependencies();
        graph.code = this.gen(ctx, body).code;
        graph.sourcemap = this.getSourcemap();
        if(ctx.options.emitFile){
            graph.outfile=ctx.getOutputAbsolutePath(this);
        }
        return graph;
    }
}
export default Annotations;