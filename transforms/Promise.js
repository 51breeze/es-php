const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Promise.php") ),
    export:"Promise",
    require:[],
    isClass:true,
    usePolyfill:false,
    namespace:"es.core"
}