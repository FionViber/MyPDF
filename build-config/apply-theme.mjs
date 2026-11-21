import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Only application documents that already load the common BentoPDF sheet receive the skin.
export async function applyTheme(output, base) {
  const css = await readFile(new URL('./fionviber-theme.css', import.meta.url));
  const digest = createHash('sha256').update(css).digest('hex').slice(0, 12);
  const asset = 'fionviber-theme-' + digest + '.css';
  await writeFile(join(output, 'assets', asset), css);
  const link = '<link rel="stylesheet" media="screen" href="' + base + 'assets/' + asset + '" data-mypdf-theme>';
  const shared = /<link\b[^>]*\bhref=["'][^"']*assets\/style-[^"']+\.css["'][^>]*>/i;
  const viewers = new Set(['pdfjs-viewer/form-viewer.html', 'pdfjs-annotation-viewer/web/viewer.html']);
  const themed = new Set();
  async function visit(relative = '') {
    const folder = join(output, relative);
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const name = relative ? relative + '/' + entry.name : entry.name;
      if (entry.isDirectory()) {
        await visit(name);
        continue;
      }
      if (!entry.isFile() || !name.endsWith('.html')) continue;
      const file = join(output, name);
      const html = await readFile(file, 'utf8');
      if (!viewers.has(name) && !shared.test(html)) continue;
      const tag = viewers.has(name) ? link.replace('data-mypdf-theme>', 'data-mypdf-theme data-mypdf-viewer>') : link;
      const result = html.replace('</head>', tag + '</head>');
      if (result === html || result.replace(tag, '') !== html || html.includes('data-mypdf-theme')) {
        throw new Error('Unexpected document head in ' + name);
      }
      await writeFile(file, result);
      themed.add(name);
    }
  }
  await visit();
  const editions = [''];
  for (const entry of await readdir(output, { withFileTypes: true })) {
    if (entry.isDirectory() && /^[a-z]{2}(?:-[A-Za-z]+)?$/.test(entry.name)) editions.push(entry.name + '/');
  }
  for (const required of [...viewers, ...editions.flatMap(prefix => ['index.html','merge-pdf.html'].map(page => prefix + page))]) {
    if (!themed.has(required)) throw new Error('Missing theme in ' + required);
  }
  console.log('Theme linked in', themed.size, 'HTML documents across', editions.length, 'language editions:', asset);
}
