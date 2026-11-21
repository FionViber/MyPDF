# Building MyPDF

MyPDF uses BentoPDF 2.8.12 at revision `f1d685bcf607c904f0c6fb385e8048974a2bc8b0`. The same sources produce both static editions. GitHub serves the site under `/MyPDF/` and Cloudflare serves it at the domain root.

## GitHub Actions

Open **Actions**, select **Publish MyPDF languages** and run it on `main`. The `github` edition publishes to GitHub Pages. The `cloudflare` edition produces a `mypdf-cloudflare` artifact for the existing Cloudflare Pages project. Only the publication step requires hosting credentials. [Release workflow](../.github/workflows/publish-mypdf.yml)

## Building from source

1. Check out the pinned upstream revision, or join the two source archive parts in order and extract the ZIP. Use Node 24.
2. Apply `build-config/source-modifications.patch` in the upstream tree. Copy the source overlays from this directory into the upstream paths listed in **Restore pinned BentoPDF source** in the release workflow. This step installs the language resolver, native picker, localized static-page generator and merge input handler.
3. Run `npm ci` in the upstream checkout.
4. From the MyPDF repository, run `node build-config/complete-build.mjs /path/to/upstream github /path/to/empty/output`. Use `cloudflare` and a separate empty output directory for the other edition.
5. Serve the entire output at the corresponding base path, including its dotfiles and Cloudflare headers. Check English and both Chinese merge pages and open the language menu on a nested tool page.

The build copies the hosted engines, licensed fonts and editor resources from this repository. It splits the LibreOffice engine into 20 MiB segments. Asset provenance is listed in `editor-resources/provenance.json` and `offline-resources/manifest.json`. Engine and font notices accompany their respective assets.
