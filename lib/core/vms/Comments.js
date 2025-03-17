import { merge, createModuleReferenceNode } from "../Common";
import {VirtualModule} from "../VirtualModule";
class Comments extends VirtualModule{
    #dataset = Object.create(null)
    get after(){
        return true;
    }

    append(ctx, object){
        let result = {changed:false};
        merge(this.#dataset, object, result);
        if(result.changed){
            this.changed = true;
            ctx.addBuildAfterDep(this);
        }
    }

    makeMapping(ctx){
        const make = (obj)=>{
            if(Array.isArray(obj)){
                return ctx.createArrayExpression(
                    obj.map(item=>make(item))
                );
            }else{
                const type = typeof obj
                if(type === 'number' || type==='boolean' || type==='string'){
                    return ctx.createLiteral(obj);
                }else if(type==="object"){
                    return ctx.createObjectExpression(
                        Object.keys(obj).map(
                            key=>ctx.createProperty(
                                ctx.createLiteral(key),
                                make(obj[key])
                            )
                        )
                    );
                }
            }
        }
        let object = this.#dataset;
        let mappings = Object.keys(object).map(
            key=>ctx.createProperty(
                ctx.createLiteral(key),
                make(object[key])
            )
        );
        let node = ctx.createPropertyDefinition( ctx.createIdentifier('metadata'), ctx.createObjectExpression(mappings));
        node.kind = 'const';
        node.modifier = ctx.createIdentifier('private')
        return node;
    }

    makeGetAllClasses(ctx){
        let node = ctx.createMethodDefinition('getAllClass',ctx.createBlockStatement([
            ctx.createChunkExpression(`return array_keys(static::metadata)`, false, true),
        ]));
        node.modifier = ctx.createIdentifier('public')
        node.static = true;
        return node;
    }

    makeGetCommentWrapper(ctx){
        let node = ctx.createMethodDefinition('getWrapper',ctx.createBlockStatement([
            ctx.createChunkExpression(`static $instances = []`, true, true),
            ctx.createChunkExpression(`if(isset($instances[$className]))return $instances[$className]`, true, true),
            ctx.createChunkExpression(`$metadata = static::metadata[$className] ?? null`, true, true),
            ctx.createChunkExpression(`if($metadata==null)return null`,true, true),
            ctx.createExpressionStatement(
                ctx.createAssignmentExpression(
                    ctx.createVarIdentifier('instance'),
                    ctx.createNewExpression(
                        createModuleReferenceNode(ctx, null, 'manifest.MetadataWrapper'), 
                        [
                            ctx.createVarIdentifier('metadata')
                        ]
                    )
                )
            ),
            ctx.createExpressionStatement(
                ctx.createAssignmentExpression(
                    ctx.createComputeMemberExpression([
                        ctx.createVarIdentifier('instances'),
                        ctx.createVarIdentifier('className')
                    ]),
                    ctx.createVarIdentifier('instance')
                )
            ),
            ctx.createReturnStatement(ctx.createVarIdentifier('instance'))
        ]),[
            ctx.createVarIdentifier('className')
        ]);
        node.modifier = ctx.createIdentifier('public')
        node.static = true;
        return node;
    }

    makeAll(ctx){
        let node = ctx.createMethodDefinition('getMetadata',ctx.createBlockStatement([
            ctx.createReturnStatement(
                ctx.createStaticMemberExpression([
                    ctx.createIdentifier('static'),
                    ctx.createIdentifier('metadata')
                ]) 
            )
        ]));
        node.modifier = ctx.createIdentifier('public')
        node.static = true;
        return node;
    }

    async build(ctx, graph){
        graph = graph || ctx.getBuildGraph(this)
        if(!this.changed && graph.code)return graph;
        this.changed = false;
        this.createImports(ctx)
        this.createReferences(ctx, graph)

        let outfile =  graph.outfile || ctx.getOutputAbsolutePath(this);
        let node = ctx.createClassDeclaration();
        
        node.id = ctx.createIdentifier('Comments');
        node.body.body.push(...[
            this.makeMapping(ctx),
            this.makeAll(ctx),
            this.makeGetAllClasses(ctx),
            this.makeGetCommentWrapper(ctx)
        ]);

        let body = [node];
        ctx.createAllDependencies();
        graph.code = ctx.getFormatCode(this.gen(ctx, graph, body).code)
        graph.outfile=outfile;



        if(ctx.options.emitFile){
            await ctx.emit(graph);
        }
        return graph;
    }
}
export default Comments;