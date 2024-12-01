import Utils from "easescript/lib/core/Utils";
import { createClassRefsNode , createStaticReferenceNode, createUniqueHashId} from "../core/Common";

const globals =['String','Number','Boolean','Object','Array'];
export default function(ctx,stack){

    if( !stack.parentStack.isMemberExpression){
        let isRefs = true;
        if(stack.parentStack.isCallExpression || stack.parentStack.isNewExpression){
            isRefs = stack.parentStack.callee !== stack;
        }
        if(isRefs){
            if(stack.value() ==="arguments"){
                return ctx.createCallExpression( ctx.createIdentifier('func_get_args') );
            }else if(stack.value() ==="undefined"){
                return ctx.createLiteral(null);
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

    if( desc && (desc.isPropertyDefinition || desc.isMethodDefinition || desc.isEnumProperty) && !(stack.parentStack.isProperty && stack.parentStack.key === stack) ){
        const ownerModule = desc.module;
        const isStatic = !!(desc.static || ownerModule.static || desc.isEnumProperty);
        const inMember = stack.parentStack.isMemberExpression;
        let propertyName = stack.value();
        if( !inMember && (desc.isMethodGetterDefinition || desc.isMethodSetterDefinition) ){
            propertyName = ctx.getAccessorName(stack.value(), desc,  desc.isMethodGetterDefinition ? 'get' : 'set');
        }
        let propertyNode = null;
        if( isStatic ){
            propertyNode = ctx.createStaticMemberExpression([
                ctx.createIdentifier( ctx.getModuleReferenceName(ownerModule, stack.module) ),
                ctx.createIdentifier(propertyName, stack)
            ]);
        }else{
            propertyNode = ctx.createMemberExpression([
                ctx.createThisExpression(),
                ctx.createIdentifier(propertyName, stack)
            ]);
        }
        if( !inMember && !stack.parentStack.isAssignmentExpression && desc.isMethodGetterDefinition ){
            return ctx.createCallExpression( propertyNode );
        }
        return propertyNode;
    }

    if(Utils.isTypeModule(desc) ){
        if(desc !== stack.module && stack.value() !=="arguments"){
            ctx.addDepend( desc );
        }
        if( stack.parentStack.isMemberExpression && stack.parentStack.object === stack || 
            stack.parentStack.isNewExpression && !globals.includes(desc.getName()) || 
            stack.parentStack.isBinaryExpression && stack.parentStack.right === stack && stack.parentStack.node.operator==='instanceof'){
            if(!stack.hasLocalDefined()){
                return ctx.createIdentifier(ctx.getModuleReferenceName(desc, stack.module), stack);
            }else{
                return ctx.createIdentifier( stack.value(), stack);
            }
        }
        else {
            return createClassRefsNode(ctx, desc, stack)
        }
    }

    let isDeclarator = desc && (desc.isDeclarator || desc.isProperty && (desc.parentStack.isObjectPattern || desc.parentStack.isObjectExpression) );
    if( isDeclarator ){
        if(desc.parentStack.isImportDeclaration && stack.compilation.mainModule && stack.module){
            return ctx.createCallExpression( 
                createStaticReferenceNode(ctx, stack, 'System', 'getScopeVariable' ),
                [
                    ctx.createLiteral( createUniqueHashId(stack.compilation.file) ),
                    ctx.createLiteral( stack.value() )
                ]
            );
        }else if( desc.parentStack.isAnnotationDeclaration ){
            const annotation = desc.parentStack;
            const name = annotation.name.toLowerCase();
            if(name ==='require' || name==="import" || name==='embed'){
                const argument = annotation.getArguments().find( item=>!!item.resolveFile );
                if(argument){
                    const asset = ctx.assets.getAsset(argument.resolveFile);
                    if(asset){
                        return ctx.createCallExpression(
                            createStaticReferenceNode(ctx, stack, 'asset.Files', 'get'),
                            [
                                ctx.createLiteral(asset.sourceId)
                            ],
                        );
                    }
                }
            }
            return ctx.createLiteral(null);
        }else{
            ctx.addVariableRefs(stack, desc);
        }
    }else if(desc && (desc.isFunctionDeclaration || desc.isDeclaratorVariable)){
        isDeclarator = true;
        if( desc.isDeclaratorVariable ){
            if( desc.kind === 'const' ){
                isDeclarator = false;
            }
        }
    }

    if(stack.parentStack.isNewExpression){
        if(!desc || !(desc.isDeclaratorVariable || isDeclarator)){
            return ctx.createLiteral(stack.raw())
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
        isDeclarator = true;
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
                const index = assignAddress.createIndexName(stack, desc);
                if(index){
                    return ctx.createComputeMemberExpression([
                        ctx.createVarIdentifier(name),
                        ctx.createVarIdentifier(index)
                    ]);
                }
            }
        }
    }
    if(isDeclarator){
        return ctx.createVarIdentifier(stack.value(), stack);
    }
    return ctx.createIdentifier(stack.value(), stack);
};