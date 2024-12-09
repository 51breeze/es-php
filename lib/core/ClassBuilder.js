import {createHash} from 'crypto';
import {addAnnotationManifest, createMainAnnotationNode} from "./Common";
class ClassBuilder{

    constructor(stack){
        this.stack = stack;
        this.compilation = stack.compilation;
        this.module =  stack.module;
        this.body = [];
        this.beforeBody = [];
        this.afterBody = [];
        this.methods = [];
        this.members = [];
        this.initAfterProperties = [];
        this.initBeforeProperties = [];
        this.construct = null;
        this.implements = [];
        this.inherit = null;
        this.mainEnter = null;
    }

    create(ctx){

        let node = ctx.createNode('ClassDeclaration')
        ctx.setNode(this.stack, this);
        const module = this.module;
        const stack = this.stack;

        addAnnotationManifest(ctx, stack);

        this.createInherit(ctx, module, stack)
        this.createImplements(ctx, module, stack)
        this.createBody(ctx, module, stack);
        
        ctx.crateModuleAssets(module);
        ctx.createModuleImportReferences(module);

        node.static = !!module.static;
        node.id = ctx.createIdentifier(module.id);
        node.inherit = this.inherit;
        node.implements = this.implements;
        node.body = ctx.createBlockStatement([
            ...this.beforeBody,
            ...this.methods,
            ...this.members,
            ...this.afterBody
        ]);

        if(this.construct){
            node.body.body.unshift(this.construct);
        }
        if(this.mainEnter){
            ctx.addNodeToAfterBody(
                ctx.createExpressionStatement(
                    ctx.createExpressionStatement(this.mainEnter)
                )
            )
        }
        ctx.removeNode(this.stack);
        return node;
    }

    createBody(ctx, module, stack){
        this.createMemebers(ctx, stack);
        this.checkConstructor(ctx, this.construct, module);
    }

    createInherit(ctx, module, stack=null){
        let inherit = module.inherit;
        if(inherit){
            ctx.addDepend(inherit, module);
            this.inherit = ctx.createIdentifier(
                ctx.getModuleReferenceName(inherit, module)
            )
        }
    }

    createImplements(ctx, module, stack=null){
        this.implements = module.implements.map( impModule=>{
            if(impModule.isInterface){
                ctx.addDepend(impModule, module);
                if(!impModule.isStructTable){
                    return ctx.createIdentifier(
                        ctx.getModuleReferenceName(impModule, module)
                    )
                }
            }
            return null
        }).filter(Boolean)
    }

    getHashId(len=8){
        let moduleHashId = this._moduleHashId;
        if(!moduleHashId){
            const name = this.module.getName();
            const file = this.compilation.file;
            this._moduleHashId = moduleHashId = createHash("sha256").update(`${file}:${name}`).digest("hex").substring(0, len);
        }
        return moduleHashId;
    }

    checkConstructor(ctx, construct, module){
        if(this.initAfterProperties.length>0 || this.initBeforeProperties.length>0){
            if(!construct){
                construct = this.construct = ctx.createMethodDefinition('__construct', ctx.createBlockStatement());
                if(this.inherit){
                    construct.body.body.push(
                        ctx.createExpressionStatement(
                            ctx.createCallExpression(
                                ctx.createMemberExpression([
                                    ctx.createSuperExpression(),
                                    ctx.createIdentifier('__construct')
                                ]),
                                []
                            )
                        )
                    )
                }
            }
            if(this.initBeforeProperties.length>0){
                let index = construct.body.body.findIndex(item=>{
                    if(item.type === "ExpressionStatement"){
                        item = item.expression;
                    }
                    if(item.type==="CallExpression" && item.callee.type==="MemberExpression"){
                        if(item.callee.object.value ==="parent" && item.callee.property.value ==="__construct"){
                            return true;
                        }
                    }
                });
                construct.body.body.splice(index+1, 0,  ...this.initBeforeProperties);
            }
            if(this.initAfterProperties.length>0){
                construct.body.body.push(...this.initAfterProperties);
            }
        }
    }

    createMemebers(ctx, stack){
        stack.body.forEach( item=> {
            const child = this.createMemeber(ctx, item, !!stack.static);
            if(!child)return;
            const staticFlag = !!(stack.static || child.static);
            const refs  = staticFlag ? this.methods : this.members;
            if(item.isConstructor && item.isMethodDefinition){
                this.construct = child;
            }
            else{
                refs.push( child );
            }
        });
    }

    createAnnotations(ctx, stack, node, staticFlag=false){
        if(staticFlag && stack.isMethodDefinition && stack.isEnterMethod && node.modifier.value ==='public'){
            this.mainEnter = createMainAnnotationNode(ctx,stack)
        }
        return node;
    }

    createMemeber(ctx, stack, staticFlag=false){
        const node = ctx.createToken(stack);
        if(node){
            this.createAnnotations(ctx, stack, node, !!(staticFlag || node.static));
        }
        return node;
    }

    createDefaultConstructor(ctx, name, inherit=null, params=[]){
        const block = ctx.createBlockStatement();
        if(inherit){
            const args = ctx.createArrayExpression( params );
            block.body.push( 
                ctx.createExpressionStatement(
                    ctx.createCallExpression( 
                        ctx.createStaticMemberExpression([
                            ctx.createSuperExpression(),
                            ctx.createIdentifier(name)
                        ]),
                        args
                    )
                )
            );
        }
        return ctx.createMethodDefinition(
            name,
            block,
            params
        );
    }
}
export default ClassBuilder;