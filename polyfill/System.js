const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/System.php") ),
    export:"System",
    require:[],
    isSystem:true,
    isClass:true,
    namespace:"es.core"
}