const Token = require("./Token");
const staticAssets = require("./Assets");

class ClassBuilder extends Token{

    static createClassNode(stack, ctx, type){
        const obj = new ClassBuilder(stack, ctx, type);
        return obj.create();
    }

    constructor(stack, ctx, type){
        super(type || stack.toString());
        this.stack = stack;
        this.scope = stack.scope;
        this.compilation = stack.compilation;
        this.compiler = stack.compiler;
        this.module =  stack.module;
        this.plugin = ctx.plugin;
        this.name = ctx.name;
        this.platform = ctx.platform;
        this.parent = ctx;
        this.builder = ctx.builder;
        this.initProperties=[];
        this.injectProperties = [];
        this.provideProperties = [];
        this.initBeforeBody = [];
        this.beforeBody = [];
        this.afterBody = [];
        this.methods = [];
        this.members = [];
        this.construct = null;
        this.body = [];
        this.implements = [];
        this.inherit = null;
        this.imports = [];
        this.using = [];
        this.assets = [];
        this.createCommentsNode(stack, this)
    }

    create(){
        if( !this.checkSyntaxPresetForClass() ){
            return null;
        }
        const module = this.module;
        const body = this.body;
        const multiModule = this.compilation.modules.size > 1;
        var mainModule = module;
        var internalModules = null;
        if( multiModule && this.compilation.modules.size > 1){
            mainModule = this.compilation.mainModule;
            internalModules = Array.from( this.compilation.modules.values() ).filter( m=>m !== mainModule );
           
        }

        if( mainModule === module ){
            if( this.plugin.options.consistent && !module.file.includes( module.getName('/') ) ){
                this.stack.error(20000, module.getName());
            }
        }

        this.createClassStructuralBody();
        this.createDependencies(module, multiModule, mainModule);
        this.createModuleAssets(module, multiModule, mainModule);

        this.beforeBody.forEach( item=>item && body.push( item ) );
        this.key = this.createIdentifierNode(module.id);
        this.static = module.static ? this.createIdentifierNode('static') : null;
        this.final = module.isFinal ? this.createIdentifierNode('final') : null;
        this.abstract = module.abstract ? this.createIdentifierNode('abstract') : null;
        this.modifier = this.createIdentifierNode( this.compiler.callUtils('getModifierValue', this.stack) );
        this.construct && body.push( this.construct );
        body.push( ...this.createStatementMember('methods', this.methods ) );
        body.push( ...this.createStatementMember('members', this.members ) );
        this.afterBody.forEach( item=>item && body.push( item ) );
        return this;
    }

