function createVirtualModule(callback, id, ns='', file=''){
    file = file || id + '.php';
    if(ns){
        file =  ns.replaceAll('.', '/') +'/'+ id + '.php';
    }
    return{
        isModule:true,
        isVirtualModule:true,
        id,
        ns,
        nsId:'',
        file,
        using:false,
        outpath:null,
        context:null,
        emitFile:()=>null,
        async make(){
            const content = await callback(this, this.context);
            return this.emitFile(content);
        },
        async getContent(){
            return await callback(this, this.context);
        },
        getName(delimiter='.'){
            if(delimiter!=='.'){
                if(ns){
                    return ns.replaceAll('.', delimiter) + delimiter + id;
                }
            }
            if(ns)return ns + '.' +id;
            return id
        }
    };
}

const virtualization = {};

module.exports = {
    createVModule(makeHook, id, ns, file){
        const key = ns ? ns+'.'+id : id;
        return virtualization[key] = createVirtualModule(makeHook, id, ns, file)
    },
    getVModule(id){
        return virtualization[id];
    }
}