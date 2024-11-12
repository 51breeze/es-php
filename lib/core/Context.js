import path from 'path';
import BaseContext from "@easescript/transform/lib/core/Context";
import {getCacheManager} from "@easescript/transform/lib/core/Cache";
import AddressVariable from "./AddressVariable";
import Namespace from "easescript/lib/core/Namespace";
import Utils from "easescript/lib/core/Utils";
const cache = getCacheManager('php')
const globalModules = ['Array','Object','Boolean','Math','Number','String']

class Context extends BaseContext{

    #usings = new Map();
    #statments = [];
    get usings(){
        return this.#usings;
    }

    get statments(){
        return this.#statments;
    }

    createModuleUsing(depModule, module){
        if(!globalModules.includes(depModule.id)){
            const hasNs = depModule.namespace && depModule.namespace.isNamespace && depModule.namespace.parent;
            let source = this.getModuleNamespace(depModule, depModule.id, !hasNs);
            if( source ){
                let local = this.getModuleAlias(depModule, module);
                this.addUsing(source, local);
            }
        }
    }

    addUsing(source, local=null){
        this.#usings.set(
            local||source,
            this.createUsingStatement(source,local)
        );
    }

    createAllDependencies(){
        const dependencies = this.dependencies
        const target = this.target;
        const compilation = Utils.isCompilation(target) ? target : null;
        const importFlag = this.options.import;
        dependencies.forEach((deps, moduleOrCompi)=>{
            const graph = this.getBuildGraph(moduleOrCompi)
            deps.forEach(depModule =>{
                if(!Utils.isModule(depModule))return;
                if(depModule === target || compilation && compilation.modules.has(depModule.getName())){
                    return;
                }
                this.createModuleImportAndUsing(graph, moduleOrCompi, depModule, importFlag)
            });
        })
    }

    createModuleDependencies(module){
        if(!Utils.isModule(module))return;
        let deps = this.getDependencies(module);
        if(!deps)return;
        const graph = this.getBuildGraph(module)
        const compilation = module.compilation;
        const importFlag = this.options.import;
        deps.forEach(depModule =>{
            if(!Utils.isModule(depModule))return;
            if(compilation && compilation.modules && compilation.modules.has(depModule.getName())){
                return;
            }
            this.createModuleImportAndUsing(graph, module, depModule, importFlag)
        });
    }

    createModuleImportAndUsing(graph, context, depModule, importFlag=true){
        if(context !== depModule && this.isNeedBuild(depModule) && Utils.isModule(depModule)){
            graph.addDepend(depModule);
            if(!depModule.isDeclaratorModule || this.isVModule(depModule)){
                if(importFlag){
                    if(!this.checkModuleImportExclude(depModule)){
                        const source = this.getModuleImportSource(depModule, context);
                        const importSource = this.addImport(source)
                        importSource.setSourceTarget(depModule);
                        importSource.setSourceContext(context);
                        graph.addImport(importSource)
                    }
                }
                this.createModuleUsing(depModule, context)
            }else if(depModule.isDeclaratorModule){
                if(this.isModuleNeedUsing(depModule)){
                    this.createModuleUsing(depModule, context)
                }
                this.createDeclaratorModuleImportReferences(depModule, context, graph)
            }
        }
    }

    resolveUsingSource(id, group){
        return this.glob.dest(id, {group,failValue:null});
    }

    isModuleNeedUsing(depModule){
        if(depModule.isStructTable){
            return false;
        }
        let result = this.resolveUsingSource(depModule.getName('/'), 'usings');
        if(result===false){
            return false;
        }
        return true;
    }

    checkModuleImportExclude(module){
        const excludes = this.options.excludes;
        if(excludes && excludes.length > 0){
            let file = module.file;
            let className = module.getName('/');
            let test = (rule)=>{
                if(rule===file||rule===className)return true;
                if(rule instanceof RegExp){
                    if(file && rule.test(file))return true;
                    return rule.test(className);
                }
                return false;
            }
            if(excludes.some(test)){
                return true;
            }
        }
        return false;
    }


    resolveSourcePresetFlag(id, group){
        return this.glob.dest(id, {group,failValue:null});
    }

    resolveSourceId(id, group, delimiter='/'){
        if( group==='namespaces' || group==='usings'){
            delimiter = '\\';
        }
        let data = {group, delimiter, failValue:null};
        if(typeof group ==='object'){
            data = group;
        }
        return this.glob.dest(id, data);
    }

    insertTokenToBlock(stack, token){
        let parent = stack.getParentStack(stack=>stack.isBlockStatement || stack.isProgram);
        if(parent){
            let node = this.getNode(parent)
            if(node){
                if(parent.isBlockStatement){
                    node.body.push(token)
                }else if(parent.isProgram){
                    node.push(token)
                }
                return;
            }
        }
        throw new Error('Not find stack block-statement')
    }

    creaateAddressRefsNode(argument){
        const node = this.createNode('AddressReferenceExpression');
        node.argument = argument;
        return node;
    }

    getWasLocalRefsName(target, name){
        let key = 'getLocalRefName:'+name;
        if(this.cache.has(target, key)){
            return this.cache.get(target, key)
        }
        return null;
    }

    getAvailableOriginType( type ){
        if( type ){
            const origin = Utils.getOriginType(type);
            switch( origin.id ){
                case 'String' :
                case 'Number' :
                case 'Array' :
                case 'Function' :
                case 'Object' :
                case 'Boolean' :
                case 'RegExp' :
                    return origin.id;
                case 'Uint' :
                case 'Int' :
                case 'Float' :
                case 'Double' :
                    return 'Number';
                default :
            }
        }
        return null;
    }

    addVariableRefs(stack, desc, refsName){
        if(!Utils.isStack(desc))return;
        const name = refsName || desc.value();
        let funScope = stack.scope;
        const check = ( scope )=>{
            if( !scope )return;
            if( !scope.declarations.has( name ) ){
                return scope.children.some( child=>{
                    return check(child);
                });
            }
            return true;
        }
        while(funScope){
            let isForContext = funScope.isForContext;
            funScope = isForContext ? funScope.getScopeByType("block") : funScope.getScopeByType("function");
            if(!funScope)return;
            if( funScope.isMethod )return;
            if( !isForContext && !funScope.type('function') )return;
            if( isForContext && !funScope.type('block') )return;
            if( !check(funScope) ){
                let dataset = cache.get(funScope, 'addVariableRefs')
                if(!dataset){
                    dataset=new Set();
                    cache.set(funScope, 'addVariableRefs', dataset)
                }
                dataset.add(refsName || desc);
                if(!refsName && (desc.isVariableDeclarator || desc.isParamDeclarator)){
                    let addressRefObject = this.getAssignAddressRef(desc);
                    if(addressRefObject){
                        dataset.add(addressRefObject.createIndexName(desc));
                    }
                }
            }
            funScope = funScope.parent;
        }
    }

    getVariableRefs(stack){
        const isForContext = stack.scope.isForContext;
        const funScope = isForContext ? stack.scope.getScopeByType("block") : stack.scope.getScopeByType("function");
        return cache.get(funScope, 'addVariableRefs')
    }
   
    addAssignAddressRef(desc, value){
        if(!desc)return null;
        let address = cache.get(desc, 'addressVariable');
        if( !address ){
            address = new AddressVariable(desc, this);
            cache.set(desc, 'addressVariable', address);
        }
        if( value ){
            address.add( value );
        }
        return address;
    }

    getAssignAddressRef(desc){
        if(!desc)return null;
        return cache.get(desc, 'addressVariable');
    }

    isArrayAddressRefsType(type){
        if( type ){
            if(type.isTypeofType && type.origin){
                return this.isArrayAddressRefsType(type.origin.type())
            }else if( type.isUnionType ){
                return type.elements.every( item=>this.isArrayAddressRefsType( item.type() ) );
            }else if( type.isIntersectionType ){
                return this.isArrayAddressRefsType( type.left.type() ) && this.isArrayAddressRefsType( type.right.type() );
            }else if(type.isClassGenericType && !type.isClassType){
                return this.isArrayAddressRefsType(type.inherit.type())
            }
        }
        return type && (type.isLiteralArrayType || type.isTupleType || Namespace.globals.get('array') === type || Namespace.globals.get('Array')===type);
    }

    isArrayMappingType(type){
        if(!type)return false;
        if(type.isTypeofType && type.origin){
            return this.isArrayMappingType(type.origin.type())
        }
        if(!type.isModule)return false;
        if(type.dynamicProperties && type.dynamicProperties.size > 0 && Namespace.globals.get('Array').is(type) ){
            return type.dynamicProperties.has(Namespace.globals.get('string')) ||
                    type.dynamicProperties.has(Namespace.globals.get('number'));
        }
        return false;
    }

    isArrayAccessor(type){
        if(!type)return false;
        if(type.isUnionType){
            if(type.elements.length===1){
                return this.isArrayAccessor(type.elements[0].type());
            }
            return type.elements.every(type=>{
                type = type.type();
                if(type.isNullableType)return true;
                return this.isArrayAccessor(type)
            })
        }else if(type.isIntersectionType){
            return [type.left, type.right].every(type=>this.isArrayAccessor(type.type()))
        }
        if(type.isTypeofType && type.origin){
            return this.isArrayAccessor(type.origin.type())
        }else if( type.isInstanceofType ){
            return false;
        }else if(type.isLiteralObjectType || type.isLiteralType || type.isLiteralArrayType || type.isTupleType){
            return true;
        }else if(type.isAliasType){
            return this.isArrayAccessor(type.inherit.type())
        }else{
            const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
            if( isWrapType ){
                let inherit = type.inherit.type();
                if(this.isArrayAccessor(inherit)){
                    return true
                }
                if(Namespace.globals.get('ObjectProtector') === inherit){
                    return false;
                }
                if( Namespace.globals.get('ArrayProtector') === inherit ){
                    return true;
                }else if( type.types.length>0 ){
                    if( Namespace.globals.get('RMD') === inherit){
                        return this.isArrayAccessor( type.types[0].type() )
                    }
                }
            }else if(type.isClassGenericType){
                if(this.isArrayAccessor(type.inherit.type())){
                    return true
                }
            }
            const raw = this.compiler.callUtils("getOriginType",type);
            if( raw === Namespace.globals.get('Array') || this.isArrayMappingType( raw ) ){
                return true;
            }
        }
        return false
    }

    isObjectAccessor(type){
        if(!type)return false;
        if(type.isUnionType){
            if(type.elements.length===1){
                return this.isObjectAccessor(type.elements[0].type());
            }
            return type.elements.every(type=>{
                type = type.type();
                if(type.isNullableType)return true;
                return this.isObjectAccessor(type)
            })
        }else if(type.isIntersectionType){
            return [type.left, type.right].every(type=>this.isObjectAccessor(type.type()))
        }

        if(type.isTypeofType && type.origin){
            return this.isObjectAccessor(type.origin.type())
        }else if( type.isInstanceofType ){
            return true;
        }else if(type.isAliasType){
            return this.isObjectAccessor(type.inherit.type())
        }
        const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
        if( isWrapType ){
            const inherit = type.inherit.type();
            if(Namespace.globals.get('ArrayProtector')===inherit){
                return false;
            }
            if( type.types.length>0){
                if(Namespace.globals.get('RMD') === inherit){
                    return this.isObjectAccessor( type.types[0].type() );
                }
            }
            return Namespace.globals.get('ObjectProtector') === inherit;
        }
        return false;
    }

    isPassableReferenceExpress(stack, type){
        if(!stack || !stack.isStack)return false;
        if(stack.isLiteral || stack.isArrayExpression || stack.isObjectExpression)return false;
        if(stack.isThisExpression || stack.isTypeTransformExpression)return false;
        if( type ){
            return this.isAddressRefsType(type, stack);
        }
        return true;
    }

    isAddressRefsType( type , stack){
        const verify = (type)=>{
            if(type && type.isClassGenericType && type.inherit.isAliasType){
                const inheritType = type.inherit.type();
                if( inheritType === Namespace.globals.get('RMD') ){
                    return true;
                }else if(type.types.length>0 && (
                    inheritType === Namespace.globals.get('ArrayProtector') || 
                    inheritType === Namespace.globals.get('ObjectProtector'))
                ){
                    return verify(type.types[0].type());
                }
            }
        }

        if( verify(type) ){
            return true;
        }

        const result = this.isArrayAddressRefsType(type);
        if( !result )return false;
        if( !stack || !stack.isStack )return result;
        const cache = new WeakSet();
        const check=(stack, type)=>{
            if( type ){
                if( verify(type) ){
                    return true;
                }
                if( !this.isArrayAddressRefsType(type) )return false;
            }
            if(cache.has(stack))return true;
            cache.add(stack);
            if( stack.isIdentifier || stack.isVariableDeclarator || stack.isParamDeclarator || stack.isArrayExpression)return true;
            if( stack.isMethodDefinition && stack.expression){
                stack = stack.expression;
            }
            if( stack.isFunctionExpression ){
                const fnScope = stack.scope.getScopeByType("function");
                const returnItems = fnScope.returnItems;
                if( returnItems && returnItems.length > 0 ){
                    return returnItems.every( item=>{
                        return item.isReturnStatement && check(item.argument, item.argument.type());
                    });
                }
            }else if( stack.isCallExpression ){
                let desc = stack.descriptor();
                if( desc ){
                    if( desc.isFunctionType ){
                        desc = desc.target && desc.target.isFunctionExpression ? desc.target : null;
                    }
                    if( desc && (desc.isFunctionExpression || desc.isMethodDefinition || desc.isCallDefinition || desc.isDeclaratorFunction)){
                        return check(desc, stack.type() );
                    }
                }
            }else if( stack.isMemberExpression ){
                let desc = stack.description();
                if( desc && (desc.isPropertyDefinition || desc.isVariableDeclarator ||  desc.isParamDeclarator || desc.isTypeObjectPropertyDefinition) ){
                    return true;
                }else if( desc && desc.isProperty && desc.hasInit && desc.init){
                    return check( desc.init );
                }else if( desc && desc.isMethodGetterDefinition ){
                    return check( desc );
                }else{
                    return true;
                }
            }else if( stack.isLogicalExpression ){
                const isAnd = stack.node.operator.charCodeAt(0) === 38;
                if( isAnd ){
                    return check( stack.right, stack.right.type() );
                }else {
                    return check( stack.left, stack.left.type() ) || check( stack.right, stack.right.type() );
                }
            }else if( stack.isConditionalExpression ){
                return check( stack.consequent, stack.consequent.type() ) || check( stack.alternate, stack.alternate.type() );
            }else if(stack.isParenthesizedExpression){
                return check(stack.expression)
            }else if(stack.isAssignmentExpression){
                return check(stack.right)
            }
            return false;
        }
        return check(stack);
    }

    hasCrossScopeAssignment( assignmentSet , inFor){
        if( !assignmentSet )return false;
        if( inFor )return assignmentSet.size > 0;
        return assignmentSet.size > 1
    }

    hasCrossDescriptionAssignment( assignmentSet, desc){
        if( !assignmentSet )return false;
        if( assignmentSet.size < 1 )return false;
        const items = Array.from( assignmentSet.values() );
        return items.every( item=>{
            const d = item.isStack ? item.description() : item;
            return d !== desc;
        });
    }

    getAccessorName(name, desc, accessor='get'){
        if(Utils.isStack(desc) && desc.module){
            let module = desc.module;
            let key = 'accessor:'+accessor+':'+name
            let resolveName = cache.get(module, key);
            if(resolveName){
                return resolveName;
            }
            
            let suffix = name.substr(0,1).toUpperCase()+name.substr(1);
            let isStatic = !!(desc.static || module.static);
            let index = 0;
            resolveName = accessor+suffix;
            while(true){
                const has = isStatic ? module.getMethod(resolveName) : module.getMember(resolveName);
                if(!has)break;
                resolveName = key+(index++);
            }
            cache.set(module, key, resolveName)
            return resolveName;
        }else{
            let suffix = name.substr(0,1).toUpperCase()+name.substr(1);
            return accessor+suffix;
        }
    }

    getModuleAlias(module,context){
        if(!Utils.isModule(context))return null;
        const alias = context.getModuleAlias(module)
        if(alias){
            return alias;
        }
        return null;
    }

    getModuleMappingFolder(module){
        let isRM = Utils.isModule(module);
        let isVM = isRM ? false : this.isVModule(module);
        if(!(isRM || isVM))return null;
        let file = module.getName('/');
        if(module.isDeclaratorModule){
            let compilation = module.compilation;
            if(compilation){
                if(compilation.isGlobalFlag && compilation.pluginScopes.scope ==='global'){
                    file += '.global';
                }else if(isVM){
                    file += '.virtual';
                }else{
                    file += '.normal';
                }
            }
        }else{
            if(isVM){
                file += '.virtual';
            }else{
                file += '.normal';
            }
        }
        return this.resolveSourceFileMappingPath(file,'folders');
    }

    getModuleImportSource(source, context, sourceId = null) {
        const config = this.options;
        const isString = typeof source === "string";
        if (isString && source.includes("${__filename}")) {
          const owner = Utils.isModule(context) ? context.compilation : context;
          source = source.replace("${__filename}", Utils.isCompilation(owner) ? owner.file : this.target.file);
        }
        if (isString && source.includes("/node_modules/")) {
          if (path.isAbsolute(source))return source;
          if (!sourceId) {
            return this.resolveSourceFileMappingPath(source, "imports") || source;
          }
          return sourceId;
        }
        if (isString && !path.isAbsolute(source)) {
          return source;
        }
        if (config.emitFile) {
          return this.getOutputRelativePath(source, context);
        }
        return isString ? source : this.getModuleResourceId(source);
      }

    getModuleMappingNamespace(module){
        let isRM = Utils.isModule(module);
        let isVM = isRM ? false : this.isVModule(module);
        if(!(isRM || isVM))return null;
        let ns = module.id;
        if(module.isDeclaratorModule){
            ns = module.getName('/');
            let compilation = module.compilation;
            if(compilation){
                if(compilation.isGlobalFlag && compilation.pluginScopes.scope ==='global'){
                    ns += '.global';
                }else if(isVM){
                    ns += '.virtual';
                }
            }
        }else{
            ns = module.getName('/');
            if(isVM){
                ns += '.virtual';
            }
        }

        if(ns){
            const result = this.getMappingNamespace(ns);
            if(result)return result;
        }

        if( this.options.folderAsNamespace ){
            const folder = this.getModuleMappingFolder(module);
            if(folder){
                return folder.replace(/[\\\\/]/g, '\\');
            }
        }
        return null;
    }

    getMappingNamespace(id){
        return this.resolveSourceId(id, 'namespaces')
    }

    getModuleNamespace(module, suffix=null, imported=false){
        if(!module)return '';
        let folder = this.getModuleMappingNamespace( module );
        if(folder){
            if( suffix ){
               return '\\'+folder+'\\'+suffix;
            }
            return folder;
        }
        if(module.namespace && module.namespace.isNamespace ){
            const items = module.namespace.getChain();
            if( items.length > 0 || !imported ){
                if( suffix ){
                    return '\\'+items.concat( suffix ).join('\\');
                }
                return items.join('\\');
            }
        }else if(this.isVModule(module)){
            if(suffix){
                return '\\'+module.ns.concat(suffix).join('\\');
            }
            return module.ns.join('\\');
        }
        return !imported && suffix ? '\\'+suffix : '';
    }
    
    inferType(stack, context){
        if(!stack)return stack;
        if(Utils.isStack(stack)){
            if(!context)context = stack.getContext();
        }
        if(context){
            return context.apply(stack.type())
        }
        return stack;
    }

    createVarIdentifier(value, stack){
        const node = this.createIdentifier(value, stack);
        node.isVariable = true;
        return node;
    }

    createSuperExpression(){
        const node = this.createNode('SuperExpression');
        node.value = 'parent';
        node.raw = 'parent';
        return node;
    }

    createStaticMemberExpression(items, stack){
        const node = this.createMemberExpression(items,stack);
        node.isStatic = true;
        return node;
    }

    createUsingStatement(source, local, stack){
        const node = this.createNode(stack, 'UsingStatement');
        node.source = source;
        node.local = local;
        return node;
    }

    createNamespaceStatement(source){
        const node = this.createNode('NamespaceStatement');
        node.source = source;
        return node;
    }

    createImportDeclaration(source, specifiers, isExpression=false){
        let node = this.createCallExpression(
            isExpression ? this.createIdentifier('include') : this.createIdentifier('include_once'),
            [
                this.createBinaryExpression(
                    this.createIdentifier('__DIR__'),
                    this.createLiteral(source),
                    '.'
                )
            ]
        );
        if(specifiers && specifiers.length>0){

            if(specifiers.length>1){
                let refs = path.basename( this.genUniFileName(source) ).replace(/[\.\-]/g, '_')
                refs = this.getGlobalRefName(null, '_'+refs);
                node = this.createExpressionStatement(
                    this.createAssignmentExpression(this.createVarIdentifier(refs), node)
                );
                specifiers.forEach(spec=>{
                    if(spec.type ==='ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier'){
                        this.statments.push(this.createExpressionStatement(
                            this.createAssignmentExpression(
                                spec.local,
                                this.createBinaryExpression(this.createComputeMemberExpression([
                                    this.createVarIdentifier(refs),
                                    this.createLiteral('default')
                                ]), this.createLiteral(null), '??')
                            )
                        ));
                    }else if(spec.type==='ImportSpecifier'){
                        let local = spec.local;
                        let imported = spec.imported;
                        if(!imported){
                            if(local.type==='Identifier'){
                                imported = this.createLiteral(local.value)
                            }
                        }else if(imported.type==='Identifier'){
                            imported = this.createLiteral(imported.value)
                        }
                        this.statments.push(this.createExpressionStatement(
                            this.createAssignmentExpression(
                                local,
                                this.createBinaryExpression(
                                    this.createComputeMemberExpression([this.createVarIdentifier(refs), imported]),
                                    this.createLiteral(null),
                                    '??'
                                )
                            )
                        ));
                    }
                })

                return node;

            }else{

                if(specifiers[0].type ==='ImportDefaultSpecifier' || specifiers[0].type === 'ImportNamespaceSpecifier'){
                    return this.createAssignmentExpression(specifiers[0].local, node)
                }else if(specifiers[0].type==='ImportSpecifier'){
                    if( specifiers[0].imported && specifiers[0].imported.value !== specifiers[0].local.value){
                        let refs = path.basename( this.genUniFileName(source) ).replace(/[\.\-]/g, '_')
                        refs = this.getGlobalRefName(null, '_'+refs);
                        node = this.createAssignmentExpression(
                            this.createVarIdentifier(refs),
                            node
                        )
                        this.statments.push(this.createExpressionStatement(
                            this.createAssignmentExpression(
                                specifiers[0].local,
                                this.createBinaryExpression(
                                    this.createComputeMemberExpression([
                                        this.createVarIdentifier(refs),
                                        specifiers[0].imported
                                    ]),
                                    this.createLiteral(null),
                                    '??'
                                )
                            )
                        ))
                    }else{
                        return this.createAssignmentExpression(specifiers[0].local, node)
                    }
                }
            }
        }
        return node;
    }

    createImportSpecifier(local, imported=null, hasAs=false){
        if(!local)return null;
        if(imported && !hasAs){
           const node = this.createNode('ImportSpecifier');
           node.imported = this.createIdentifier(imported);
           node.local = this.createVarIdentifier(local);
           return node;
        }else if( hasAs ){
            const node = this.createNode('ImportNamespaceSpecifier');
            node.local = this.createVarIdentifier(local);
            return node;
        }else{
            const node = this.createNode('ImportDefaultSpecifier');
            node.local = this.createVarIdentifier(local);
            return node;
        }
    }
}
export default Context;