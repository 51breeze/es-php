import Namespace from "easescript/lib/core/Namespace";
import { createStaticReferenceNode } from "../core/Common";

export default function(ctx,stack){
    if( stack.parentStack.isArrayExpression ){
        const type = stack.argument.type();
        const _Array =  Namespace.globals.get("Array");
        const _array =  Namespace.globals.get("array");
        if( type && (type.isLiteralArrayType || type===_Array || type === _array)){
            return ctx.createToken(stack.argument);
        }
        const node = ctx.createCallExpression(
            createStaticReferenceNode(ctx,stack,'System', 'toArray'),
            [
                ctx.createToken(stack.argument)
            ]
        );
        node.isSpreadElement = true;
        return node;
    }else if( stack.parentStack.isObjectExpression ){
        let node = ctx.createToken(stack.argument);
        node.isSpreadElement = true;
        return node;
    }

    const node = ctx.createNode(stack);
    node.argument = ctx.createToken(stack.argument);
    return node;
}