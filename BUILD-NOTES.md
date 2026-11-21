# MyPDF build notes

This deployment is built from the official BentoPDF repository at the pinned source revision recorded in `BentoPDF-source.zip.part1` and `BentoPDF-source.zip.part2`.

The static build uses `BASE_URL=/MyPDF/` for GitHub Pages and a root base for Cloudflare Pages. Ghostscript, PyMuPDF and CoherentPDF resources are copied from the prepared open-source deployment bundle into `wasm/`. The deployment also contains the local license files for those components.

Cloudflare Pages has a 25 MiB per-file limit. The two LibreOffice compressed files are split into 20 MiB chunks and reconstructed by `large-assets-sw.js`. The original filenames remain the request URLs used by the application.

OCR worker, OCR core and OCR language data remain configurable runtime resources because the upstream release does not ship a complete language pack in the static application bundle. The WASM settings page shows the active paths and can be pointed at a same-origin mirror.
