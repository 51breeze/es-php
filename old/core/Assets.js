const PATH= require('path');
const crypto = require('crypto');
const fs = require("fs-extra");
class Asset{

    #baseDir = '';
    #outDir = '';
    #resolveDir = '';
    #dist = null;
    #format = '[name]-[hash][ext]';
    #content = '';
    #filename = '';
    #extname = '';
    #file = '';
    #source = '';
    #hash = null;
    #change = true;

    constructor(file, source, local, module){
        this.#file = file;
        this.#source = source;
        this.local = local;
        this.module = module;
        this.compilation = module && module.isModule && module.compilation ? module.compilation : module;
        if(file){
            const ext = PATH.extname(file);
            if(ext){
                this.#extname = ext;
            }
        }
    }

    get change(){
        return this.#change;
    }

    get source(){
        return this.#source;
    }

    setAttr(name, value){
        if(name==='baseDir'){
            this.#baseDir = value;
        }
        else if(name==='outDir'){
            this.#outDir = value;
        }
        else if(name==='resolveDir'){
            this.#resolveDir = value;
        }
        else if(name==='dist'){
            this.#change = true;
            this.#dist = value;
        }
    }

    emit(done){
        if( this.#change ){
            this.#change = false;
            const filename = this.getResourcePath();
            const distFile = PATH.isAbsolute(filename) ? filename :  PATH.join(this.#baseDir, filename);
            if( !fs.existsSync(PATH.dirname(distFile)) ){
                fs.mkdirSync(PATH.dirname(distFile), {recursive: true});
            }
            if( this.content ){
                fs.writeFileSync(distFile, this.#content); 
            }else if( fs.existsSync(this.#file) ){
                fs.copyFileSync(this.#file, distFile);
            }
            if(done){
                done();
            }
        } 
    }

    unlink(){
        const filename = this.getResourcePath();
        const distFile = PATH.isAbsolute(filename) ? filename :  PATH.join(this.#baseDir, filename);
        if(fs.existsSync(distFile)){
            fs.unlinkSync(distFile);
        }
    }

    setContent(content){
        if( content !== this.#content ){
            this.#change = true;
            this.#content = content;
        }
    }

    getContent(){
        return this.#content;
    }

    getExt(){
        return this.#extname;
    }

    getBaseDir(){
        return this.#baseDir;
    }

    getOutputDir(){
        return this.#outDir;
    }

    getResolveDir(){
        return this.#resolveDir;
    }

    getFilename(){
        if(this.#filename)return this.#filename;
        let name = this.module ? this.module.id : ''
        if( PATH.isAbsolute(this.#file) ){
            name = PATH.basename(this.#file, PATH.extname(this.#file))
        }else{
            name = PATH.extname(this.#file).slice(1)
        }
        return this.#filename = String(name).toLowerCase();
    }

    getHash(){
        if(this.#hash)return this.#hash;
        return this.#hash = crypto.createHash('md5').update(this.#file||this.#content).digest('hex').substring(0,8);
    }

    getResourceId(){
        return this.getHash();
    }

    getResourcePath(){
        if(this.#dist){
            return this.#dist;
        }
        let file = this.getAbsoluteResourcePath();
        file = PATH.relative(this.#baseDir,file).replace(/\\/g, '/');
        return this.#dist = file;
    }

    getAbsoluteResourcePath(){
        if(this._absoluteResourcePath){
            return this._absoluteResourcePath;
        }
        const outDir = this.#outDir;
        let folder = this.#resolveDir || '.';
        if(outDir && !PATH.isAbsolute(folder)){
            folder = PATH.join(outDir,folder);
        }
        const ext = this.getExt();
        const data = {
            name:this.getFilename(),
            hash:this.getHash(),
            ext:ext
        }
        let file = this.#format.replace(/\[(\w+)\]/g,(_,name)=>{
            return data[name] || '';
        });
        file = PATH.join(folder, file);
        file = !PATH.isAbsolute(file) ? PATH.join(this.#baseDir,file) : file;
        file = file.replace(/\\/g, '/');
        this._absoluteResourcePath = file;
        return file;
    }

    getAssetFilePath(){
       return this.#file;
    }

    toString(){
        if( this.#content ){
            return this.#content;
        }else if( fs.existsSync(this.#file) ){
            return fs.readFileSync( this.#file ).toString();
        }
        return '';
    }
}

class Assets{

    static #instance = new Assets()

    static create(resolve, source, local, module, builder){
        return Assets.#instance.create(resolve, source, local, module, builder)
    }

    static getAsset(resolve){
        return Assets.#instance.getAsset(resolve);
    }

    static getAssets(){
        return Assets.#instance.getAssets();
    }

    static has(file){
        return Assets.#instance.has(file);
    }

    static del(file){
        return Assets.#instance.del(file);
    }

    static isEmpty(){
        return !(Assets.#instance.dataset.size > 0)
    }

    static get instance(){
        return Assets.#instance;
    }

    constructor(){
        this.dataset = new Map();
        this.cache = new WeakSet();
    }

    emit(done){
        const queues = Array.from( this.dataset.values() )
        .filter( asset=>asset.change )
        .map( asset=>new Promise((resolve,reject)=>{
            asset.emit((error)=>{
                if(error){
                    reject(error)
                }else{
                    resolve();
                }
            });
        }));
        Promise.all(queues).then( (results)=>{
            const errors = results.filter( error=>!!error );
            done( errors.length>0 ? errors : null );
        }).catch( e=>{
            done(e);
        });
    }

    async emitAsync(publicPath){
        return await new Promise((resolve, reject)=>{
            try{
                this.emit(resolve)
            }catch(e){
                reject(e);
            }
        })
    }

    create(resolve, source, local, module, builder){
        if( !this.dataset.has(resolve) ){
            const asset = new Asset(resolve, source, local, module);
            asset.setAttr('baseDir', builder.getOutputPath());
            asset.setAttr('outDir', builder.getPublicPath());
            asset.setAttr('resolveDir', builder.resolveSourceFileMappingPath(resolve));
            this.dataset.set(resolve, asset);
            const compilation = asset.compilation;
            if(compilation && !this.cache.has(compilation)){
                this.cache.add(compilation);
                compilation.on('onClear',()=>{
                    this.dataset.forEach( (asset, resolve)=>{
                        if(asset.compilation === compilation){
                            const asset = this.dataset.get(resolve);
                            if(asset){
                                asset.unlink();
                                this.dataset.delete(resolve);
                            }
                        }
                    });
                });
            }
            return asset;
        }
        return this.dataset.get(resolve);
    }

    getAsset(resolve){
        return this.dataset.get(resolve);
    }

    getAssets(){
        return Array.from( this.dataset.values() )
    }
}


module.exports = Assets;