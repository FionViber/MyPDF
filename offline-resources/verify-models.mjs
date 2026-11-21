import { readdir, readFile } from 'node:fs/promises'
import { gunzip } from 'node:zlib'
import { promisify } from 'node:util'
const unzip = promisify(gunzip)
const dir = 'C:/Users/Zack/.codex/workspaces/asq-20261121/pdf/offline-resources/tesseract'
const files = (await readdir(dir)).filter(name => name.endsWith('.traineddata.gz'))
const small = []
for (const name of files) { const decoded = await unzip(await readFile(dir + '/' + name)); if (decoded.length < 1000) small.push({ name, bytes: decoded.length }) }
console.log(JSON.stringify({ files: files.length, decoded: 'all gzip models decompressed successfully', small }))
