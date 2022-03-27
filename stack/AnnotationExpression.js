const Syntax = require("../core/Syntax");
class AnnotationExpression extends Syntax{
    emitter(){ 
        const args = this.stack.getArguments();
        const name = this.stack.name.toLowerCase();
        switch( name ){
            case 'provider' : 
                const indexMap=['className','action','method']
                const getItem=(name)=>{
                    let index = args.findIndex(item=>item.key === name);
                    if( index < 0 ){
                        index = indexMap.indexOf(name);
                    }
                    return args[index];
                }
                const moduleClass = getItem( indexMap[0] );
                const action = getItem( indexMap[1] );
                const method = getItem( indexMap[2] ) || {value:'Get'};
                const providerModule = this.stack.getModuleById(moduleClass.value , true);
                if( !providerModule ){
                    this.error(`Class '${moduleClass.value}' is not exists.`);
                }
                const member = providerModule.getMember(action.value);
                if( !member || (member.modifier && member.modifier.value() !=="public") ){
                    this.error(`Method '${moduleClass.value}::${action.value}' is not exists.`);
                }
                const annotation = member.annotations.find( item=>method.value.toLowerCase() == item.name.toLowerCase() );
                if( !annotation ){
                    this.error(`Router '${method.value}' method is not exists. in ${moduleClass.value}::${action.value}`);
                }
                this.compilation.setPolicy(2, providerModule);
                const params = annotation.getArguments();
                const value = params[0] ? params[0].value : action.value;
                if( value.charCodeAt(0)===47 ){
                    return `'${value}'`;
                }
                return `'/${providerModule.id.toLowerCase()}/${value}'`;
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
                        return item.value();
                    }else if( item.AssignmentExpression ){
                        return item.left.value()
                    }
                    return null;
                }).filter( value=>!!value );

                let urlPath = args[0] || action;
                if( params.length > 0 ){
                    urlPath = [urlPath].concat( params.map( value=>`:${value}` ) ).join('/');
                }

                if( urlPath.charCodeAt(0) === 47 ){
                    return {path:urlPath,method:name,controller};
                }
                return {path:`/${className}/${urlPath}`,method:name,controller};
            }
 
            default :
                this.error( `The '${name}' annotations is not supported.` );
        }
        return null;
    }
}
module.exports = AnnotationExpression;