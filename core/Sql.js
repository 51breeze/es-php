const Generator = require("./Generator");
class Sql{
    constructor(){
        this.dataset = new Map();
        this.builder=null;
    }

    addTable(file, node, stack){
        this.dataset.set(file,{node,stack});
    }

    has( file ){
        return this.dataset.has(file);
    }

    toString(){
        const dataset = [];
        this.dataset.forEach((object)=>{
            const gen = new Generator(object.stack.file);
            gen.builder = this.builder;
            gen.make( object.node );
            const code = gen ? gen.toString() : '';
            dataset.push( code );
        });
        return dataset.join('\r\n');
    }
}
module.exports = Sql;