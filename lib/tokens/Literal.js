export default function(ctx,stack){
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
    if(type && type.toString().toLowerCase()==="regexp" ){
        ctx.addDepend( type.inherit, stack.module||stack.compilation );
        let pattern = node.raw.trim();
        let index = node.raw.lastIndexOf('/');
        if( pattern.charCodeAt(0) !== 47 || !(index > 0) ){
            throw new Error('Invalid regexp '+pattern );
        }else{
            let glog = pattern.slice(index+1);
            pattern = pattern.slice(1, index);
            const args = [pattern, glog].filter( item=>!!item );
            const newNode = ctx.createNewExpression( 
                ctx.createIdentifier( ctx.getModuleReferenceName(type.inherit, stack.module) ), 
                args.map( item=>ctx.createLiteral( item ) )
            );
            if( stack.parentStack.isMemberExpression ){
                return ctx.createParenthesizedExpression( newNode );
            }else{
                return newNode;
            }
        }
    }
    return node;
}