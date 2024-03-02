import { getFavicon, toSlug } from '@factor/api'
import type { AggregationRow } from '../types'

interface IconDictionaryItem {
  domain?: string
  icon?: string
  matches: string[]
  checkString?: boolean
}

const iconDomains: IconDictionaryItem[] = [
  {
    domain: 'https://www.google.com',
    matches: [
      'chrome',
      'chromium-os',
      'gsa',
      'chrome-webview',
      'chrome-headless',
    ],
  },
  {
    domain: 'https://www.apple.com',
    matches: ['safari', 'ios', 'mobile-safari', 'mac-os'],
  },
  {
    domain: 'https://www.android.com',
    matches: ['android', 'android-browser'],
  },
  { domain: 'https://www.amazon.com', matches: ['silk'] },
  { domain: 'https://www.ucweb.com', matches: ['ucbrowser'] },
  { domain: 'https://www.yandex.com', matches: ['yandex'] },
  { domain: 'https://www.firefox.com', matches: ['firefox'] },
  { domain: 'https://www.mozilla.org', matches: ['mozilla'] },
  { domain: 'https://www.microsoft.com', matches: ['windows'] },
  { domain: 'https://microsoftedgewelcome.microsoft.com', matches: ['edge'] },
  { domain: 'https://www.opera.com', matches: ['opera', 'opera-touch'] },
  { domain: 'https://www.webkit.org', matches: ['webkit'] },
  { domain: 'https://www.linux.org', matches: ['linux'] },
  { domain: 'https://www.samsung.com', matches: ['samsung-browser'] },
  { domain: 'https://ubuntu.com', matches: ['ubuntu'] },
  { domain: 'https://getfedora.org', matches: ['fedora'] },
  { domain: 'https://www.debian.org', matches: ['debian'] },
  { domain: 'https://www.facebook.com', matches: ['facebook'] },
  { domain: 'https://whale.naver.com', matches: ['whale'] },
  { domain: 'https://www.yahoo.com', matches: ['yahoo'], checkString: true },
  { domain: 'https://about.instagram.com', matches: ['instagram'] },
  { domain: 'https://linuxmint.com/', matches: ['mint'] },
  { domain: 'https://www.tizen.org/', matches: ['tizen'] },
  { domain: 'https://www.playstation.com/', matches: ['playstation'] },
  { domain: 'https://en.miui.com', matches: ['miui-browser'] },
  {
    domain: 'https://ontraport.com',
    matches: ['ontraport'],
    checkString: true,
  },
  { domain: 'https://www.suse.com', matches: ['suse'] },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>`,
    matches: ['desktop'],
  },
  {
    icon: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.55 14.7H11.7308C11.71 15.2572 11.3171 15.6 10.81 15.6H9.1C8.57434 15.6 8.17131 15.1087 8.17834 14.7H1.45C1.2025 14.7 1 14.9025 1 15.15V15.6C1 16.59 1.81 17.4 2.8 17.4H17.2C18.19 17.4 19 16.59 19 15.6V15.15C19 14.9025 18.7975 14.7 18.55 14.7ZM17.2 4.35C17.2 3.6075 16.5925 3 15.85 3H4.15C3.4075 3 2.8 3.6075 2.8 4.35V13.8H17.2V4.35ZM15.4 12H4.6V4.8H15.4V12Z" fill="currentColor"/>
    </svg>`,
    matches: ['laptop'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>`,
    matches: ['mobile'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>`,
    matches: ['tablet'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>`,
    matches: ['topBrowsers'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
  </svg>`,
    matches: ['topOperatingSystems'],
  },

  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>`,
    matches: ['topPages'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>`,
    matches: ['topEventLabel'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>`,
    matches: ['topEventCategory'],
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>`,
    matches: ['topEventAction'],
  },
]

export function getDataIcon(args: {
  dictionaryMatch?: string
  widgetKey?: string
  item?: AggregationRow
}): string | undefined {
  const { dictionaryMatch, widgetKey, item } = args

  let match: IconDictionaryItem | undefined
  if (dictionaryMatch) {
    const lowerName = toSlug(dictionaryMatch)
    match = iconDomains.find(d => d.matches.includes(lowerName))

    if (!match) {
      const checkStrings = iconDomains.filter(_ => _.checkString)

      match = checkStrings.find((d) => {
        return d.matches.some(matcher => lowerName.includes(matcher))
      })
    }
  }

  if (!match && widgetKey)
    match = iconDomains.find(d => d.matches.includes(widgetKey))

  const { domain, icon } = match || {}

  if (domain) {
    return getFavicon(domain)
  }
  else if (icon) {
    return icon
  }
  else if (item?.url) {
    return getFavicon(item?.url)
  }
  else {
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
  </svg>`
  }
}
