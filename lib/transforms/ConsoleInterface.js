import Namespace from "easescript/lib/core/Namespace";
import { createStaticReferenceNode } from "../core/Common";

export default{
    log(stack,ctx, object, args, called=false, isStatic=false){
        const module = Namespace.globals.get('System')
        ctx.addDepend( module );
        if(!called){
            return ctx.createChunkExpression(`function(...$args){System::print(...$args);}`)
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'print'),
            args
        );
    },
    trace(stack,ctx, object, args, called=false, isStatic=false){
        return this.log(stack, ctx, object, args, called, isStatic);
    },
    
}
