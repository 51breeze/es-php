const esbuild = require('esbuild');
esbuild.build({
  entryPoints:{
    index: 'index.js',
  },
  bundle: true,
  outdir: './dist',
  external: ['fsevents','less','node-sass','rollup','rollup-plugin-commonjs','rollup-plugin-node-resolve','fs-extra','lodash'],
  format: 'cjs',
  platform: 'node',
  minify:false,
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    require('esbuild-plugin-copy').copy({
      resolveFrom: 'cwd',
      globbyOptions:{
        ignore:[
          './types/php.array.d.es',
          './types/php.constant.d.es',
          './types/php.d.es',
          './types/spl.d.es',
        ],
      },
      assets: {
        from: ['./types/**'],
        to: ['./dist/types/'],
      },
      keepStructure: false,
    }),
    require('esbuild-plugin-copy').copy({
      resolveFrom: 'cwd',
      assets: {
        from: ['./polyfill/**'],
        to: ['./dist/polyfills/'],
      },
      keepStructure: false,
    })
  ],
}).then( ()=>{
  console.log('Build done.\r\n')
}).catch(() =>{
  console.log('Build error.\r\n')
  process.exit(1);
});


