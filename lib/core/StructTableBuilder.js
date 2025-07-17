import {createHash} from 'crypto';
import { addAnnotationManifest, createCommentsNode } from './Common';
import Generator from './Generator';
import Utils from 'easescript/lib/core/Utils';
class StructTableBuilder{

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

        let node = ctx.createNode('ClassDeclaration')
        ctx.setNode(this.stack, this);
        const module = this.module;
        const stack = this.stack;

        node.comments = createCommentsNode(ctx, stack)
        const comments = ['/**','* @StructTable','**/'].join("\n");
        if(node.comments){
            node.comments.value += '\n' + comments;
        }else{
            node.comments = ctx.createChunkExpression(comments, true)
        }

        addAnnotationManifest(ctx, stack);
        
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
       
        if(stack.isStructTableColumnDefinition){
            const node = ctx.createNode(stack, 'PropertyDefinition');
            const typeName = Utils.getStructTableMethodTypeName(stack.typename?.value() || 'varchar');
            node.modifier = ctx.createIdentifier('public');
            node.kind = 'var';
            node.key = ctx.createIdentifier(stack.key.value(),stack.key)
            node.init = ctx.createLiteral(typeName ==='string' ? '' : null);
            node.comments = createCommentsNode(ctx, stack)
            let format = '* @Formal(varchar,255)';
            if(stack.typename){
                const formatNode = ctx.createToken(stack.typename);
                const generator = new Generator()
                if(formatNode.type==="StructTableMethodDefinition"){
                    generator.withSequence([formatNode.key, ...formatNode.params])
                }else{
                    generator.make(formatNode);
                }
                format = `* @Formal(${generator.toString()})`;
            }
            let comments = ['* @StructColumn', stack.question ? '* @Optional' : '* @Requred', format];
            if(node.comments){
                const lines = String(node.comments.value).split(/[\r\n]+/);
                lines.splice(lines.length-2, 0, ...comments)
                node.comments.value = lines.join('\n');
            }else{
                node.comments = ctx.createChunkExpression(['/**', ...comments, '**/'].join("\n"))
            }
            return node;
        }
        return null;
    }
}
export default StructTableBuilder;