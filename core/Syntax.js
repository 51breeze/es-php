const Constant = require("./Constant");
const Polyfill = require("./Polyfill");
const PATH = require("path");
const events = require('events');
const AddressVariable = require("./AddressVariable");
const createdStackData = new Map();
const refsParentVariable = new Map();
class Syntax extends events.EventEmitter {
    constructor(stack){
        super();
        this.stack = stack;
        this.parentStack = stack.parentStack;
        this.scope = stack.scope;
        this.compilation = stack.compilation;
        this.compiler = stack.compiler;
        this.module = stack.module; 
    }

    getComment(){
        return this.stack.comments;
    }

    getModuleById( id ){
        return this.compilation.getModuleById(id);
    }

    getGlobalModuleById( id ){
        return this.compilation.getGlobalTypeById(id);
    }

    isNumberType(){
        return Array.from(arguments).every( stack=>{
            let type = stack.type();
            if( type.isLiteralType ){
                type = type.inherit;
            }
            const name = type.toString().toLowerCase();
            switch( name ){
                case "number" :
                case "int" :
                case "uint" :
                case "float" :
                case "double" :
                    return true;
            }
            return false;
        });
    }

    createDataByStack(stack){
        let data = createdStackData.get(stack);
        if( !data ){
            createdStackData.set(stack,data = {});
        }
        return data;
    }

    addAssignAddressRef(target, value){
        const data = this.createDataByStack(target);
        if( !data.AddressVariable ){
            data.AddressVariable = new AddressVariable( target, this );
        }
        if( value ){
            data.AddressVariable.add( value );
        }
        return data.AddressVariable;
    }

    hasCrossScopeAssignment( assignSetObject ){
        if( !assignSetObject )return false;
        const items = Array.from( assignSetObject.values() );
        if( items.length < 1 )return false;
        const firstScope = items[0].scope;
        return items.some( item=>{
           return item.scope !== firstScope;
        });
    }

    hasAssigned( stack ){
        if( stack && (stack.isVariableDeclarator || stack.isParamDeclarator) ){
            if( stack.isAssignmentPattern || stack.init ){
                return stack.assignItems.size > 1;
            }
            return stack.assignItems.size > 0;
        }
        return false;
    }

    getAssignAddressRef(target){
        if(!target)return null;
        const data = this.createDataByStack(target);
        return data.AddressVariable;
    }

    addVariableRefs( stack ){
        const name = stack.value();
        let funScope = this.scope;
        while( funScope && (funScope = funScope.getScopeByType("function")) && !funScope.isMethod && funScope.type('function') ){
            const check = ( scope )=>{
                if( !scope )return;
                if( !scope.declarations.has( name ) ){
                    return scope.children.some( child=>{
                        return check(child);
                    });
                }
                return true;
            }
            if( !check( funScope ) ){
                let dataset = refsParentVariable.get(funScope);
                if(!dataset){
                    dataset=new Set();
                    refsParentVariable.set(funScope,dataset);
                }
                dataset.add(stack);
            }
            funScope = funScope.parent;
        }
    }

    createArrayRefs(desc,object){
        const assignAddress = this.getAssignAddressRef(desc);
        if( assignAddress ){
            if( this.hasCrossScopeAssignment( desc.assignItems ) ){
                const dataset = this.createDataByStack(desc);
                const key = `get_array_refs_${object}`;
                let method_name = dataset[ key ];
                if( !method_name ){
                    const content = [];
                    const indent =  this.getIndent();
                    const assert =  '$'+this.generatorVarName(desc,"_ARV");
                    const uses = [object, assert];
                    let itemIndex = 0;
                    method_name = '$'+this.generatorVarName(desc,`_REF`,true);
                    desc.assignItems.forEach( (item)=>{
                        const desc = item.description();
                        if( assignAddress.hasName(desc) ){
                            const refs = '$'+assignAddress.getName(desc);
                            uses.push( refs );
                            content.push(`${indent}\t\tcase ${itemIndex++} : return ${refs};`);
                        }
                    });
                    content.push(`${indent}\t\tdefault: return ${object};`);
                    const push_method = [
                        `function &()use(&${uses.join(',&')}){`,
                        `${indent}\tif(${assert}===null)return ${object};`,
                        `${indent}\tswitch(${assert}){`, 
                        content.join("\r\n"), 
                        `${indent}\t}`,
                        `${indent}};`
                    ].join("\r\n");
                    this.insertExpression(`${indent}/*References ${object} memory address*/\r\n${indent}${method_name} = ${push_method}`);
                    dataset[ key ] = method_name;
                }
                return `${method_name}()`;
            }else{
                const rd = assignAddress.getLastAssignedRef();
                if( rd ){
                   return '$'+rd; 
                }
            }
        }
        return object;
    }

