import type { FrameUtility } from './elBrowserFrameUtil.js' // Adjust import path as needed

export class LinkHandler {
  private frameUtility: FrameUtility
  isListening: boolean = false

  constructor(frameUtility: FrameUtility<any>) {
    this.frameUtility = frameUtility
  }

  private isExternalLink(href: string): boolean {
    try {
      const currentOrigin = window.location.origin
      const linkOrigin = new URL(href, currentOrigin).origin
      return linkOrigin !== currentOrigin
    }
    catch (e) {
      this.frameUtility.log.error('Invalid URL in link', { href, error: e })
      return false
    }
  }

  private handleLinkClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest('a')
    if (!link)
      return

    const href = link.getAttribute('href')
    if (!href)
      return

    const isExternal = this.isExternalLink(href)
    const isSpecialClick = event.ctrlKey || event.metaKey || event.button === 1

    if (isExternal || isSpecialClick) {
      event.preventDefault()

      if (isExternal)
        window.open(href, '_blank')

      else if (isSpecialClick)
        window.open(href, '_self')

      this.frameUtility.log.info('Link click modified', { href, isExternal, isSpecialClick })
    }
    else {
      this.frameUtility.log.info('Normal link click', { href })
    }
  }

  public setup(): void {
    document.addEventListener('click', this.handleLinkClick)
    document.addEventListener('auxclick', this.handleLinkClick)
  }

  public cleanup(): void {
    document.removeEventListener('click', this.handleLinkClick)
    document.removeEventListener('auxclick', this.handleLinkClick)
  }
}
