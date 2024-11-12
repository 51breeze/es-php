export default function(ctx,stack){
    const node = ctx.createNode( stack );
    node.body = [];
    stack.body.forEach( item=>{
        if( item.isClassDeclaration || item.isDeclaratorDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration ){
            node.body.push( ctx.createToken(item) );
        }
    });
    return node;
}