module.exports = function(ctx, stack){
    let value = stack.value();
    if( value ){  
        value = value.replace(/[\r\n]+/g,'').replace(/\u0022/g,'\\"');
        if( value ){
            return ctx.createLiteralNode(value);
        }
    }
    return null;
}
