const fs = require("fs");
const path = require("path");
module.exports={
    content: fs.readFileSync( path.join(__dirname,"./files/Reflect.php") ),
    export:"Reflect",
    require:['System','RegExp','String','Array','Object','Number'],
    isClass:true,
    namespace:"es.core"
}