# Runtime resources

MyPDF is a static build of BentoPDF 2.8.12. Each production edition uses its own origin. A first visit or first use of a tool transfers its files from that origin. Browser cache availability on later visits depends on what was loaded and retained.

| Feature | Default source | Online dependency |
| --- | --- | --- |
| PDF parsing, rendering and standard fonts | Bundled PDF.js, workers, CMaps, standard font and WASM assets | Same site |
| PDF editor | Local PDFium 2.9.1, original EmbedPDF CJK, Arabic, Hebrew and Latin font packages, Open Sans and PDFObject | Same site |
| Advanced PDF functions | Local Ghostscript, PyMuPDF/Pyodide and CoherentPDF | Same site |
| OCR | Tesseract worker and compatible core variants; 102 gzip language models including English, Chinese, Kurdish and Fraktur; 27 Noto fonts for the text layer | Same site; first use downloads selected resources |
| Office conversions | LibreOffice worker and two gzip files stored as five 20 MiB-or-smaller pieces | Same site; requires cross-origin isolation for threaded WASM |
| Signed document timestamps | Upstream RFC 3161 client sends a timestamp query containing the digest to the selected trusted time authority | External, only when requesting a trusted timestamp |
| Certificate requests / timestamp relay | Optional CORS proxy setting in the upstream signing module | Not provisioned or billed by this deployment |
| Custom WASM provider selected in Settings | User-supplied provider URL | External if the user chooses another host |
| Links from documents, source, licences and external documentation | The chosen link destination | Navigation, not an engine download |

The upstream TSA presets are DigiCert (timestamp.digicert.com), Sectigo (timestamp.sectigo.com), SSL.com (ts.ssl.com), FreeTSA (freetsa.org/tsr) and MeSign (tsa.mesign.com). Availability, CORS, HTTPS support and terms belong to each operator. Providing a trusted external time signature requires a reachable authority. No TSA, paid API or relay was subscribed to as part of this release.

Some libraries retain default CDN addresses in their source for custom builds. The deployment selects the local provider, worker, font and model URLs. The registry tarball links in the font provenance file identify build inputs, not a per-document download. No document is sent to a conversion server by the tested merge, OCR, compress or Office flows.