    getVariableRefs(){
        const funScope = this.scope.getScopeByType("function");
        return refsParentVariable.get(funScope);
    }

    firstToUpper(name){
        return name.substr(0,1).toUpperCase()+name.substr(1);
    }

    getAvailableTypeName( type ){
        if( type ){
            if(type.isGenericType || type.isClassGenericType || type.isFunctionType || type.isVoidType ){
                return null;
            }
            if( type.isTupleType || type.isLiteralArrayType ){
                return 'array';
            }
            if( type.isLiteralObjectType || type.toString() ==='Object' || type.toString() ==='object' ){
                return null;
            }
            if( type.isLiteralType){
                type = type.inherit;
            }
            switch( type.toString().toLowerCase() ){
                case "string" : 
                    return 'string';
                case "int" : 
                case "bigint" : 
                case "inter" : 
                case "uint" : 
                case "number" : 
                    return 'int';
                case "double" : 
                case "float" : 
                    return 'float';
                case "boolean" : 
                    return 'bool';
                case "array" : 
                    return 'array';
            }
            type = this.compiler.callUtils("getOriginType", type);
            if( this.isDependModule( type, true ) ){
                return type.id;
            }
        }
        return null;
    }

    getReferenceNameByModule(module, flag=false){
        const polyfillModule = module.isDeclaratorModule && Polyfill.modules.get(module.id);
        if( polyfillModule && polyfillModule.export && polyfillModule.isClass ){
            const paths = polyfillModule.namespace.split('.').concat(polyfillModule.export);
            return '\\'+paths.join("\\");
        }

        if( !flag ){
            if( this.module ){
                const imports = this.module.imports;
                if( imports && imports.has( module.id ) ){
                    return module.id;
                }
                if( this.module.importAlias && this.module.importAlias.has(module) ){
                    return this.module.importAlias.get(module);
                }
            }
            if( module === this.module ){
                return module.id;
            }
        }
        return '\\'+module.namespace.getChain().concat(module.id).join("\\");
    }

    getClassStringName( module, flag=false ){
        const name = this.getReferenceNameByModule(module, flag);
        return `'${name}'`;
    }

    getEventName( name ){
        return `${this.name}.${name}`;
    }

    isUsed(module){
        if( !module )return false;
        return module.used || module.compilation=== this.compilation || (module.compilation && module.compilation.isMain) ;
    }

    isRuntime( name ){
        switch( name.toLowerCase() ){
            case "client" :
                return this.platform === "client";
            case  "server" :
                return this.platform === "server";
        }
        return false;
    }

    isSyntax( name ){
        return name.toLowerCase() === this.name;
    }

    checkRefsName(name){
        if( this.scope.isDefine(name) ){
            const topStack = this.stack.getParentStack((stack)=>!!stack.isClassDeclaration);
            var classScope = this.scope.getScopeByType("class");
            var value = this.generatorVarName(topStack,name);
            classScope.dispatcher("insertTopRefsToClassBefore",{name,value});
            return value;
        }
        return name;
    }

