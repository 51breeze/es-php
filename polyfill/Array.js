const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Array.php") ),
    export:"Array",
    require:[],
    namespace:"core"
}