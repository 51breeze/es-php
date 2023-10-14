module.exports = function(ctx,stack){
    const node = ctx.createNode(stack);
    node.raw = stack.raw();
    const code = node.raw.charCodeAt(0);
    if(code === 34 || code ===39){
        node.value = node.raw.slice(1,-1);
    }else{
        node.value = stack.value();
    }
    if( code === 34 ){
        node.raw=`'${node.value.replace("'","\\'")}'`;
    }

    const type = stack.type();
    if( type.toString()==="regexp" ){
        ctx.addDepend( type.inherit );
        let pattern = node.raw.trim();
        let index = node.raw.lastIndexOf('/');
        if( pattern.charCodeAt(0) !== 47 || !(index > 0) ){
            throw new Error('Invalid regexp '+pattern );
        }else{
            let glog = pattern.slice(index+1);
            pattern = pattern.slice(1, index);
            const args = [pattern, glog].filter( item=>!!item );
            const newNode = ctx.createNewNode( 
                ctx.createIdentifierNode( ctx.getModuleReferenceName(type.inherit) ), 
                args.map( item=>ctx.createLiteralNode( item ) )
            );
            if( stack.parentStack.isMemberExpression ){
                return ctx.createParenthesNode( newNode );
            }else{
                return newNode;
            }
        }
    }
    return node;
}