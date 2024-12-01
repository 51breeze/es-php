import path from 'path';
import fs from 'fs';
import Namespace from "easescript/lib/core/Namespace";
import Utils from "easescript/lib/core/Utils";
import Manifest from "./Manifest";
import {createUniqueHashId, parseUrlAnnotation, parseReadfileAnnotation} from "@easescript/transform/lib/core/Common";
import {isAsset} from "./Asset";

function createStaticReferenceNode(ctx, stack, className, method){
    return ctx.createStaticMemberExpression([
        createModuleReferenceNode(ctx, stack, className),
        ctx.createIdentifier(method, stack)
    ]);
}

function createModuleReferenceNode(ctx, stack, className){
    let gloablModule = Namespace.globals.get(className)
    if(gloablModule){
        let context =  stack ? stack.module || stack.compilation : null;
        ctx.addDepend(gloablModule, context)
        return ctx.createIdentifier(
            ctx.getModuleReferenceName(gloablModule, context),
        )
    }else{
        throw new Error(`References the '${className}' module is not exists`)
    }
}

function createClassRefsNode(ctx, module, stack=null){
    if(!Utils.isModule(module))return null;
    let name = null;
    if(Utils.isStack(stack)){
        name = stack.isIdentifier && stack.hasLocalDefined() ? stack.value() : ctx.getModuleReferenceName(module, stack.module || stack.compilation);
    }else{
        name = ctx.getModuleReferenceName(module);
    }
    return ctx.createStaticMemberExpression([
        ctx.createIdentifier(name),
        ctx.createIdentifier('class')
    ],stack);
}

function createScopeIdNode(ctx, module){
    if( module && module.isModule ){
        return createClassRefsNode(ctx, module);
    }
    return ctx.createLiteral(null);
}

function createComputedPropertyNode(ctx, stack){
    return stack.computed ? ctx.createToken(stack.property) : ctx.createLiteral(stack.property.value());
}

function createAddressRefsNode(ctx, argument){
    let node = ctx.createNode('AddressReferenceExpression');
    node.argument = argument;
    return node;
}

function createArrayAddressRefsNode(ctx, stack, desc, name, nameNode){
    if(!desc)return;
    let assignAddress = Utils.isStack(desc) && desc.assignItems && ctx.getAssignAddressRef(desc);
    if(assignAddress){
        let name = assignAddress.getName(desc);
        let rd = assignAddress.createIndexName(stack, desc);
        if( rd ){
            return ctx.createStaticMemberExpression([
                ctx.createVarIdentifier(name),
                ctx.createVarIdentifier(rd)
            ]);
        }
    }
    return nameNode || ctx.createVarIdentifier(name);
}

function createExpressionTransformBooleanValueNode(ctx, stack, assignName=null, type=null, originType=null, tokenValue=null){
    if( stack.isLogicalExpression || stack.isUnaryExpression || stack.isBinaryExpression){
        return ctx.createToken(stack);
    }
    if( stack.isParenthesizedExpression ){
        return ctx.createParenthesizedExpression(
            createExpressionTransformBooleanValueNode(
                ctx,
                stack.expression,
                assignName, 
                type, 
                originType, 
                tokenValue
            )
        );
    }

    type = type || stack.type();
    originType = originType || ctx.getAvailableOriginType(type);
    if(originType && originType.toLowerCase() === "array"){
        let value = tokenValue || ctx.createToken(stack);
        if( assignName ){
            value = ctx.createAssignmentExpression(
                ctx.createVarIdentifier(assignName),
                value
            );
        }
        return ctx.createCallExpression(
            ctx.createIdentifier('is_array'),
            [value]
        );
    }
    else if( type.isAnyType || type.isUnionType || type.isIntersectionType || type.isLiteralObjectType){
        let value = tokenValue || ctx.createToken(stack);
        if(assignName){
            value = ctx.createAssignmentExpression(
                ctx.createVarIdentifier(assignName),
                value
            );
        }
        return ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, 'System', 'toBoolean'),
            [value]
        );
    }
    return tokenValue || ctx.createToken(stack);
}

function createExpressionTransformTypeNode(ctx, typename, expression, parenthese=false){
    let node = ctx.createNode('TypeTransformExpression');
    node.typeName = typename;
    node.expression = expression;
    if(parenthese){
        return ctx.createParenthesizedExpression(node);
    }
    return node;
}