    generatorVarName(stack,name,flag=false, scope=null){
        const dataset = this.createDataByStack(stack);
        if( dataset.hasOwnProperty(name) ){
            return dataset[name];
        }
        const stackScope = stack.scope || this.scope;
        const value = stackScope.generateVarName(name, flag);
        if( scope ){
            const data = this.createDataByStack(scope);
            if( !data.generatorVariables ){
                data.generatorVariables = new Set();
            }
            data.generatorVariables.add( value );
        }
        return dataset[name] = value;
    }

    getGeneratorVarName(stack,name,scope=null){
        const dataset = this.createDataByStack(stack);
        const value = dataset[name] || null;
        if( scope ){
            const data = this.createDataByStack(scope);
            if( data.generatorVariables && data.generatorVariables.has( value ) ){
                return value;
            }
            return null;
        }
        return value
    }

    generatorRefName(target, name, key, callback){
        const dataset = this.createDataByStack(target);
        if( dataset.hasOwnProperty(key) ){
            return dataset[key];
        }
        const block = target.getParentStack( stack=>!!stack.isBlockStatement );
        const refName =  this.generatorVarName(target,name);
        block.dispatcher("insert",this.semicolon(`\$${refName} = ${callback()}`));
        return dataset[key] = refName;
    }

    insertExpression(expression,target=null){
        target = target || this.stack; 
        const block = target.getParentStack( stack=>!!stack.isBlockStatement );
        block.dispatcher("insert",expression);
    }

    // getOutputAbsolutePath(module){
    //     const options = this.getOptions();
    //     const config = this.getConfig();
    //     const suffix = config.suffix||".php";
    //     const output = config.output || options.output;
    //     const workspace = config.workspace || options.workspace;
    //     if(module && module.isDeclaratorModule ){
    //         const isPolyfill = Polyfill.modules.has( module.id );
    //         const polyfillModule = isPolyfill ? Polyfill.modules.get( module.id ) : null;
    //         const filename = (polyfillModule && polyfillModule.export ? polyfillModule.export : module.id)+suffix;
    //         if( polyfillModule ){
    //             return PATH.join(output,polyfillModule.namespace.replace(/\./g,'/'),filename).replace(/\\/g,'/');
    //         }
    //         return PATH.join(output,module.getName("/")+suffix).replace(/\\/g,'/');
    //     }
    //     const filepath = PATH.resolve(output, PATH.relative( workspace, module.file ) );
    //     const info = PATH.parse(filepath);
    //     if( info.ext !== suffix ){
    //        return PATH.join(info.dir,info.name+suffix).replace(/\\/g,'/');
    //     }
    //     return filepath.replace(/\\/g,'/');
    // }

    getOutputRelativePath(module,context){
        const contextPath = this.getOutputAbsolutePath(context);
        const modulePath  = this.getOutputAbsolutePath(module);
        return './'+PATH.relative( PATH.dirname(contextPath), modulePath ).replace(/\\/g,'/');
    }


    getOutputAbsolutePath(module, flag){
        const options = this.getOptions();
        const config = this.getConfig();
        const suffix = config.suffix||".php";
        const workspace = config.workspace || this.compiler.workspace;
        const output = config.output || options.output;
        if( !flag && module && module.isModule ){
            if( module.isDeclaratorModule ){
                const polyfillModule = Polyfill.modules.get( module.getName() );
                const filename = module.id+suffix;
                if( polyfillModule ){
                    return PATH.join(output,(polyfillModule.namespace||config.ns).replace(/\./g,'/'),filename).replace(/\\/g,'/');
                }
                return PATH.join(output,module.getName("/")+suffix).replace(/\\/g,'/');
            }else if( module.compilation.isDescriptionType ){
                return PATH.join(output,module.getName("/")+suffix).replace(/\\/g,'/');
            }
        }
        let filepath = flag && typeof module === "string" ? module : 
        module && module.isModule && this.compiler.normalizePath( module.file ).includes(workspace) ?
        PATH.resolve(output, PATH.relative( workspace, module.file ) ) :
        PATH.join(output,module.getName("/")+suffix).replace(/\\/g,'/') ;

        const info = PATH.parse(filepath);
        if( info.ext !== suffix ){
           return PATH.join(info.dir,info.name+suffix).replace(/\\/g,'/');
        }
        return filepath.replace(/\\/g,'/');
    }


