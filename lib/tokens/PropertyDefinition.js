import Utils from 'easescript/lib/core/Utils';
import {getMethodOrPropertyAlias, createReadfileAnnotationNode, createEmbedAnnotationNode,createEnvAnnotationNode, createUrlAnnotationNode, createCommentsNode} from '../core/Common';
export default function(ctx,stack){
    let alias =getMethodOrPropertyAlias(ctx, stack)
    let init = null;
    if(stack.annotations && stack.annotations.length > 0){
        let items = [];
        stack.annotations.forEach( annot=>{
            const name = annot.getLowerCaseName();
            if(name==='readfile'){
                items.push(
                    createReadfileAnnotationNode(ctx, annot) || ctx.createLiteral(null)
                );
            }else if(name==='embed'){
                items.push(
                    createEmbedAnnotationNode(ctx, annot)
                );
            }else if(name==='env'){
                items.push(
                    createEnvAnnotationNode(ctx, annot)
                );
            }else if(name==='url'){
                items.push(
                    createUrlAnnotationNode(ctx, annot)
                );
            }
        });
        if(items.length>0){
            init = items.length > 1 ? ctx.createArrayExpression(items) : items[0];
        }
    }

    const node = ctx.createNode(stack);
    node.declarations = (stack.declarations || []).map( item=>ctx.createToken(item) );
    node.modifier = ctx.createIdentifier( Utils.getModifierValue(stack) );

    if( stack.static && stack.kind ==='const' && !hasEmbed){
        node.kind = stack.kind;
    }else if(stack.static){
        node.static = ctx.createIdentifier('static');
    }

    node.key = alias ? ctx.createIdentifierNode(alias) : node.declarations[0].id;
    node.init = init || node.declarations[0].init || ctx.createLiteral(null);
    node.comments = createCommentsNode(ctx, stack, node)
    return node;
}