function createDocumentScopeId(context, source ){
    if(!context || !source || !context.file)return null;
    let isModule = Utils.isModule(context);
    const file = isModule ? context.file+'?id='+context.getName() : context.file;
    const key = isModule ? file +'&scope='+source : file +'?scope='+source;
    return createUniqueHashId(key);
}

function createCommentsNode(ctx, stack, node){
    const manifests = ctx.options.manifests || {};
    const enable = ctx.options.comments;
    if(stack.module && (enable||manifests.comments)){
        const result = stack.parseComments('Block');
        if(result){
            if(manifests.comments && result.meta){
                let kind = 'class';
                if(stack.isMethodSetterDefinition){
                    kind = 'setter'
                }else if(stack.isMethodGetterDefinition){
                    kind = 'getter'
                }else if(stack.isMethodDefinition){
                    kind = 'method'
                }else if(stack.isPropertyDefinition){
                    kind = 'property'
                }
                const id = ctx.getModuleNamespace(stack.module, stack.module.id);
                Manifest.add(stack.compilation, 'comments', {
                    [id]:{[node.key.value+':'+kind]:result.meta}
                })
            }
            if(enable && result.comments.length>0){
                return ctx.createChunkExpression( ['/**',...result.comments,'**/'].join("\n"), false )
            }
        }
    }
    return null;
}

function createESMImports(ctx, importManage){
    let imports = [];
    importManage.getAllImportSource().forEach(importSource=>{
        if(importSource.isExportSource)return;
        let target = importSource.getSourceTarget();
        if(isAsset(target)){
            return;
        }
        let isExpre = Utils.isCompilation(target);
        let isDefault = false;
        if(isExpre){
            let targetGraph = ctx.graphs.getBuildGraph(target);
            if(targetGraph){
                let exports = targetGraph.exports;
                if(exports && exports.size===1){
                    isDefault = Array.from(exports.values()).some( exportSource=>{
                        return exportSource.specifiers.length===1 && exportSource.specifiers[0].type==='default';
                    })
                }
            }
        }
        const size = importSource.specifiers.length;
        const specifiers = importSource.specifiers.map(spec=>{
            if(spec.type==='default'){
                if(size===1 && isDefault){
                    return ctx.createImportSpecifier(spec.local, null, true)
                }else{
                    return ctx.createImportSpecifier(spec.local)
                }
            }else if(spec.type==='specifier'){
                return ctx.createImportSpecifier(spec.local, spec.imported)
            }else if(spec.type==='namespace'){
                return ctx.createImportSpecifier(spec.local, null, true)
            }
        });
        const node = ctx.createImportDeclaration(
            importSource.sourceId,
            specifiers,
            isExpre,
            target,
            imports
        );
        if(node){
            imports.push(ctx.createExpressionStatement(node));
        }
    })
    return imports
}

