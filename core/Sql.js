const Generator = require("./Generator");

class Table{
    constructor(module, node, stack){
        this.module = module;
        this.node = node;
        this.stack = stack;
        this.file = stack.file;
        this.content = null;
    }
    toString(){
        if( this.content === null ){
            const gen = new Generator(this.file);
            gen.make( this.node );
            return this.content = gen ? gen.toString() : '';
        }
        return this.content;
    }
}

class Sql{

    static #instance = new Sql()

    static add(module, node, stack){
        Sql.#instance.add(module, node, stack)
    }

    static emit(){
        return Sql.#instance.emit();
    }

    static del(module){
        return Sql.#instance.del(module);
    }

    static has(module){
        return Sql.#instance.has(module);
    }

    static isEmpty(){
        return !(Sql.#instance.dataset.size > 0)
    }

    static get tables(){
        return Array.from(Sql.#instance.dataset.values());
    }

    static get instance(){
        return Sql.#instance;
    }

    constructor(){
        this.dataset = new Map();
        this.changed = false;
        this.content = '';
        this.cache = new WeakSet();
    }

    add(module, node, stack){
        if(this.has(module))return;
        this.changed = true;
        const compilation = stack.compilation;
        if(!this.cache.has(compilation)){
            this.cache.add(compilation);
            compilation.on('onClear',()=>{
                this.dataset.forEach( (table, module)=>{
                    if(compilation === table.stack.compilation){
                        this.changed = true;
                        this.dataset.delete(module);
                    }
                })
            });
        }
        this.dataset.set(module, new Table(module, node, stack));
    }

    has(module){
        return this.dataset.has(module);
    }

    del(module){
        this.changed = true;
        return this.dataset.del(module);
    }

    emit(){
        if(this.changed){
           this.content = this.toString();
           this.changed = false;
        }
        return this.content;
    }

    toString(){
        const dataset = [];
        this.dataset.forEach((table)=>{
            dataset.push( table.toString() );
        });
        return dataset.join('\r\n');
    }
}
module.exports = Sql;