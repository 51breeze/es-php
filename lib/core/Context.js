import path from 'path';
import BaseContext from "@easescript/transform/lib/core/Context";
import {getCacheManager} from "@easescript/transform/lib/core/Cache";
import AddressVariable from "./AddressVariable";
import Namespace from "easescript/lib/core/Namespace";
import Utils from "easescript/lib/core/Utils";
import { createUniqueHashId, createStaticReferenceNode, isExcludeDependency} from './Common';
import { isVModule } from './VirtualModule';
const cache = getCacheManager('php')
const globalModules = ['Array','Object','Boolean','Math','Number','String']

class Context extends BaseContext{

    #usings = new Map();
    #statments = [];
    #moduleAlias = null;
    get usings(){
        return this.#usings;
    }

    get statments(){
        return this.#statments;
    }

    getLayouts(imports, body, externals,  exports){
        return [
            ...imports,
            ...Array.from(this.usings.values()),
            ...this.statments,
            ...this.beforeBody,
            ...body,
            ...this.afterBody,
            ...externals,
            ...exports
        ];
    }

    getFormatCode(code){
        if(this.options.strict){
            return '<?php\r\ndeclare (strict_types = 1);\r\n'+code;
        }else{
            return '<?php\r\n'+code;
        }
    }

    getPublicDir(){
        return this.options.publicPath || 'public';
    }

    #vnodeHandleNode = null;
    createVNodeHandleNode(stack, ...args){
        let handle = this.#vnodeHandleNode;
        if(!handle){
            let name = 'createVNode';
            let local = this.getGlobalRefName(stack, name);
            let VNode = Namespace.globals.get('VNode');
            let ns = this.getModuleNamespace(VNode, name);
            if(local !== name){
                this.addUsing(ns, local);
            }else{
                local = ns;
            }
            this.addDepend(VNode);
            handle = this.createIdentifier(local);
            this.#vnodeHandleNode = handle;
        }
        return this.createCallExpression(handle,args);
    }

    getVNodeApi(name){
        console.log(name)

        let esxVM = this.getVModule("web.ESX");
        let local = this.getGlobalRefName(null, name);
        let ns = this.getModuleNamespace(esxVM, name);
        if(local !== name){
            this.addUsing(ns, local);
        }else{
            local = ns;
        }
       
        this.addDepend(esxVM)
        const source = this.getModuleImportSource(esxVM, this.target);
        const importSource = this.addImport(source);
        importSource.setSourceTarget(esxVM);
        let graph = this.getBuildGraph();
        graph.addImport(importSource);

        return local;
    }

    createModuleUsing(depModule, context){
        if(!globalModules.includes(depModule.id)){
            let source = this.getModuleNamespace(depModule);
            if(source){
                source += '\\'+depModule.id
            }else if(Utils.isModule(context) || Utils.isCompilation(context)){
                let ns = context.namespace;
                if(ns && ns.parent){
                    source = '\\'+depModule.id;
                }
            }
            if( source ){
                let local = this.getModuleAlias(depModule, context);
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
                if(!(Utils.isModule(depModule) || isVModule(depModule)))return;
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
            if(!(Utils.isModule(depModule) || isVModule(depModule)))return;
            if(compilation && compilation.modules && compilation.modules.has(depModule.getName())){
                return;
            }
            this.createModuleImportAndUsing(graph, module, depModule, importFlag)
        });
    }