    getOptions(){
        return this.compiler.options;
    }

    getConfig( name ){
        const config = this.compiler.getPlugin( this.name ).config();
        if( name ){
            if( name.lastIndexOf(".") > 0 ){
                const keys = name.split('.');
                let object = config;
                do{
                    if( typeof object !=="object" ){
                        return null;
                    }
                    object = object[ keys.shift() ] || null;
                }while( keys.length > 0 );
                return object;
            }
            return config[name];
        }
        return config;
    }

    inCaseStatement(){
        let stack = this.stack.parentStack;
        while( stack && !stack.isSwitchCase ){
            stack=stack.parentStack;
        }
        return !!(stack && stack.isSwitchCase);
    }

    getIndentNum( num=null ){
        let level = num === null ? this.scope.level : num;
        if( num === null ){
            const fnScope = this.scope.getScopeByType("function");
            if( fnScope && fnScope.parent && fnScope.parent.type("top") && !this.stack.parentStack.isCallExpression ){
                level+=1;
            }else if( this.scope.parent && this.stack.isFunctionExpression ) {
                level = this.scope.parent.level;
            }else if( !this.stack.isBreakStatement && this.inCaseStatement() ){
                level+=1;
            }
        }
        return level;
    }

    getIndent(num=null){
        var level = this.getLevel( this.getIndentNum(num) );
        return level > 0 ? "\t".repeat( level ) : '';
    }

    getLevel( level ){
        return level-1;
    }
    
    semicolon(expression){
        if( !expression )return "";
        if( expression.charCodeAt( expression.length-1 )===59){
            return `${this.getIndent()}${expression}`;
        }
        return `${this.getIndent()}${expression};`;
    }

    checkMetaTypeSyntax( metaTypes ){
        metaTypes = metaTypes.filter( item=>item.name ==="Runtime" || item.name ==="Syntax");
        return metaTypes.length > 0 ? metaTypes.every( item=>{
            const desc = item.description();
            const value = desc.params[0];
            const expect = desc.expect !== false;
            switch( item.name ){
                case "Runtime" :
                    return this.isRuntime(value) === expect;
                case "Syntax" :
                    return this.isSyntax(value) === expect;
            }
            return true;
        }) : true;
    }
   
    addDepend( depModule ){
        const module = this.module;
        if( typeof depModule === "string"){
            depModule = this.getModuleById(depModule);
        }
        if( !depModule.isModule || depModule === this.module )return;
        this.compilation.addDependency(depModule,module);
    }

    getDependencies( module ){
        return this.compilation.getDependencies(module) || [];
    }

    isDependModule(depModule, isRealClass=false){
        if( !depModule )return false;
        const isRequire = this.isUsed(depModule) && !depModule.file.includes("\\easescript\\lib") && !this.compiler.callUtils("checkDepend", this.module, depModule);
        const polyfillModule = depModule.isDeclaratorModule && Polyfill.modules.get(depModule.id);
        if( isRequire || (polyfillModule && polyfillModule.export && (!isRealClass || polyfillModule.isClass))){
            return true;
        }
        return false;
    }

    isNeedBuild(module){
        if(!module)return false;
        const isDeclaratorModule = module.isDeclaratorModule;
        const isPolyfill = isDeclaratorModule && Polyfill.modules.has( module.id );
        return !isDeclaratorModule || isPolyfill;
    }

    isBaseType( type ){
        if( !type )return false;
        switch( true ){
            case type.isLiteralObjectType :
            case type.isLiteralArrayType :
                return true;
        }
        switch( type.toString() ){
            case 'string' :
            case 'RegExp' :
                return true;
        }
        return false;
    }

