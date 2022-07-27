const fs = require("fs");
const path = require("path");
const dirname = path.join(__dirname,"../","transforms");
const modules = new Map();
fs.readdirSync( dirname ).forEach( (filename)=>{
    const filepath =  path.join(dirname,filename);
    const info =  path.parse(filepath);
    modules.set( info.name, require(filepath) );
});
module.exports = modules;