const path = require('path');
const Compiler = require("easescript/lib/core/Compiler");
Compiler.buildTypesManifest(
    [path.resolve('./types/index.d.es')], 
    {
        name:'es-php', 
        inherits:[]
    },
    './types'
);