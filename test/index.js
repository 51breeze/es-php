const fs = require('fs')
const path = require('path')
const compiler = require("./compiler");
const root = path.join(__dirname,'./specs');
const specs = fs.readdirSync( root );

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

//specs.forEach(file=>require(path.join(root,file)));

describe('compile file', function() {

    const creator = new compiler.Creator();
    let compilation = null;
    let errors = [];
    beforeAll(async function() {
        compilation = await creator.startByFile('./IndexTest.es');
        errors = compilation.compiler.errors.filter(e=>e.code===0 ||e.code===1);
    });

    afterAll(()=>{
        errors.forEach( item=>{
            if( item.kind == 0 ){
                fail( item.toString() )
            }
        });
        compilation = null;
    });

    it('should compile success and build', function() {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build( compilation );
        }
    });
    
});


describe('compile file', function() {
    const creator = new compiler.Creator();
    let compilation = null;
    let errors = [];
    beforeAll(async function() {
        compilation = await creator.startByFile('./StartTest.es');
        errors = compilation.compiler.errors.filter(e=>e.code===0 ||e.code===1);
    });

    afterAll(()=>{
        errors.forEach( item=>{
            if( item.kind == 0 ){
                fail( item.toString() )
            }
        });
        compilation = null;
    });

    it('should compile success and build', function() {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build(compilation);
        }
    });
});


describe('compile file', function() {
    const creator = new compiler.Creator();
    let compilation = null;
    let errors = [];

    beforeAll(async function() {
        compilation = await creator.startByFile('./ArrayBufferTest.es');
        errors = compilation.compiler.errors.filter(e=>e.code===0 ||e.code===1);
    });

    afterAll(()=>{
        errors.forEach( item=>{
            if( item.kind == 0 ){
                fail( item.toString() )
            }
        });
        compilation = null;
    });


    it('should compile success and build', function(done) {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build(compilation, done);
        }
    });
});