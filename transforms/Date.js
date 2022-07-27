const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Date.php") ),
    export:"Date",
    require:[],
    isClass:true,
    usePolyfill:false,
    namespace:"es.core"
}