import { mkdir, readdir, cp, writeFile, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [source, host, destination] = process.argv.slice(2);
if (!source || !['github','cloudflare'].includes(host) || !destination) {
  throw Error('Usage: node build-config/complete-build.mjs <patched-upstream-checkout> github|cloudflare <new-empty-output>');
}
const output = path.resolve(destination), checkout = path.resolve(source);
const repo = fileURLToPath(new URL('../',import.meta.url));
if (output===checkout || path.resolve(repo)===output) throw Error('Use a separate output directory.');
await mkdir(output,{recursive:true});
if ((await readdir(output)).length) throw Error('The build output must be empty.');
const base = host==='github'?'/MyPDF/':'/';
const home = host==='github'?'https://fionviber.github.io/MyPDF/':'https://mypdf-zdf.pages.dev/';
const env = {...process.env, BASE_URL:base, SITE_URL:home, ALLOW_INDEXING:'false', SIMPLE_MODE:'true',
  VITE_BRAND_NAME:'MyPDF', VITE_USE_CDN:'false',
  VITE_WASM_GS_URL:home+'wasm/gs/', VITE_WASM_PYMUPDF_URL:home+'wasm/pymupdf/', VITE_WASM_CPDF_URL:home+'wasm/coherentpdf/',
  VITE_TESSERACT_WORKER_URL:home+'offline-resources/tesseract/worker.min.js',
  VITE_TESSERACT_CORE_URL:home+'offline-resources/tesseract/', VITE_TESSERACT_LANG_URL:home+'offline-resources/tesseract/',
  VITE_OCR_FONT_BASE_URL:home+'offline-resources/fonts/', NODE_OPTIONS:'--max-old-space-size=4096'};
function node(args) {
  const proc=spawnSync(process.execPath,args,{cwd:checkout,env,stdio:'inherit',windowsHide:true});
  if(proc.status!==0)throw Error('Build step failed: '+args[0]+' '+String(proc.error||proc.status));
}
node(['scripts/generate-static-tool-links.mjs']);
node(['node_modules/vite/bin/vite.js','build','--logLevel','error','--outDir',output]);
for(const name of ['wasm','offline-resources']) {
  const dest=path.join(output,name);
  await rm(dest,{recursive:true,force:true}); // Inside the fresh Vite output above.
  await cp(path.join(repo,name),dest,{recursive:true,filter:p=>!p.endsWith('.tgz')});
}
async function omitMaps(folder){
 for(const entry of await readdir(folder,{withFileTypes:true})){
   const file=path.join(folder,entry.name);
   if(entry.isDirectory())await omitMaps(file);else if(entry.name.endsWith('.map'))await rm(file);
 }
}
await omitMaps(output);
node([fileURLToPath(new URL('finalize-host.mjs',import.meta.url)),host,output]);
node([fileURLToPath(new URL('localize-editor.mjs',import.meta.url)),host,output]);
console.log('Ready:',home,output);
