class Router{
    constructor(){
        this.dataset = new Map();
        this.cached = {};
        this.builder = null;
    }

    getFileObject(file){
        var object = this.dataset.get( file );
        if( !object ){
            object={file,items:[],change:false}
            this.dataset.set(file, object);
        }
        return object;
    }

    addItem(file, className, action, path, method, params){
        while( path.charCodeAt(0) ===47 ){
            path = path.substring(1);
        }
        const item = {className, action, path, method, params};
        const cacheKey =  [path].concat( (params||[]).map( item=>item.name ) ).join('-');
        const cacheValue = [className, '::', action,'/',cacheKey,':',method].join('');
        const old = this.cached[ cacheKey ];
        if( old ){
            if( old === cacheValue )return true;
            if( !old.includes( className ) )return false;
        }
        const object = this.getFileObject(file);
        object.items.push(item);
        object.change=true;
        this.cached[ cacheKey ] = cacheValue;
    }

    create( filename="route.php" ){
        const dataset = [];
        this.dataset.forEach((object)=>{
            if( object.change ){
                dataset.push( this.make(object,filename) );
            }
        });
        return dataset;
    }

    make( object ){
        const filename = 'route.php';
        object.change = false;
        return {file:filename,content:null};
    }
}
module.exports = Router;