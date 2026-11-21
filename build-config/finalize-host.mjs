import assert from 'node:assert/strict';
import { readFile, writeFile, copyFile, readdir, stat, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const [host, output] = process.argv.slice(2);
assert(['github','cloudflare'].includes(host) && output, 'Usage: node finalize-host.mjs github|cloudflare <built-directory>');
const root = resolve(output);
const home = host === 'github' ? 'https://fionviber.github.io/MyPDF/' : 'https://mypdf-zdf.pages.dev/';
const base = new URL(home).pathname;
const read = file => readFile(file, 'utf8');
await copyFile(new URL('isolation-ready.js', import.meta.url), join(root,'isolation-ready.js'));
if(host === 'cloudflare') await copyFile(new URL('cloudflare-headers.txt',import.meta.url),join(root,'_headers'));
await writeFile(join(root,'.nojekyll'),'');
for(const [archive,count] of [['soffice.wasm.gz',3],['soffice.data.gz',2]]){
  const file = join(root,'libreoffice-wasm',archive);
  let bytes;
  try { bytes=await readFile(file); } catch (e) { if(e.code!=='ENOENT') throw e; }
  const size=20*1024*1024;
  if(bytes) assert.equal(Math.ceil(bytes.length/size),count,'Upstream files have changed; update the source loader and re-test.');
  for(let index=0;index<count;index++){
    const part=file+'.part'+String(index).padStart(3,'0');
    if(bytes) await writeFile(part,bytes.subarray(index*size,(index+1)*size));
    const existing=await stat(part);assert(existing.size>0 && existing.size<=size);
  }
  if(bytes) await unlink(file);
}
const officePages=/^(word|excel|powerpoint|odt|odg|ods|odp|doc|pages|rtf|pub|vsd|wpd|wps)-to-pdf\.html$/;
const sourceLinks='<p class="text-center text-sm my-4"><a href="https://github.com/FionViber/MyPDF">MyPDF source code</a> · <a href="https://github.com/alam00000/bentopdf">BentoPDF</a> · AGPL-3.0</p>';
async function walk(directory){
  for(const file of await readdir(directory,{withFileTypes:true})){
    if(file.name.startsWith('.') || ['node_modules','build-config','wasm','offline-resources','pdfjs-viewer','pdfjs-annotation-viewer'].includes(file.name))continue;
    const full=join(directory,file.name);
    if(file.isDirectory()){await walk(full);continue;}
    if(file.name.endsWith('.html')){
      const original=await read(full); let html=original.replaceAll('<span id="app-version">Unknown</span>','<span id="app-version">2.8.12</span>');
      if(file.name==='index.html' && html.includes('simpleMode.title')){
        html=html.replaceAll('<title>PDF Tools</title>','<title>MyPDF</title>').replaceAll('content="PDF Tools"','content="MyPDF"').replace(/(<span data-i18n="simpleMode.title">)[^<]*(<\/span>)/,'$1MyPDF$2');
        if(!html.includes('https://github.com/FionViber/MyPDF'))html=html.replace('</body>',sourceLinks+'\n</body>');
      }
      if(officePages.test(file.name) && !html.includes('isolation-ready.js')) html=html.replace('<head>', '<head><script src="'+base+'isolation-ready.js"></script>');
      if(html!==original)await writeFile(full,html);
    }else if(full.includes('locales')&&file.name.endsWith('.json')){
      const messages=JSON.parse(await read(full));
      if(messages.simpleMode && messages.simpleMode.title!=='MyPDF'){messages.simpleMode.title='MyPDF';await writeFile(full,JSON.stringify(messages));}
    }
  }
}
await walk(root);
console.log(host,home,'finalized');
