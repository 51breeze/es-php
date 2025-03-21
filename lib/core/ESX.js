import Namespace from 'easescript/lib/core/Namespace';
import Utils from 'easescript/lib/core/Utils'
import{getModuleAnnotations, getMethodAnnotations, getAnnotationArgumentValue, compare, createStaticReferenceNode, createClassRefsNode} from './Common';
import transArray from '../transforms/Array';

function createTextVNode(ctx, node){
    return ctx.createCallExpression(
        this.createIdentifier( ctx.getVNodeApi('createTextVNode') ),
        [
            node
        ]
    );
}

function createCommentVNode(ctx, text){
    return ctx.createCallExpression(
        ctx.createIdentifier( ctx.getVNodeApi('createCommentVNode') ),
        [
            ctx.createLiteral(text)
        ]
    );
}

function createSlotNode(ctx, stack,...args){
    if(stack.isSlot && stack.isSlotDeclared){
        const slots = ctx.createCallExpression( 
            ctx.createMemberExpression([
                ctx.createThisExpression(),
                ctx.createIdentifier('getSlots')
            ])
        );
        const node= ctx.createCallExpression(
            ctx.createIdentifier(
                ctx.getVNodeApi('renderSlot')
            ),
            [slots].concat(args)
        );
        node.isSlotNode = true;
        return node;
    }else{
        let node = args[0];
        if(node){
            node.isSlotNode = true;
        }
        return node;
    }
}

function createForMapNode(ctx, object, element, item, key, index, stack){
    const params = [item]
    if(key){
        params.push(key)
    }

    if(index){
        params.push(index)
    }

    if( element.type ==="ArrayExpression" && element.elements.length === 1){
        element = element.elements[0];
    }

    const node = ctx.createArrowFunctionExpression(element, params);
    return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, 'System', 'forMap'),
        [
            object,
            node
        ]
    );
}

function createForEachNode(ctx, refs, element, item, key){
    const args = [item];
    if(key){
        args.push(key);
    }
    if( element.type ==='ArrayExpression' && element.elements.length === 1){
        element = element.elements[0];
    }
    return transArray.map(null, ctx, refs, [ctx.createArrowFunctionExpression(element,args)], true);
}

function getComponentDirectiveAnnotation(module){
    if(!Utils.isModule(module)) return null;
    const annots = getModuleAnnotations(module, ['define'])
    for(let annot of annots){
        const args = annot.getArguments();
        if( compare(getAnnotationArgumentValue(args[0]), 'directives') ){
            if( args.length > 1 ){
                return [module, getAnnotationArgumentValue(args[1]), annot];
            }else{
                return [module, desc.getName('-'), annot];
            }
        }
    }
    return null;
}

let directiveInterface = null;
function isDirectiveInterface(module){
    if(!Utils.isModule(module))return false;
    directiveInterface = directiveInterface || Namespace.globals.get('web.components.Directive')
    if(directiveInterface && directiveInterface.isInterface ){
        return directiveInterface.type().isof( module );
    }
    return false;
}

