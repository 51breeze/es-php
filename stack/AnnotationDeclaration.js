const Syntax = require("../core/Syntax");
class AnnotationExpression extends Syntax{
    emitter(){ 
        const args = this.stack.getArguments();
        const name = this.stack.name.toLowerCase();
        switch( name ){
            case 'post' :
            case 'get' :
            case 'option' :
            case 'put' :
            case 'delete' :{
                const method = this.stack.additional;
                const className = method.module.id;
                const action = method.key.value();
                const controller = method.module.getName('.') + '/'+action;
                const params = method.params.map( item=>{
                    if( item.isIdentifier || item.isDeclarator ){
                        return item.value()+( item.question ? '?' : '' );
                    }else if( item.AssignmentExpression ){
                        return item.left.value()+( item.left.question ? '?' : '' );
                    }
                    return null;
                }).filter( value=>!!value );

                let urlPath = args[0] ? args[0].value : action;
                if( params.length > 0 ){
                    urlPath = [urlPath].concat( params.map( value=>`<${value}>` ) ).join('/');
                }

                if( urlPath.charCodeAt(0) === 47 ){
                    return {path:urlPath,method:name,controller,stack:this};
                }
                return {path:`/${className.toLowerCase()}/${urlPath}$`,method:name,controller,stack:this};
            }
 
            default :
                this.error( `The '${name}' annotations is not supported.` );
        }
        return null;
    }
}
module.exports = AnnotationExpression;