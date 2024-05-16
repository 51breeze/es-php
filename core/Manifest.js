class Manifest{

    static #instance = new Manifest()

    static add(module, file, namespace){
        Manifest.#instance.add(module, file, namespace)
    }

    static emit(){
        return Manifest.#instance.emit()
    }

    static has(file){
        return Manifest.#instance.has(file);
    }

    static del(file){
        return Manifest.#instance.del(file);
    }

    static isEmpty(){
        return !(Manifest.#instance.dataset.size > 0)
    }

    static get instance(){
        return Manifest.#instance;
    }

    constructor(){
        this.dataset = new Map();
        this.changed = false;
        this.content = '';
        this.cache = new WeakSet();
    }

    add(module, file, namespace){
        this.changed = true;
        this.dataset.set(file, [module, file, namespace]);
        const compilation = module.compilation;
        if(!this.cache.has(compilation)){
            this.cache.add(compilation);
            compilation.once('onClear',()=>{
                this.dataset.forEach( ([module], key)=>{
                    if(compilation === module.compilation){
                        this.changed = true;
                        this.dataset.delete(key);
                    }
                })
            });
        }
    }
    
    has(file){
        return this.dataset.has(file);
    }

    del(file){
        return this.dataset.delete(file);
    }

    emit(){
        if(this.changed){
           this.content = this.toString();
           this.changed = false;
        }
        return this.content;
    }

    toString(){
        if( this.dataset.size > 0 ){
            const items = [];
            const cache = Object.create(null);
            this.dataset.forEach( ([b,file,ns])=>{
                if(!cache[ns]){
                    cache[ns] = true;
                    items.push(`'${ns}'=>'${file}'`)
                }
            });
            return `return [\r\n\t${items.join(',\r\n\t')}\r\n];`;
        }
        return `return []`;
    }
}

module.exports = Manifest;