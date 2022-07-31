const events = require('events');
const TOP_SCOPE = ["ClassDeclaration","EnumDeclaration","DeclaratorDeclaration","Program"];
const FUNCTION_SCOPE = ["MethodDefinition","MethodGetterDefinition","MethodSetterDefinition","FunctionExpression"];
const SCOPE_MAP = new Map();
const refsParentVariable = new Map();
const assignAddressRef = new Map();
const addressRefNodes = new Map();
const accessorNamedMaps = new Map();

class Token extends events.EventEmitter {

    static SCOPE_REFS_All = 31;
    static SCOPE_REFS_TOP = 16;
    static SCOPE_REFS_UP_CLASS = 8;
    static SCOPE_REFS_UP_FUN = 4;
    static SCOPE_REFS_UP = 2;
    static SCOPE_REFS_DOWN = 1;

    constructor(type){
        super();
        this.type = type;
        this.stack = null;
        this.scope = null;
        this.compilation = null;
        this.compiler = null;
        this.module = null;
        this.plugin = null;
        this.name = null;
        this.platform = null;
        this.parent = null;
        this.builder = null;
        this.value = '';
        this.raw = '';
    }

    createNode(stack,type){
        if( !stack )return null;
        const nonStack = typeof stack === 'string';
        if( !type ){
            type = nonStack ? stack : stack.toString();
        }
        const obj = new Token( type );
        obj.stack = nonStack ? null : stack;
        obj.scope = nonStack ? this.scope : stack.scope;
        obj.compilation =  nonStack ? this.compilation : stack.compilation;
        obj.compiler =  nonStack ? this.compiler : stack.compiler;
        obj.module =  nonStack ? this.module : stack.module;
        obj.plugin = this.plugin;
        obj.name = this.name;
        obj.platform = this.platform;
        obj.parent = this;
        obj.builder = this.builder;
        return obj;
    }

    createToken(stack){
        if( !stack )return null;
        const type = stack.toString();
        if( type ==='TypeStatement')return null;
        const creator = this.plugin.getTokenNode( type );
        if( creator ){
            try{
                return creator(this, stack, type);
            }catch(e){
                console.log(e)
            }
        }else{
            throw new Error(`Token class '${stack.toString()}' is not exists.`);
        }
    }

    createFunctionNode( createChildFun, params){
        const node = this.createNode('FunctionExpression');
        const block = node.createNode('BlockStatement');
        block.body = [];
        node.params = [];
        if(params){
            params.forEach( item=>{
                item.parent = node;
                node.params.push( item );
            });
        }
        node.body = block;
        createChildFun( block );
        return node;
    }

    createReturnNode( argument ){
        const node = this.createNode('ReturnStatement');
        node.argument = argument;
        argument.parent = node;
        return node;
    }

    createMethodNode(key, createChildFun, params=null, using=null){
        const node = this.createFunctionNode(createChildFun, params);
        node.type = "MethodDefinition";
        if( key ){
            node.key = key instanceof Token ? key : node.createIdentifierNode(key);
            node.key.parent = node;
        }
        node.using = using;
        return node;
    }

    createObjectNode(properties ,stack){
        const object = this.createNode('ObjectExpression');
        object.stack = stack;
        object.properties = [];
        if( properties ){
            properties.forEach( (value)=>{
                value.parent = object;
                object.properties.push( value );
            });
        }
        return object;
    }

    createArrayNode( elements, stack){
        const object = this.createNode('ArrayExpression');
        object.stack = stack;
        object.elements = [];
        if(elements){
            elements.forEach( (value)=>{
                value.parent = object;
                object.elements.push( value );
            });
        }
        return object;
    }

    createPropertyNode(key, init, stack){
        const propery = this.createNode('Property');
        propery.stack = stack;
        if( key instanceof Token ){
            key.parent = propery;
            propery.key = key;
            propery.computed = key.computed;
        }else{
            propery.key = propery.createIdentifierNode( String(key) );
        }

        if( init instanceof Token ){
            init.parent = propery;
            propery.init = init;
        }else{
            propery.init = propery.createLiteralNode( String(init) );
        }
        return propery;
    }

    createStaticMemberNode(items,stack){
        const node = this.createMemberNode(items,stack);
        node.isStatic = true;
        return node;
    }

    createMemberNode(items,stack){
    
        const create = (items, object, ctx)=>{
            const member = ctx.createNode('MemberExpression'); 
            if( object instanceof Token ){
                member.object = object;
            }else{
                member.object = member.createNode('Identifier'); 
                member.object.value = object; 
            }

            const property = items.shift();
            if( property instanceof Token ){
                member.property = property;
            }else{
                member.property = member.createNode('Identifier'); 
                member.property.value = property;
            }

            member.object.parent = ctx;
            member.property.parent = ctx;
            if( items.length > 0 ){
                return create(items, member, member);
            }
            return member;
        }

        items = items.slice(0);
        const node = create(items, items.shift(), this);
        node.stack = stack;
        return node;
    }

