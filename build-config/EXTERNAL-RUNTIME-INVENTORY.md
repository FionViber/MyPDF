# Runtime endpoint inventory

The two production builds set the engine, OCR worker, OCR language and font bases to the same host. The following URLs remain in upstream source as optional fallback or product metadata.

- `https://cdn.jsdelivr.net/...` is the upstream fallback for PDFium, EmbedPDF fonts, Tesseract and WASM packages when a same-origin override is missing.
- `https://rawcdn.githack.com/googlefonts/noto-fonts/...` is an upstream font fallback in the font mapping module. The published bundle contains the 27 selected Noto fonts used by the configured local mapping.
- `https://bentopdf-cors-proxy.bentopdf.workers.dev` is used only by workflows that fetch certificate chains for digital signatures. It is not required for ordinary local PDF editing, merging or conversion.
- RFC 3161 timestamp authorities such as `timestamp.apple.com`, `timestamp.digicert.com`, `timestamp.entrust.net` and `timestamp.sectigo.com` are used only when a user signs a PDF and requests a trusted timestamp.
- External GitHub, Discord, social-media and upstream documentation URLs are attribution or navigation links.
- The browser bundle contains the upstream `pdfobject` and CropperJS documentation URLs. They are not required for the local static resources.

The published build does not use an application backend. Ordinary PDF operations, OCR resources, WASM engines, fonts and the model data are served by the same GitHub Pages or Cloudflare Pages origin.