function createChildNode(ctx, stack, childNode, prev=null){
    if(!childNode)return null;
    const cmd=[];
    let content = [childNode];
    if( !stack.directives || !(stack.directives.length > 0) ){
        return {
            cmd,
            child: stack,
            content
        };
    }
    const directives = stack.directives.slice(0).sort( (a,b)=>{
        const bb = b.name.value().toLowerCase();
        const aa = a.name.value().toLowerCase();
        const v1 = bb === 'each' || bb ==="for" ? 1 : 0;
        const v2 = aa === 'each' || aa ==="for" ? 1 : 0;
        return v1 - v2;
    });

    while( directives.length > 0){
        const directive = directives.shift();
        const name = directive.name.value().toLowerCase();
        const valueArgument = directive.valueArgument;
        if( name ==="each" || name ==="for" ){
            let refs = ctx.createToken(valueArgument.expression);
            let item = ctx.createVarIdentifier(valueArgument.declare.item);
            let key  = ctx.createVarIdentifier(valueArgument.declare.key || 'key');
            let index = valueArgument.declare.index;
            if(index){
                index = ctx.createIdentifier(index)
            }
            if( name ==="each"){
                content[0] = createForEachNode(
                    ctx,
                    refs,
                    content[0],
                    item,
                    key
                );
            }else{
                content[0] = createForMapNode(
                    ctx,
                    refs,
                    content[0],
                    item,
                    key,
                    index,
                    stack
                );
            }
            content[0].isForNode = true;
            cmd.push(name);

        }else if( name ==="if" ){
            const node = ctx.createNode('ConditionalExpression');
            node.test = ctx.createToken(valueArgument.expression);
            node.consequent = content[0];
            content[0] = node;
            cmd.push(name);
        }else if( name ==="elseif" ){
            if( !prev || !(prev.cmd.includes('if') || prev.cmd.includes('elseif')) ){
                directive.name.error(1114, name);
            }else{
                cmd.push(name);
            }
            const node = ctx.createNode('ConditionalExpression');
            node.test = ctx.createToken(valueArgument.expression);
            node.consequent = content[0];
            content[0]=node;
        }else if( name ==="else"){
            if( !prev || !(prev.cmd.includes('if') || prev.cmd.includes('elseif')) ){
                directive.name.error(1114, name);
            }else{
                cmd.push(name);
            }
        }
    }
    return {
        cmd,
        child: stack,
        content
    };
}

function createSlotCalleeNode(ctx, stack, child, ...args){
    if(stack.isSlotDeclared){
        return ctx.createCallExpression(
            ctx.createMemberExpression([
                ctx.createThisExpression(), 
                ctx.createIdentifier('slot')
            ]),
            child ? args.concat( child ) : args,
            stack
        );
    }else{
        return child || ctx.createArrowFunctionExpression(ctx.createArrayExpression())
    }
}

