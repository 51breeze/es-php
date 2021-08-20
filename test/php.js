const {exec} = require('child_process');
exec(`phpunit ./test/build --bootstrap test/autoload.php --include-path ${process.cwd()}/test/build`,(error,stdout,stderr)=>{
    console.log(stdout);
});