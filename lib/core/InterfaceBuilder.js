import {createHash} from 'crypto';
class InterfaceBuilder{

    constructor(stack){
        this.stack = stack;
        this.compilation = stack.compilation;
        this.module =  stack.module;
        this.body = [];
        this.methods = [];
        this.members = [];
        this.implements = [];
        this.inherit = null;
    }

    create(ctx){

        let node = ctx.createNode('InterfaceDeclaration')
        ctx.setNode(this.stack, this);
        const module = this.module;
        const stack = this.stack;
        this.createInherit(ctx, module, stack)
        this.createImplements(ctx, module, stack)
        this.createBody(ctx, module, stack);
        
        node.id = ctx.createIdentifier(module.id);
        node.inherit = this.inherit;
        node.implements = this.implements;
        node.body = ctx.createBlockStatement([
            ...this.methods,
            ...this.members,
        ]);

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
            if(impModule.isInterface && ctx.isActiveModule(impModule, module) ){
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
            child.isInterfaceMember = true;
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

    createMemeber(ctx, stack, staticFlag=false){
        return ctx.createToken(stack);
    }
}
export default InterfaceBuilder;