    createCalleeNode(callee, args, stack){
        const expression = this.createNode('CallExpression');
        expression.stack = stack;
        callee.parent = expression;
        expression.callee = callee;
        expression.arguments = args || [];
        expression.arguments.forEach( item=>{
            item.parent = expression;
        });
        return expression;
    }

    createAssignmentNode(left,right,stack){
        const expression = this.createNode('AssignmentExpression');
        expression.stack = stack;
        left.parent = expression;
        right.parent = expression;
        expression.left = left;
        expression.right = right;
        return expression;
    }

    creaateAddressRefsNode( argument ){
        const obj = this.createNode('AddressReferenceExpression');
        obj.argument = argument;
        argument.parent = obj;
        return obj;
    }

    createStatementNode( expression, stack){
        const obj = this.createNode('ExpressionStatement');
        obj.stack = stack;
        expression.parent = obj;
        obj.expression=expression;
        return obj;
    }

    createSequenceNode(items, stack){
        const obj = this.createNode('SequenceExpression');
        obj.stack = stack;
        obj.expressions = items;
        items.forEach( item=>{
            item.parent = obj;
        });
        return obj;
    }

    createParenthesNode(expression, stack){
        const obj = this.createNode('ParenthesizedExpression');
        expression.parent = obj;
        obj.stack = stack;
        obj.expression = expression;
        return obj;
    }

    createDeclarationNode( kind, items, stack){
        const obj = this.createNode('VariableDeclaration');
        obj.stack = stack;
        obj.kind = kind;
        obj.declarations = items;
        items.forEach( item=>{
            item.parent = obj;
        });
        return obj;
    }

    createDeclaratorNode(id, init, stack){
        const obj = this.createNode('VariableDeclarator');
        obj.stack = stack;
        obj.id = id instanceof Token ? id : obj.createIdentifierNode(id);
        obj.init = init;
        obj.id.parent = obj;
        if( init ){
            obj.init.parent = obj;
        }
        return obj;
    }

    createLiteralNode(value, raw, stack){
        const node = this.createNode('Literal');
        node.stack = stack;
        node.value = value;
        if( raw === void 0){
            if( typeof value === 'string'){
                node.raw = `"${value}"`;
            }else{
                node.raw = String(value); 
            }
        }else{
            node.raw = String(value);
        }
        return node;
    }

    createIdentifierNode(value, stack, isVariable=false){
        const token = this.createNode('Identifier');
        token.stack = stack;
        token.value = value;
        token.raw   = value;
        token.isVariable = isVariable;
        return token;
    }

    createClassRefsNode( module, stack){
        if(!module || !module.isModule)return null;
        const name = this.getModuleReferenceName(module);
        return this.createStaticMemberNode([
            this.createIdentifierNode(name),
            this.createIdentifierNode('class')
        ],stack);
    }

    createChunkNode(value, newLine=true, semicolon=false){
        const node = this.createNode('ChunkExpression');
        node.newLine = newLine;
        node.semicolon = semicolon;
        node.value = value;
        node.raw = value;
        return node;
    }

    createThisNode(stack){
        const node = this.createNode('ThisExpression');
        node.stack = stack;
        return node;
    }

    createConditionalNode(test, consequent, alternate){
        const node = this.createNode('ConditionalExpression');
        node.test = test;
        node.consequent = consequent;
        node.alternate = alternate;
        test.parent = node;
        consequent.parent = node;
        alternate.parent = node;
        return node;
    }

    createBinaryNode(operator, left, right){
        const node = this.createNode('BinaryExpression');
        node.operator = operator;
        node.left = left;
        node.right = right;
        left.parent = node;
        right.parent = node;
        return node;
    }

    createNewNode(callee, args=[]){
        const node = this.createNode('NewExpression');
        node.callee = callee;
        node.arguments = args;
        callee.parent = node;
        args.forEach( item=>item.parent=node );
        return node;
    }

    createImportNode(source, specifiers, stack){
        const obj = this.createNode('ImportDeclaration');
        obj.stack = stack;
        obj.source = source instanceof Token ? source : obj.createLiteralNode( source );
        obj.specifiers = [];
        specifiers.forEach( item=>{
            if( Array.isArray(item) ){
                obj.specifiers.push( obj.createImportSpecifierNode( ...item ) );
            }else if( item instanceof Token ){
                item.parent = obj;
                obj.specifiers.push( item );
            }
        });
        return obj;
    }

