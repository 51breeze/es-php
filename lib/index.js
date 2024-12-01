import Plugin from "./core/Plugin";
import pkg from "../package.json";
import { mergeWith } from "lodash";
const defaultConfig ={
    target:7,
    strict:true,
    emitFile:true,
    useAbsolutePathImport:false,
    import:true,
    outDir:'.output',
    outExt:'.php',
    publicPath:'public',
    context:{
        include:null,
        exclude:null,
        only:false
    },
    dependencies:{
        'moment':{
            name:'fightbulc/moment',
            version:'^1.33.0',
            env:'prod'
        }
    },
    metadata:{
        env:{}
    },
    transform:{
        createToken:null,
        tokens:null
    },
    composer:null,
    consistent:true,
    assets:/\.(gif|png|jpeg|jpg|svg|bmp|icon|font|css|less|sass|scss|js|mjs|cjs|vue|ts)$/i,
    bundle:{
        enable:false,
        extensions:['.js','.mjs','.cjs','.vue','.es','.ts','.sass','.scss','.less'],
        plugins:[],
        esbuildOptions:{}
    },
    lessOptions:{},
    sassOptions:{},
    comments:false,
    manifests:{
        comments:false,
        annotations:false,
    },
    rollupOptions:{
        input:{
            plugins:[]
        },
        output:{
            format:'cjs',
            exports:'auto',
        }
    },
    resolve:{
        usings:{},
        folders:{
            "*.global":"escore",
            "*.assets":"public"
        },
        namespaces:{},
    },
    folderAsNamespace:true,
    externals:[],
    excludes:[],
    includes:[],
    esx:{
        enable:true,
        raw:false,
        handle:'createVNode',
        complete:{
            //['for','each','condition','*']
            keys:false
        },
        delimit:{
            expression:{
                left:'{{',
                right:'}}'
            },
            attrs:{
                left:'"',
                right:'"'
            }
        },
        component:{
            prefix:'',
            resolve:null
        }
    },
}

function merge(...args){
    return mergeWith(...args,(objValue, srcValue)=>{
        if(Array.isArray(objValue) && Array.isArray(srcValue)){
            if(srcValue[0]===null)return srcValue.slice(1);
            srcValue.forEach( value=>{
                if( !objValue.includes(value) ){
                    objValue.push(value)
                }
            })
            return objValue;
        }
   });
}

function getOptions(options){
    return merge({},defaultConfig, options);
}

function plugin(options={}){
    return new Plugin(
        pkg.esconfig.scope,
        pkg.version,
        getOptions(options)
    )
}
export {getOptions, Plugin}
export default plugin;