function getCascadeConditional( elements ){
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

function createChildren(ctx, children, data){
    let content = [];
    let len = children.length;
    let index = 0;
    let last = null;
    let result = null;
    let next = ()=>{
        if(index<len){
            const child = children[index++];
            const childNode = createChildNode(
                ctx,
                child,
                ctx.createToken(child),
                last
            ) || next();
            if( child.hasAttributeSlot ){
                const attributeSlot = child.openingElement.attributes.find(attr=>attr.isAttributeSlot);
                if( attributeSlot ){
                    const name = attributeSlot.name.value();
                    const scopeName = attributeSlot.value ? 
                            ctx.createToken(
                                attributeSlot.parserSlotScopeParamsStack()
                            ) : null;
                    let childrenNodes = childNode.content;
                    if( childrenNodes.length ===1 && childrenNodes[0].type ==="ArrayExpression" ){
                        childrenNodes = childrenNodes[0];
                    }else{
                        childrenNodes = ctx.createArrayExpression(childrenNodes);
                    }
                    const params = scopeName ? [ 
                        ctx.createAssignmentExpression(
                            scopeName,
                            ctx.createObjectExpression()
                        ) 
                    ] : [];
                    const renderSlots= createSlotCalleeNode(
                        ctx,
                        child, 
                        ctx.createArrowFunctionExpression(childrenNodes, params)
                    );
                    data.slots[name] = renderSlots
                    return next();
                }
            }else if( child.isSlot && !child.isSlotDeclared ){
                const name = child.openingElement.name.value();
                data.slots[name] = childNode.content[0]
                return next();
            }else if( child.isDirective ){
                childNode.cmd.push(
                    child.openingElement.name.value().toLowerCase()
                )
            }
            return childNode;
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

    let hasComplex = false;
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
                    value = getCascadeConditional( last.content.concat( result.content ) );
                    result.ifEnd = true;
                }else{
                    if(result)result.ifEnd = true;
                    last.content.push( createCommentVNode('end if') );
                    value = getCascadeConditional( last.content );
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
        let first = content[0];
        if( content.length === 1 && (first.type == 'ArrayExpression' || first.isForNode || first.isSlotNode) ){
            return first;
        }

        let base =  content.length > 1 ? content.shift() : ctx.createArrayExpression();
        if( base.type !== 'ArrayExpression' && !base.isForNode ){
            base = ctx.createArrayExpression([base]);
            base.newLine = true;
        }

        const node = ctx.createCallExpression( 
            ctx.createIdentifier('array_merge'),
            [
                base,
                ctx.createArrayExpression(
                    content.reduce(function(acc, val){
                        if( val.type === 'ArrayExpression' ){
                            return acc.concat( ...val.elements );
                        }else{
                            return acc.concat(val)
                        }
                    },[])
                )
            ]
        );
        node.newLine = true;
        node.indentation = true; 
        return node;
    }
    const node = ctx.createArrayExpression( content );
    if( content.length > 1 || !(content[0].type ==="Literal" || content[0].type ==="Identifier") ){
        node.newLine = true;
    }
    return node;
}

function createElementPropsNode(ctx, data, stack){
    const items = [];
    Object.entries(data).map( item=>{
        const [key, value] = item;
        if( key ==='slots' || key==='directives' || key==='keyProps'){
            return;
        }
        if(value){
            if(key==='props' || key==='attrs' || key==='on'){
                if(Array.isArray(value)){
                    items.push( ...value ); 
                }else{
                    throw new Error(`Invalid ${key}`)
                }
            }else{
                if(value.type ==="Property"){
                    items.push( value );
                }else{
                    throw new Error(`Invalid ${key}`)
                }
            }
        }
    });

    const props = items.length > 0 ? ctx.createObjectExpression(items) : null;
    return props;
}

function createComponentPropsHookNode(ctx, props, className){
    return ctx.createCallExpression(
        ctx.createMemberExpression([
            ctx.createThisExpression(),
            ctx.createIdentifier('invokeHook')
        ]),
        [
            ctx.createLiteral('polyfills:props'),
            props,
            className
        ]
    );
}

function createAttributes(ctx, stack, data){
    const createPropertyNode = (propName, propValue)=>{
        return ctx.createProperty(
            propName.includes('-') ? ctx.createLiteral(propName) : ctx.createIdentifier(propName),
            propValue
        )
    }
    const forStack = stack.getParentStack(stack=>{
        return stack.scope.isForContext || !(stack.isJSXElement || stack.isJSXExpressionContainer)
    },true);
    const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;
    stack.openingElement.attributes.forEach(item=>{
        if(item.isAttributeXmlns)return;
        if(item.isAttributeDirective){
            return;
        }else if(item.isJSXSpreadAttribute){
            if(item.argument){
                data.props.push(
                    ctx.createSpreadElement(
                        ctx.createToken(item.argument),
                        item
                    )
                );
            }
            return;
        }else if( item.isAttributeSlot ){
            return;
        }

        let value = ctx.createToken( item );
        if( !value )return;

        let ns = value.namespace;
        let name = value.name.value;
        let propName = name;
        let propValue = value.value;
        let attrLowerName = name.toLowerCase();

        if( (ns ==="@events" || ns ==="@natives" || ns ==="@binding") ){
            return;
        }

        if( ns && ns.includes('::') ){
            let [seg, className] = ns.split('::',2);
            ns = seg;
            name = createStaticReferenceNode(ctx, item, className, name);
            name.computed = true;
            custom = name;
        }

        let isDOMAttribute = false;
        if( item.isMemberProperty ){
            let attrDesc = item.getAttributeDescription( stack.getSubClassDescription() );
            if( attrDesc ){
                isDOMAttribute = getMethodAnnotations(attrDesc, ['domattribute']).length > 0;
            }
        }
        
        if( item.isMemberProperty ){
            if(!isDOMAttribute){
                data.props.push(
                    createPropertyNode(
                        propName,
                        propValue
                    )
                );
                return;
            }
        }

        if( !ns && (attrLowerName ==='ref' || attrLowerName ==='refs') ){
            name = propName = 'ref';
            let useArray = inFor || attrLowerName ==='refs';
            if(useArray){
                propValue = ctx.createArrayExpression([
                    value.value,
                    ctx.createLiteral(true)
                ]);
            }
        }
        
        if(name==='class' || name==='staticClass'){
            if(propValue && propValue.type !== 'Literal'){
                propValue = ctx.createCallExpression(
                    ctx.createIdentifier(
                        ctx.getVNodeApi('normalizeClass')
                    ),
                    [
                        propValue
                    ]
                );
            }
        }else if(name==='style' || name==='staticStyle'){
            if(propValue && !(propValue.type === 'Literal' || propValue.type === 'ObjectExpression')){
                propValue = ctx.createCallExpression(
                    ctx.createIdentifier(
                        ctx.getVNodeApi('normalizeStyle')
                    ),
                    [propValue]
                );
            }
        }else if(attrLowerName==='key' || attrLowerName==='tag'){
            name = attrLowerName
        }

        const property = createPropertyNode(
            propName,
            propValue
        );

        switch(name){
            case "class" :
            case "style" :
            case "key" :
            case "tag" :
            case "ref" :
                data[name] = property
                break;
            default:
                data.attrs.push( property );
        }
    });
}

function createSlotElementNode(ctx, stack , children){
    const openingElement = ctx.createToken(stack.openingElement);
    const args = [ctx, stack];
    let props = null;
    let params = [];
    if( stack.isSlotDeclared ){
        args.push( ctx.createLiteral(stack.openingElement.name.value()) )
        if( openingElement.attributes.length > 0 ){
            const properties = openingElement.attributes.map(attr=>{
                return ctx.createProperty(
                    attr.name,
                    attr.value
                )
            });
            props = ctx.createObjectExpression(properties);
        }else{
            props = ctx.createObjectExpression();
        }
        args.push( props );
    }else if( stack.openingElement.attributes.length > 0 ){
        const attribute = stack.openingElement.attributes[0];
        if( attribute.value ){
            const stack = attribute.parserSlotScopeParamsStack();
            params.push(
                ctx.createAssignmentExpression(
                    ctx.createToken(stack),
                    ctx.createObjectExpression()
                )
            );
        }
    }
    if( children ){
        if(Array.isArray(children) && children.length===0){
            children = null
        }else if( children.type ==='ArrayExpression' && children.elements.length === 0){
            children = null
        }
        if(children){
            args.push( ctx.createArrowFunctionExpression(children, params) );
        }
    }
    return createSlotNode(...args);
}

function createDirectiveElementNode(ctx, stack, children){
    const openingElement = stack.openingElement;
    const name = openingElement.name.value().toLowerCase();
    switch( name ){
        case 'custom' :
        case 'show' :
            return children;
        case 'if' :
        case 'elseif' :
            {
                const condition = ctx.createToken( stack.attributes[0].parserAttributeValueStack() )
                const node = ctx.createNode('ConditionalExpression')
                node.test = condition;
                node.consequent = children
                return node;
            }
        case 'else' :
            return children;
        case 'for' :
        case 'each' :
            {
                const attrs = stack.openingElement.attributes;
                const argument = {};
                attrs.forEach( attr=>{
                    if( attr.name.value()==='name'){
                        argument[ 'refs' ] = ctx.createToken( attr.parserAttributeValueStack() );
                    }else{
                        argument[attr.name.value()] = ctx.createVarIdentifier(attr.value.value());
                    }
                });
                let item = argument.item || ctx.createVarIdentifier('item')
                let key = argument.key || ctx.createVarIdentifier('key')
                let node = name === 'for' ? 
                    createForMapNode(ctx, argument.refs, children, item, key, argument.index, stack) :
                    createForEachNode(ctx, argument.refs, children, item, key);
                node.isForNode = true;
                return node;
            }
    } 
    return null;
}

function createElementNode(ctx,stack,data,children){
    let name = null;
    if( stack.isComponent ){
        if( stack.jsxRootElement === stack && stack.parentStack.isProgram ){
            name = ctx.createLiteral("div");
        }else{
            const desc = stack.description();
            if(Utils.isModule(desc)){
                ctx.addDepend(desc, stack.module)
                name = createClassRefsNode(ctx, desc, stack);
            }else{
                name = ctx.createIdentifier(
                    stack.openingElement.name.value(),
                    stack.openingElement.name
                );
            }
        }
    }else{
        name = ctx.createLiteral(stack.openingElement.name.value());
    }

    data = createElementPropsNode(ctx, data, stack);
    if(children){
        return ctx.createVNodeHandleNode(stack, name, data || ctx.createLiteral(null), children);
    }else if(data){
        return ctx.createVNodeHandleNode(stack, name, data);
    }else{
        return ctx.createVNodeHandleNode(stack, name);
    }
}

function getChildren(stack){
    return stack.children.filter(child=>{
        return !((child.isJSXScript && child.isScriptProgram) || child.isJSXStyle)
    })
}

function createElement(ctx, stack){
    let data = {
        directives:[],
        slots:{},
        attrs:[],
        props:[]
    };
    let isRoot = stack.jsxRootElement === stack;
    let children = getChildren(stack)
    let childNodes = createChildren(ctx, children, data, stack)
    let desc = stack.description();
    let componentDirective = getComponentDirectiveAnnotation(desc);
    let nodeElement = null;
    if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
        componentDirective = true;
    }else if(stack.isComponent && isDirectiveInterface(desc)){
        componentDirective = true;
    }

    if(componentDirective){
        return childNodes;
    }

    if(!stack.isJSXFragment){
        if(!(isRoot && stack.openingElement.name.value()==='root') ){
            createAttributes(ctx, stack, data)
        }
    }

    const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram)
    if( isWebComponent ){
        const properties = []
        if( childNodes ){
            properties.push( ctx.createProperty(
                ctx.createIdentifier('default'),
                childNodes
            ));
            childNodes = null;
        }
        if(data.slots){
            for(let key in data.slots){
                properties.push( 
                    ctx.createProperty(
                        ctx.createIdentifier(key), 
                        data.slots[key]
                    )
                );
            }
        } 
        if( properties.length > 0 ){
            childNodes = ctx.createObjectExpression( properties );
        }
    }

    if(stack.isSlot ){
        nodeElement = createSlotElementNode(ctx, stack, childNodes);
    }else if(stack.isDirective){
        nodeElement = createDirectiveElementNode(ctx, stack, childNodes);
    }else{
        if(stack.isJSXFragment || (isRoot && !isWebComponent && stack.openingElement.name.value()==='root')){
            if(Array.isArray(childNodes) && childNodes.length===1){
                nodeElement = childNodes[0]
            }else{
                nodeElement = createElementNode(ctx, stack, data, childNodes)
            }
        }else{
            nodeElement = createElementNode(ctx, stack, data, childNodes);
        }
    }
    return nodeElement;
}

export {
    createElement,
    createTextVNode,
    createCommentVNode,
    createForMapNode,
    createForEachNode,
    createChildren,
    createChildNode,
    createElementNode,
    createDirectiveElementNode,
    createSlotElementNode,
    createAttributes,
    createComponentPropsHookNode,
    createSlotNode,
    getCascadeConditional,
    getChildren,
    getComponentDirectiveAnnotation,
    isDirectiveInterface,
    createElementPropsNode
}