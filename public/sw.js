const CACHE = 'g-stock-shell-v4'
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    const previousCaches = (await caches.keys()).filter((name) => name !== CACHE)
    for (const previousName of previousCaches) {
      const previousCache = await caches.open(previousName)
      for (const request of await previousCache.keys()) {
        const path = new URL(request.url).pathname
        if (request.mode !== 'navigate' && path !== '/' && !path.startsWith('/assets/') && path !== '/manifest.webmanifest' && path !== '/gstock.svg') continue
        const response = await previousCache.match(request)
        if (response) await cache.put(request, response)
      }
    }
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
