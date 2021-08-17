const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Iterator.php") ),
    export:"IIterator",
    isClass:true,
    namespace:"es.core"
}