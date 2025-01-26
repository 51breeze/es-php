import Utils from 'easescript/lib/core/Utils';
import Transform from '../transforms';
import {createStaticReferenceNode, createScopeIdNode, createComputedPropertyNode, createAddressRefsNode} from '../core/Common';
import AddressVariable from '../core/AddressVariable';
const hasOwn = Object.prototype.hasOwnProperty;

function createNode(ctx,stack){
    let node = ctx.createNode( stack );
    let desc = stack.left.description();
    let module = stack.module;
    let isMember = stack.left.isMemberExpression;
    let operator = stack.operator;
    node.operator = operator;

    let refsNode = ctx.createToken(stack.right);
    let leftNode = null;
    let isReflect = false;
    if( isMember ){
        const objectType = stack.left.object.type();
        if(desc && desc.isStack && (desc.isMethodSetterDefinition || desc.isPropertyDefinition)){
            const property = stack.left.property.value();
            let typename = ctx.getAvailableOriginType( objectType ) || objectType.toString();
            if( (objectType.isUnionType || objectType.isIntersectionType) && Utils.isModule(desc.module)){
                typename = desc.module.id;
            }
            const map={
                'Array':{
                    'length':()=>{
                        let lengthNode = ctx.createToken(stack.left);
                        if( !stack.right.isLiteral || stack.right.value() != 0 ){
                            lengthNode = ctx.createBinaryExpression(lengthNode , refsNode, '-');
                        }
                        return Transform.get('Array').splice(
                            stack,
                            ctx, 
                            ctx.createToken(stack.left.object), 
                            [refsNode,lengthNode], 
                            true
                        )
                    }
                },
                'Error':{
                    'name':()=>{
                        return null;
                    }
                }
            }

            if( hasOwn.call(map, typename) && hasOwn.call(map[typename], property) ){
                return map[typename][property]();
            }
        }

        if( stack.left.computed ){
            let hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
            if(!hasDynamic && desc && (desc.isProperty && desc.computed || desc.isPropertyDefinition && desc.dynamic)){
                hasDynamic = true
            }
            
            if( !hasDynamic && !Utils.isLiteralObjectType(objectType ) ){
                isReflect = true;
            }
        }else if( desc && desc.isAnyType ){
            isReflect = !Utils.isLiteralObjectType(objectType )
        }
    }

    if( desc && !isReflect && stack.right ){
        const addressRefObject = (desc.isVariableDeclarator || desc.isParamDeclarator) ? ctx.getAssignAddressRef(desc) : null;
        if( addressRefObject && stack.left.isIdentifier ){
            const index = addressRefObject.add( stack.right );
            const left = addressRefObject.createIndexName(stack, desc);
            const key = ctx.createAssignmentExpression( 
                ctx.createVarIdentifier(left), 
                ctx.createLiteral(index)
            );
            ctx.addVariableRefs(stack, left);
            let isAddressRefs = false;
            if( ctx.isPassableReferenceExpress(stack.right,stack.right.type()) ){
                if(refsNode.type==='ParenthesizedExpression'){
                    refsNode = refsNode.expression
                }
                if(refsNode.type==='AssignmentExpression'){
                    ctx.insertTokenToBlock(stack, refsNode);
                    refsNode = refsNode.left;
                }
                refsNode = createAddressRefsNode(ctx,refsNode);
                isAddressRefs = true;
            }
            if( !stack.right.isIdentifier ){
                
                const refs = ctx.getLocalRefName(stack, AddressVariable.REFS_VALUE, stack);
                ctx.insertTokenToBlock(
                    stack,
                    ctx.createAssignmentExpression( ctx.createVarIdentifier(refs), refsNode )
                );
                refsNode = ctx.createVarIdentifier(refs);
                if( isAddressRefs ){
                    refsNode = createAddressRefsNode(ctx,refsNode);
                }
            }
            leftNode = ctx.createComputeMemberExpression([
                ctx.createToken( stack.left ),
                key
            ],null, true);

        }else if( ctx.isPassableReferenceExpress(stack.right,stack.right.type()) ){
            refsNode = createAddressRefsNode(ctx, refsNode);
        }
    }

    if(isReflect){
        if( operator && operator.charCodeAt(0) !== 61 && operator.charCodeAt(operator.length-1) === 61 ){
            operator = operator.slice(0,-1);
            const value = ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, 'Reflect', 'get'),
                [
                    createScopeIdNode(ctx, module, stack),
                    ctx.createToken(stack.left.object), 
                    createComputedPropertyNode(ctx, stack.left),
                ],
                stack
            );
            refsNode = ctx.createBinaryExpression(value, refsNode, operator);
        }

        let target = ctx.createToken(stack.left.object);
        if( !stack.left.object.isIdentifier ){
            
            const refs = ctx.getLocalRefName(stack, AddressVariable.REFS_VALUE, stack);
            ctx.insertTokenToBlock(
                stack,
                ctx.createAssignmentExpression(
                    ctx.createVarIdentifier(refs),
                    target
                )
            );
            target = ctx.createVarIdentifier(refs);
        }

        return ctx.createCallExpression( 
            createStaticReferenceNode(ctx, stack, 'Reflect', 'set'),
            [
                createScopeIdNode(ctx, module, stack),
                target, 
                createComputedPropertyNode(ctx, stack.left),
                refsNode
            ], 
            stack
        );
        
    }else if(desc && desc.isMethodSetterDefinition){
        return ctx.createCallExpression(
            leftNode || ctx.createToken( stack.left ),
            [
                refsNode
            ],
            stack
        );
    }else{
        node.left = leftNode || ctx.createToken( stack.left );
        node.right = refsNode;
        return node;
    }
}

export default function(ctx,stack){
    const node = createNode(ctx,stack)
    let operator = stack.operator;
    if( operator === '??=' ){
        const test = ctx.createCallExpression(
            ctx.createIdentifier('!isset'),
            [
                ctx.createToken(stack.left)
            ],
            stack
        );
        node.operator = '=';
        if(stack.parentStack.isExpressionStatement){
            return ctx.createIfStatement(test, node);
        }
        return ctx.createConditionalExpression(test, node, ctx.createLiteral(null));
    }
    return node;
}