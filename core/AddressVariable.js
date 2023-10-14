class AddressVariable {
    constructor( target, ctx){
       this.dataset = new Map();
       this.refs = new Map();
       this.target = target;
       this.ctx = ctx;
       this.cross = 0;
       this.last = null;
       this.indexName = null;
    }

    setName(desc, name){
        this.refs.set( desc, name );
    }

    getName(desc){
        return this.refs.get( desc );
    }

    hasName(desc){
        return this.refs.has( desc );
    }

    getLastAssignedRef(){
        if( !this.hasCross() && this.last ){
           const name = this.getName( this.last.description() );
           if( name ){
               return name;
           }
        }
        return null;
    }

    createName(description){
        if( !description )return null;
        if( !this.refs.has( description ) ){
            const name = this.ctx.getDeclareRefsName(description, AddressVariable.REFS_NAME );
            this.setName(description, name );
            return name;
        }
        return this.getName(description);
    }

    createIndexName(description){
        if( !description || !description.isStack )return null;
        if( this.indexName === null ){
            const name = this.ctx.getDeclareRefsName(description, AddressVariable.REFS_INDEX );
            this.indexName = name;
        }
        return this.indexName;
    }

    add(value){
        if( !value )return;
        if( this.last && this.last.scope !== value.scope ){
            if( this.last.description() !== value.description() ){
                this.cross++;
            }
        }
        const index = this.dataset.size;
        this.dataset.set( value ,  index);
        this.last = value;
        return index;
    }

    getIndex( value ){
        if( !this.dataset.has(value) ){
            this.add(value);
        }
        return this.dataset.get(value);
    }

    hasCross(){
        return this.cross > 0;
    }
}

AddressVariable.REFS_NAME = '__ARD';
AddressVariable.REFS_INDEX = '__ARI';

module.exports = AddressVariable;