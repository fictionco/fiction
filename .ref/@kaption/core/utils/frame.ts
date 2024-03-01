export function sendNavigateMessage(el: HTMLElement, event: MouseEvent): void {
  const href = el.getAttribute('href')

  if (!href || href.includes('#'))
    return

  event.preventDefault()
  event.stopPropagation()

  if (!window.__px || !window.__or)
    throw new Error('px base urls not defined')

  const originalUrl = window.__or
  const proxyUrl = window.__px
  const url = href?.startsWith('/')
    ? `${originalUrl}${href}`
    : href.replace(proxyUrl, originalUrl)

  window.parent.postMessage(
    {
      from: 'kaption',
      messageType: 'navigate',
      data: url,
    },
    '*',
  )
}
