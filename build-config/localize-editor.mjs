import { cp, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const [platform,out] = process.argv.slice(2);
if (!["github","cloudflare"].includes(platform) || !out) throw Error("Expected a platform and built output path.");
const origin = platform==="github" ? "https://fionviber.github.io/MyPDF/" : "https://mypdf-zdf.pages.dev/";
const editor = origin+"editor-resources/";
const source = fileURLToPath(new URL("../editor-resources/",import.meta.url));
const target = path.resolve(out,"editor-resources");
if(path.resolve(source)!==target) await cp(source,target,{recursive:true});
for(const entry of await readdir(path.join(out,"assets"))){
  if(!entry.endsWith(".js")) continue;
  const file = path.join(out,"assets",entry);
  const original = await readFile(file,"utf8");
  let js = original
    .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/@embedpdf\/fonts-([a-z]+)@(?:\\?\$\{version\}|[0-9.]+)\/fonts/g,(_,family)=>editor+"fonts-"+family)
    .replaceAll("https://cdn.jsdelivr.net/npm/@embedpdf/pdfium@2.9.1/dist/pdfium.wasm",editor+"pdfium/pdfium.wasm")
    .replaceAll("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap",editor+"open-sans/font.css")
    .replaceAll("https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js",editor+"pdfobject/pdfobject.min.js")
    .replace(/https:\/\/rawcdn\.githack\.com\/googlefonts\/[^\s"'\x60]+\/([A-Za-z0-9_-]+\.(?:ttf|otf))/g,(_,name)=>origin+"offline-resources/fonts/"+name);
  if(entry.startsWith("edit-pdf-")){
    js=js.replaceAll("https://cdn.jsdelivr.net/npm/@embedpdf",editor.slice(0,-1))
      .replace(/(fonts-[a-z]+)@1\.0\.0\/fonts\//g,"$1/");
  }
  if(js!==original)await writeFile(file,js);
}
