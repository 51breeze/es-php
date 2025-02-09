import {createScopeIdNode,createStaticReferenceNode} from '../core/Common';
import AddressVariable from '../core/AddressVariable';

export default function(ctx,stack){
    const node = ctx.createNode(stack);
    let chain = stack.expression;
    if(chain.isCallExpression || chain.isNewExpression){
        chain = stack.expression.callee;
    }

    let chainNodes = [];
    while(chain.isMemberExpression){
        if(chain.optional){
            let node = ctx.createToken(chain.object);
            if(node.type==="CallExpression"){
                let refs = ctx.getLocalRefName(chain.object,AddressVariable.REFS_ASSIGN,chain.object);
                node = ctx.createCallExpression(
                    createStaticReferenceNode(ctx, stack, 'System', 'toBoolean'),
                    [
                        ctx.createAssignmentExpression(
                            ctx.createVarIdentifier(refs),
                            node
                        )
                    ],
                    stack
                );
            }
            chainNodes.unshift(node);
        }
        chain = chain.object;
    }

    node.expression = ctx.createToken(stack.expression);

    let defaultValueNode = ctx.createLiteral(null);
    if(stack.parentStack.isLogicalExpression){
        operator = stack.parentStack.operator;
        if(operator.length===2 && operator.charCodeAt(0) === 63 ){
            let code = operator.charCodeAt(1)
            if(code===63){
                if(stack===stack.parentStack.left){
                    defaultValueNode = ctx.createToken(stack.parentStack.right);
                }else{
                    defaultValueNode = ctx.createToken(stack.parentStack.left);
                }
            }
        }
    }

    if(stack.expression.isCallExpression){
        if(stack.expression.optional){
            let objectNode = node.expression.callee;
            let propertyNode = null;
            if(node.expression.callee.type==="MemberExpression"){
                objectNode = node.expression.callee.object;
                propertyNode =  node.expression.callee.property;
                propertyNode = propertyNode.type==="Identifier" && !propertyNode.isVariable ? ctx.createLiteral(propertyNode.value) : propertyNode;
            }

            let isReflect = objectNode.value==="Reflect";
            let reflectName = isReflect && propertyNode && propertyNode.value;
            if(isReflect && (reflectName==='call' || reflectName==='tryCall')){
                node.expression.callee.property.value="tryCall";
                node.expression.callee.property.raw="tryCall";
            }else if(!(isReflect && reflectName==='get')){
                let arg = objectNode;
                if(propertyNode){
                    let _args = [
                        createScopeIdNode(ctx,stack.module,stack),
                        objectNode,
                        propertyNode
                    ];
                    if(node.expression.arguments.length>0){
                        _args.push(ctx.createArrayExpression(node.expression.arguments))
                    }
                    node.expression = ctx.createCallExpression(
                        createStaticReferenceNode(ctx, stack, 'Reflect', 'tryCall'),
                        _args,
                        stack
                    );
                }else{
                    node.expression = ctx.createConditionalExpression(
                        ctx.createCallExpression(
                            ctx.createIdentifier('is_callable'),
                            [
                                arg
                            ]
                        ),
                        node.expression,
                        defaultValueNode
                    );
                }
            }
        }
    }

    if(chainNodes.length>0){
        if(chainNodes.every(node=>node.type==="Identifier"||node.type==="MemberExpression")){
            node.expression = ctx.createConditionalExpression(
                ctx.createCallExpression(
                    ctx.createIdentifier('isset'),
                    chainNodes
                ), 
                node.expression, 
                defaultValueNode
            );
        }else{
            chainNodes = chainNodes.map(node=>{
                if(node.type==="Identifier"||node.type==="MemberExpression"){
                    return ctx.createCallExpression(
                        ctx.createIdentifier('isset'),
                        [node]
                    )
                }else{
                    return node;
                }
            });
            let logical = chainNodes.shift();
            while(chainNodes.length>0){
                logical = ctx.createLogicalExpression(logical, chainNodes.shift());
            }
            node.expression = ctx.createConditionalExpression(logical, node.expression, defaultValueNode);
        }
    }
    return node;
}