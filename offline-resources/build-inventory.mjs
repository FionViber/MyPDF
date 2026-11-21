import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
const root = 'C:/Users/Zack/.codex/workspaces/asq-20261121/pdf/offline-resources'
async function walk(dir) { const result=[]; for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name); if(entry.isDirectory()) result.push(...await walk(file)); else result.push(file)} return result }
const files=[]
for(const file of await walk(root)){if(file.endsWith('build-inventory.mjs')||file.endsWith('inventory.json'))continue;const bytes=await readFile(file);files.push({path:path.relative(root,file).replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')})}
const manifest=JSON.parse(await readFile(root+'/manifest.json','utf8'));manifest.inventory=files;manifest.totalBytes=files.reduce((sum,file)=>sum+file.bytes,0);manifest.maxFileBytes=Math.max(...files.map(file=>file.bytes));await writeFile(root+'/manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify({files:files.length,totalBytes:manifest.totalBytes,maxFileBytes:manifest.maxFileBytes,unavailable:manifest.unavailable}))
