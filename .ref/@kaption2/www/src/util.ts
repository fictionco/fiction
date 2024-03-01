import {
  getLocal,
  onBrowserEvent,
  setLocal,
  storeItem,
  stored,
  vue,
} from '@factor/api'

export function getDashboardUrl(path = '/'): string {
  return `https://app.kaption.co${path}`
}

export function setPageMode(mode: 'dark' | 'darkHeader' | ''): void {
  storeItem('pageMode', mode)
}

export const darkMode = vue.computed((): boolean => {
  const mode = stored('pageMode')
  return mode === 'dark' || mode === 'darkHeader'
})

const INTERACTION_KEY = 'trackInteractions'

function getLocalEngage(): Record<string, number> {
  return getLocal<Record<string, number>>({ key: INTERACTION_KEY }) ?? {}
}
function setEngage(engage: string): void {
  const value = getLocalEngage()

  value[engage] = (value[engage] ?? 0) + 1
  storeItem(INTERACTION_KEY, value)
  setLocal({ persist: 'session', key: INTERACTION_KEY, value })
}

export function trackInteractions(): (() => void) {
  storeItem(INTERACTION_KEY, getLocalEngage())

  const clearWatchers = [
    onBrowserEvent('load', () => setEngage('load')),
    onBrowserEvent('mousemove', () => setEngage('mousemove')),
    onBrowserEvent('mousedown', () => setEngage('mousedown')),
    onBrowserEvent('touchstart', () => setEngage('touchstart')),
    onBrowserEvent('click', () => setEngage('click')),
    onBrowserEvent('keypress', () => setEngage('keypress')),
    onBrowserEvent('scroll', () => setEngage('scroll')),
  ]

  return (): void => {
    clearWatchers.forEach(clearWatcher => clearWatcher())
  }
}

export const activeInteractions = vue.computed(() => {
  return stored(INTERACTION_KEY)
})