function createESMExports(ctx, exportManage, graph){
    let importSpecifiers = new Map();
    let exports = [];
    let imports = [];
    let declares = [];
    let exportSets = new Set(exportManage.getAllExportSource());
    let properties = [];
    let spreads = [];

    exportSets.forEach(exportSource=>{
        let importSource = exportSource.importSource;
        let sourceId = importSource ? importSource.sourceId : null
        let specifiers = [];
        let refs = null;
        let isDefault = false;
        graph.addExport(exportSource);
        if(sourceId){
            let target = importSource.getSourceTarget();
            let isExpre = Utils.isCompilation(target);
            refs = path.basename( ctx.genUniFileName(sourceId) ).replaceAll('.', '_')
            refs = ctx.getGlobalRefName(null, '_'+refs);
            let importNode = ctx.createImportDeclaration(
                sourceId,
                [ctx.createImportSpecifier(refs)],
                isExpre,
                target
            );
            if(importNode){
                imports.push(
                    ctx.createExpressionStatement(
                        importNode
                    )
                );
            }
            if(isExpre){
                let targetGraph = ctx.graphs.getBuildGraph(target);
                if(targetGraph){
                    let exports = targetGraph.exports;
                    if(exports && exports.size===1){
                        isDefault = Array.from(exports.values()).some( exportSource=>{
                            return exportSource.specifiers.length===1 && exportSource.specifiers[0].type==='default';
                        })
                    }
                }
            }
        }

        exportSource.specifiers.forEach(spec=>{
            if(spec.type==='namespace'){
                if(spec.exported){
                    properties.push(
                        ctx.createProperty(
                            ctx.createLiteral(spec.exported),
                            ctx.createVarIdentifier(refs)
                        )
                    );
                }else if(refs){
                    if(isDefault){
                        spreads.push(ctx.createObjectExpression(
                            ctx.createProperty(
                                ctx.createLiteral('default'),
                                ctx.createVarIdentifier(refs)
                            )
                        ));
                    }else{
                        spreads.push(ctx.createVarIdentifier(refs));
                    }
                }
            }else if(spec.type === 'default'){
                properties.push(
                    ctx.createProperty(
                        ctx.createLiteral('default'),
                        spec.local
                    )
                );
            }else if(spec.type==='named' && !sourceId){
                if(spec.local.type==='VariableDeclaration'){
                    spec.local.declarations.map(decl=>{
                        properties.push(
                            ctx.createProperty(
                                ctx.createLiteral(decl.id.value),
                                decl.init || ctx.createLiteral(null)
                            )
                        )
                    });
                }else if(spec.local.type==='FunctionDeclaration'){
                    spec.local.type = 'FunctionExpression';
                    properties.push(
                        ctx.createProperty(
                            ctx.createLiteral(spec.local.key.value),
                            spec.local
                        )
                    );
                }
            }else if(spec.type==='specifier'){
                if(sourceId){
                    let node = [
                        refs,
                        spec.local,
                        spec.exported
                    ];
                    properties.push(
                        ctx.createProperty(
                            ctx.createLiteral(spec.local),
                            ctx.createVarIdentifier(spec.exported||spec.local),
                        )
                    );
                    specifiers.push(node);
                }else{
                    properties.push(ctx.createProperty(
                        ctx.createLiteral(spec.exported),
                        ctx.createVarIdentifier(spec.local),
                        spec.stack
                    ));
                }
            }
        });

        if(specifiers.length > 0){
            let dataset = importSpecifiers.get(sourceId)
            if(!dataset){
                importSpecifiers.set(sourceId, dataset=[]) 
            }
            dataset.push(...specifiers)
        }
    });

    importSpecifiers.forEach((specifiers)=>{
        let [refs,local,exported] = specifiers;
        declares.push(ctx.createExpressionStatement(
            ctx.createAssignmentExpression(
                ctx.createVarIdentifier(exported||local),
                ctx.createBinaryExpression(
                    ctx.createComputeMemberExpression([
                        ctx.createIdentifier(refs),
                        ctx.createLiteral(local)
                    ]), 
                    ctx.createLiteral(null),
                    '??'
                )
            )
        ))
    });

    if(properties.length>0){
        if(properties.length===1 && properties[0].key.value ==='default' && !spreads.length){
            exports.push(
                ctx.createReturnStatement(properties[0].init)
            );
        }else{
            let object = ctx.createObjectExpression(properties);
            if(spreads.length>0){
                let args = spreads.map(item=>ctx.createConditionalExpression(
                    ctx.createCallExpression(
                        ctx.createIdentifier('is_array'),
                        [
                            item
                        ]
                    ),
                    item,
                    ctx.createObjectExpression()
                ));
                object = ctx.createCallExpression(
                    ctx.createIdentifier('array_merge'),
                    [
                        ...args,
                        object
                    ]
                );
            }
            exports.push(
                ctx.createReturnStatement(object)
            );
        }
    }
    return {imports, exports, declares}
}

function createEmbedAnnotationNode(ctx,annot,stack){
    let result = parseUrlAnnotation(ctx, annot)
    if(result.length>0){
        let items = result.map(item=>{
            return ctx.createCallExpression( 
                createStaticReferenceNode(ctx, stack, 'asset.Manifest', 'get' ),
                [
                    ctx.createLiteral(createUniqueHashId(item.resolve)),
                ]
            );
        });
        if(items.length>1){
            return ctx.createArrayExpression(items)
        }else{
            return items[0];
        }
    }
    return ctx.createLiteral('');
}

function createUrlAnnotationNode(ctx,stack){
    let result = parseUrlAnnotation(ctx, stack)
    if(result.length>0){
        let items = result.map(item=>{
            return ctx.createCallExpression( 
                createStaticReferenceNode(ctx, stack, 'asset.Manifest', 'path' ),
                [
                    ctx.createLiteral(createUniqueHashId(item.resolve)),
                ]
            );
        });
        if(items.length>1){
            return ctx.createArrayExpression(items)
        }else{
            return items[0];
        }
    }
    return ctx.createLiteral('');
}

