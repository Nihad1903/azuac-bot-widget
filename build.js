const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const isWatch = process.argv.includes('--watch');
const cssRawPlugin = {
  name: 'css-raw',
  setup(build) {
    build.onResolve({ filter: /\.css\?raw$/ }, (args) => {
      const c = args.path.replace(/\?raw$/, '');
      return { path: path.resolve(path.dirname(args.importer), c), namespace: 'css-raw' };
    });
    build.onLoad({ filter: /.*/, namespace: 'css-raw' }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      return { contents: 'export default ' + JSON.stringify(css) + ';', loader: 'js' };
    });
  },
};
const opts = {
  entryPoints: ['src/widget.js'], bundle: true, minify: true, sourcemap: true,
  format: 'iife', outfile: 'dist/widget.min.js',
  target: ['es2018', 'chrome70', 'firefox65', 'safari12'],
  plugins: [cssRawPlugin],
  banner: { js: '/* AZUAC Chatbot Widget v1.0.0 */' },
  define: { 'process.env.NODE_ENV': '"production"' },
};
async function main() {
  if (isWatch) { const ctx = await esbuild.context(opts); await ctx.watch(); console.log('Watching...'); }
  else {
    const r = await esbuild.build({ ...opts, metafile: true });
    console.log('\n Build complete:\n');
    for (const [f, m] of Object.entries(r.metafile.outputs))
      console.log('  ' + f + ' (' + (m.bytes/1024).toFixed(2) + ' KB)');
  }
}
main().catch(e => { console.error(e); process.exit(1); });
