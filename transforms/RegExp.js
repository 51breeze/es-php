const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/RegExp.php") ),
    export:"RegExp",
    require:[],
    isClass:true,
    usePolyfill:false,
    namespace:"es.core"
}