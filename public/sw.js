const CACHE = 'g-stock-shell-v3'
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    const response = await fetch('/')
    if (!response.ok) throw new Error('Unable to precache the application shell.')
    await cache.put('/', response.clone())
    const html = await response.text()
    const assets = [...html.matchAll(/(?:src|href)="([^"]+\/assets\/[^"]+)"/g)].map((match) => match[1])
    await cache.addAll(['/manifest.webmanifest', '/gstock.svg', ...assets])
  })())
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))))
  self.clients.claim()
})
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return
  if (new URL(event.request.url).pathname.startsWith('/api/')) return
  event.respondWith((async () => {
    const cache = await caches.open(CACHE)
    const cached = await cache.match(event.request)
    const isNavigation = event.request.mode === 'navigate'
    const isBuildAsset = new URL(event.request.url).pathname.startsWith('/assets/')
    if (isBuildAsset && cached) return cached

    const controller = new AbortController()
    const timeout = isNavigation ? setTimeout(() => controller.abort(), 2500) : undefined
    try {
      const response = await fetch(event.request, isNavigation ? { signal: controller.signal } : undefined)
      if (timeout) clearTimeout(timeout)
      if (response.ok) event.waitUntil(cache.put(event.request, response.clone()).catch(() => undefined))
      return response
    } catch {
      if (timeout) clearTimeout(timeout)
      return cached || (isNavigation ? await cache.match('/') : undefined) || Response.error()
    }
  })())
})
