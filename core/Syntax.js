const Constant = require("./Constant");
const Polyfill = require("./Polyfill");
const PATH = require("path");
const events = require('events');
const usedModules = new Set();
const refAddressVariables = new Set();
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

    addAssignAddressRef(target, value){
        const data = this.createDataByStack(target);
        refAddressVariables.add( target );
        if( data.assignAddressRef && data.assignAddressRef.scope !== value.scope ){
            if( !data.assignAddressCrossRefs ){
                data.assignAddressCrossRefs = new Set();
                data.assignAddressCrossRefs.add( data.assignAddressRef );
            }
            data.assignAddressCrossRefs.add( value );
        }
        data.assignAddressRef= value;
    }

    getRefAddressVariables(){
        return refAddressVariables;
    }

    hasRefAddressVariables(target){
        return refAddressVariables.has(target);
    }

    getAssignAddressRef(target){
        if(!target)return null;
        const data = this.createDataByStack(target);
        return data.assignAddressRef;
    }

    getAssignAddressCrossRefs(target){
        const data = this.createDataByStack(target);
        return data.assignAddressCrossRefs;
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
            if(type.isGenericValueType || type.isGenericType || type.isClassGenericType){
                return null;
            }
            if( type.isTupleType  ){
                return 'array';
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
            if( this.isDependModule( type ) ){
                return type.id;
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

    generatorVarName(stack,name,flag=false, scope=null){
        const dataset = this.createDataByStack(stack);
        if( dataset.hasOwnProperty(name) ){
            return dataset[name];
        }
        const value = stack.scope.generateVarName(name, flag);
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

    insertExpression(target, expression){
        const block = target.getParentStack( stack=>!!stack.isBlockStatement );
        block.dispatcher("insert",expression);
    }

    getOutputAbsolutePath(module){
        const options = this.getOptions();
        const config = this.getConfig();
        const suffix = config.output.suffix||".php";
        if( module.isDeclaratorModule ){
            const isPolyfill = Polyfill.modules.has( module.id );
            const polyfillModule = isPolyfill ? Polyfill.modules.get( module.id ) : null;
            const filename = (polyfillModule.export ? polyfillModule.export : module.id)+suffix;
            if( polyfillModule ){
                return PATH.join(options.output,polyfillModule.namespace.replace(/\./g,'/'),filename).replace(/\\/g,'/');
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
            const asyncIndent =  0;
            if( this.scope.parent && this.stack.isFunctionExpression ) {
                level = this.scope.parent.level;
            }else if( !this.stack.isBreakStatement && this.inCaseStatement() ){
                level+=1;
            }
            level+=asyncIndent;
        }
        level = this.getLevel(level);
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
                            !this.compiler.callUtils("checkDepend", this.module, depModule);
        const polyfillModule = depModule.isDeclaratorModule && Polyfill.modules.get(depModule.id);
        if( isRequire || (polyfillModule && polyfillModule.export)){
            return true;
        }
        return false;
    }

    createDependencies(module, refs){
        refs = refs || [];
        const importAlias = module.importAlias;
        this.getDependencies(module).forEach( depModule=>{
            if( this.isDependModule(depModule) ){
                const polyfillModule = depModule.isDeclaratorModule && Polyfill.modules.get(depModule.id);
                if( polyfillModule ){
                    if( polyfillModule.export ){
                        refs.push( this.createImport('\\'+polyfillModule.namespace.split('.').concat(polyfillModule.export).join("\\"), null) );
                    }
                    return;
                }
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
        if( this.isDependModule(inherit[0]) ){
            this.addDepend( inherit[0] );
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