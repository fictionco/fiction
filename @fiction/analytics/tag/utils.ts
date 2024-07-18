import { safeUrl } from '@fiction/core/utils/url'
import { getAnonymousId } from '@fiction/core/utils/anon'
import { getCanonicalUrl } from '../utils/tracking'
import type { TrackingContext, TrackingEventBrowser } from './types'

export function baseBrowserEvent(args: {
  library: string
  orgId: string
  siteId?: string
  version?: string
}): TrackingEventBrowser {
  const { library = 'client', orgId, version = 'unknown', siteId } = args

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
      isFake: window.fictionIsFake || false,
    }
  }

  const { anonymousId } = getAnonymousId()

  const config: TrackingEventBrowser = {
    anonymousId,
    orgId,
    siteId,
    context: {
      ...browserContext,
      library: { name: library, version },
    },
  }

  return config
}

export function isReturningSession(): boolean {
  const { isNew } = getAnonymousId()
  return !isNew
}
