const {exec} = require('child_process');

exec(`${process.cwd()}/test/vendor/bin/phpunit ./test/build --bootstrap test/autoload.php --include-path ${process.cwd()}/test/build`,(error,stdout,stderr)=>{
    console.log(stdout);
});