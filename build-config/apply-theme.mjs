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
  const englishAndLocales = [''];
  for (const entry of await readdir(output, { withFileTypes: true })) {
    if (entry.isDirectory() && /^[a-z]{2}(?:-[A-Za-z]+)?$/.test(entry.name)) englishAndLocales.push(entry.name);
  }
  async function attach(file, html, tag) {
    const result = html.replace('</head>', tag + '</head>');
    if (result === html || result.replace(tag, '') !== html || html.includes('data-mypdf-theme')) {
      throw new Error('Unexpected document head in ' + file);
    }
    await writeFile(file, result);
  }
  let total = 0;
  for (const locale of englishAndLocales) {
    const folder = join(output, locale);
    const covered = new Set();
    for (const name of await readdir(folder)) {
      if (!name.endsWith('.html')) continue;
      const file = join(folder, name);
      const html = await readFile(file, 'utf8');
      if (!shared.test(html)) continue;
      await attach(file, html, link);
      covered.add(name);
    }
    if (!covered.has('index.html') || !covered.has('merge-pdf.html')) throw new Error('Incomplete theme coverage in ' + folder);
    total += covered.size;
  }
  for (const nested of ['pdfjs-viewer/form-viewer.html', 'pdfjs-annotation-viewer/web/viewer.html']) {
    const file = join(output, nested);
    await attach(file, await readFile(file, 'utf8'), link.replace('data-mypdf-theme>', 'data-mypdf-theme data-mypdf-viewer>'));
  }
  console.log('Theme linked in', total, 'application pages across', englishAndLocales.length, 'editions:', asset);
}
