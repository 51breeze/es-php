const Syntax = require("../core/Syntax");
class ObjectExpression extends Syntax{

    objectExpression(properties){
        let indent = this.getIndent();
        let level = 1;
        const parent = this.stack.getParentStack( (parent)=>{
            if( parent.isProperty && parent.parentStack.isObjectExpression){
                level++;
                return false;
            }
            return true;
        });

        if( this.stack.hasChildComputed  ){
            const refs = '$'+this.generatorVarName(this.stack,"_c");
            properties = properties.slice(0);
            properties.unshift(`${refs}=new \\ArrayObject([], \\ArrayObject::STD_PROP_LIST | \\ArrayObject::ARRAY_AS_PROPS)`);
            properties.push(`${refs}`);
            indent = indent+("\t".repeat(level));
            return `(${properties.join(`,\r\n${indent}`)})`;
        }else{
            return `new \\ArrayObject([${properties.join(",")}], \\ArrayObject::STD_PROP_LIST | \\ArrayObject::ARRAY_AS_PROPS)`;
        }
    }
    objectMerge(props){
        return `new \\ArrayObject( array_merge(${props.join(",")}), \\ArrayObject::STD_PROP_LIST | \\ArrayObject::ARRAY_AS_PROPS)`;
    }
    emitter(){
        let properties = this.stack.properties.slice(0);
        let spreadElementIndex = properties.findIndex( item=>item.isSpreadElement );
        if( spreadElementIndex >=0 ){
            let props = [];
            do{
                const [spreadElement] = properties.splice(spreadElementIndex, 1);
                const left  = properties.splice(0,spreadElementIndex);
                if( left.length > 0 || props.length == 0 )
                {
                    props.push( this.objectExpression( left.map( item=>this.make(item) ) ) );
                }
                props.push( `${this.make(spreadElement)}` );

            }while( (spreadElementIndex = properties.findIndex( item=>item.isSpreadElement ) ) >= 0 );

            if( properties.length > 0 )
            {
                props.push( this.objectExpression( properties.map( item=>this.make(item) ) ) );
            }
            return this.objectMerge(props);
        }else{
            return this.objectExpression( properties.map( item=>this.make(item) ) );
        }
    }
}

module.exports = ObjectExpression;