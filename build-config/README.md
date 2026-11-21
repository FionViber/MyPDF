# Rebuilding MyPDF

The matching upstream source is split into `BentoPDF-source.zip.part1` and `BentoPDF-source.zip.part2`. Join the two parts in order, then extract the archive.

Copy `pnpm-workspace.yaml` into the source root and run `pnpm install --offline` after the package cache or network dependencies are available. Run `pnpm exec node scripts/generate-static-tool-links.mjs` before `vite build` because the full release script expects blog frontmatter from a separate release workflow.

Copy the prepared `wasm/` and `offline-resources/` trees from this repository's static root into the source `public/` directory. Use the host-specific environment example before `vite build`. Keep LibreOffice assets split below the Cloudflare Pages 25 MiB limit and use `large-assets-sw.js` to reassemble them at runtime.
