const path = require('path')
module.exports = function(ctx,stack,type){
   if( stack.source && stack.source.isLiteral ){
      const compilation = stack.getResolveCompilation();
      if( !compilation )return null;
      const resolve = stack.getResolveFile();
      const info = path.parse(resolve);
      const source = ctx.builder.getModuleImportSource( resolve, ctx.module || stack.compilation.file);
      const specifiers = stack.specifiers.map( item=>ctx.createToken(item) );
      ctx.plugin.getBuilder(compilation).make(compilation, compilation.stack);
      if( specifiers.length > 0 ){
         const namespaceSpecifier = specifiers.length === 1 && specifiers[0].type ==='ImportNamespaceSpecifier' ? specifiers[0] : null;
         if( namespaceSpecifier ){
            const node = ctx.createImportNode(source, [[namespaceSpecifier.local.value]], stack);
            return node;
         }else{
            let name = info.name.replace(/[.-]/g, '_');
            if( /^\d+/.test(info.name) ){
               name = '_'+name;
            }
            const refs = ctx.checkRefsName( name , true);
            const node = ctx.createImportNode(source, [[refs]], stack);
            const top = ctx.getTopBlockContext();
            const body = top.initBeforeBody || top.beforeBody || top.body;
            const isDefaultGlobal = specifiers.length === 1 && specifiers[0].type === 'ImportDefaultSpecifier';

            specifiers.forEach( item=>{
               let name = item.local.value;
               if( item.type ==='ImportNamespaceSpecifier' ){
                  body.push( 
                     node.createStatementNode( 
                        node.createAssignmentNode(
                           node.createIdentifierNode(name, null, true),
                           node.createIdentifierNode(refs,true,true)
                        )
                     )
                  );
               }else{
                  let imported = 'default';
                  if( item.type !=='ImportDefaultSpecifier' ){
                     imported = item.imported.value;
                  }

                  const system = ctx.builder.getGlobalModuleById('System');
                  ctx.addDepend( system );

                  const registerScopeVariables = node.createCalleeNode( 
                     node.createStaticMemberNode([
                        node.createIdentifierNode( node.getModuleReferenceName(system) ), 
                        node.createIdentifierNode('registerScopeVariables')
                     ]),
                     [
                        node.createLiteralNode( ctx.builder.createScopeId(stack.compilation, resolve) ),
                        node.createLiteralNode(name),
                        isDefaultGlobal ? 
                        node.createIdentifierNode(refs,true,true) :
                        node.createBinaryNode(
                           '??', 
                           node.createMemberNode([
                              node.createTypeTransformNode('object', node.createIdentifierNode(refs,true,true), true ), 
                              node.createIdentifierNode(imported)
                           ]), 
                           node.createLiteralNode(null)
                        )
                     ]
                  );

                  body.push( 
                     node.createStatementNode( 
                        registerScopeVariables
                     )
                  );
               }
            });
            return node;
         }
      }
      return ctx.createImportNode( source, specifiers, stack );
   }else{
      const classModule = stack.description();
      if( classModule && ctx.isActiveForModule(classModule) ){
         const compilation = classModule.compilation;
         ctx.builder.buildForModule(compilation, compilation.stack, classModule);
         const source = ctx.builder.getModuleImportSource( classModule, stack.compilation.file );
         const node = ctx.createImportNode( source );
         const name = stack.alias ? stack.alias.value() : classModule.id;
         if( name !== classModule.id ){
            node.insertNodeBlockContextTop( 
               node.createUsingStatementNode( 
                  node.createImportSpecifierNode( 
                     name, 
                     node.getModuleReferenceName(classModule)
                  )
               )
            );
         }
         return node;
      }
   }
   return null;
}