import {VirtualModule} from "../VirtualModule";
class Annotation extends VirtualModule{
    #added = new Map()
    #builded = false;
    append(ctx, hashId, path){
        if(!this.#added.has(hashId)){
            this.#added.set(hashId,path);
            this.changed = true;
            if(this.#builded){
                this.build(ctx);
            }
        }
    }

    makeManifestPropertyNode(ctx, outfile){
        let manifests =[]
        this.#added.forEach( (path, hashId)=>{
            let relativePath = ctx.getRelativePath(path, outfile);
            let filepath = ctx.createBinaryExpression(
                ctx.createIdentifier('__DIR__'),
                ctx.createLiteral(relativePath),
                '.'
            );
            manifests.push(
                ctx.createProperty(
                    ctx.createLiteral(hashId),
                    filepath
                )
            )
        });
        let node = ctx.createPropertyDefinition( ctx.createIdentifier('manifests'), ctx.createObjectExpression(manifests));
        node.kind = 'const';
        node.modifier = ctx.createIdentifier('private')
        return node;
    }

    makeGetContentMethodNode(ctx){
        let node = ctx.createMethodDefinition('get',ctx.createBlockStatement([
            ctx.createExpressionStatement(
                ctx.createAssignmentExpression(
                    ctx.createVarIdentifier('path'),
                    ctx.createCallExpression(
                        ctx.createStaticMemberExpression([
                            ctx.createIdentifier('static'),
                            ctx.createIdentifier('path')
                        ]),
                        [
                            ctx.createVarIdentifier('id')
                        ]
                    )
                )
            ),
            ctx.createReturnStatement( ctx.createConditionalExpression(
                ctx.createVarIdentifier('path'),
                ctx.createCallExpression(
                    ctx.createIdentifier('file_get_contents'),
                    [
                        ctx.createVarIdentifier('path')
                    ]
                ),
                ctx.createLiteral(null)
            ))
        ]),[
            ctx.createVarIdentifier('id')
        ]);
        node.modifier = ctx.createIdentifier('public')
        node.static = true;
        return node;
    }

    makeGetPathMethodNode(ctx){
        let node = ctx.createMethodDefinition('path',ctx.createBlockStatement([
            ctx.createReturnStatement( ctx.createBinaryExpression(ctx.createComputeMemberExpression([
                ctx.createStaticMemberExpression([
                    ctx.createIdentifier('static'),
                    ctx.createIdentifier('manifests')
                ]),
                ctx.createVarIdentifier('id')
            ]), ctx.createLiteral(null), '?:'))
        ]),[
            ctx.createVarIdentifier('id')
        ]);
        node.modifier = ctx.createIdentifier('public')
        node.static = true;
        return node;
    }

    makeGetAllMethodNode(ctx){
        let node = ctx.createMethodDefinition('all',ctx.createBlockStatement([
            ctx.createReturnStatement(
                ctx.createCallExpression(
                    ctx.createIdentifier('array_values'),
                    [
                        ctx.createStaticMemberExpression([
                            ctx.createIdentifier('static'),
                            ctx.createIdentifier('manifests')
                        ])
                    ]
                )
            )
        ]));
        node.modifier = ctx.createIdentifier('public')
        node.static = true;
        return node;
    }

    async build(ctx){
        const graph = ctx.getBuildGraph(this.bindModule||this)
        if(!this.changed && graph.code)return graph;
        this.changed = false;
        this.createImports(ctx)
        this.createReferences(ctx, graph)
        let outfile =  graph.outfile || ctx.getOutputAbsolutePath(this);
        let node = ctx.createClassDeclaration();
        node.id = ctx.createIdentifier('Annotation');
        node.body.body.push(...[
            this.makeManifestPropertyNode(ctx, outfile),
            this.makeGetContentMethodNode(ctx),
            this.makeGetPathMethodNode(ctx),
            this.makeGetAllMethodNode(ctx)
        ]);

        let body = [node];
        ctx.createAllDependencies();
        graph.code = ctx.getFormatCode(this.gen(ctx, graph, body).code)
        graph.outfile=outfile;
        return graph;
    }
}
export default Annotation;