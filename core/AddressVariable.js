class AddressVariable {
    constructor( target ){
       this.dataset = new Map();
       this.target = target;
       this.cross = 0;
       this.last = null;
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


module.exports = AddressVariable;