    createModuleImportAndUsing(graph, context, depModule, importFlag=true){
        if(context === depModule || !this.isNeedBuild(depModule))return;
        let isRM = Utils.isModule(depModule);
        let isVM = this.isVModule(depModule);
        if(!(isVM || isRM))return;
        let isDRM = !isVM && isRM && depModule.isDeclaratorModule;
        graph.addDepend(depModule);
        if(isDRM){
            if(this.isModuleNeedUsing(depModule)){
                this.createModuleUsing(depModule, context)
            }
            this.createDeclaratorModuleImportReferences(depModule, context, graph)
        }else{
            if(importFlag){
                if(!this.checkModuleImportExclude(depModule)){
                    const source = this.getModuleImportSource(depModule, context);
                    const importSource = this.addImport(source)
                    importSource.setSourceTarget(depModule);
                    graph.addImport(importSource)
                }
            }
            this.createModuleUsing(depModule, context)
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
        return isExcludeDependency(this.options.dependency.excludes, module.file||module.getName('/'), module);
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
                if(token.type!=='ExpressionStatement'){
                    token = this.createExpressionStatement(token)
                }
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

    getClassBuilder(stack){
        let parent = stack.getParentStack(stack=>stack.isClassDeclaration);
        if(parent && parent.isClassDeclaration){
            let node = this.getNode(parent)
            if(node){
                return node;
            }
        }
        throw new Error('Not find stack class-builder')
    }

    creaateAddressRefsNode(argument){
        const node = this.createNode('AddressReferenceExpression');
        node.argument = argument;
        return node;
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
                        dataset.add(addressRefObject.createIndexName(stack, desc));
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
            const raw =  Utils.getOriginType(type);
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
            let _name = accessor+suffix;
            resolveName = _name;
            while(true){
                const has = isStatic ? module.getMethod(resolveName) : module.getMember(resolveName);
                if(!has)break;
                resolveName = _name+(index++);
            }
            cache.set(module, key, resolveName)
            return resolveName;
        }else{
            let suffix = name.substr(0,1).toUpperCase()+name.substr(1);
            return accessor+suffix;
        }
    }
    
    getModuleReferenceName(module,context=null){
        let name = null;
        let vm = null;
        let key = module;
        if(isVModule(module)){
            let m = module.bindModule;
            if(!m){
                vm = module;
            }else{
                module = m;
                key = m;
            }
        }else if(!Utils.isModule(module)){
            return null;
        }

        if(module === context || module === this.target){
            return module.id 
        }

        if(vm){
            return vm.id;
        }
        if(!context)context = this.target;
        name = module.id;
        let hasDefined = false;
        if(Utils.isModule(context)){
            if(module.required || context.imports && context.imports.has(module.id) ){
                hasDefined = !!module.required;
                if(!hasDefined){
                    hasDefined = context.imports.get(module.id).type() === module.type();
                }
            }else if(context.isDeclaratorModule){
                const vm = this.getVModule(context.getName());
                if(vm){
                    let _name = vm.getReferenceName(module.getName());
                    if(_name){
                        name = _name;
                        hasDefined = true;
                    }
                }
            }
        }
        if(hasDefined){
            return name;
        }
        let alias = this.getModuleAlias(module, context);
        if(alias){
            name = alias;
        }else{
            name = module.id;
            if(module.namespace && module.namespace.parent){
                name = module.getName('_');
            }
            name = this.getGlobalRefName(null, name, module);
            this.setModuleAlias(module, name);
        }
        return name;
    }

    getModuleAlias(module,context){
        if(!Utils.isModule(module))return null;
        let alias = Utils.isCompilation(context) ? 
            context.importModuleNameds.get(module) : 
                Utils.isModule(context) ? 
                    context.getModuleAlias(module) : null;

        if(!alias){
            let mapping = this.#moduleAlias;
            if(mapping){
                alias = mapping.get(module);
            }
        }   

        if(alias === module.id)return null;
        if(alias){
            return alias;
        }
        return null;
    }

    setModuleAlias(module, name){
        let moduleAlias = this.#moduleAlias;
        if(!moduleAlias){
            moduleAlias = this.#moduleAlias = new Map();
        }
        moduleAlias.set(module, name);
        return name;
    }

    getModuleMappingFolder(module){
        let isRM = Utils.isModule(module);
        let isVM = isRM ? false : isVModule(module);
        if(!(isRM || isVM))return null;
        if(isVM){
            let bindM = module.bindModule;
            if(bindM && Utils.isModule(bindM)){
                module = bindM;
                isRM = true;
                isVM = false;
            }
        }
        let file = module.file || (module.getName('/')+'.source');
        if(isRM && module.isDeclaratorModule){
            let compilation = module.compilation;
            if(compilation){
                if(compilation.isGlobalFlag && compilation.pluginScopes.scope ==='global'){
                    file += '.global';
                }else{
                    file += '.declare';
                }
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
        let file = module.getName('/');
        if(file){
            const result = this.getMappingNamespace(file);
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

    getModuleNamespace(module, suffix=null){
        if(!module)return '';
        let folder = this.getModuleMappingNamespace(module);
        if(folder){
            if( suffix ){
               return '\\'+folder+'\\'+suffix;
            }
            return folder;
        }
        if(module.namespace && module.namespace.isNamespace ){
            const items = module.namespace.getChain();
            if( items.length > 0 ){
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
        return suffix ? '\\'+suffix : '';
    }
    
    inferType(stack, context=null){
        if(!stack)return stack;
        if(!context && Utils.isStack(stack)){
            context = stack.getContext();
        }
        if(context){
            return context.infer(stack.type())
        }
        return stack.type();
    }

    createThisExpression(stack=null){
        return this.createNode(stack, 'ThisExpression');
    }

    createSuperExpression(stack=null){
        const node = this.createNode(stack,'SuperExpression');
        node.value = 'parent';
        node.raw = 'parent';
        return node;
    }

    createLiteral(value, raw, stack=null){
        const node = this.createNode(stack, 'Literal');
        node.value = value;
        if(raw === void 0){
            if( typeof value === 'string'){
                node.raw = `'${value}'`;
            }else{
                node.raw = String(value); 
            }
        }else{
            node.raw = String(value);
        }
        return node;
    }

    createVarIdentifier(value, stack=null){
        const node = this.createIdentifier(value, stack);
        node.isVariable = true;
        return node;
    }

    createStaticMemberExpression(items, stack=null){
        const node = this.createMemberExpression(items,stack);
        node.isStatic = true;
        return node;
    }

    createUsingStatement(source, local, stack=null){
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

    getNormalImportName(source){
        let ext = path.extname(source);
        let name = path.basename(source, ext);
        let refs = name.replace(/[\.\-]/g, '_');
        return this.getGlobalRefName(null, '_'+refs);
    }

    createImportDeclaration(source, specifiers, isExpression=false, origin=null, imports=[]){
        if(!isExpression){
            isExpression = Array.isArray(specifiers) && specifiers.length>0;
        }
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
            let setScopeVariable = null;
            let multi = specifiers.length>1;
            if( origin && Utils.isCompilation(origin) && Utils.isCompilation(this.target) && this.target.mainModule){
                let hashId = createUniqueHashId(this.target.file);
                let added = false;
                setScopeVariable = (local, value)=>{
                    if(!added){
                        added = true;
                        let deps = this.dependencies.get(this.target);
                        let System = Namespace.globals.get('System');
                        let has = deps ? deps.has(System) : false;
                        if(!has && imports){
                            this.addDepend(System, this.target);
                            const source = this.getModuleImportSource(System, this.target);
                            const node = this.createImportDeclaration(source);
                            if(node){
                                this.createModuleUsing(System, this.target)
                                imports.push(this.createExpressionStatement(node));
                            }
                        }
                    }
                    return this.createExpressionStatement(this.createCallExpression( 
                        createStaticReferenceNode(this, this.target, 'System', 'registerScopeVariables'),
                        [
                            this.createLiteral(hashId),
                            local,
                            value
                        ]
                    ))
                }
            }

            let refs = this.getNormalImportName(source)
            let nameNode = this.createVarIdentifier(refs);
            node = this.createExpressionStatement(
                this.createAssignmentExpression(nameNode, node)
            );
            specifiers.forEach(spec=>{
                if(spec.type ==='ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier'){
                    let refValue = multi ? this.createBinaryExpression(
                            this.createComputeMemberExpression([
                                nameNode,
                                this.createLiteral('default')
                            ]), 
                            this.createLiteral(null),
                            '??'
                        ) : nameNode;
                    let refNode = this.createAssignmentExpression(
                        spec.local,
                        refValue
                    );
                    this.statments.push(this.createExpressionStatement(refNode));
                    if(setScopeVariable){
                        this.statments.push(setScopeVariable(this.createLiteral(spec.local.value), spec.local) )
                    }
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
                    this.statments.push(this.createExpressionStatement(this.createAssignmentExpression(
                        local,
                        this.createBinaryExpression(
                            this.createComputeMemberExpression([
                                nameNode,
                                imported
                            ]),
                            this.createLiteral(null),
                            '??'
                        )
                    )));
                    if(setScopeVariable){
                        this.statments.push(setScopeVariable(this.createLiteral(local.value), local))
                    }
                }
            });
            if(isExpression){
                this.statments.unshift(node);
                return null;
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