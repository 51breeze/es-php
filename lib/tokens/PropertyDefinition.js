import Utils from 'easescript/lib/core/Utils';
import {getMethodOrPropertyAlias, createReadfileAnnotationNode, createEmbedAnnotationNode,createEnvAnnotationNode, createUrlAnnotationNode, createCommentsNode} from '../core/Common';
export default function(ctx,stack){
    let alias =getMethodOrPropertyAlias(ctx, stack)
    let isStatic = !!(stack.module.static ||stack.static);
    const node = ctx.createNode(stack);
    node.declarations = (stack.declarations || []).map( item=>ctx.createToken(item) );
    node.modifier = ctx.createIdentifier( Utils.getModifierValue(stack) );

    if(stack.annotations && stack.annotations.length > 0){
        stack.annotations.forEach( annot=>{
            const name = annot.getLowerCaseName();
            let value = null;
            if(name==='readfile'){
                value = createReadfileAnnotationNode(ctx, annot, stack) || ctx.createLiteral(null)
            }else if(name==='embed'){
                value = createEmbedAnnotationNode(ctx, annot, stack)
            }else if(name==='env'){
                value = createEnvAnnotationNode(ctx, annot, stack)
            }else if(name==='url'){
                value = createUrlAnnotationNode(ctx, annot, stack)
            }
            if(value){
                let prop = null;
                if(stack.isReadonly){
                    prop = alias ? ctx.createIdentifier(alias) : node.declarations[0].id;
                }else{
                    prop = alias ? ctx.createIdentifier(alias) : ctx.createIdentifier(node.declarations[0].id.value);
                }
                if(isStatic){
                    ctx.addNodeToAfterBody(ctx.createExpressionStatement(
                        ctx.createAssignmentExpression(
                            ctx.createStaticMemberExpression([
                                ctx.createIdentifier(stack.module.id),
                                prop
                            ]),
                            value
                        )
                    ));
                }else{
                    let builder = ctx.getClassBuilder(stack);
                    builder.initBeforeProperties.push(
                        ctx.createExpressionStatement(
                            ctx.createAssignmentExpression(
                                ctx.createMemberExpression([
                                    ctx.createThisExpression(),
                                    prop
                                ]),
                                value
                            )
                        )
                    );
                }
            }
        });
    }

    if(isStatic && stack.kind ==='const' && !hasEmbed){
        node.kind = stack.kind;
    }else if(isStatic){
        node.static = ctx.createIdentifier('static');
    }

    node.key = alias ? ctx.createIdentifier(alias) : node.declarations[0].id;
    node.init = node.declarations[0].init || ctx.createLiteral(null);
    node.comments = createCommentsNode(ctx, stack, node)
    return node;
}