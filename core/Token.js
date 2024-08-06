const events = require('events');
const TOP_SCOPE = ["ClassDeclaration","EnumDeclaration","DeclaratorDeclaration","Program"];
const FUNCTION_SCOPE = ["MethodDefinition","MethodGetterDefinition","MethodSetterDefinition","FunctionExpression",'FunctionDeclaration','Program'];
const SCOPE_MAP = new Map();
const DECLARE_REFS = new Map();
const refsParentVariable = new Map();
const assignAddressRef = new Map();
const addressRefNodes = new Map();
const accessorNamedMaps = new Map();

const AddressVariable = require('./AddressVariable');
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
        if(type ==='TypeStatement')return null;
        if( type ==='NewDefinition')return null;
        if( type ==='CallDefinition')return null;
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
        createChildFun && createChildFun( block );
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
            propery.key = propery.createLiteralNode( String(key) );
        }

        if( init instanceof Token ){
            init.parent = propery;
            propery.init = init;
        }else{
            propery.init = propery.createIdentifierNode( String(init) );
        }
        return propery;
    }

    createStaticMemberNode(items,stack){
        const node = this.createMemberNode(items,stack);
        node.isStatic = true;
        return node;
    }

    createTypeTransformNode(typename, expression, createParenthes=false, stack=null){
        const node = stack ? this.createNode(stack,'TypeTransformExpression') : this.createNode('TypeTransformExpression');
        node.typeName = typename;
        node.expression = expression;
        expression.parent = node;
        if( createParenthes ){
            return this.createParenthesNode( node );
        }
        return node;
    }

    createMemberNode(items,stack,computed=false){
    
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
        if(computed){
            node.computed = true;
        }
        return node;
    }

    createCalleeNode(callee, args, stack){
        const expression = this.createNode('CallExpression');
        expression.stack = stack;
        callee.parent = expression;
        expression.callee = callee;
        expression.arguments = [];
        if(args){
            args.forEach( item=>{
                if( item ){
                    item.parent = expression;
                    expression.arguments.push( item );
                }
            });
        }
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
                node.raw = `'${value}'`;
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

    createUsingStatementNode( specifier ){
        const node = this.createNode('UsingStatement');
        node.argument = specifier;
        specifier.parent = node;
        return node;
    }

    createIfStatement(condition,consequent,alternate){
        const node = this.createNode('IfStatement');
        node.condition = condition;
        node.consequent = consequent;
        node.alternate = alternate;
        condition.parent = node; 
        consequent.parent = node; 
        if( alternate ){
            alternate.parent = node; 
        }
        return node;
    }

    createTransformBooleanTypeNode( stack, assignName, type, originType, tokenValue){
        if( stack.isLogicalExpression || stack.isUnaryExpression || stack.isBinaryExpression){
            return this.createToken(stack);
        }

        if( stack.isParenthesizedExpression ){
            return this.createParenthesNode(
                this.createTransformBooleanTypeNode(
                    stack.expression,
                    assignName, 
                    type, 
                    originType, 
                    tokenValue
                ), 
                stack
            );
        }

        type = type || this.inferType(stack);
        originType = originType || this.builder.getAvailableOriginType( type );
        if( originType && originType.toLowerCase() === "array"){
            let value = tokenValue || this.createToken(stack);
            if( assignName ){
               value = this.createAssignmentNode( this.createIdentifierNode( assignName, null, true ), value);
            }
            return this.createCalleeNode(this.createIdentifierNode('is_array'), [value]);
        }
        else if( type.isAnyType || type.isUnionType || type.isIntersectionType || type.isLiteralObjectType){
             const system = this.builder.getGlobalModuleById('System');
             this.addDepend( system );
             let value = tokenValue || this.createToken(stack);
             if( assignName ){
                value = this.createAssignmentNode( this.createIdentifierNode( assignName, null, true ), value);
             }
             return this.createCalleeNode(this.createStaticMemberNode([
                this.createIdentifierNode( this.getModuleReferenceName( system ) ),
                this.createIdentifierNode( 'condition' )
             ]), [ value ]);
        }
        return tokenValue || this.createToken(stack);
    }

    insertNodeBlockContextTop(node){
        const top = this.getTopBlockContext();
        if( top ){
            top.insertNodeBlockContextAt( node );
        }
    }

    getTopBlockContext(){
        return this.getParentByType( (parent)=>{
            return TOP_SCOPE.includes(parent.type)
        },true);
    }

    createImportNode(source, specifiers, stack){
        const obj = this.createNode('ImportDeclaration');
        obj.stack = stack;
        obj.source = source instanceof Token ? source : obj.createLiteralNode( source );

        const config = this.plugin.options;
        if( !config.useAbsolutePathImport ){
           const dir = this.createNode('BinaryExpression');
           dir.left  = dir.createIdentifierNode('__DIR__');
           dir.right = obj.source;
           dir.operator = '.';
           dir.right.parent = dir;
           obj.source = dir;
        }

        obj.specifiers = [];
        if( specifiers ){
            specifiers.forEach( item=>{
                if( Array.isArray(item) ){
                    obj.specifiers.push( obj.createImportSpecifierNode( ...item ) );
                }else if( item instanceof Token ){
                    item.parent = obj;
                    obj.specifiers.push( item );
                }
            });
        }
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

    createCallReflectScopeNode( module ){
        if( module && module.isModule ){
            return this.createClassRefsNode(module);
        }
        return this.createLiteralNode(null);
    }

    createCallReflectPropertyNode( memberStack ){
        return memberStack.computed ? this.createToken(memberStack.property) : this.createLiteralNode(memberStack.property.value());
    }

    createArrayAddressRefsNode(desc, name, nameNode){
        if(!desc)return;
        const assignAddress = desc.isStack && desc.assignItems && this.getAssignAddressRef(desc);
        if( assignAddress ){
            const name = assignAddress.getName(desc);
            const rd = assignAddress.createIndexName(desc);
            if( rd ){
                return this.createMemberNode([
                    this.createIdentifierNode(name, null, true),
                    this.createIdentifierNode(rd, null, true)
                ],null, true);
            }
        }
        return nameNode || this.createIdentifierNode(name,null,true);
    }


    addVariableRefs(desc, refsName){
        if(!desc || !desc.isStack)return;
        const name = refsName || desc.value();
        let funScope = this.scope;
        const check = ( scope )=>{
            if( !scope )return;
            if( !scope.declarations.has( name ) ){
                return scope.children.some( child=>{
                    return check(child);
                });
            }
            return true;
        }

        while( funScope ){
            const isForContext = funScope.isForContext;
            funScope = isForContext ? funScope.getScopeByType("block") : funScope.getScopeByType("function");
            if(!funScope)return;
            if( funScope.isMethod )return;
            if( !isForContext && !funScope.type('function') )return;
            if( isForContext && !funScope.type('block') )return;
            if( !check( funScope ) ){
                let dataset = refsParentVariable.get(funScope);
                if(!dataset){
                    dataset=new Set();
                    refsParentVariable.set(funScope,dataset);
                }
                dataset.add(refsName || desc);
                if( !refsName && (desc.isVariableDeclarator || desc.isParamDeclarator) ){
                    const addressRefObject = this.getAssignAddressRef(desc);
                    if(addressRefObject){
                        dataset.add(addressRefObject.createIndexName(desc));
                    }
                }
            }
            funScope = funScope.parent;
        }
    }

    getVariableRefs(){
        const isForContext = this.scope.isForContext;
        const funScope = isForContext ? this.scope.getScopeByType("block") : this.scope.getScopeByType("function");
        return refsParentVariable.get(funScope);
    }

    getAssignAddressRef(desc){
        if(!desc)return null;
        return assignAddressRef.get(desc);
    }

    addAssignAddressRef(desc, value){
        if(!desc)return null;
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
        return type && (type.isLiteralArrayType || type.isTupleType || this.builder.getGlobalModuleById('array') === type || this.builder.getGlobalModuleById('Array')===type);
    }

    isArrayMappingType(type){
        if(!type)return false;
        if(type.isTypeofType && type.origin){
            return this.isArrayMappingType(type.origin.type())
        }
        if(!type.isModule)return false;
        if(type.dynamicProperties && type.dynamicProperties.size > 0 && this.builder.getGlobalModuleById('Array').is(type) ){
            return type.dynamicProperties.has( this.builder.getGlobalModuleById('string') ) ||
                    type.dynamicProperties.has( this.builder.getGlobalModuleById('number') );
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
        }
        else{
            const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
            if( isWrapType ){
                let inherit = type.inherit.type();
                if(this.builder.getGlobalModuleById('ObjectProtector') === inherit){
                    return false;
                }
                if( this.builder.getGlobalModuleById('ArrayProtector') === inherit ){
                    return true;
                }else if( type.types.length>0 ){
                    if( this.builder.getGlobalModuleById('RMD') === inherit){
                        return this.isArrayAccessor( type.types[0].type() )
                    }
                }
            }
            const raw = this.compiler.callUtils("getOriginType",type);
            if( raw === this.builder.getGlobalModuleById('Array') || this.isArrayMappingType( raw ) ){
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
            if(this.builder.getGlobalModuleById('ArrayProtector')===inherit){
                return false;
            }
            if( type.types.length>0){
                if(this.builder.getGlobalModuleById('RMD') === inherit){
                    return this.isObjectAccessor( type.types[0].type() );
                }
            }
            return this.builder.getGlobalModuleById('ObjectProtector') === inherit;
        }
        return false;
    }

    isPassableReferenceExpress( stack, type ){
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
                if( inheritType === this.builder.getGlobalModuleById('RMD') ){
                    return true;
                }else if(type.types.length>0 && (
                    inheritType === this.builder.getGlobalModuleById('ArrayProtector') || 
                    inheritType === this.builder.getGlobalModuleById('ObjectProtector'))
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
        if( stack.isArrayExpression ){
            return true;
        }

        const check=(stack, type)=>{
            if( type ){
                if( verify(type) ){
                    return true;
                }
                if( !this.isArrayAddressRefsType(type) )return false;
            }
            if( stack.isIdentifier || stack.isVariableDeclarator || stack.isParamDeclarator )return true;
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
            }
            return false;
        }
        return check(stack);
    }

    hasCrossScopeAssignment( assignmentSet , inFor){
        if( !assignmentSet )return false;
        //if( assignmentSet.size < 2 )return false;
        if( inFor )return assignmentSet.size > 0;
        return assignmentSet.size > 1
        // const items = Array.from( assignmentSet.values() );
        // const firstScope = items[0].scope;
        // return items.some( item=>{
        //    return item.scope !== firstScope;
        // });
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


    addDepend( dep ){
        this.builder.addDepend(dep, this.module || this.compilation);
    }

    getDependencies(module){
        return this.builder.getDependencies(module || this.module || this.compilation);
    }

    isActiveForModule(module, ctxModule, flag=false){
        if( this.builder.isActiveForModule(module, ctxModule || this.module || this.compilation) ){
            return true;
        }
        if( flag ){
            return this.isReferenceDeclaratorModule(module, ctxModule);
        }
        return false;
    }

    isReferenceDeclaratorModule( depModule,ctxModule ){
        return this.builder.isReferenceDeclaratorModule(depModule, ctxModule || this.module || this.compilation);
    }

    getParentByType( type, flag=false){
        var parent = flag ? this : this.parent;
        var invoke = typeof type === 'function' ? type : item=>item.type === type;
        while( parent && !invoke(parent) ){
            parent = parent.parent;
        }
        return parent;
    }

    insertNodeBlockContextAt(node){
        const block = this.getParentByType( (parent)=>{
            return parent.type ==='BlockStatement' || parent.type ==="FunctionExpression" || TOP_SCOPE.includes(parent.type)
        },true);
        if( block ){
            if( !(node.type === "ExpressionStatement" || node.type === 'VariableDeclaration') ){
                node = this.createStatementNode( node );
            }
            node.parent = block;
            block.body.push( node );
            return true;
        }
        return false;
    }

    checkRefsName(name,top=false,flags=Token.SCOPE_REFS_DOWN | Token.SCOPE_REFS_UP_FUN, context=null, initInvoke=null){

        const ctx = context || this.getParentByType(parent=>{
            if( top ){
                return TOP_SCOPE.includes( parent.type );
            }else{
                return FUNCTION_SCOPE.includes( parent.type );
            }
        }, true);

        if( !ctx ){
            return name;
        }

        if(top)flags= Token.SCOPE_REFS_All;
        const scope = (context && context.scope) || this.scope;
        const fnScope = top ?  scope.getScopeByType('top') : scope.getScopeByType('function');
        const key = fnScope ? fnScope : scope;
        const cache = SCOPE_MAP;
        var dataset = cache.get( key );
        if( !dataset ){
            cache.set(key, dataset={
                scope,
                result:new Set(),
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
        }

        const isTokenCtx = ctx instanceof Token;
        var body = isTokenCtx ? ctx.beforeBody || ctx.body : null;
        var block = isTokenCtx ? ctx : null;
        if( body && body.type === "BlockStatement" ){
            block = body;
            body = body.body;
        }

        if( dataset.check(name,scope) ){
            var index = 1;
            while( dataset.check(name+index, scope) && index++ );
            var value = name+index;
            dataset.result.add(value);
            if( isTokenCtx ){
                const event = {name,value,top,context:ctx,scope,prevent:false};
                ctx.emit('onCreateRefsName', event);
                if( block && !event.prevent ){
                    let init = null;
                    if( initInvoke ){
                        init = initInvoke(value,name);
                    }
                    if( init ){
                        body.push(block.createDeclarationNode('const', [
                            block.createDeclaratorNode(
                                block.createIdentifierNode(value),
                                init,
                            )
                        ]));
                    }
                }
            }
            return value;
        }else if(!top) {
            dataset.result.add(name);
            if(initInvoke && block){
                var init = initInvoke(name, name);
                if( init ){
                    body.push(block.createDeclarationNode('const', [
                        block.createDeclaratorNode(
                            block.createIdentifierNode(name),
                            init,
                        )
                    ]));
                }
            }
        }

        return name;
    }

    getDeclareRefsName(desc, name, flags=Token.SCOPE_REFS_DOWN | Token.SCOPE_REFS_UP_FUN, initInvoke=null, context=null){
        if( !desc )return name;
        var cache = DECLARE_REFS.get( desc );
        if(!cache) DECLARE_REFS.set(desc, cache={});
        if( Object.prototype.hasOwnProperty.call(cache,name) ){
            return cache[name];
        }
        return cache[name] = this.checkRefsName(name, false, flags, context, initInvoke);
    }

    getWasRefsName(desc, name){
        var cache = DECLARE_REFS.get( desc );
        if(cache){
            return cache[name];
        }
        return null;
    }

    getModuleReferenceName(module,context){
        context = context || this.module;
        if( !context && !this.compilation.mainModule ){
            const imports = this.compilation.stack.imports;
            if( imports.length > 0 ){
                const importStack = imports.find( stack=> stack.description() === module );
                if( importStack ){
                    if( importStack.alias ){
                        return importStack.alias.value();
                    }
                    return module.id;
                }
            }
        }
        return this.builder.getModuleReferenceName(module,context);
    }

    inferType(stack, context){
        if( !stack )return stack;
        if( stack.isStack ){
            if( !context )context = stack.getContext();
        }
        if( context ){
            return context.apply(stack.type())
        }
        return stack;
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