    createImportSpecifierNode(local, imported=null, hasAs=false){
        if( imported ){
           const obj = this.createNode('ImportSpecifier');
           obj.imported =  obj.createIdentifierNode( imported );
           obj.local =  obj.createIdentifierNode( local );
           return obj;
        }else if( hasAs ){
            const obj = this.createNode('ImportNamespaceSpecifier');
            obj.local =  obj.createIdentifierNode( local );
            return obj;
        }else{
            const obj = this.createNode('ImportDefaultSpecifier');
            obj.local =  obj.createIdentifierNode( local );
            return obj;
        }
    }

    createArrayAddressRefsNode(desc,name){
        if(!desc)return;
        const assignAddress = this.getAssignAddressRef(desc);
        if( assignAddress ){
            if( this.hasCrossScopeAssignment( desc.assignItems ) ){
                const dataset = addressRefNodes.get(desc);
                const key = `get_array_refs_${name}`;
                let method_name = dataset && dataset.name;
                if( !method_name ){
                    const content = [];
                    const assert = this.checkRefsName("_ARV");
                    const uses = [this.createIdentifierNode(name,null,true), this.createIdentifierNode(assert,null,true)];
                    const switchNode = this.createNode('SwitchStatement');
                    switchNode.condition = switchNode.createIdentifierNode( assert, null, true);
                    switchNode.cases = content;
                    let itemIndex = 0;
                    method_name = this.checkRefsName(key);
                    desc.assignItems.forEach( (item)=>{
                        const desc = item.description();
                        if( assignAddress.hasName(desc) ){
                            const refs = assignAddress.getName(desc);
                            uses.push( this.createIdentifierNode(refs,null,true) );
                            const node = switchNode.createNode('SwitchCase');
                            node.condition = node.createLiteralNode(itemIndex++);
                            node.consequent = node.createReturnNode( node.createIdentifierNode(refs,null,true) );
                            content.push( node );
                        }
                    });
                    const node = this.createNode('SwitchCase');
                    node.consequent = this.createReturnNode( this.createIdentifierNode(name,null,true) );
                    content.push( node );
                    const funNode = this.createMethodNode(this.createIdentifierNode('&'),(ctx)=>{
                        const node = ctx.createNode('IfStatement');
                        const condition = node.createNode('LogicalExpression');
                        condition.left = condition.createIdentifierNode( assert, null, true);
                        condition.operator = '===';
                        condition.right = condition.createLiteralNode( null );
                        node.condition = condition;
                        node.consequent = node.createReturnNode( node.createIdentifierNode(name,null,true) );
                        switchNode.parent = ctx;
                        ctx.body.push( node );
                        ctx.body.push( switchNode );
                    },[],uses.map( item=>{ 
                        item.isAddressRefs = true;
                        return item;
                    }));
                    funNode.comment =`/*References ${name} memory address*/`;
                    const refsNode = this.createAssignmentNode(this.createIdentifierNode(method_name),funNode);
                    this.insertNodeBlockContextAt( refsNode );
                    addressRefNodes.set(desc,{name:method_name,node:refsNode});
                }
                return this.createCalleeNode( this.createIdentifierNode(method_name,null,true) );

            }else{
                const rd = assignAddress.getLastAssignedRef();
                if( rd ){
                    return this.createIdentifierNode(rd,null,true);
                }
            }
        }
        return this.createIdentifierNode(name,null,true);
    }


