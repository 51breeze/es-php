const Constant = require("./Constant");
const Polyfill = require("./Polyfill");
const PATH = require("path");
const events = require('events');
const classMap=new Map();
const namespaceMap=new Map();
const usedModules = new Set();
const dependModules = new Map();
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

    createDataByStack(stack){
        let data = createdStackData.get(stack);
        if( !data ){
            createdStackData.set(stack,data = {});
        }
        return data;
    }

    addVariableRefs( stack ){
        const name = stack.value();
        const funScope = this.scope.getScopeByType("function");
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
    }

    getVariableRefs(){
        const funScope = this.scope.getScopeByType("function");
        return refsParentVariable.get(funScope);
    }

    firstToUpper(name){
        return name.substr(0,1).toUpperCase()+name.substr(1);
    }

    getTypeName( type ){
        if( type ){
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
            if( this.isDependModule( type ) ){
                return type.toString();
            }
        }
        return null;
    }

    getReferenceNameByModule(module){
        if( this.module ){
            const imports = this.module.imports;
            if( imports && imports.has( module.id ) && imports.get(module.id).namespace === this.module.namespace){
                return module.id;
            }
            if( this.module.importAlias && this.module.importAlias.has(module) ){
                return this.module.importAlias.get(module);
            }
        }
        return '\\'+module.namespace.getChain().concat(module.id).join("\\");
    }

    getEventName( name ){
        return `${this.name}.${name}`;
    }

    used(module){
        usedModules.add(module);
    }

    isUsed(module){
        return module.used || usedModules.has(module);
    }

    getUsedModules(){
        return usedModules;
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

    generatorVarName(stack,name,flag=false){
        const dataset = this.createDataByStack(stack);
        if( dataset.hasOwnProperty(name) ){
            return dataset[name];
        }
        const value = stack.scope.generateVarName( name , flag);
        return dataset[name] = value;
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

    getOutputAbsolutePath(module){
        const options = this.getOptions();
        const config = this.getConfig();
        const suffix = config.output.suffix||".php";
        if( module.isDeclaratorModule ){
            const isPolyfill = Polyfill.modules.has( module.id );
            const polyfillModule = isPolyfill ? Polyfill.modules.get( module.id ) : null;
            const filename = module.id+suffix;
            if( polyfillModule ){
                return PATH.join(options.output,polyfillModule.namespace,filename).replace(/\\/g,'/');
            }
            return PATH.join(options.output,module.getName("/")+suffix).replace(/\\/g,'/');
        }
        const filepath = PATH.resolve(options.output, PATH.relative( this.compiler.workspace, module.file ) );
        const info = PATH.parse(filepath);
        if( info.ext !== suffix ){
           return PATH.join(info.dir,info.name+suffix).replace(/\\/g,'/');
        }
        return filepath.replace(/\\/g,'/');
    }

    getOutputRelativePath(module,context){
        const contextPath = this.getOutputAbsolutePath(context);
        const modulePath  = this.getOutputAbsolutePath(module);
        return './'+PATH.relative( PATH.dirname(contextPath), modulePath ).replace(/\\/g,'/');
    }

    getOptions(){
        return this.compiler.options;
    }
    
    getConfig( name ){
        const config = this.compiler.options.configuration[ this.name ] || {
            build:Constant.BUILD_ALL_FILE,
            target:7,
            output:{
                suffix:'.php',
            },
        };
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
    isBlockStatement(){
        const stack = this.stack;
        return !!(stack.isFunctionExpression || 
                stack.isSwitchStatement      ||
                stack.isIfStatement         ||
                stack.isForInStatement      ||
                stack.isForStatement        ||
                stack.isForOfStatement      ||
                stack.isDoWhileStatement    ||
                stack.isBlockStatement      ||
                stack.isWhileStatement      ||
                stack.isTryStatement        ||
                stack.isPackageDeclaration  ||
                stack.isClassDeclaration    ||
                stack.isInterfaceDeclaration)         
    }

    isExpression(){
        const stack = this.stack;
        return stack.isVariableDeclaration || 
               stack.parentStack.isVariableDeclarator || 
               stack.parentStack.isExpressionStatement || 
               stack.isSwitchCase || 
               stack.isBreakStatement || 
               stack.isReturnStatement || 
               stack.isExpressionStatement;
    }

    getBlockStatement( stack ){
       stack = stack || this.stack.parentStack;
       while( stack && !(stack.isBlockStatement || stack.isSwitchStatement) ){
           stack=stack.parentStack;
       }
       if(stack && stack.isBlockStatement ){
           return stack.parentStack;
       }
       return stack;
    }

    inCaseStatement(){
        let stack = this.stack.parentStack;
        while( stack && !stack.isSwitchCase ){
            stack=stack.parentStack;
        }
        return !!(stack && stack.isSwitchCase);
    }

    getIndent(num=null){
        let level = num === null ? this.scope.level : num;
        if( num === null ){
            const asyncIndent = this.scope.asyncParentScopeOf ? 4 : 0;
            const pScope = this.scope.asyncParentScopeOf ? this.scope.getScopeByType("function") : null;
            if( pScope && this.scope.asyncParentScopeOf && pScope.hasChildAwait ){
                const asc = this.scope.asyncParentScopeOf;
                const stack = this.getBlockStatement();
                level =  this.scope.parent && this.stack.isFunctionExpression ? this.scope.parent.level : asc.level+asyncIndent;
                if( stack ){
                    if(stack.isFunctionExpression && stack.scope !== asc ){
                        const diff = this.scope.level - stack.scope.parent.level;
                        level = asc.level+asyncIndent+diff;
                    }else{
                        let ps = this.scope;
                        while( ps && ps.parent && !(ps.parent === asc || ps === asc || ps.hasChildAwait) ){
                            ps = ps.parent;
                        }
                        let diff = this.scope.level - ps.level;
                        level = asc.level+asyncIndent+diff;
                    }
                }
                
            }else{
                if( this.scope.parent && this.stack.isFunctionExpression ) {
                    level = this.scope.parent.level;
                }else if( !this.stack.isBreakStatement && this.inCaseStatement() ){
                    level+=1;
                }
                level+=asyncIndent;
            }
        }
        level = this.getLevel(level);
        return level > 0 ? "\t".repeat( level ) : '';
    }

    getLevel( level ){
        return level-1;
    }
    
    semicolon(expression){
        if( !expression )return "";
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
    getIdByModule( module ){
        if( !classMap.has(module) ){
            classMap.set(module,classMap.size);
        }
        return classMap.get(module);
    }
    getIdByNamespace( namespace ){
        if( !namespaceMap.has(namespace) ){
            namespaceMap.set(namespace,namespaceMap.size);
        }
        return namespaceMap.get(namespace);
    }

    addDepend( depModule ){
        const module = this.module;
        if( !depModule.isModule || depModule === module )return;
        if( !dependModules.has( module ) ){
            dependModules.set(module,new Set());
        }
        const target = dependModules.get(module);
        this.used(depModule);
        target.add(depModule);
    }
    getDependencies( module ){
        return dependModules.get(module) || [];
    }

    isDependModule(depModule){
        if( !depModule )return false;
        const isRequire = !depModule.isDeclaratorModule && 
                            this.isUsed(depModule) &&
                            this.compiler.callUtils("isLocalModule", depModule) && 
                            !this.compiler.callUtils("checkDepend",module, depModule);         
        const isPolyfill = depModule.isDeclaratorModule && Polyfill.modules.has(depModule.id);
        if( isRequire || isPolyfill){
            return true;
        }
        return false;
    }

    createDependencies(module, refs){
        refs = refs || [];
        const importAlias = module.importAlias;
        this.getDependencies(module).forEach( depModule=>{
            if( this.isDependModule(depModule) ){
                const alias = importAlias.has(depModule) ? importAlias.get(depModule) : null;
                refs.push( this.createImport('\\'+depModule.namespace.getChain().concat(depModule.id).join("\\"), alias) );
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

    definePropertyDescription(target,name,value,isAccessor,modifier,id,compute){
        const map={
            "public":Constant.MODIFIER_PUBLIC,
            "protected":Constant.MODIFIER_PROTECTED,
            "private":Constant.MODIFIER_PRIVATE,
        }
        const items = [`m:${map[modifier]},d:${id}`]
        if( id === Constant.DECLARE_PROPERTY_VAR ){
            items.push(`writable:true`);
        }
        if( (isAccessor || id === Constant.DECLARE_PROPERTY_VAR || id === Constant.DECLARE_PROPERTY_CONST) && modifier==="public"){
            items.push(`enumerable:true`);
        }
        if( isAccessor ){
            if( value.get ){
                items.push(`get:`+value.get);
            }
            if( value.set ){
                items.push(`set:`+value.set);
            }
        }else{
            items.push(`value:`+value);
        }
        if( compute ){
            return `${target}[${name}]={${items.join(",")}};`
        }
        return `${target}.${name}={${items.join(",")}};`
    }

    getDescription(description){
       if( description.length >0 ){
           return `{\r\n\t${description.join(",\r\n\t")}\r\n}`;
       }
       return `{}`;
    }

    getImps(module){
        return module.implements.filter( module=>{
            const result = !module.isDeclaratorModule && module.isInterface;
            if( result ){
                this.addDepend( module )
                return true;
            }
        });
    }

    getInherit(module){
        const inherit = module.extends.filter( module=>module.isClass );
        if( inherit[0] ){
            this.addDepend( inherit[0] );
        }
        if( this.isDependModule(inherit[0]) ){
            return inherit[0];
        }
        return null;
    }

    emitter(){}

    error(code,...args){
        this.stack.error(code,...args);
    }

    warn(code,...args){
        this.stack.warn(code,...args);
    }
}

module.exports = Syntax;