    isDeclaratorModuleMember( desc , global=false){
        if( !desc )return false;
        if( desc.isStack && desc.module && desc.module.isDeclaratorModule){
            return global ? desc.module.file.includes("\\easescript\\lib") : true;
        }else if( desc.isType && desc.target && desc.target.module && desc.target.module.isDeclaratorModule ){
            return global ? desc.target.module.file.includes("\\easescript\\lib") : true;
        }
        return false;
    }

    isIteratorInterface(module){
        return module && module.isInterface && module.isDeclaratorModule && module.id === 'Iterator';
    }

    getModuleFile(module, uniKey, type){
        return this.compiler.normalizeModuleFile(module, uniKey, type);
    }

    getModuleReferenceName(module,context){
        context = context || this.module;
        if( !module )return null;
        if( module.required ){
            return module.id;
        }
        if( context ){
            if( context.compilation.isDescriptionType ){
                return module.id;
            }
            return context.getReferenceNameByModule( module );
        }
        return module.namespace.getChain().concat(module.id).join("_");
    }

    createModuleAssets(module,refs){
        refs = refs || [];
        const push = (value)=>{
            if( refs.indexOf(value) < 0 ){
                refs.push( value );
            }
        }
        const target = module || this.compilation;
        const assets = target.assets;
        const config = this.getConfig();
        const isWebpack = config.webpack;
        if( assets && assets.size > 0 && isWebpack ){
            assets.forEach( asset=>{
                if( asset.file ){
                    if( asset.assign ){
                        push( this.createImport( `${asset.assign}`, asset.file ) )
                    }else{
                        push( this.createImport( null, asset.file ) );
                    } 
                }else if( asset.type ==="style" && config.styleLoader && module ){
                    const filename = config.styleLoader.concat( this.getModuleFile(module, asset.resolve, asset.type) ).join('!');
                    push( this.createImport( null, filename ) );
                }
            });
        }
        return refs;
    }

    createModuleRequires(module,refs){
        refs = refs || [];
        const push = (value)=>{
            if( refs.indexOf(value) < 0 ){
                refs.push( value );
            }
        }
        const target = module || this.compilation;
        if( target.requires && target.requires.size > 0 ){
            target.requires.forEach( item=>{
                const file = this.compiler.normalizePath( item.from );
                if( item.extract ){
                    const key = item.key;
                    const name = item.name;
                    if( name !== key ){
                        push( this.createImport( `{${key} as ${name}}`, file ) )
                    }else{
                        push( this.createImport( `{${name}}`, file ) )
                    }
                }else{
                    push( this.createImport( `${item.key}`, file ) )
                }
            });
        }
        return refs;
    }

    createDependencies(module, refs, requires){
        refs = refs || [];
        requires = requires || refs;
        const push=( value )=>{
            if(!requires.includes(value )){
                requires.unshift( value );
            }
        }
        const importAlias = module.importAlias;
        this.getDependencies(module).forEach( depModule=>{
            if( this.isDependModule(depModule) ){
                const polyfillModule = depModule.isDeclaratorModule && Polyfill.modules.get(depModule.id);
                const alias = importAlias.has(depModule) ? importAlias.get(depModule) : null;
                const file = this.getOutputRelativePath(depModule,  module);
                let paths = null;
                if( polyfillModule ){
                    if( polyfillModule.export ){
                        paths = polyfillModule.namespace.split('.').concat(polyfillModule.export);
                        push( `require_once('${file}');` );
                        if( !polyfillModule.isClass ){
                            paths = null;
                        }else  if( !polyfillModule.namespace ){
                            paths = null;
                        }
                    }
                }else{
                    paths = depModule.namespace.getChain().concat(depModule.id);
                    if( !depModule.isDeclaratorModule ){
                        push( `require_once('${file}');` );
                    }
                    if( !depModule.namespace.identifier ){
                        paths = null;
                    }
                }
                if( paths ){
                    refs.push( this.createImport('\\'+paths.join("\\"), alias) );
                }
            }
        });
        return refs;
    }

    createImport(name, alias){
        if( alias ){
            return `use ${name} as ${alias};`;
        }
        return `use ${name};`;
    }

