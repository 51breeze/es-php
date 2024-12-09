const Compiler = require("easescript/lib/core/Compiler");
const Compilation = require("easescript/lib/core/Compilation");
const path =require("path");
let plugin = require("../dist/index");
plugin = plugin.default || plugin
class Creator {
    constructor(options){
        const compiler = new Compiler(Object.assign({
            debug:false,
            diagnose:true,
            enableComments:true,
            autoLoadDescribeFile:true,
            workspace:path.join(__dirname,"./src"),
            parser:{
                locations:true
            }
        },options || {}));
        
        this._compiler = compiler;
        this.plugin = plugin({
            includes:['JsxTest.es'],
            folderAsNamespace:true,
            outDir:path.join(__dirname,"./build"),
            metadata:{
                env:{NODE_ENV:'development'}
            },
            comments:true,
            manifests:{
                comments:true,
                annotations:false,
            },
            resolve:{
                usings:[
                    'PHPUnit/Framework/TestCase',
                    'PHPMailer/**'
                ],
                folders:{
                    "*.global":"escore",
                }
            }
        });
        this.plugin.init(compiler);
    }

    get compiler(){
        return this._compiler;
    }

    factor(file){
        return new Promise( async(resolved,reject)=>{
            const compiler = this.compiler;
            await compiler.initialize();
            await compiler.loadTypes([
               'lib/types/php.d.es',
            ], {scope:'es-php'});
            let compilation = null;
            try{
                compilation=file ? await compiler.createCompilation(file) : new Compilation( compiler );
                await compilation.parserAsync();
                if(compilation.stack){
                    resolved(compilation);
                }else{
                    reject({compilation,errors:compiler.errors});
                }
            }catch(error){
                console.log( error )
                reject({compilation,errors:[error]});
            }
        });
    }

    startBySource(source){
        return this.factor(null, source);
    }

    startByFile(file){
        return this.factor(file);
    }

    async build(compilation){
        await this.plugin.run(compilation);
    }
}

exports.Creator=Creator;