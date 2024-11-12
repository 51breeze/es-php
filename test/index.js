const fs = require('fs')
const path = require('path')
const compiler = require("./compiler");
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const creator = new compiler.Creator();

describe('compile file', function() {
    let compilation = null;
    let errors = [];
    beforeAll(async function() {
        compilation = await creator.factor('./IndexTest.es');
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
    let compilation = null;
    let errors = [];
    beforeAll(async function() {
        compilation = await creator.startByFile('./StartTest');
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


    it('should compile success and build', function() {
        expect('Expected 0 errors').toContain( errors.length );
        if( errors.length===0 ){
            creator.build(compilation);
        }
    });
});