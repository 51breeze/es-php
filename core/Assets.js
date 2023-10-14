const PATH= require('path');
const crypto = require('crypto');
const merge = require("lodash/merge");
const fs = require('fs');
class Asset{
    constructor(file, source, local, module, context){
        this.file = file;
        this.source = source;
        this.local = local;
        this.module = module;
        this.context = context;
        this.content = '';
        this.change = true;
    }

    emit(done){
        if( this.change ){
            this.change = false;
            const output = this.context.getOutputPath();
            const file = PATH.join(output, this.getOutputFilename());
            this.mkdir( file );
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

    mkdir( file ){
        var dir = file;
        const paths = [];
        while( dir && !fs.existsSync( dir = PATH.dirname(dir) ) ){
            paths.push( dir );
        }
        while( paths.length > 0 ){
            fs.mkdirSync( paths.pop() );
        }
    }

    setContent(content){
        if( content !== this.content ){
            this.change = true;
            this.content = content;
        }
    }

    getExt(){
        const pos = this.file.lastIndexOf('.');
        if( pos > 0 ){
            return this.file.substring(pos).toLowerCase();
        }
        return '';
    }

    getOutputFilename(){
        if(this.outputFilename)return this.outputFilename;
        const name = this.getFilename();
        return this.outputFilename = name+this.getExt();
    }

    getFilename(){
        if(this.filename)return this.filename;
        return this.filename = crypto.createHash('md5').update(this.file).digest('hex');
    }

    getFolder(){
        if(this.folder)return this.folder;
        const mapping = this.context.plugin.options.resolve.mapping.folder;
        return this.folder = this.context.resolveSourceFileMappingPath(this.file, mapping, 'asset') || PATH.dirname(this.file);
    }

    getAssetFilePath(){
        if(this.assetFilePath)return this.assetFilePath;
        const publicPath = (this.context.plugin.options.resolve.publicPath || '').trim();
        let folder = this.getFolder();
        if( publicPath ){
            folder = PATH.relative('./'+publicPath, folder).replace(/^[\.\/\\]+/,'')
        }
        return this.assetFilePath = this.context.compiler.normalizePath( PATH.join( folder, this.getFilename()+this.getExt() ) );
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