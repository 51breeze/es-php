class Composer{

    static #instance = new Composer()

    static add(builder, name, version, env='dev'){
        Composer.#instance.add(builder, name, version, env='dev')
    }

    static emit(){
        return Composer.#instance.emit()
    }

    static del(compilation){
        this.changed = true;
        return Composer.#instance.dataset.delete(compilation);
    }

    static isEmpty(){
        return !(Composer.#instance.dataset.size > 0)
    }
    
    static make(object){
        return Composer.#instance.make(object);
    }

    static get instance(){
        return Composer.#instance;
    }

    constructor(){
        this.dataset = new Map();
        this.changed = false;
        this.content = '';
        this.cache = new WeakSet();
    }

    add(builder, name, version, env='prod'){
        const compilation = builder.compilation;
        let object = this.dataset.get(compilation);
        if(!object){
            this.dataset.set(compilation, object=Object.create(null));
        }
        object[name+':'+env] = {name, version, env};
        this.changed = true;
        if(!this.cache.has(compilation)){
            this.cache.add(compilation);
            compilation.once('onCompilationClear',()=>{
                this.changed = true;
                this.dataset.delete(compilation)
            });
        }
    }

    emit(){
        if(this.changed){
           this.content = this.toString();
           this.changed = false;
        }
        return this.content;
    }

    make(object){
        object = object || Object.create(null);
        Array.from(this.dataset.values()).map(item=>item.values()).flat().forEach(item=>{
            const {name, version, env} = item;
            const key = env ==='prod' ? 'require' : 'require-dev';
            const data = object[key] || (object[key] = Object.create(null));
            data[name] = version;
        });
        return object;
    }

    toString(){
        const object = make();
        return JSON.stringify(object);
    }
}
module.exports = Composer;