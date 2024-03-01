import { objectId, safeUrl } from '@factor/api/utils/utils'
import { getCookie, setCookieWithDomain } from '@factor/api/utils/cookie'
import { getCanonicalUrl } from '@factor/api/utils-analytics/tracking'
import pkg from './package.json'
import type { KaptionEventBrowser, TrackingContext } from './types'

export const ANON_ID_KEY = 'KAnonId'
const FIRST_SESSION_KEY = 'KFirstSession'

export function getAnonymousId(): {
  anonymousId: string
  isNew: boolean
} {
  const savedCookie = getCookie(ANON_ID_KEY)

  const savedLocal
    = typeof localStorage === 'undefined'
      ? undefined
      : localStorage.getItem(ANON_ID_KEY)

  const anonymousId = savedCookie || savedLocal || objectId()

  setCookieWithDomain(ANON_ID_KEY, anonymousId, { expires: 365 })

  let isNew = false
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ANON_ID_KEY, anonymousId)

    if (!savedLocal)
      sessionStorage.setItem(FIRST_SESSION_KEY, 'yes')

    if (sessionStorage.getItem(FIRST_SESSION_KEY))
      isNew = true
  }

  return { anonymousId, isNew }
}

export function baseBrowserEvent(args: {
  library: string
  projectId: string
}): KaptionEventBrowser {
  const { library = 'client', projectId } = args

  let browserContext: Partial<TrackingContext> = {}

  // in browser, get context information
  // in node this information must be provided directly
  if (typeof window !== 'undefined') {
    // don't track referrer if its from the same host
    const ref = document.referrer ? safeUrl(document.referrer) : undefined
    const referrer = ref?.host === location.host ? undefined : document.referrer

    browserContext = {
      screen: { width: window.innerWidth, height: window.innerHeight },
      locale: navigator.language.toLowerCase(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      page: {
        title: document.title.slice(0, 500) || undefined,
        referrer,
        url: getCanonicalUrl(),
      },
      userAgent: navigator.userAgent,
      isFake: window.kaptionIsFake || false,
    }
  }

  const { anonymousId } = getAnonymousId()

  const config: KaptionEventBrowser = {
    anonymousId,
    projectId,
    context: {
      ...browserContext,
      library: {
        name: library,
        version: pkg.version ?? 'unknown',
      },
    },
  }

  return config
}

export function isReturningSession(): boolean {
  const { isNew } = getAnonymousId()
  return !isNew
}