    addVariableRefs( desc ){
        if(!desc || !desc.isStack)return;
        const name = desc.value();
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
                dataset.add(desc);
            }
            funScope = funScope.parent;
        }
    }

    getVariableRefs(){
        
    }



    getAssignAddressRef(desc){
        if(!desc)return null;
        return assignAddressRef.get(desc);
    }

    addAssignAddressRef(desc, value){
        if(!desc)return null;
        const type = desc.type();
        if( !(type.isLiteralArrayType || type.isTupleType) )return null;
        var address = assignAddressRef.get(desc);
        if( !address ){
            address = new AddressVariable(desc, this);
            assignAddressRef.set(desc, address);
        }
        if( value ){
            address.add( value );
        }
        return address;
    }

    hasCrossScopeAssignment( assignmentSet ){
        if( !assignmentSet )return false;
        if( assignmentSet.size < 1 )return false;
        const items = Array.from( assignmentSet.values() );
        const firstScope = items[0].scope;
        return items.some( item=>{
           return item.scope !== firstScope;
        });
    }


    addDepend( dep ){
        this.builder.addDepend(dep, this.module);
    }

    getDependencies(module){
        return this.builder.getDependencies(module || this.module);
    }

    isActiveForModule(module, ctxModule){
        return this.builder.isActiveForModule(module, ctxModule || this.module);
    }

    getParentByType( type ){
        var parent = this.parent;
        var invoke = typeof type === 'function' ? type : item=>item.type === type;
        while( parent && !invoke(parent) ){
            parent = parent.parent;
        }
        return parent;
    }

    insertNodeBlockContextAt(node){
        const block = this.getParentByType( (parent)=>{
            return parent.type ==='BlockStatement' || parent.type ==="FunctionExpression" || TOP_SCOPE.includes(parent.type)
        });
        if( block ){
            if( node.type !== "ExpressionStatement"){
                node = this.createStatementNode( node );
            }
            node.parent = block;
            block.body.push( node );
        }
    }

    checkRefsName(name,top=false,flags=Token.SCOPE_REFS_DOWN | Token.SCOPE_REFS_UP_FUN, context=null, initInvoke=null){

        const ctx = context || this.getParentByType(parent=>{
            if( top ){
                return TOP_SCOPE.includes( parent.type );
            }else{
                return FUNCTION_SCOPE.includes( parent.type );
            }
        });

        if( !ctx )return name;
        const scope = (context && context.scope) || this.scope;
        var dataset = SCOPE_MAP.get( ctx );
        if( !dataset ){
            SCOPE_MAP.set(ctx, dataset={
                scope,
                result:new Map(),
                check(name, scope){
                    if( this.result.has(name) )return true;
                    if( flags === Token.SCOPE_REFS_All ){
                        return scope.topDeclarations.has(name);
                    }
                    if( scope.isDefine(name) ){
                        return true;
                    }
                    var index = 0;
                    var flag = 0;
                    while( flag < (flags & Token.SCOPE_REFS_All) ){
                        flag = Math.pow(2,index++);
                        switch( flags & flag ){
                            case Token.SCOPE_REFS_DOWN :
                                if(scope.declarations.has(name) || scope.hasChildDeclared(name))return true;
                            case Token.SCOPE_REFS_UP :
                                if( scope.isDefine(name) )return true;
                            case Token.SCOPE_REFS_TOP :
                                if( scope.isDefine(name) || scope.hasChildDeclared(name) )return true;
                            case Token.SCOPE_REFS_UP_FUN :
                                if( scope.isDefine(name,'function') )return true;
                            case Token.SCOPE_REFS_UP_CLASS :
                                if( scope.isDefine(name,'class') )return true;
                        }
                    }
                    return false;
                }
            });
        }else if( dataset.result.has(name) ){
            return dataset.result.get(name);
        }

        if( dataset.check(name,scope) ){
            var index = 1;
            while( dataset.check(name+index, scope) && index++ );
            var value = name+index;
            dataset.result.set(name,value);
            const event = {name,value,top,context:ctx,scope,prevent:false};
            ctx.emit('onCreateRefsName', event);
            if( !event.prevent ){
                const block = top ? ctx : ctx.body;
                let init = null;
                if( initInvoke ){
                    init = initInvoke(value,name);
                }
                if( !init && top ){
                    init = block.createIdentifierNode(name);
                }
                if( init ){
                    (block.beforeBody||block.body).push(block.createDeclarationNode('const', [
                        block.createDeclaratorNode(
                            block.createIdentifierNode(value, null, true),
                            init,
                        )
                    ]));
                }
            }
            return value;
        }else {
            dataset.result.set(name,name);
            if(initInvoke){
                var init = initInvoke(name, name);
                const block = top ? ctx : ctx.body;
                if( init ){
                    (block.beforeBody||block.body).push(block.createDeclarationNode('const', [
                        block.createDeclaratorNode(
                            block.createIdentifierNode(value, null, true),
                            init,
                        )
                    ]));
                }
            }
        }
        
        return name;
    }

    getModuleReferenceName(module,context){
        context = context || this.module;
        return this.builder.getModuleReferenceName(module,context);
    }

    getAccessorName(name, desc, accessor='get'){
        const prefix = accessor;
        const suffix = name.substr(0,1).toUpperCase()+name.substr(1);
        var key = prefix+suffix;
        if( desc && desc.isStack && desc.module ){
            const module = desc.module;
            const isStatic = !!(desc.static || module.static);
            var dataset = accessorNamedMaps.get( module );
            if( !dataset ){
                accessorNamedMaps.set(module, dataset={});
            }else if( dataset[ key ] ){
                return dataset[ key ];
            }
            var index = 1;
            var value = key;
            while( true ){
                const has = isStatic ? module.getMethod( value ) : module.getMember( value );
                if(!has)break;
                value = key+(index++);
            }
            dataset[ key ] = value;
            return value;
        }
        return key;
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

    error(message , stack=null){
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

module.exports = Token;