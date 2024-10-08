const Transform = require('../core/Transform');
const hasOwn = Object.prototype.hasOwnProperty;

function createNode(ctx,stack){
    const node = ctx.createNode( stack );
    let desc = stack.left.description();
    const module = stack.module;
    const isMember = stack.left.isMemberExpression;
    let operator = stack.operator;
    node.operator = operator;
    // if( desc && desc.isVariableDeclarator && desc.useRefItems && desc.useRefItems.size === 0){
    //     //return null;
    // }
    var refsNode = node.createToken(stack.right);
    var leftNode = null;
    var isReflect = false;
    if( isMember ){
        const objectType = ctx.inferType(stack.left.object);
        if( desc && desc.isStack && (desc.isMethodSetterDefinition || desc.isPropertyDefinition)){
            const property = stack.left.property.value();
            let typename = ctx.builder.getAvailableOriginType( objectType ) || objectType.toString();
            if( (objectType.isUnionType || objectType.isIntersectionType) && desc.module && desc.module.isModule ){
                typename = desc.module.id;
            }
            const map={
                'Array':{
                    'length':()=>{
                        let lengthNode = node.createToken(stack.left);
                        if( !stack.right.isLiteral || stack.right.value() != 0 ){
                            lengthNode = node.createBinaryNode('-', lengthNode , refsNode);
                        }
                        return Transform.get('Array').splice(
                            node, 
                            node.createToken(stack.left.object), 
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
            if( !hasDynamic && !ctx.compiler.callUtils("isLiteralObjectType", objectType ) ){
                isReflect = true;
            }
        }else if( desc && desc.isAnyType ){
            isReflect = !ctx.compiler.callUtils("isLiteralObjectType", objectType )
        }
    }

    if( desc && !isReflect && stack.right ){
        const addressRefObject = (desc.isVariableDeclarator || desc.isParamDeclarator) ? node.getAssignAddressRef(desc) : null;
        if( addressRefObject && stack.left.isIdentifier ){
            const index = addressRefObject.add( stack.right );
            const left = addressRefObject.createIndexName(desc);
            const key = node.createAssignmentNode( 
                node.createIdentifierNode(left,null,true), 
                node.createLiteralNode(index)
            );
            node.addVariableRefs(stack, left );
            let isAddressRefs = false;
            if( node.isPassableReferenceExpress(stack.right,stack.right.type()) ){
                if(refsNode.type==='ParenthesizedExpression'){
                    refsNode = refsNode.expression
                }
                if(refsNode.type==='AssignmentExpression'){
                    node.insertNodeBlockContextAt(refsNode);
                    refsNode = refsNode.left
                }
                refsNode = node.creaateAddressRefsNode(refsNode);
                isAddressRefs = true;
            }

            if( !stack.right.isIdentifier ){
                const refs = node.checkRefsName('__REF');
                node.insertNodeBlockContextAt(
                    node.createAssignmentNode( node.createIdentifierNode(refs, null, true), refsNode )
                );
                refsNode = node.createIdentifierNode(refs, null, true);
                if( isAddressRefs ){
                    refsNode = node.creaateAddressRefsNode(refsNode);
                }
            }

            leftNode = node.createMemberNode([
                node.createToken( stack.left ),
                key
            ],null, true);

        }else if( node.isPassableReferenceExpress(stack.right,stack.right.type()) ){
            refsNode = node.creaateAddressRefsNode(refsNode);
        }
    }

    if(isReflect){

        const Reflect = stack.getGlobalTypeById("Reflect")
        node.addDepend(Reflect );
        if( operator && operator.charCodeAt(0) !== 61 && operator.charCodeAt(operator.length-1) === 61 ){
            operator = operator.slice(0,-1)
            const callee = node.createStaticMemberNode([
                node.createIdentifierNode( node.getModuleReferenceName( Reflect ) ),
                node.createIdentifierNode('get')
            ]);
            const value = node.createCalleeNode( callee, [
                node.createCallReflectScopeNode( module ),
                node.createToken(stack.left.object), 
                node.createCallReflectPropertyNode(stack.left),
            ], stack);
            refsNode = node.createBinaryNode(operator, value, refsNode );
        }

       
        const callee = node.createStaticMemberNode([
            node.createIdentifierNode( node.getModuleReferenceName( Reflect ) ),
            node.createIdentifierNode('set')
        ]);

        let target = node.createToken(stack.left.object);
        if( !stack.left.object.isIdentifier ){
            const refs = node.checkRefsName('__REF');
            node.insertNodeBlockContextAt(
                node.createAssignmentNode( node.createIdentifierNode(refs, null, true), target )
            );
            target = node.createIdentifierNode(refs, null, true);
        }

        return node.createCalleeNode( callee, [
            node.createCallReflectScopeNode( module ),
            target, 
            node.createCallReflectPropertyNode(stack.left),
            refsNode
        ], stack);
        
    }else if(desc && desc.isMethodSetterDefinition){
        return node.createCalleeNode(
            leftNode || node.createToken( stack.left ),
            [
                refsNode
            ],
            stack
        );
    }else{
        node.left = leftNode || node.createToken( stack.left );
        node.right = refsNode;
        refsNode.parent = node;
        return node;
    }
}

module.exports = function(ctx,stack){
    const node = createNode(ctx,stack)
    let operator = stack.operator;
    if( operator === '??=' ){
        const test = ctx.createCalleeNode(
            ctx.createIdentifierNode('!isset'),
            [
                ctx.createToken(stack.left)
            ],
            stack
        );

        node.operator = '=';
        return ctx.createConditionalNode(test, node, ctx.createLiteralNode(null));
    }
    return node;
}