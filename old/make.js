const fs = require("fs");
const path = require("path");
let files = fs.readdirSync('./tokens');
let content = [];
content.push(`const modules = new Map();`)
files.forEach( (file)=>{
    const info = path.parse(file)
    if( info.name != "index"){
        content.push(`modules.set("${info.name}",require('./${file}'));`)
    }
});
content.push(`module.exports=modules;`);
fs.writeFileSync(  path.join(__dirname,'./tokens/index.js'), content.join('\r\n') );


files = fs.readdirSync('./transforms');
content = [];
content.push(`const modules = new Map();`)
files.forEach( (file)=>{
    const info = path.parse(file)
    if( info.name != "index"){
        content.push(`modules.set("${info.name}",require('./${file}'));`)
    }
});
content.push(`module.exports=modules;`);
fs.writeFileSync(  path.join(__dirname,'./transforms/index.js'), content.join('\r\n') );