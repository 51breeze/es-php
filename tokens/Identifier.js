
const globals =['String','Number','Boolean','Object','Array'];

module.exports = function(ctx,stack){

    if( !stack.parentStack.isMemberExpression){
        let isRefs = true;
        if(stack.parentStack.isCallExpression || stack.parentStack.isNewExpression){
            isRefs = stack.parentStack.callee !== stack;
        }
        if(isRefs){
            if(stack.value() ==="arguments"){
                return ctx.createCalleeNode( ctx.createIdentifierNode('func_get_args') );
            }else if(stack.value() ==="undefined"){
                return ctx.createLiteralNode(null);
            }
        }
    }
    
    let desc = null;
    if( stack.parentStack.isMemberExpression ) {
        if( stack.parentStack.object === stack ){
            desc = stack.description();
        }
    }else{
        desc = stack.description();
    }

    if(desc && desc.isImportDeclaration){
        desc = desc.description();
    }

    const builder = ctx.builder;
    if( desc && (desc.isPropertyDefinition || desc.isMethodDefinition) ){
        const ownerModule = desc.module;
        const isStatic = !!(desc.static || ownerModule.static);
        const inMember = stack.parentStack.isMemberExpression;
        let propertyName = stack.value();
        if( !inMember && (desc.isMethodGetterDefinition || desc.isMethodSetterDefinition) ){
            propertyName = ctx.getAccessorName( stack.value(), desc,  desc.isMethodGetterDefinition ? 'get' : 'set');
        }
        let propertyNode = null;
        if( isStatic ){
            propertyNode = ctx.createStaticMemberNode([
                ctx.createIdentifierNode( builder.getModuleNamespace(ownerModule) ),
                ctx.createIdentifierNode(propertyName, stack)
            ]);
        }else{
            propertyNode = ctx.createMemberNode([
                ctx.createThisNode(),
                ctx.createIdentifierNode(propertyName, stack)
            ]);
        }
        if( !inMember && !stack.parentStack.isAssignmentExpression && desc.isMethodGetterDefinition ){
            return ctx.createCalleeNode( propertyNode );
        }
        return propertyNode;
    }

    if( stack.compiler.callUtils("isTypeModule", desc) ){
        if(desc !== stack.module){
            ctx.addDepend( desc );
        }
        if( stack.parentStack.isMemberExpression && stack.parentStack.object === stack || 
            stack.parentStack.isNewExpression && !globals.includes(desc.getName()) || 
            stack.parentStack.isBinaryExpression && stack.parentStack.right === stack && stack.parentStack.node.operator==='instanceof'){
            if(!stack.hasLocalDefined()){
                return ctx.createIdentifierNode( ctx.getModuleReferenceName(desc), stack);
            }else{
                return ctx.createIdentifierNode( stack.value(), stack);
            }
        }
        else {
            return ctx.createClassRefsNode(desc, stack)
        }
    }

    var isDeclarator = desc && (desc.isDeclarator || desc.isProperty && (desc.parentStack.isObjectPattern || desc.parentStack.isObjectExpression) );
    if( isDeclarator ){
        if( desc.parentStack.isImportDeclaration ){
            const resolve = desc.parentStack.getResolveFile();
            const system = ctx.builder.getGlobalModuleById('System');
            ctx.addDepend( system );
            const node = ctx.createCalleeNode( 
                ctx.createStaticMemberNode([
                        ctx.createIdentifierNode( ctx.getModuleReferenceName(system) ), 
                        ctx.createIdentifierNode('getScopeVariable')
                ]),
                [
                ctx.createLiteralNode( ctx.builder.createScopeId(stack.compilation, resolve) ),
                ctx.createLiteralNode( stack.value() )
                ]
            );
            return node;
        }else if( desc.parentStack.isAnnotationDeclaration ){
            const annotation = desc.parentStack;
            const name = annotation.name.toLowerCase();
            if(name ==='require' || name==="import" || name==='embed'){
                const argument = annotation.getArguments().find( item=>!!item.resolveFile );
                if(argument){
                    const asset = ctx.builder.getAsset(argument.resolveFile);
                    if(asset){
                        const Assets = ctx.builder.getVirtualModule('asset.Assets');
                        ctx.addDepend(Assets);
                        return ctx.createCalleeNode(
                            ctx.createStaticMemberNode([
                                ctx.createIdentifierNode(ctx.getModuleReferenceName(Assets)),
                                ctx.createIdentifierNode("get")
                            ]),
                            [
                                ctx.createLiteralNode(asset.getResourceId())
                            ],
                        );
                    }
                }
            }
            return ctx.createLiteralNode(null);
        }else{
            ctx.addVariableRefs( desc );
        }
    }else if( desc && (desc.isFunctionDeclaration || desc.isDeclaratorVariable) ){
        isDeclarator = true;
        if( desc.isDeclaratorVariable ){
            if( desc.kind === 'const' ){
                isDeclarator = false;
            }
        }
    }

    if(stack.parentStack.isNewExpression){
        if(!desc || !(desc.isDeclaratorVariable || isDeclarator)){
            return ctx.createLiteralNode(stack.raw())
        }
    }

    if( stack.parentStack.isMemberExpression ){
        isDeclarator = false;
        if( stack.parentStack.computed && stack.parentStack.property === stack ){
            isDeclarator = true;
        }else if( stack.parentStack.object === stack ){
            isDeclarator = true;
        }
    }else if( stack.parentStack.isJSXExpressionContainer && stack.scope.define(stack.value()) ){
        if(desc && desc.isIdentifier){
            ctx.addVariableRefs( desc );
        }
        isDeclarator = true;
    }

    if( desc && (desc.isVariableDeclarator || desc.isParamDeclarator) ){
        let isRefs = true;
        if(stack.parentStack.isMemberExpression ) {
            isRefs = stack.parentStack.object === stack;
        }else if(stack.parentStack.isVariableDeclarator){
            isRefs = stack.parentStack.init === stack;
        }else if(stack.parentStack.isAssignmentExpression){
            isRefs = stack.parentStack.right === stack;
        }
        if( isRefs ){
            const assignAddress =ctx.getAssignAddressRef(desc);
            if( assignAddress ){
                const name = assignAddress.getName(desc) || stack.value();
                const index = assignAddress.createIndexName(desc);
                if( index ){
                    return ctx.createMemberNode([
                        ctx.createIdentifierNode(name, null, true),
                        ctx.createIdentifierNode(index, null, true)
                    ],null, true);
                }
            }
        }
    }

    return ctx.createIdentifierNode(stack.value(), stack, isDeclarator);
};