    checkSyntaxPresetForClass(){
        const stack = this.stack;
        const module = this.module;
        const annotations = stack.annotations;
        if( annotations ){
            const syntaxAnnotation = annotations.find( annotation=>annotation.name.toLowerCase() ==='syntax');
            if( syntaxAnnotation ){
                const args = syntaxAnnotation.getArguments();
                if( args[0] ){
                    if( this.builder.isSyntax( args[0].value ) ){
                        this.compilation.isServerPolicy(module);
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }
        return true;
    }

    createClassStructuralBody(){
        const stack = this.stack;
        const module = this.module;
        this.id = this.createToken( stack.id );
        const ns = this.builder.getModuleNamespace(module);
        if( ns ){
            this.namespace = this.createIdentifierNode( ns );
        }
        if(module.inherit){
            this.addDepend(module.inherit);
        }
        if( this.isActiveForModule(module.inherit, module, true) ){
            this.inherit = this.createIdentifierNode( this.getModuleReferenceName( module.inherit ) );
        }
        this.implements = module.implements.filter( impModule=>{
            if( impModule.isInterface ){
                this.addDepend(impModule);
                return this.isActiveForModule(impModule, module,  true);
            }
            return false;
        }).map( item=>this.createIdentifierNode( this.getModuleReferenceName( item ) ) )

        this.createClassMemebers(stack);
        if(this.initProperties.length > 0){
            if(!this.construct){
                this.construct = this.createDefaultConstructMethod('__construct', this.initProperties);
            }else{
                this.construct.body.body.push( ...this.initProperties );
            }
        }
        this.checkConstructMethod();
        return this;
    }

    checkConstructMethod(){}

    createClassMemebers(stack){
        if( !(this.type =="ClassDeclaration" || this.type==="InterfaceDeclaration") )return;
        const cache1 = new Map();
        const cache2 = new Map();
        stack.body.forEach( item=> {
            const child = this.createClassMemeberNode(item);
            if(!child)return;
            const isStatic = !!(stack.static || child.static);
            const refs  = isStatic ? this.methods : this.members;
            this.createAnnotations(child, item, isStatic);
            child.isInterfaceMember = this.type==="InterfaceDeclaration";
            if( child.type ==="PropertyDefinition" ){
                if( !child.init ){
                    child.init = child.createLiteralNode(null);
                }
            }
            if( item.isMethodSetterDefinition || item.isMethodGetterDefinition ){
                const name = child.key.value;
                const dataset = isStatic ? cache1 : cache2;
                var target = dataset.get( name );
                if( !target ){
                    target={
                        isAccessor:true,
                        kind:'accessor', 
                        key:child.key, 
                        modifier:child.modifier
                    };
                    dataset.set(name, target);
                    refs.push( target );
                }
                if( item.isMethodGetterDefinition ){
                    target.get =child;
                }else if( item.isMethodSetterDefinition ){
                    target.set = child;
                }
            }else if(item.isConstructor && item.isMethodDefinition){
                this.construct = child;
            }
            else{
                refs.push( child );
            }
        });
    }

    createAnnotations(node, memeberStack, isStatic){
        if(isStatic && node && memeberStack.compiler.callUtils('isModifierPublic',memeberStack) && memeberStack.isMethodDefinition && memeberStack.isEnterMethod && !this.mainEnterMethods ){
            const mainEnterMethods = this.createStatementNode(
                this.createCalleeNode(
                    this.createStaticMemberNode([
                        this.createIdentifierNode(this.module.id),
                        this.createIdentifierNode(node.key.value)
                    ])
                )
            );  
            this.mainEnterMethods = mainEnterMethods;
            const program = this.getParentByType('Program');
            if(program){
                program.afterBody.push( mainEnterMethods );
            }
        }
    }

    createClassMemeberNode( memeberStack ){
        return this.createToken(memeberStack);
    }

    createDefaultConstructMethod(methodName, initProperties, params=[]){
        const inherit = this.inherit;
        const node = this.createMethodNode( methodName ? this.createIdentifierNode(methodName) : null, (ctx)=>{
            if( inherit ){
                const se = ctx.createNode('SuperExpression');
                se.value =  'parent';
                ctx.body.push( 
                    ctx.createStatementNode(
                        ctx.createCalleeNode( 
                            ctx.createStaticMemberNode([se, ctx.createIdentifierNode('__construct')]),
                            params
                        )
                    )
                );
            }
            if( initProperties && initProperties.length ){
                initProperties.forEach( item=>{
                    ctx.body.push( item );
                });
            }
        }, params);
        node.type ="FunctionDeclaration";
        return node;
    }

    createStatementMember(name, members){
        if( !members.length )return [];
        const body = [];
        members.forEach( node=>{
            if( node.isAccessor ){
                if( node.get ){
                    body.push( node.get );
                }
                if( node.set ){
                    body.push( node.set );
                }
            }else{
                body.push( node );
            }
        });
        return body;
    }

    createDependencies(module, multiModule=false, mainModule=null){

        const stack = this.compilation.getStackByModule(module);
        if( stack && stack.imports && stack.imports.length > 0 ){
            stack.imports.forEach( item=>{
                if( item.source.isLiteral ){
                    const compilation = item.getResolveCompilation();
                    if( compilation && compilation.modules.size === 0 ){
                        const node = this.createToken( item );
                        if( node ){
                            this.imports.push( node );
                        }
                    }else{
                        const source = item.getResolveFile(true);
                        if( this.plugin.options.assets.test(source) ){
                            if(item.specifiers && item.specifiers.length > 0){
                                const local = item.specifiers[0].value();
                                staticAssets.create(source, item.source.value(), local, module, this.builder);
                            }else{
                                staticAssets.create(source, item.source.value(), null, module, this.builder);
                            }
                        } 
                    }
                }
            });
        }

        const dependencies = this.builder.getDependencies(module);
        var excludes = null;
        if( multiModule && mainModule && mainModule !== module ){
            excludes = this.builder.getDependencies(mainModule);
            excludes.push( mainModule );
        }
        const importFlag = this.plugin.options.import;
        const consistent = this.plugin.options.consistent;
        const folderAsNamespace = this.plugin.options.folderAsNamespace;
        const usingExcludes = this.builder.getGlobalModules();
        const createUse=(depModule)=>{
            if( !usingExcludes.includes(depModule) ){
                const hasNs = module.namespace && module.namespace.isNamespace && module.namespace.parent;
                const name = this.builder.getModuleNamespace(depModule, depModule.id, !hasNs);
                if( name ){
                    let local = this.builder.getModuleUsingAliasName(depModule, module);
                    let imported = name;
                    if( !local ){
                        imported = void 0;
                        local = name
                    }
                    this.using.push(this.createUsingStatementNode( 
                        this.createImportSpecifierNode(local, imported )
                    ));
                }
            }
        }

        dependencies.forEach( depModule =>{
            if( !(excludes && excludes.includes( depModule )) && this.builder.isPluginInContext(depModule) ){
                if( this.isActiveForModule( depModule, module ) ){
                    if( importFlag ){
                        if( !this.builder.isImportExclude(depModule) ){
                            const source = this.builder.getModuleImportSource(depModule, module);
                            this.imports.push( this.createImportDeclaration(source) );
                        }
                    }else if( !(consistent||folderAsNamespace) ){
                        const source = this.builder.getFileRelativeOutputPath(depModule);
                        const name = this.builder.getModuleNamespace(depModule, depModule.id);
                        this.builder.addFileAndNamespaceMapping(source, name, module);
                    }
                    createUse( depModule );
                }else if( this.isReferenceDeclaratorModule(depModule, module) ){
                    createUse(depModule);
                }
            }
        });
        
        if( module.isDeclaratorModule ){
            const polyfillModule = this.builder.getPolyfillModule( module.getName() );
            if( polyfillModule && polyfillModule.requires.size > 0 ){
                polyfillModule.requires.forEach( item=>{
                    const name = item.key;
                    const source = item.from;
                    //const extract = item.extract;
                    if( importFlag && !this.builder.isImportExclude(source) ){
                        this.imports.push( this.createImportDeclaration(source) );
                    }

                    if( !usingExcludes.includes(module) ){
                        const ns = this.builder.getModuleNamespace(module, polyfillModule.export);
                        if( ns ){
                            if( name !== item.value ){
                                this.using.push(this.createUsingStatementNode( 
                                    this.createImportSpecifierNode( name, ns )
                                ));
                            }else{
                                this.using.push(this.createUsingStatementNode( 
                                    this.createImportSpecifierNode( ns )
                                ));
                            }
                        }
                    }

                });
            }
        }
    }

    createModuleAssets(module, multiModule=false, mainModule=null){
        // var excludes = null;
        // if( multiModule && mainModule && mainModule !== module ){
        //     excludes = this.builder.getModuleAssets(mainModule);
        // }
        // this.builder.getModuleAssets( module ).forEach( item=>{
        //     if( excludes ){
        //         const res = excludes.find( value=>value.source ===item.source && item.local===value.local );
        //         if( res ){
        //             return;
        //         }
        //     }
        //     this.assets.push( this.createImportDeclaration(item.source, item.local ? [[item.local,item.imported]] : []) );
        // });
    }

    createImportDeclaration(source, specifiers){
        return this.createImportNode(source, specifiers);
    }
}

module.exports = ClassBuilder;