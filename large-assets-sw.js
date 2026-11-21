const LARGE = {"/libreoffice-wasm/soffice.wasm.gz":["/libreoffice-wasm/soffice.wasm.gz.part000","/libreoffice-wasm/soffice.wasm.gz.part001","/libreoffice-wasm/soffice.wasm.gz.part002"],"/libreoffice-wasm/soffice.data.gz":["/libreoffice-wasm/soffice.data.gz.part000","/libreoffice-wasm/soffice.data.gz.part001"]};
self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => {
  const parts = LARGE[new URL(event.request.url).pathname];
  if (!parts) return;
  event.respondWith((async () => {
    const chunks = await Promise.all(parts.map(part => fetch(new URL(part, self.location.origin))));
    if (chunks.some(response => !response.ok)) throw new Error("A large asset chunk could not be loaded");
    const bytes = await Promise.all(chunks.map(response => response.arrayBuffer()));
    return new Response(new Blob(bytes), { headers: { "Content-Type": "application/octet-stream", "Content-Encoding": "gzip", "Cache-Control": "public, max-age=31536000, immutable" } });
  })());
});