function createReadfileAnnotationNode(ctx, annot, stack){
    const result = parseReadfileAnnotation(ctx, annot)
    if(!result)return  null;
    const addDeps=(source, local)=>{
        source = ctx.getSourceFileMappingFolder(source) || source;
        let importSource = ctx.addImport(source, local);
        importSource.setSourceTarget()
    }

    const fileMap = {};
    const localeCxt = result.dir.toLowerCase()
    const getParentFile=(pid)=>{
        if(fileMap[pid] ){
            return fileMap[pid]
        }
        if(localeCxt !==pid && pid.includes(localeCxt)){
            return getParentFile(path.dirname(pid))
        }
        return null;
    }

    const dataset = [];
    const namedMap = new Set();
    const only = result.only;
    result.files.forEach( file=>{
        const pid = path.dirname(file).toLowerCase();
        const named = path.basename(file,path.extname(file));
        const id = (pid+'/'+named).toLowerCase();
        const filepath = result.relative ? ctx.compiler.getRelativeWorkspacePath(file) : file;
        let item = {
            path:filepath,
            isFile:fs.statSync(file).isFile()
        }
        
        if(item.isFile && result.load){
            let data = '';
            if(file.endsWith('.env')){
                const content = dotenv.parse(fs.readFileSync(file));
                dotenvExpand.expand({parsed:content})
                data = JSON.stringify(content);
            }else{
                if(result.lazy){
                    data = `include('${file}')`
                }else{
                    namedMap.add(file);
                    data = ctx.getGlobalRefName(annot, '_'+named.replace(/[\.\-]+/g, '_') +namedMap.size);
                    addDeps(file, data);
                }
            }
            item.content = data;
        }else if(result.source){
            item.content =JSON.stringify(fs.readFileSync(file));
        }
        const parent = getParentFile(pid);
        if( parent ){
            const children = parent.children || (parent.children = []);
            children.push(item);
        }else{
            fileMap[id+path.extname(file)] = item;
            dataset.push(item);
        }
    });

    const make = (list)=>{
        return list.map( object=>{
            if(only){
                return object.content ? ctx.createChunkExpression(object.content) : ctx.createLiteral(null);
            }
            const properties = [
                ctx.createProperty(
                    ctx.createIdentifier('path'), 
                    ctx.createLiteral(object.path)
                )
            ];
            if(object.isFile){
                properties.push(ctx.createProperty(ctx.createIdentifier('isFile'), ctx.createLiteral(true)))
            }
            if(object.content){
                properties.push(ctx.createProperty(ctx.createIdentifier('content'),ctx.createChunkExpression(object.content)))
            }
            if(object.children){
                properties.push(ctx.createProperty(ctx.createIdentifier('children'),ctx.createArrayExpression(make(object.children))))
            }
            return ctx.createObjectExpression(properties)
        });
    }

    return ctx.createArrayExpression(make(dataset))
}

function createMainAnnotationNode(ctx, stack){
    if(!stack || !stack.isMethodDefinition)return;
    const main = Array.isArray(stack.annotations) ? 
                stack.annotations.find(stack=>stack.getLowerCaseName() ==='main') :
                null;
    if(!main)return;
    let callMain = ctx.createCallExpression(
        ctx.createStaticMemberExpression([
            ctx.createIdentifier(stack.module.id),
            ctx.createIdentifier(stack.key.value())
        ])
    );
    // const args = main ? main.getArguments() : [];
    // const defer = args.length>0 ? !(String(args[0].value).toLowerCase() ==='false') : true;
    // if(defer){
    //     callMain = ctx.createCallExpression(
    //         createStaticReferenceNode(ctx, stack, 'System', 'setImmediate'),
    //         [
    //             ctx.createArrowFunctionExpression(callMain)
    //         ]
    //     )
    // }
    return ctx.createExpressionStatement(callMain);
}

export * from "@easescript/transform/lib/core/Common";
export {
    createStaticReferenceNode,
    createModuleReferenceNode,
    createClassRefsNode,
    createScopeIdNode,
    createDocumentScopeId,
    createComputedPropertyNode,
    createAddressRefsNode,
    createArrayAddressRefsNode,
    createExpressionTransformBooleanValueNode,
    createExpressionTransformTypeNode,
    createCommentsNode,
    createEmbedAnnotationNode,
    createUrlAnnotationNode,
    createReadfileAnnotationNode,
    createMainAnnotationNode,
    createESMImports,
    createESMExports
}