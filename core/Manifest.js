const arrayKey = Symbol('array');
const merge = (target, source)=>{
    if(Array.isArray(target)){
        if(Array.isArray(source)){
            source.forEach((value,index)=>{
                if(Array.isArray(value) && Array.isArray(target[index])){
                    merge(target[index], value)
                }else if( typeof value ==='object' && typeof target[index] ==='object'){
                    merge(target[index], value)
                }else if(!target.includes(value)){
                    target.push(value)
                }
            })
        }
    }else if(typeof target==='object'){
        if(typeof source==='object'){
            Object.keys(source).forEach(key=>{
                if(Array.isArray(target[key]) && Array.isArray(source[key])){
                    merge(target[key], source[key])
                }else if(typeof target[key] ==='object' && typeof source[key] ==='object'){
                    merge(target[key], source[key])
                }else{
                    target[key] = source[key]
                }
            })
        }
    }
    return target;
}

class Manifest{

    static #instance = new Manifest()

    static add(compilation, name, data){
        Manifest.#instance.add(compilation, name, data)
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

    static changed(){
        return Manifest.#instance.changed
    }

    static get instance(){
        return Manifest.#instance;
    }

    constructor(){
        this.dataset = new Map();
        this.changed = false;
        this.content = '[]';
    }

    add(compilation, name,  object){
        if(!compilation || !name || !object)return;
        this.changed = true;
        let group = this.dataset.get(name);
        if(!group){
            this.dataset.set(name, group=new Map())
        }

        let data = group.get(compilation);
        if(!data){
            group.set(compilation, data=new Map())
            compilation.on('onClear',()=>{
                this.changed = true;
                data.delete(compilation);
            });
        }

        if(Array.isArray(object)){
            const existed = data.get(arrayKey);
            if(existed){
                merge(existed, object)
            }else{
                data.set(arrayKey, object)
            }
        }else{
            Object.keys(object).forEach(key=>{
                const existed = data.get(key);
                if(existed){
                    merge(existed, object[key])
                }else{
                    data.set(key, object[key])
                }
            });
        }
    }

    update(name, object){
        let group = this.dataset.get(name);
        if(group){
            let keys = Array.isArray(object) ? [arrayKey] : Object.keys(object);
            let len = keys.length;
            for(let data of group){
                for(let index in keys){
                    let key = keys[index]
                    if(data.has(key) ){
                        keys.splice(index,1);  
                        merge(data.get(key), object[key])
                        break;
                    }
                }
                if(!keys.length){
                    break;
                }
            }
            return keys.length === len;
        }
        return false;
    }
    
    has(name){
        return this.dataset.has(name);
    }

    del(name){
        return this.dataset.delete(name);
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
            const make = (obj, indent=0)=>{
                let tabs = "\t".repeat(indent)
                let endTabs = "\t".repeat(indent-1)
                if(Array.isArray(obj)){
                    if(!obj.length)return '[]';
                    return `[\n` + obj.map(item=>{
                        return tabs+ make(item, indent+1)
                    }).join(`,\n`) + `\n${endTabs}]`;
                }else{
                    const type = typeof obj
                    if(type === 'number' || type==='boolean'){
                        return obj;
                    }else if(type==='string'){
                        return `'${obj}'`;
                    }
                    let keys = Object.keys(obj);
                    if(!keys.length)return '[]';
                    return `[\n` + keys.map(key=>{
                        return `${tabs}'${key}'=>${make(obj[key], indent+1)}`
                    }).join(`,\n`) + `\n${endTabs}]`;
                }
            }

            const toItem = (group, indent)=>{
                const dataitems = Array.from(group.values());
                const dataGroup = [];
                let tabs = "\t".repeat(indent)
                let endTabs = "\t".repeat(indent-1)
                dataitems.forEach(data=>{
                    data.forEach((object, key)=>{
                        dataGroup.push(`${tabs}'${key}'=>${make(object, indent+1)}`)
                    })
                })
                if(!dataGroup.length)return `[]`;
                return `[\n` + dataGroup.join(',\n') + `\n${endTabs}]`
            }

            let indent = 3;
            this.dataset.forEach( (group, name)=>{
                let tabs = "\t".repeat(indent)
                items.push(`${tabs}'${name}'=>${toItem(group, indent+1)}`)
            });
            let endTabs = "\t".repeat(indent-1)
            return `[\n${items.join(',\n')}\n${endTabs}]`;
        }
        return `[]`;
    }
}

module.exports = Manifest;