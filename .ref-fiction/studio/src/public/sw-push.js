// sw.js - Service Worker File

globalThis.addEventListener('push', (event) => {
  if (event.data) {
    const payload = event.data.json()
    const options = {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: { url: payload.url },
    }

    console.warn('received push', payload)

    const runNotify = async () => {
      await globalThis.registration.showNotification(payload.title, options)
      console.warn('notify', globalThis.registration, payload.title, options)
    }

    event.waitUntil(runNotify())
  }
})

globalThis.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const handleClick = async () => {
    await clients.openWindow(event.notification.data.url)
  }
  event.waitUntil(handleClick())
})
