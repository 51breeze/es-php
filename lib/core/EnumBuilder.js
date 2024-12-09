import Namespace from 'easescript/lib/core/Namespace.js';
import ClassBuilder from './ClassBuilder.js'
import { addAnnotationManifest } from './Common.js';
class EnumBuilder extends ClassBuilder{

    create(ctx){
        let node = ctx.createNode('ClassDeclaration')
        ctx.setNode(this.stack, this);
        const module = this.module;
        const stack = this.stack;

        addAnnotationManifest(ctx, stack);

        this.createInherit(ctx, module, stack)
        this.createImplements(ctx, module, stack)
        this.createBody(ctx, module, stack);

        ctx.crateModuleAssets(module)
        
        node.id = ctx.createIdentifier(module.id);
        node.inherit = this.inherit;
        node.implements = this.implements;

        ctx.removeNode(this.stack);
        node.body =ctx.createBlockStatement([
            ...this.beforeBody,
            ...this.methods,
            ...this.members,
            ...this.afterBody
        ]);

        if(this.construct){
            node.body.body.unshift(this.construct);
        }
        return node;
    }

    createEnumExpression(ctx){
        const stack = this.stack;
        const name = stack.value();
        const keys = [];
        const values = [];
        stack.properties.forEach( item =>{
            keys.push(
                ctx.createProperty(
                    ctx.createLiteral(item.key.value()),
                    ctx.createLiteral(item.init.value())
                )
            );
            values.push(
                ctx.createProperty(
                    ctx.createLiteral(String(item.init.value())),
                    ctx.createLiteral(item.key.value())
                )
            );
        });
        return ctx.createExpressionStatement( 
            ctx.createAssignmentExpression( 
                ctx.createVarIdentifier(name), 
                ctx.createObjectExpression(values.concat(keys))
            )
        );
    }

    createBody(ctx, module, stack){
        this.createMemebers(ctx, stack);
    }

    createInherit(ctx, module, stack=null){
        let inherit = module.inherit;
        if(inherit){
            ctx.addDepend(inherit, stack.module);
            if(ctx.isActiveModule(inherit, stack.module)){
                this.inherit = ctx.createIdentifier(
                    ctx.getModuleReferenceName(inherit, module),
                    stack.inherit
                )
            }
        }
        if(!this.inherit){
            const inherit = Namespace.globals.get('Enumeration')
            ctx.addDepend(inherit, stack.module);
            this.inherit = ctx.createIdentifier(
                ctx.getModuleReferenceName(inherit, module)
            )
        }
    }

    createMemebers(ctx, stack){
        let methods = this.methods;
        stack.properties.forEach( item=> {
            const child = this.createMemeber(ctx, item);
            if(child){
                methods.push(child)
            }
        });
        super.createMemebers(ctx, stack)
    }
}
export default EnumBuilder;