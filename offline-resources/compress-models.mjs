import { readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { gzip } from 'node:zlib'
import { promisify } from 'node:util'
const zip = promisify(gzip)
const dir = 'C:/Users/Zack/.codex/workspaces/asq-20261121/pdf/offline-resources/tesseract'
for (const name of await readdir(dir)) {
  if (!/^lang-.*\.traineddata$/.test(name)) continue
  const bytes = await zip(await readFile(dir + '/' + name), { level: 9 })
  await writeFile(dir + '/' + name + '.gz', bytes)
  await unlink(dir + '/' + name)
}
