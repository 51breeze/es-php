import {createHash} from 'crypto';
import {createMainAnnotationNode} from "./Common";
import Namespace from "easescript/lib/core/Namespace"

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
        this.createInherit(ctx, module, stack)
        this.createImplements(ctx, module, stack)
        this.createBody(ctx, module, stack);
        
        ctx.crateModuleAssets(module);
        ctx.createModuleImportReferences(module);

        node.id = ctx.createIdentifier(module.id);
        node.inherit = this.inherit;
        node.implements = this.implements;
        node.body = [
            ...this.beforeBody,
            ...this.methods,
            ...this.members,
            ...this.afterBody
        ];
        if(this.construct){
            node.body.unshift(this.construct);
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
    }

    createInherit(ctx, module, stack=null){
        let inherit = module.inherit;
        if(inherit){
            ctx.addDepend(inherit, module);
            if(ctx.isActiveModule(inherit, module)){
                this.inherit = ctx.createIdentifier(
                    ctx.getModuleReferenceName(inherit, module)
                )
            }
        }
    }

    createImplements(ctx, module, stack=null){
        this.implements = module.implements.map( impModule=>{
            ctx.addDepend(impModule, module);
            if(impModule.isInterface && ctx.isActiveModule(impModule, module) && Namespace.globals.get('Iterator') !== impModule ){
                return ctx.createIdentifier(
                    ctx.getModuleReferenceName(impModule, module)
                )
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

    checkConstructor(ctx, construct, module){}

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
        if(staticFlag && stack.isMethodDefinition && stack.isEnterMethod && node.modifier ==='public' && !this.mainEnter){
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