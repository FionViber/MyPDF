# MyPDF

A browser-based PDF toolkit built from BentoPDF 2.8.12. Choose a tool, open a local file and download the result.

[GitHub Pages](https://fionviber.github.io/MyPDF/) · [Cloudflare Pages](https://mypdf-zdf.pages.dev/)

The public application serves its PDF engines, Office converter, OCR worker and language data, fallback fonts and editor resources from its own origin. These assets download when required. A trusted timestamp or a deliberately configured remote provider may require a network service.

## Language

The multilingual edition follows your browser on the first visit. The menu beside MyPDF offers 24 languages, including Simplified Chinese and Traditional Chinese. Choose a language to remember it on this browser, or choose **Follow browser** to return to automatic selection. Switching languages opens the same tool in the selected language. Choose your language before adding documents.

## Source and licences

The upstream source is provided by the two BentoPDF-source.zip parts. The source patch, platform-specific build steps and release finalisers are in [build-config](build-config/BUILD-REPRODUCTION.md). This distribution is licensed under AGPL-3.0. Third-party engine and font licences are included with their respective assets.

[Upstream project](https://github.com/alam00000/bentopdf) · [AGPL licence](BENTOPDF-LICENSE)
