const path = require('path')
module.exports = function(ctx,stack,type){
   if( stack.source && stack.source.isLiteral ){
      const compilation = stack.getResolveCompilation();
      if(!compilation)return null;
      const resolve = stack.getResolveFile();
      const source = ctx.builder.getModuleImportSource( resolve, ctx.module || stack.compilation.file);
      const specifiers = stack.specifiers.map( item=>ctx.createToken(item) );
      ctx.plugin.getBuilder(compilation).make(compilation, compilation.stack);
      if( specifiers.length > 0 ){

         const exports = compilation.stack?.exports;
         let ignoreDefaultSpecifier = false;
         if(exports && exports.length===1 && exports[0].isExportDefaultDeclaration && specifiers.length===1 && specifiers[0]){
            ignoreDefaultSpecifier = specifiers[0].type ==='ImportDefaultSpecifier';
         }

         const hasSpecifier = !ignoreDefaultSpecifier ? specifiers.some(spec=>spec.type==='ImportSpecifier' || spec.type==='ImportDefaultSpecifier') : false;
         const refName = hasSpecifier ? '__'+path.parse(resolve).name.replace(/[.-]/g, '_') : '';
         const refs = hasSpecifier ? ctx.checkRefsName( refName , true) : null;
         const node = hasSpecifier ? ctx.createImportNode(source, [[refs]], stack) : ctx.createImportNode( source, specifiers, stack );
         const top = ctx.getTopBlockContext();
         const body = top.initBeforeBody || top.beforeBody || top.body;
         node.includeOnce = false;
         
         let systemNode = null;
         if(stack.compilation.mainModule){
            let system = ctx.builder.getGlobalModuleById('System');
            ctx.addDepend( system );
            systemNode = node.createIdentifierNode( node.getModuleReferenceName(system) )
         }

         specifiers.forEach( item=>{
            let name = item.local.value;
            let refValue = null;
            if(item.type ==='ImportNamespaceSpecifier'){
               if(hasSpecifier){
                  body.push( 
                     node.createStatementNode( 
                        node.createAssignmentNode(
                           node.createIdentifierNode(name, null, true),
                           node.createIdentifierNode(refs,true,true)
                        )
                     )
                  )
               }
            }else if(!ignoreDefaultSpecifier){
               let importer = item.type ==='ImportDefaultSpecifier' ? 'default' : item.imported.value
               refValue = node.createBinaryNode(
                  '??', 
                  node.createMemberNode([
                     node.createIdentifierNode(refs,true,true), 
                     node.createLiteralNode(importer)
                  ], null, true), 
                  node.createLiteralNode(null)
               );
               
               if(!stack.compilation.mainModule){
                  body.push(
                     node.createStatementNode( 
                        node.createAssignmentNode(
                           node.createIdentifierNode(name, null, true),
                           refValue
                        )
                     )
                  );
               }
            }

            if(stack.compilation.mainModule){
               const registerScopeVariables = node.createCalleeNode( 
                  node.createStaticMemberNode([
                     systemNode, 
                     node.createIdentifierNode('registerScopeVariables')
                  ]),
                  [
                     node.createLiteralNode( ctx.builder.createScopeId(stack.compilation, resolve) ),
                     node.createLiteralNode(name),
                     refValue || node.createIdentifierNode(name, null, true)
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