const fs = require('fs')
const path = require('path')
const compiler = require("./compiler");
const root = path.join(__dirname,'./specs');
const specs = fs.readdirSync( root );

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

//specs.forEach(file=>require(path.join(root,file)));

describe('compile file', function() {
    
    const creator = new compiler.Creator();
    creator.startByFile("./IndexTest.es").then( compilation=>{
        it('should compile success and build', function(done) {
            const errors = compilation.compiler.errors.filter( error=>error.code < 1 );
            compilation.compiler.errors.forEach( error=>{
                if( error.code > 0 ){
                console.log(  error.toString() );
                }
            });
            expect('Expected 0 errors').toContain( errors.length );
            if( errors.length===0 ){
                creator.build( compilation, done );
            }else{
                errors.forEach((error)=>{
                    fail( error.toString() );
                });
                done();
            }
        });
    }).catch( error=>{
        const errors=error.errors;
        it(`compiler failed 'Test.es'`, function() {
            errors.forEach((error)=>{
                console.log( error )
                fail( error.message );
            });
        });
    });
    
});


describe('compile file', function() {
    const creator = new compiler.Creator();
    creator.startByFile("./StartTest.es").then( compilation=>{
        it('should compile success and build', function(done) {
            const errors = compilation.compiler.errors.filter( error=>error.code < 1 );
            compilation.compiler.errors.forEach( error=>{
                if( error.code > 0 ){
                   console.log(  error.toString() );
                }
            });
            expect('Expected 0 errors').toContain( errors.length );
            if( errors.length===0 ){
                creator.build(compilation, done);
            }else{
                errors.forEach((error)=>{
                    fail( error.toString() );
                });
                done();
            }
        });
    }).catch( error=>{
        const errors=error.errors;
        it(`compiler failed 'Test.es'`, function() {
            errors.forEach((error)=>{
                fail( error.message );
            });
        });
    });
});


describe('compile file', function() {
    const creator = new compiler.Creator();
    creator.startByFile("./ArrayBufferTest.es").then( compilation=>{
        it('should compile success and build', function(done) {
            const errors = compilation.compiler.errors.filter( error=>error.code < 1 );
            compilation.compiler.errors.forEach( error=>{
                if( error.code > 0 ){
                   console.log(  error.toString() );
                }
            });
            expect('Expected 0 errors').toContain( errors.length );
            if( errors.length===0 ){
                creator.build(compilation, done);
            }else{
                errors.forEach((error)=>{
                    fail( error.toString() );
                });
                done();
            }
        });
    }).catch( error=>{
        const errors=error.errors;
        it(`compiler failed 'ArrayBufferTest.es'`, function() {
            errors.forEach((error)=>{
                fail( error.message );
            });
        });
    });
});