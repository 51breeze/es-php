module.exports = function(ctx,stack){
     const desc = stack.description();
     const builder = ctx.builder;
     if( desc && (desc.isPropertyDefinition || desc.isMethodDefinition) ){
          const ownerModule = desc.module;
          const isStatic = !!(desc.static || ownerModule.static);
          if( isStatic ){
               return ctx.createStaticMemberNode([
                    ctx.createIdentifierNode( builder.getModuleNamespace(ownerModule) ),
                    ctx.createIdentifierNode(stack.value(), stack)
               ]);
          }else{
               return ctx.createStaticMemberNode([
                    ctx.createThisNode(),
                    ctx.createIdentifierNode(stack.value(), stack)
               ]);
          }
     }
     if( stack.compiler.callUtils("isClassType", desc) ){
          ctx.addDepend( desc );
          if( stack.parentStack.isMemberExpression && stack.parentStack.object === stack || stack.parentStack.isNewExpression ){
               return ctx.createIdentifierNode( ctx.getModuleReferenceName(desc), stack);
          }
          else {
               return ctx.createClassRefsNode(desc, stack)
          }
     }

     var isDeclarator = desc && desc.isDeclarator;
     if( stack.parentStack.isMemberExpression ){
          isDeclarator = false;
          if( stack.parentStack.computed && stack.parentStack.property === stack ){
               isDeclarator = true;
          }else if( stack.parentStack.object === stack ){
               isDeclarator = true;
          }
     }

     return ctx.createIdentifierNode(stack.value(), stack, isDeclarator );
};