    getImps(module){
        return module.implements.filter( module=>{
            const result = module.isInterface;
            if( result ){
                this.addDepend( module )
                return true;
            }
        });
    }

    getInherit(module){
        const inherit = module.extends.filter( module=>module.isClass );
        if( this.isDependModule(inherit[0], true) ){
            this.addDepend( inherit[0] );
            return inherit[0];
        }
        return null;
    }

    getAccessorName(desc,type,name){
        if( !desc || !desc.module || !desc.isStack )return name;
        if( desc.isAccessor ){
            const origin = name;
            name = type+this.firstToUpper( name );
            const has =(name)=>{
                const result = desc.static ? desc.module.getMethod(name) : desc.module.getMember(name);
                if( result && desc.modifier && desc.modifier.value() ==="private" && desc.module !== result.module ){
                    return false;
                }
                return !!result;
            }
            if( has(name) ){
                const data = this.createDataByStack(desc.module);
                if( !data.hasOwnProperty("methodAccessorNames") ){
                    data.methodAccessorNames = {};
                }
                if( !data.methodAccessorNames.hasOwnProperty(type) ){
                    data.methodAccessorNames[type]={};
                }
                if( !data.methodAccessorNames[type].hasOwnProperty(origin) ){
                    let index=1;
                    let key = name;
                    while( has( key = name+(index++) ) );
                    data.methodAccessorNames[type][origin]=key;
                }
                return data.methodAccessorNames[type][origin];
            }
            return name;
        }else{
            this.error(`'${name}' is not ${type} acessor.`);
        }
    }

    getAccessorNamesByModule( module ){
        const data = createdStackData.get(module);
        if( !data || !data.methodAccessorNames)return null;
        return data.methodAccessorNames;
    }

    getJsxCreateElementHandle(){
        return 'createElement';
    }

    getJsxCreateElementRefs(){
        return 'this.createElement.bind(this)';
    }

    emitCreateElement(){
        return this.semicolon(`var ${this.getJsxCreateElementHandle()} = ${this.getJsxCreateElementRefs()}`)
    }

    isInheritWebComponent(classModule){
        if( webComponents.has(classModule) ){
            return true;
        }
        while( classModule ){
            const stack = this.compilation.getStackByModule( classModule );
            if( stack && stack.annotations  && Array.isArray(stack.annotations) ){
                if( stack.annotations.some( item=>item.name.toLowerCase() === 'webcomponent' ) ){
                    webComponents.set(classModule, true);
                    return true;
                }
            }
            classModule=classModule.inherit;
        }
        webComponents.set(classModule, false);
        return false;
    }

    make(stack, ...args){
        const plugin = this.compiler.getPlugin( this.name );
        const stackClass = plugin.getStack( stack.toString() );
        if( stackClass ){
            const obj = new stackClass( stack );
            obj.name = this.name;
            obj.platform = this.platform;
            obj.version = this.version;
            if( args.length > 0 ){
                return obj.emitter.apply(obj, args);
            }else{
                return obj.emitter();
            }
        }
        throw new Error(`Stack '${stack.toString()}' is not found.`);
    }

    factory(syntaxClass,stack){
        const obj = new syntaxClass( stack );
        obj.name = this.name;
        obj.platform = this.platform;
        obj.version = this.version;
        return obj;
    }


    emitter(){}
    error( message , stack=null){
        if( stack===null ){
            stack = this.stack;
        }
        const range = this.compilation.getRangeByNode(stack.node);
        const file  = this.compilation.file;
        message+= ` (${file}:${range.start.line}:${range.start.column})`;
        this.compiler.callUtils("error",message);
    }
    warn(message , stack=null){
        if( stack===null ){
            stack = this.stack;
        }
        const range = this.compilation.getRangeByNode(stack.node);
        const file  = this.compilation.file;
        message+= ` (${file}:${range.start.line}:${range.start.column})`;
        this.compiler.callUtils("warn",message);
    }
}

module.exports = Syntax;