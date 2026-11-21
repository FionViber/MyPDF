import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
const root = 'C:/Users/Zack/.codex/workspaces/asq-20261121/pdf/MyPDF'
const source = 'C:/Users/Zack/.codex/workspaces/asq-20261121/pdf/offline-resources'
const target = path.join(root, 'offline-resources')
await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true, filter: file => !file.endsWith('sync-targets.mjs') })
const tess = path.join(target, 'tesseract')
for (const name of await readdir(tess)) if (name.startsWith('lang-') && name.endsWith('.traineddata.gz')) await (await import('node:fs/promises')).rename(path.join(tess, name), path.join(tess, name.slice(5)))
for (const name of await readdir(tess)) if (name.endsWith('.traineddata')) await rm(path.join(tess, name), { force: true })
const manifestPath = path.join(target, 'manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const list of [manifest.assets, manifest.inventory]) for (const item of list || []) item.path = item.path.replace('/lang-', '/')
await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
console.log(JSON.stringify({ target, models: (await readdir(tess)).filter(name => name.endsWith('.traineddata.gz')).length }))
