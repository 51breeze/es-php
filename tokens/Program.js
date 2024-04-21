const path = require('path');

function createDependencies(stack, ctx, node, importExcludes){

    const imports = [];
    const using = [];
    const plugin = ctx.plugin;
    const builder = ctx.builder;
    const importFlag = plugin.options.import;
    const consistent = plugin.options.consistent;
    const folderAsNamespace = plugin.options.folderAsNamespace;
    const usingExcludes = new WeakSet();
    builder.getGlobalModules().forEach( module=>{
        usingExcludes.add(module);
    })

    const dependencies = node.getDependencies();
    const createUse=(depModule)=>{
        if( !usingExcludes.has(depModule) ){
            const name = builder.getModuleNamespace(depModule, depModule.id);
            if( name ){
                let local = name;
                let imported = void 0;
                using.push(node.createUsingStatementNode( 
                    node.createImportSpecifierNode(local, imported )
                ));
            }
        }
    }

    dependencies.forEach( depModule =>{
        if( stack.compiler.isPluginInContext(plugin, depModule) ){
            if( !importExcludes.has( depModule ) ){
                if( node.isActiveForModule( depModule ) ){
                    if( importFlag ){
                        if( !builder.isImportExclude(depModule) ){
                            const source = builder.getModuleImportSource(depModule, stack.compilation.file);
                            imports.push( node.createImportNode(source) );
                        }
                    }else if( !(consistent||folderAsNamespace) ){
                        const source = builder.getFileRelativeOutputPath(depModule);
                        const name = builder.getModuleNamespace(depModule, depModule.id);
                        builder.addFileAndNamespaceMapping(source, name);
                    }
                    createUse( depModule );
                }else if( node.isReferenceDeclaratorModule(depModule) ){
                    createUse( depModule );
                }
            }
        }
    });
    return [imports,using];
}

module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    node.body = [];
    node.afterBody = [];
    node.imports = [];
    stack.body.forEach( item=>{
        if( stack.isJSXProgram || item.isClassDeclaration || item.isDeclaratorDeclaration || 
            item.isStructTableDeclaration || 
            item.isEnumDeclaration || item.isInterfaceDeclaration || item.isPackageDeclaration ){
            node.body.push( node.createToken(item) );
        }
    });

    const externalImports = [];
    const insertImports = [];
    const insertUsing = [];
    const importExcludes = new WeakSet();
    if( stack.externals.length > 0 ){
        stack.externals.forEach( item=>{
            if( item.isImportDeclaration ){
                const desc = item.description();
                if( desc && desc.isModule ){
                    importExcludes.add(desc);
                }
                externalImports.push( item );
            }else{
                const obj = node.createToken(item);
                if( obj ){
                    node.body.push( obj );
                }
            }
        });
    }

    if( stack.exports.length > 0 ){
        const dataset = [];
        const isDefaultGlobal = stack.exports.length === 1 && stack.exports[0].isExportDefaultDeclaration;
        stack.exports.forEach( item=>{
            const obj = node.createToken(item);
            if( obj.type === 'ExportNamedDeclaration' ){
                if( obj.declaration ){
                    if( obj.declaration.type ==='FunctionDeclaration' ){
                        dataset.push( 
                            node.createPropertyNode(
                                obj.declaration.key.value, 
                                obj.declaration
                            )
                        );
                    }else if( obj.declaration.type ==='Identifier' ){
                        dataset.push(
                            node.createPropertyNode(
                                obj.declaration.value, 
                                obj.declaration
                            )
                        );
                    }else if( obj.declaration.type ==='ClassDeclaration' ){
                        dataset.push( 
                            node.createPropertyNode(
                                obj.declaration.module.id, 
                                node.createIdentifierNode(
                                    node.getModuleReferenceName(
                                        obj.declaration.module
                                    )
                                )
                            )
                        );
                    }else if(obj.declaration.type ==='VariableDeclaration'){
                        obj.declaration.declarations.forEach( declare=>{
                            if( declare.init )dataset.push( node.createPropertyNode(declare.id.value,  declare.init) ); 
                        });
                    }
                }else if( obj.specifiers && obj.specifiers.length>0 ){
                    if( obj.source ){
                        const refs = obj.checkRefsName( path.parse( obj.source.value ).name, true );
                        insertImports.push( node.createImportNode(obj.source, [[refs]]) );
                        obj.specifiers.forEach( specifier=>{
                            dataset.push(
                                node.createPropertyNode(
                                    specifier.exported.value,  
                                    node.createBinaryNode(
                                        '??', 
                                        node.createMemberNode( node.createIdentifierNode(refs,null,true), specifier.local),
                                        node.createLiteralNode(null) 
                                    )
                                )
                            );
                        });
                    }else{
                        obj.specifiers.forEach( specifier=>{
                            dataset.push(
                                node.createPropertyNode(
                                    specifier.exported.value,
                                    specifier.local
                                )
                            );
                        });
                    }
                }
            }
            else if(obj.type === 'ExportDefaultDeclaration'){

                if( isDefaultGlobal ){

                    if( obj.declaration.type ==='ClassDeclaration' ){
                        dataset.push(node.createIdentifierNode( 
                            node.getModuleReferenceName( obj.declaration.module ) 
                        ));
                    }else{
                        dataset.push(obj.declaration);
                    }

                }else{

                    if( obj.declaration.type ==='ClassDeclaration' ){
                        dataset.push(
                            node.createPropertyNode(
                                'default',
                                node.createIdentifierNode( 
                                    node.getModuleReferenceName( obj.declaration.module ) 
                                )
                            )
                        );
                    }else{
                        dataset.push(node.createPropertyNode('default', obj.declaration));
                    }
                }
            }
            else if( obj.type === 'ExportAllDeclaration' ){
                const refs = obj.checkRefsName(obj.exported.value,true);
                insertImports.push( node.createImportNode(obj.source, [[refs]]) );
                dataset.push(
                    node.createPropertyNode(
                        obj.exported.value,  
                        node.createIdentifierNode(refs,null,true)
                    )
                );
            }
        });

        if( isDefaultGlobal ){
            if( dataset[0] ){
                node.afterBody.push( node.createReturnNode( dataset[0] ) );
            }
        }else{
            node.afterBody.push( node.createReturnNode( node.createObjectNode( dataset ) ) );
        }
    }

    if( !stack.compilation.mainModule && (stack.externals.length > 0 ||  stack.exports.length > 0) ){
        const [imps, using]  = createDependencies(stack, ctx, node, importExcludes);
        insertImports.push( ...imps );
        insertUsing.push( ...using );
     }

    externalImports.forEach( item=>{
        const obj = node.createToken(item);
        if( obj ){
            node.imports.push( obj );
        }
    });

    node.imports.push( ...insertImports );
    node.body.unshift( ...node.imports );
    node.body.push( ...insertUsing );
    node.body.push( ...node.afterBody );
    delete node.afterBody;
    delete node.imports;
    return node;
}