const PATH= require('path');
const crypto = require('crypto');
const merge = require("lodash/merge");
const fs = require("fs-extra");
const suffixMaps = {
    '.less':'.css',
    '.sacc':'.css',
    '.scss':'.css',
}
class Asset{
    constructor(file, source, local, module, context){
        this.file = file;
        this.source = source;
        this.local = local;
        this.module = module;
        this.context = context;
        this.content = '';
        this.change = true;
        this.format = '[name]-[hash][ext]';
        this.extname = '';
        if(file){
            const ext = PATH.extname(file);
            if(ext){
                this.extname = ext;
            }
        }
    }

    emit(done){
        if( this.change ){
            this.change = false;
            const output = this.context.getOutputPath();
            const file = PATH.join(output, this.getOutputFilePath());
            fs.mkdirSync(PATH.dirname(file), {recursive: true});
            const ext = this.getExt();
            if( ext ==='.less'){
                this.lessCompile(done, file);
            }else if( ext ==='.sass'){
                this.sassCompile(done, file);
            }else if( ext ==='.js' || ext ==='.es' ){
                this.jsCompile(done, file);
            }else{
                if( this.content ){
                    fs.writeFileSync(file, this.content); 
                }else if( fs.existsSync(this.file) ){
                    fs.copyFileSync(this.file, file);
                }
                if(done)done();
            }
        } 
    }

    lessCompile(done, filename){
        const less = require('less');
        const options = merge({filename:this.file}, this.context.plugin.options.lessOptions);
        const content = this.content || fs.readFileSync(this.file).toString();
        less.render(content,options,(e, output)=>{
            if( e ){
                done( e );
            }else{
                fs.writeFile(filename, output.css, done);
            }
        });
    }

    sassCompile(done, filename){
        const sass = require('node-sass');
        const options = merge({}, this.context.plugin.options.sassOptions);
        const content = this.content || fs.readFileSync(this.file).toString();
        options.file = this.file;
        options.data = content;
        sass.render(options,(e, output)=>{
            if( e ){
                done( e );
            }else{
                fs.writeFile(filename, output.css, done);
            }
        });
    }

    jsCompile(done, filename){
        const rollup = require('rollup');
        const options = merge({
            input:{
                plugins:[],
                watch:false,
            }, 
            output:{
                format:'cjs'
            },
        }, this.context.plugin.options.rollupOptions);
        const plugins = [
            'rollup-plugin-node-resolve',
            'rollup-plugin-commonjs'
        ].map( nam=>{
            try{
                const file = require.resolve( nam );
                const plugin = require( file );
                return plugin();
            }catch(e){
                return null;
            }
        }).filter( plugin =>plugin && !options.input.plugins.some(item=>{
            return item.name === plugin.name;
        }));
        options.input.plugins.push( ...plugins );
        options.input.input = this.content || this.file;
        options.output.file = filename;
        rollup.rollup(options.input).then( bundle=>{
            bundle.write( options.output ).finally(done);
        }).catch( done );
    }

    setContent(content){
        if( content !== this.content ){
            this.change = true;
            this.content = content;
        }
    }

    getExt(){
        return this.extname;
    }

    getOutputFilePath(){
        if(this.assetOutputFile)return this.assetOutputFile;
        const publicPath = (this.context.plugin.options.publicPath || '').trim();
        let folder = this.getFolder();
        if( publicPath && !PATH.isAbsolute(folder)){
            folder = PATH.join(publicPath,folder);
        }
        const ext = this.getExt();
        const data = {
            name:this.getFilename(),
            hash:this.getHash(),
            ext:suffixMaps[ext] || ext
        }
        let file = this.format.replace(/\[(\w+)\]/g,(_,name)=>{
            return data[name] || '';
        });
        file = PATH.join(folder, file);
        return this.assetOutputFile = this.context.compiler.normalizePath( PATH.isAbsolute(file) ? PATH.relative(this.context.getOutputPath(),file) : file );
    }

    getFilename(){
        if(this.filename)return this.filename;
        let name = this.module ? this.module.id : ''
        if( PATH.isAbsolute(this.file) ){
            name = PATH.basename(this.file, PATH.extname(this.file))
        }else{
            name = PATH.extname(this.file).slice(1)
        }
        return this.filename = String(name).toLowerCase();
    }

    getHash(){
        if(this.hash)return this.hash;
        return this.hash = crypto.createHash('md5').update(this.file).digest('hex').substring(0,8);
    }

    getFolder(){
        if(this.folder)return this.folder;
        const mapping = this.context.plugin.options.resolve.mapping.folder;
        return this.folder = this.context.resolveSourceFileMappingPath(this.file, mapping, 'asset') || PATH.dirname(this.file);
    }

    getAssetFilePath(){
       return this.file;
    }

    toString(){
        if( this.content ){
            return this.content;
        }else if( fs.existsSync(this.file) ){
            return fs.readFileSync( this.file ).toString();
        }
        return '';
    }
}

class Assets{

    constructor(){
        this.dataset = new Map();
        this.context = null;
    }

    setContext( ctx ){
        this.context = ctx;
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
            if(done && results.length === queues.length){
                const errors = results.filter( error=>!!error );
                done( errors.length>0 ? errors : null );
            }
        }).catch( e=>{
            done(e);
        });
    }

    create(resolve, source, local, module){
        if( !this.dataset.has(resolve) ){
            const asset = new Asset(resolve, source, local, module);
            asset.context = this.context;
            this.dataset.set(resolve, asset);
            return asset;
        }
        return this.dataset.get(resolve);
    }

    getAsset(resolve){
        return this.dataset.get(resolve);
    }
}


module.exports = new Assets();