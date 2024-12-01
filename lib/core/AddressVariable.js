import Utils from "easescript/lib/core/Utils";

class AddressVariable {
    //引用数组的变量名
    static REFS_NAME = '__RAN';
    //引用数组的索引
    static REFS_INDEX = '__RAI';
    //引用数组的内存地址
    static REFS_MEMORY = '__RMA';
    //对一个变量的引用名
    static REFS_VALUE = '__RVN';
    
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

    createName(stack, description){
        if(!description)description = stack;
        if(!Utils.isStack(description))return null;
        if( !this.refs.has( description ) ){
            const name = this.ctx.getLocalRefName(stack, AddressVariable.REFS_NAME, description);
            this.setName(description, name );
            return name;
        }
        return this.getName(description);
    }

    createIndexName(stack, description=null){
        if(!description)description = stack;
        if(!Utils.isStack(description))return null;
        if( this.indexName === null ){
            const name = this.ctx.getLocalRefName(stack, AddressVariable.REFS_INDEX, description);
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

export default AddressVariable