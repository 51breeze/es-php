const Token = require("./Token");
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
    }

    create(){
        const module = this.module;
        const body = this.body;
        const multiModule = this.stack.compilation.modules.size > 1;
        var mainModule = module;
        if( multiModule && stack.compilation.modules.size > 1){
            mainModule = Array.from( stack.compilation.modules.values() )[0];
        }
        this.createClassStructuralBody();
        this.createDependencies(module, multiModule, mainModule).forEach( item=>this.createUsingNode( item ) );
        this.createModuleAssets(module, multiModule, mainModule).forEach( item=>this.createUsingNode( item ) );

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

    createUsingNode( node ){
        this.imports.push( node );
        node.specifiers.forEach( specifier=>{
            const node = this.createNode('UsingStatement');
            node.argument = specifier;
            specifier.parent = node;
            this.using.push( node )
        });
    }

    createClassStructuralBody(){
        const stack = this.stack;
        const module = this.module;
        this.id = this.createToken( stack.id );
        if(module.inherit){
            this.addDepend(module.inherit);
        }
        if( this.isActiveForModule(module.inherit) ){
            this.inherit = this.createIdentifierNode( this.getModuleReferenceName( module.inherit ) );
        }
        this.implements = module.implements.filter( impModule=>{
            if( !impModule.isDeclaratorModule && impModule.isInterface ){
                this.addDepend(impModule);
                return this.isActiveForModule(impModule, module);
            }
            return false;
        }).map( item=>this.createIdentifierNode( this.getModuleReferenceName( item ) ) )

        this.createClassMemebers(stack);
        if( !this.construct ){
            this.construct = this.createDefaultConstructMethod('__construct', this.initProperties);
        }
        this.checkConstructMethod();
        return this;
    }

    checkConstructMethod(){
        const stack = this.stack;
        if( !this.construct && (stack.isInterfaceDeclaration || stack.isClassDeclaration || stack.isEnumDeclaration) ){
            this.construct = this.createDefaultConstructMethod('__construct');
        }
    }

    createClassMemebers(stack){
        if( this.type !=="ClassDeclaration" )return;
        const cache1 = new Map();
        const cache2 = new Map();
        stack.body.forEach( item=> {
            const child = this.createClassMemeberNode(item);
            const isStatic = !!(stack.static || child.static);
            const refs  = isStatic ? this.methods : this.members;
            this.createAnnotations(child, item, isStatic);
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
        if(isStatic && node.modifier ==="public" &&  memeberStack.isMethodDefinition && memeberStack.isEnterMethod && !this.mainEnterMethods ){
            const mainEnterMethods = this.createStatementNode(
                this.createCalleeNode(
                    this.createMemberNode([
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
        const items = [];
        const dependencies = this.builder.getDependencies(module);
        var excludes = null;
        if( multiModule && mainModule && mainModule !== module ){
            excludes = this.builder.getDependencies(mainModule);
            excludes.push( mainModule );
        }
        dependencies.forEach( depModule =>{
            if( this.isActiveForModule( depModule ) && !(excludes && excludes.includes( depModule )) ){
                const name = this.builder.getModuleReferenceName(depModule, module);
                const source = this.builder.getModuleImportSource(depModule, module);
                items.push( this.createImportDeclaration(source, [[name]]) );
            }
        });
        if( module.isDeclaratorModule ){
            const polyfillModule = this.builder.getPolyfillModule( module.getName() );
            if( polyfillModule && polyfillModule.requires.size > 0 ){
                polyfillModule.requires.forEach( item=>{
                    const name = item.key;
                    const source = item.from;
                    //const extract = item.extract;
                    if( name !== item.value ){
                        items.push( this.createImportDeclaration(source, [[item.value, name]]) );
                    }else{
                        items.push( this.createImportDeclaration(source, [[name]]) );
                    }
                });
            }
        }
        return items;
    }

    createModuleAssets(module, multiModule=false, mainModule=null){
        var excludes = null;
        if( multiModule && mainModule && mainModule !== module ){
            excludes = this.builder.getModuleAssets(mainModule);
        }
        const assets = [];
        this.builder.getModuleAssets( module ).forEach( item=>{
            if( excludes ){
                const res = excludes.find( value=>value.source ===item.source && item.local===value.local );
                if( res ){
                    return;
                }
            }
            assets.push( this.createImportDeclaration(item.source, item.local ? [[item.local,item.imported]] : []) );
        });
        return assets;
    }

    createImportDeclaration(source, specifiers){
        return this.createImportNode(source, specifiers);
    }
}

module.exports = ClassBuilder;