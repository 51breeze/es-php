const Token = require("./Token");
const JSXClassBuilder = require("./JSXClassBuilder");
const Transform = require("./Transform");
class JSXTransform extends Token{
    constructor(stack, ctx){
        super(stack.toString());
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
    }

    makeConfig(data){
        const items = [];
        Object.entries(data).map( item=>{
            const [key, value] = item;
            if( value ){
                if( Array.isArray(value) ){
                    if( value.length > 0 ){
                        const isObject = value[0].type ==='Property';
                        if( isObject ){
                            items.push( this.createPropertyNode( this.createLiteralNode(key), this.createObjectNode(value) ) );
                        }else{
                            items.push( this.createPropertyNode( this.createLiteralNode(key), this.createArrayNode(value) ) );
                        }
                    }
                }else{
                    if( value.type ==="Property"){
                        items.push( value );
                    }else{
                        items.push( this.createPropertyNode( this.createLiteralNode(key), value) );
                    }
                }
            }
        });
        return items.length > 0 ? this.createObjectNode(items) : null;
    }


    makeAttributes(stack, childNodes, data, spreadAttributes){

        const pushEvent=(name,callback, category)=>{
            const events =  data[ category ] || (data[ category ]=[]);
            const property = this.createPropertyNode(name, callback);
            if( property.key.computed ){
                property.computed = true;
                property.key.computed = false;
            }
            events.push( property );
        }

        const toFun = (item,content)=>{
            if( item.value.isJSXExpressionContainer ){
                const expr = item.value.expression;
                if( expr.isAssignmentExpression ){
                    return this.createFunBindNode(
                        this.createFunctionNode((block)=>{
                            block.body=[
                                content
                            ]
                        }),  
                        this.createThisNode()
                    );
                }
            }
            return content;
        }

        stack.openingElement.attributes.forEach(item=>{
            if( item.isAttributeXmlns || item.isAttributeDirective ){
                if( item.isAttributeDirective ){
                    const name = item.name.value();
                    if( name === 'show'){
                        data.directives.push(
                            this.createObjectNode([
                                this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode('show') ),
                                this.createPropertyNode(this.createIdentifierNode('value'), this.createToken( item.valueArgument.expression ) ),
                            ])
                        );
                    }
                }
                return;
            }else if( item.isJSXSpreadAttribute ){
                spreadAttributes && spreadAttributes.push( this.createToken( item ) );
                return;
            }else if( item.isAttributeSlot ){
                const name = item.name.value();
                const scopeName = item.value ? item.value.value() : null;
                if( scopeName ){
                    data.scopedSlots.push(
                        this.createPropertyNode( 
                            this.createIdentifierNode(name), 
                            this.createFunctionNode((ctx)=>{
                                    ctx.body.push(
                                        ctx.createReturnNode( childNodes ? childNodes : ctx.createLiteralNode(null) )
                                    )
                                },
                                [this.createIdentifierNode(scopeName)]
                            )    
                        )
                    );
                }else{
                    data.slot = this.createLiteralNode(name);
                }
                return;
            }

            let value = this.createToken( item );
            if( !value )return;

            let ns = value.namespace;
            let name = value.name.name;

            if( ns && ns.includes('::') ){
                let [seg,className] = ns.split('::',2);
                ns = seg;
                const refsModule = stack.getModuleById(className);
                const moduleClass = this.getModuleReferenceName( refsModule );
                this.addDepend( refsModule );
                name = this.createStaticMemberNode([
                    this.createIdentifierNode( moduleClass ),
                    name
                ], name);
                name.computed = true;
            }

            if( ns ==="@events" ){
                pushEvent( name, toFun(item,value.value), 'on')
                return;
            }else if( ns ==="@natives" ){
                pushEvent( name, toFun(item,value.value), 'nativeOn')
                return;
            }else if( ns ==="@binding" ){
                data.directives.push(
                    this.createObjectNode([
                        this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode('model') ),
                        this.createPropertyNode(this.createIdentifierNode('value'), value.value ),
                    ])
                );
                const funNode =this.createFunctionNode((block)=>{
                        block.body=[
                            block.createStatementNode(
                                block.createAssignmentNode(
                                    value.value,
                                    block.createChunkNode(`event && event.target && event.target.nodeType===1 ? event.target.value : event`, false)
                                )
                            )
                        ]
                    },
                    [ this.createIdentifierNode('event') ]
                );
                pushEvent(this.createIdentifierNode('input') , funNode , 'on');
            }

            let propName = name = value.name.value;
            if( item.isMemberProperty ){
                let isDOMAttribute = false;
                let attrDesc = item.getAttributeDescription( stack.getSubClassDescription() );
                if( attrDesc ){
                    isDOMAttribute = attrDesc.annotations.some( item=>item.name.toLowerCase() === 'domattribute' );
                    const alias = attrDesc.annotations.find( item=>item.name.toLowerCase() === 'alias' );
                    if( alias ){
                        const args = alias.getArguments();
                        if( args.length > 0) {
                            propName = args[0].value;
                        }
                    }
                }
                if( !isDOMAttribute ){
                    data.props.push( this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack ), value.value ) );
                    return;
                }
            }

            const property = this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack), value.value );
            switch(name){
                case "class" :
                case "style" :
                case "key" :
                case "ref" :
                case "refInFor" :
                case "tag" :
                case "staticStyle" :
                case "staticClass" :
                    data[name] = property
                    break;
                case "innerHTML" :
                    data.domProps.push( property );
                    break;
                case "value" :
                default:
                    data.attrs.push( property );
            }
        });
    }

    createFunBindNode(target, thisArg, args=[]){
        this.addDepend( this.builder.getGlobalModuleById('System') );
        return this.createCalleeNode(
            this.createStaticMemberNode([
                this.createIdentifierNode('System'),
                this.createIdentifierNode('bind')
            ]),
            [
                target,
                thisArg
            ].concat( args.map( item=>{
                const obj = item instanceof Token ? item : this.createIdentifierNode(item,null,true);
                obj.isVariable = true;
                return obj;
            }))
        );
    }

    createPropertyKeyNode(name, stack){
        return this.createLiteralNode(name, void 0, stack);
    }

    makeProperties(children, data ){
        children.forEach( child=>{
            if( child.isProperty ){
                const node = this.createToken( child );
                data.props.push( this.createPropertyNode( node.name,  node.value ) );
            }else if( child.isSlot ){
                // const name = child.attributes.find( attr=>attr.name.value().toLowerCase() ==='name' );
                // const scope = child.attributes.find( attr=>attr.name.value().toLowerCase() ==='scope' );
                // const children = child.children.map( child=>this.make(child) );
            }
        });
    }

    makeDirectives(child, element, prevResult){
        if( !element )return null;
        const cmd=[];
        let content = [element];
        if( !child.directives || !(child.directives.length > 0) ){
            return {cmd,child,content};
        }
        const directives = child.directives.slice(0).sort( (a,b)=>{
            const name = b.name.value();
            return name === 'each' || name ==="for" ? -1 : 0;
        });

        let ctx = element.jsxTransformNode || this;
        while( directives.length > 0){
            const directive = directives.shift();
            const name = directive.name.value();
            const valueArgument = directive.valueArgument;
            if( name ==="each" || name ==="for" ){
                let refs = ctx.createToken(valueArgument.expression);
                let desc = valueArgument.expression.isStack && valueArgument.expression.description();
                let item = valueArgument.declare.item;
                let key = valueArgument.declare.key;
                let index = valueArgument.declare.index;
                
                if( cmd.includes('if') ){
                    cmd.pop();
                    content.push( ctx.createLiteralNode(null)  );
                    content[0] = ctx.cascadeConditionalNode( content );
                }

                if( name ==="each"){
                    content[0] = ctx.createIterationNode(name, refs, desc, ctx.checkRefsName('_refs'), content[0], item, key);
                }else{
                    content[0] = ctx.createIterationNode(name, refs , desc, ctx.checkRefsName('_refs'), content[0], item, key, index );
                }
                cmd.push(name);

            }else if( name ==="if" ){
                const node = ctx.createNode('ConditionalExpression');
                node.test = ctx.createToken(valueArgument.expression);
                node.consequent = content[0];
                content[0] = node;
                cmd.push(name);
            }else if( name ==="elseif" ){
                if( !prevResult || !(prevResult.cmd.includes('if') || prevResult.cmd.includes('elseif')) ){
                    directive.name.error(1114, name);
                }else{
                    cmd.push(name);
                }
                const node = ctx.createNode('ConditionalExpression');
                node.test = ctx.createToken(valueArgument.expression);
                node.consequent = content[0];
                content[0]=node;
            }else if( name ==="else"){
                if( !prevResult || !(prevResult.cmd.includes('if') || prevResult.cmd.includes('elseif')) ){
                    directive.name.error(1114, name);
                }else{
                    cmd.push(name);
                }
            }
        }
        return {cmd,child,content};
    }

    cascadeConditionalNode( elements ){
        if( elements.length < 2 ){
            throw new Error('Invaild expression');
        }
        let lastElement = elements.pop();
        while( elements.length > 0 ){
            const _last = elements.pop();
            if( _last.type ==="ConditionalExpression" ){
                _last.alternate = lastElement;
                lastElement = _last;
            }else{
                throw new Error('Invaild expression');
            }
        }
        return lastElement;
    }

    makeChildren(children,data){
        const content = [];
        const part = [];
        let len = children.length;
        let index = 0;
        let last = null;
        let result = null;
        const next = ()=>{
            if( index<len ){
                const child = children[index++];
                const elem = this.makeDirectives(child, this.createToken(child) , last) || next();
                if( !elem )return null;
                if( child.isSlot && !child.isSlotDeclared ){
                    const name = child.openingElement.name.value();
                    if( child.attributes.length > 0 ){
                        data.scopedSlots.push( this.createPropertyNode( this.createLiteralNode(name), elem.content[0]) );
                        return next();
                    }
                }else if( child.isDirective ){
                    let last = elem;
                    let valueGroup = [];
                    last.cmd.push( child.openingElement.name.value() )
                    while(true){
                        const maybeChild = index < len && children[index].isDirective ? children[index++] : null;
                        const maybe=  maybeChild ? this.makeDirectives(maybeChild, this.createToken(maybeChild) , last) : null;
                        const hasIf = last.cmd.includes('if');
                        const isDirective = maybe && maybe.child.isDirective;
                        if( isDirective ){
                            maybe.cmd.push( maybeChild.openingElement.name.value() );
                        }
                        if( hasIf ){
                            if( isDirective && maybe.cmd.includes('elseif') ){
                                maybe.cmd = last.cmd.concat( maybe.cmd );
                                maybe.content = last.content.concat( maybe.content );
                            }else if( isDirective && maybe.cmd.includes('else') ){
                                valueGroup.push( this.cascadeConditionalNode( last.content.concat( maybe.content ) ) );
                                maybe.ifEnd = true;
                            }else{
                                if(maybe)maybe.ifEnd = true;
                                last.content.push( this.createLiteralNode(null) );
                                valueGroup.push( this.cascadeConditionalNode( last.content ) );
                            }
                        }else if( !last.ifEnd ){
                            valueGroup.push( ...last.content );
                        }
                        if( maybe ){
                            last = maybe;
                        }
                        if( !isDirective ){
                            break;
                        }
                    }
                    last.content = valueGroup;
                    last.cmd.length = 0;
                    delete last.ifEnd;
                    return last;
                }
                return elem;
            }
            return null;
        }

        const push = (data, value)=>{
            if( value ){
                if( Array.isArray(value) ){
                    data.push( ...value );
                }else{
                    data.push( value );
                }
            }
        }

        var hasComplex = false;
        
        while(true){
            result = next();
            if( last ){
                let value = null;
                const hasIf = last.cmd.includes('if');
                if( hasIf ){
                    if( result && result.cmd.includes('elseif') ){
                        result.cmd = last.cmd.concat( result.cmd );
                        result.content = last.content.concat( result.content );
                    }else if(result && result.cmd.includes('else') ){
                        value = this.cascadeConditionalNode( last.content.concat( result.content ) );
                        result.ifEnd = true;
                    }else{
                        if(result)result.ifEnd = true;
                        last.content.push( this.createLiteralNode(null) );
                        value = this.cascadeConditionalNode( last.content );
                    }
                }else if( !( last.ifEnd && last.cmd.includes('else') ) ) {
                    value = last.content;
                }

                const complex = last.child.isJSXExpressionContainer ? !!(last.child.expression.isMemberExpression || last.child.expression.isCallExpression) : false;
                if( last.cmd.includes('each') || last.cmd.includes('for') || last.child.isSlot || last.child.isDirective || complex ){
                    hasComplex = true;
                }
                push(content, value);
            }
            last = result;
            if( !result )break;
        }

        if( !content.length )return null;
        if( hasComplex ){
            var base =  content.length > 1 ? content.shift() : this.createArrayNode();
            if( base.type !== 'ArrayExpression' ){
                base = this.createArrayNode([base]);
                base.newLine = true;
            }
            const node =  Transform.get('Array').concat(this, base , content.reduce(function(acc, val){
                if( val.type === 'ArrayExpression' ){
                    return acc.concat( ...val.elements );
                }else{
                    return acc.concat(val)
                }
            },[]), true );
            node.newLine = true;
            node.indentation = true; 
            return node;
        }
        const node = this.createArrayNode( content );
        if( content.length > 1 || !(content[0].type ==="Literal" || content[0].type ==="Identifier") ){
            node.newLine = true;
        }
        return node;
    }

    createForInNode(refName, element, item, key, index){
        const node = this.createFunctionNode(ctx=>{
            const refArray = `_${refName}`;
            ctx.body.push(
                ctx.createDeclarationNode('var',[
                    ctx.createDeclaratorNode( ctx.createIdentifierNode(refArray) , ctx.createArrayNode() )
                ])
            );

            if( index ){
                ctx.body.push(
                    ctx.createDeclarationNode('var',[
                        ctx.createDeclaratorNode(
                            ctx.createIdentifierNode(index), 
                            ctx.createLiteralNode(0,0) )
                    ])
                );
            }

            const _key = key || `_${item}Key`;
            const forNode = ctx.createNode('ForInStatement');
            ctx.body.push( forNode );

            forNode.left = forNode.createDeclarationNode('var', [
                forNode.createDeclaratorNode( _key )
            ]);
            forNode.left.inFor = true;
            forNode.right = forNode.createIdentifierNode(refName, null, true);
            forNode.value = forNode.createIdentifierNode(item, null, true);

            const forBlock = forNode.body = forNode.createNode('BlockStatement'); 
            const forBody = forBlock.body = [];

            forBody.push( 
                forBlock.createStatementNode(
                    Transform.get('Array').push( 
                        forBlock, 
                        forBlock.createIdentifierNode(refArray, null, true), 
                        element.type === "ArrayExpression" ?  element.elements : element,
                        true
                    )
                )
            );

            if( index ){
                const dec = forBlock.createNode('UpdateExpression');
                dec.argument = dec.createIdentifierNode(index, null, true);
                dec.operator='++';
                forBody.push( forBlock.createStatementNode(dec) );
            }

            ctx.body.push( ctx.createReturnNode( ctx.createIdentifierNode(refArray, null, true) ) );

        }, [ this.createIdentifierNode(refName, null, true) ]);
        node.using = this.createFunctionGlobalUsing();
        const variableRefs = this.getVariableRefs();
        if( variableRefs ){
            Array.from( variableRefs.values() ).forEach( item=>{
                const refs = typeof item === 'string' ? node.createIdentifierNode(item,null,true) : node.createIdentifierNode( item.value(), item, true );
                node.using.push( node.creaateAddressRefsNode(refs) )
            });
        }
        return node;
    }

    createFunctionGlobalUsing(){
        const node = this.createElementRefsNode();
        node.isVariable = true;
        return [ this.creaateAddressRefsNode( node ) ];
    }

    createEachNode(element, args){
        const node = this.createFunctionNode(
            ctx=>{
                ctx.body.push( ctx.createReturnNode( element.type ==="ArrayExpression" && element.elements.length === 1 ? element.elements[0] : element ) );
            }, 
            args
        );
        node.using = this.createFunctionGlobalUsing();
        const variableRefs = this.getVariableRefs();
        if( variableRefs ){
            Array.from( variableRefs.values() ).forEach( item=>{
                const refs = typeof item === 'string' ? node.createIdentifierNode(item,null,true) : node.createIdentifierNode( item.value(), item, true );
                node.using.push( node.creaateAddressRefsNode(refs) );
            });
        }
        return node;
    }

    createIterationNode(name, refs, desc, refName, element, item, key, index){
        if( name ==="each"){
            const args = [ this.createIdentifierNode(item,null,true) ];
            if(key){
                args.push( this.createIdentifierNode(key,null,true) );
            }
            const node = Transform.get('Array').map( this, refs, [ this.createEachNode(element, args) ], true);
            return node;
        }else{
            const node = this.createCalleeNode(
                this.createIdentifierNode('call_user_func'),
                [ 
                    this.createForInNode(refName, element, item, key, index),
                    refs
                ]
            );
            return node;
        }
    }

    createRenderNode(stack, child){
        const handle = this.createElementHandleNode(stack);
        const node = this.createMethodNode('render', (ctx)=>{
            handle.parent = ctx;
            ctx.body = [
                handle,
                ctx.createReturnNode( child )
            ]
        });
        node.static = false;
        node.modifier = 'public';
        node.kind = 'method';
        return node;
    }

    createClassNode(stack, renderMethod, initProperties){
        const obj = new JSXClassBuilder(stack, this, 'ClassDeclaration');
        if(renderMethod){
            obj.members.push( renderMethod )
        }
        if( initProperties && initProperties.length>0 ){
            obj.initProperties.push( ...initProperties );
        }
        obj.create();
        return obj;
    }

    getElementConfig(){
        return {
            props:[],
            attrs:[],
            on:[],
            nativeOn:[],
            slot:void 0,
            scopedSlots:[],
            domProps:[],
            key:void 0,
            ref:void 0,
            refInFor:void 0,
            tag:void 0,
            staticClass:void 0,
            class:void 0,
            show:void 0,
            staticStyle:void 0,
            style:void 0,
            hook:void 0,
            model:void 0,
            transition:[],
            directives:[]
        };
    }

    isWebComponent(stack){
        const module = stack.module;
        if( this.compilation.JSX || (module && ( stack.isModuleForWebComponent( module ) || stack.isModuleForSkinComponent(module) ) )){
            return true;
        }
        return false
    }

    createElementHandleNode(stack){
        if( this.isWebComponent(stack) ){
            return this.createDeclarationNode('const', [ 
                this.createDeclaratorNode( 
                    this.createElementRefsNode(),
                    this.createFunBindNode(this.createArrayNode([
                        this.createThisNode(),
                        this.createLiteralNode('createElement')
                    ]), this.createThisNode())
                )
            ]);
        }else{
            return this.createDeclarationNode('const', [ 
                this.createDeclaratorNode( 
                    this.createElementRefsNode(),
                    this.createChunkNode('func_get_arg(0)',false)
                ) 
            ]);
        }
    }

    createElementRefsNode(){
        const root = this.stack.jsxRootElement;
        return this.createIdentifierNode( this.getDeclareRefsName(root, 'createNode' , Token.SCOPE_REFS_DOWN | Token.SCOPE_REFS_UP_FUN, null, root) );
    }

    createElementNode(stack, ...args){
        const refs = this.createElementRefsNode();
        refs.isVariable = true;
        const node = this.createCalleeNode(refs,args);
        return node;
    }

    createSlotCalleeNode(child, ...args){
        const node = this.createNode('LogicalExpression');
        node.left = node.createCalleeNode(
            node.createMemberNode([
                node.createThisNode(), 
                node.createIdentifierNode('slot')
            ]),
            args
        );
        node.right = child;
        node.left.parent = node;
        node.right.parent = node;
        node.operator = '?:';
        return node;
    }

    makeSlotElement(stack , children){
        const openingElement = this.createToken(stack.openingElement);
        if( stack.isSlotDeclared ){
            if( stack.openingElement.attributes.length > 0 ){
                return this.createSlotCalleeNode(
                    children,
                    openingElement.name, 
                    this.createLiteralNode(true), 
                    this.createTypeTransformNode('object', this.createObjectNode( openingElement.attributes ) )
                );
            }else{
                return this.createSlotCalleeNode(
                    children || this.createArrayNode(),
                    openingElement.name,  
                );
            }
        }else{
            if( stack.openingElement.attributes.length > 0 ){
                const scope = stack.openingElement.attributes.find( attr=>attr.name.value() === 'scope' );
                const scopeName = scope && scope.value ? scope.value.value() : 'scope';
                return this.createSlotCalleeNode(
                    this.createCalleeNode(
                        this.createMemberNode([
                            this.createParenthesNode(this.createFunctionNode((ctx)=>{
                                const node = ctx.createNode('ReturnStatement');
                                node.argument = children;
                                children.parent = node;
                                ctx.body.push( node )
                            },[
                                this.createIdentifierNode(scopeName)
                            ])),
                            this.createIdentifierNode('bind')
                        ]),
                        [
                            this.createThisNode()
                        ]
                    ),
                    openingElement.name, 
                    this.createLiteralNode(true),
                );
            }else{
                return this.createSlotCalleeNode(
                    children || this.createArrayNode(),
                    openingElement.name,  
                );
            }
        }
    }

    makeDirectiveElement(stack,children){
        const openingElement = stack.openingElement;
        const name = openingElement.name.value();
        switch( name ){
            case 'show' :
                return children;
            case 'if' :
            case 'elseif' :
                const condition = this.createToken( stack.attributes[0].parserAttributeValueStack() )
                const node = this.createNode('ConditionalExpression')
                node.test = condition;
                node.consequent = children
                return node;
            case 'else' :
                return children;
            case 'for' :
            case 'each' :
                const attrs = stack.openingElement.attributes;
                const argument = {};
                attrs.forEach( attr=>{
                    if( attr.name.value()==='name'){
                        const stack = attr.parserAttributeValueStack();
                        argument[ 'refs' ] = this.createToken( stack );
                        argument[ 'desc' ] = stack.isStack && stack.description();

                    }else{
                        argument[ attr.name.value() ] = attr.value.value();
                    }
                });
                const fun = this.createIterationNode(
                    name, 
                    argument.refs, 
                    argument.desc,
                    this.checkRefsName('_refs'),
                    children, 
                    argument.item || 'item',
                    argument.key || 'key', 
                    argument.index
                );
                if( stack.children.length > 1 ){
                    return Transform.get('Array').flat( this, fun, [], true);
                }
                return fun;
        } 
        return null;
    }

    makeHTMLElement(stack,data,children){
        var name = null;
        if( stack.isComponent ){
            if( stack.jsxRootElement === stack && stack.parentStack.isProgram ){
                name = this.createLiteralNode("div");
            }else{
                const module = stack.description();
                this.addDepend( module );
                name = this.createClassRefsNode( module, stack );
            }
        }else{
            name = this.createLiteralNode(stack.openingElement.name.value(), void 0, stack.openingElement.name);
        }

        data = this.makeConfig(data);
        if( children ){
            return this.createElementNode(stack, name, data || this.createLiteralNode(null), children);
        }else if(data){
            return this.createElementNode(stack, name, data);
        }else{
            return this.createElementNode(stack, name);
        }
    }

    create(stack){

        const data = this.getElementConfig();
        const children = stack.children.filter(child=>!( (child.isJSXScript && child.isScriptProgram) || child.isJSXStyle) );
        const childNodes =this.makeChildren(children, data);

        if( stack.parentStack.isSlot ){
            const name = stack.parentStack.openingElement.name.value();
            data.slot = this.createLiteralNode(name);
        }else if(stack.parentStack && stack.parentStack.isDirective ){
            let dName = stack.parentStack.openingElement.name.value();
            if( dName === 'show' ){
                const condition= stack.parentStack.openingElement.attributes[0];
                data.directives.push(
                    this.createObjectNode([
                        this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode('show') ),
                        this.createPropertyNode(this.createIdentifierNode('value'), this.createToken( condition.parserAttributeValueStack() ) ),
                    ])
                );
            }
        }

        var hasScopedSlot = false;
        if( stack.hasAttributeSlot ){
            const attrSlot = stack.openingElement.attributes.find( attr=>!!attr.isAttributeSlot );
            if( attrSlot ){
                hasScopedSlot = !!attrSlot.value;
            }
        }

        const spreadAttributes = [];
        this.makeAttributes(stack, childNodes, data, spreadAttributes);
        this.makeProperties(children, data);

        if( spreadAttributes.length > 0 ){
            if( data.props.length > 0 ){
                const params = [
                    this.createObjectNode(), 
                    this.createObjectNode(data.props),
                    ...spreadAttributes
                ];
                data.props = this.createCalleeNode(
                    this.createMemberNode([
                        this.createIdentifierNode('Object'),
                        this.createIdentifierNode('assign')
                    ]),
                    params
                );
            }else{
                const params = [this.createObjectNode() , ...spreadAttributes];
                data.props = this.createCalleeNode(
                    this.createMemberNode([
                        this.createIdentifierNode('Object'),
                        this.createIdentifierNode('assign')
                    ]),
                    params
                );
            }
        }

        const isRoot = stack.jsxRootElement === stack;
        var nodeElement = null;
        if(stack.isSlot){
            nodeElement = this.makeSlotElement(stack, childNodes);
        }else if(stack.isDirective){
            nodeElement = this.makeDirectiveElement(stack, childNodes);
        }else{
            nodeElement = this.makeHTMLElement(stack, data, hasScopedSlot ? null : childNodes );
        }

        if( isRoot ){
            if( stack.compilation.JSX && stack.parentStack.isProgram ){
                const initProperties = data.props.map( property=>{
                    return this.createStatementNode(
                        this.createAssignmentNode(
                            this.createMemberNode([
                                this.createThisNode(),
                                this.createIdentifierNode( property.name.value )
                            ]),
                            property.value,
                        )
                    )
                });
                const renderMethod = this.createRenderNode(stack, nodeElement );
                nodeElement = this.createClassNode(stack, renderMethod, initProperties);
            }else{
                const block =  this.getParentByType( ctx=>{
                    return ctx.type === "BlockStatement" && ctx.parent.type ==="MethodDefinition"
                });
                if( block && !block.existCreateElementHandle ){
                    block.existCreateElementHandle = true;
                    block.body.unshift( this.createElementHandleNode(stack) );
                }
            }
        }
        nodeElement.jsxTransformNode = this;
        return nodeElement;
    }
}

module.exports = JSXTransform;