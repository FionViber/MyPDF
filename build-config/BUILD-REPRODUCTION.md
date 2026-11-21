# Building MyPDF

The upstream revision is `f1d685bcf607c904f0c6fb385e8048974a2bc8b0` (BentoPDF v2.8.12). Check out that revision or concatenate the two source archive parts in numerical order and extract the resulting ZIP. Use a separate empty directory for each output platform.

1. Apply `git apply --binary /path/to/MyPDF/build-config/source-modifications.patch` in the upstream tree.
2. Install the pinned upstream JavaScript dependencies (Node 24 and the upstream npm lockfile, or the supplied pnpm lock/workspace configuration). Use the original Vite configuration.
3. From the published MyPDF repository, run `node build-config/complete-build.mjs /path/to/patched-upstream github /path/to/empty/github-output`. Repeat with `cloudflare` and a separate empty output directory.
4. Publish the GitHub output at the root of the MyPDF Pages repository and the Cloudflare output at the project root. Retain dotfiles such as .nojekyll and the Cloudflare _headers file.

The build script and finalisers copy the working runtime files from this repository, use host-specific absolute URLs, create 20 MiB Office engine segments and add the editor's licensed fonts. All production PDF.js, PDFium, Ghostscript, PyMuPDF, CoherentPDF, Tesseract, LibreOffice and font files are static. See editor-resources/provenance.json, offline-resources/manifest.json and the notices in the wasm and font directories. No account token is needed to build.
