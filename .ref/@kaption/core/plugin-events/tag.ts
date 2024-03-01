import { groupBy } from '@factor/api/utils'
import { wildcardToRegExp } from '@factor/api'
import type {
  IdentifyTraitsUser,
  KaptionEventUserDefined,
  TrackingProperties,
} from '@kaption/client'
import { ClientTag, KaptionPageStats } from '../tag-utils'
import type { TagEntryPoint, TagSettings } from '../plugin-tag/types'
import type { CustomTrackEvent, TriggerType } from './types'
import { passesTargetingRules } from './utils/tagRules'

type EventTagSettings = {
  projectEvents?: CustomTrackEvent[]
} & TagSettings

export class EventTag extends ClientTag<EventTagSettings> {
  pageLoad: 'soft' | 'hard' = 'hard'
  trackedEvents: CustomTrackEvent[] = []
  eventCheckIntervalMs = 3000
  kaptionPageStats = new KaptionPageStats({ key: 'events' })
  trackedEventsKey = 'KTrackedEvents'
  projectEvents = this.settings.projectEvents ?? []
  constructor(settings: EventTagSettings) {
    super({ gen: 'user', ...settings })
  }

  getCustomEvents(): CustomTrackEvent[] {
    return this.projectEvents.filter(_ => _ && _.event) as CustomTrackEvent[]
  }

  async init(): Promise<void> {
    this.kaptionPageStats.start()

    const customEvents = this.getCustomEvents()

    const _promises = customEvents.map(async (ev) => {
      if (ev.rules) {
        const passed = await passesTargetingRules(ev.rules)

        return passed ? ev : undefined
      }
      else { return ev }
    })
    const result = await Promise.all(_promises)
    const eligibleEvents = result.filter(Boolean)

    const groupedEvents = groupBy<Record<TriggerType, CustomTrackEvent[]>>(
      eligibleEvents,
      'eventTrigger',
    )

    this.log.info('initialize events tag', {
      data: { groupedEvents, settings: this.settings },
    })

    setInterval(() => {
      const trackEvents: KaptionEventUserDefined[] = []
      if (groupedEvents.url) {
        trackEvents.push(
          ...this.handleUrlEvents({
            customEvents: groupedEvents.url,
            location: window.location,
          }),
        )
      }
      if (groupedEvents.element) {
        trackEvents.push(
          ...this.handleElementEvents({
            dom: document,
            customEvents: groupedEvents.element,
          }),
        )
      }

      // async on event
      if (groupedEvents.click)
        this.handleClickEvents(groupedEvents.click)

      if (groupedEvents.metric)
        trackEvents.push(...this.handleMetricEvents(groupedEvents.metric))

      // look for custom HTML attr [kaption-track]
      trackEvents.push(...this.handleCustomElementEvents({ dom: document }))

      trackEvents.forEach(e => this.track(e))
    }, this.eventCheckIntervalMs)
  }

  getEventsTracked(): Record<string, KaptionEventUserDefined> {
    if (typeof sessionStorage === 'undefined')
      return {}

    const local = sessionStorage.getItem(this.trackedEventsKey)

    return local
      ? (JSON.parse(local) as Record<string, KaptionEventUserDefined>)
      : {}
  }

  storeEventTracked(userEvent: KaptionEventUserDefined): void {
    if (typeof sessionStorage === 'undefined')
      return

    const trackedObject = this.getEventsTracked()
    trackedObject[userEvent.event] = userEvent

    sessionStorage.setItem(this.trackedEventsKey, JSON.stringify(trackedObject))
  }

  alreadyTrackedEvent(userEvent: KaptionEventUserDefined): boolean {
    const trackedObject = this.getEventsTracked()

    return !!trackedObject[userEvent.event]
  }

  getKaptionEvent(customEvent: CustomTrackEvent): KaptionEventUserDefined {
    const {
      event,
      value,
      weight,
      selector,
      category,
      label,
      action,
      eventTrigger,
      conversion,
    } = customEvent

    const properties: Partial<TrackingProperties> = {
      category,
      action: action || eventTrigger,
      label,
      selector,
      value,
      weight,
      conversion,
    }
    Object.keys(properties).forEach((key) => {
      if (properties[key] === undefined)
        delete properties[key]
    })

    return { event, properties }
  }

  track(userEvent: KaptionEventUserDefined): void {
    if (this.alreadyTrackedEvent(userEvent))
      return

    this.client.capture(userEvent).catch(console.error)

    this.storeEventTracked(userEvent)
  }

  urlSearchMatch(location: Location | URL, search: string): boolean {
    const locationParams = new URLSearchParams(location.search)
    const matchParams = new URLSearchParams(search)
    let matched = true
    matchParams.forEach((v, key) => {
      if (locationParams.get(key) !== v)
        matched = false
    })

    return matched
  }

  handleUrlEvents(args: {
    location: Location | URL
    customEvents: CustomTrackEvent[]
  }): KaptionEventUserDefined[] {
    const { location, customEvents } = args
    const trackEvents: KaptionEventUserDefined[] = []
    customEvents.forEach((e) => {
      if (!e.pathMatch)
        return

      const paths = e.pathMatch.split(',').map(p => p.trim())

      const locationParams = new URLSearchParams(location.search)

      // If the url has a value parameter
      const urlValue = +(locationParams.get('value') || '')

      const value = !Number.isNaN(urlValue) && urlValue ? urlValue : undefined

      if (value)
        e.value = value

      paths.forEach((p) => {
        let pathnameToMatch = p
        if (p.includes('http')) {
          try {
            const url = new URL(p)
            if (url.origin !== location.origin)
              return

            pathnameToMatch = url.pathname
          }
          catch {
            return
          }
        }
        const lp = location.pathname

        // if homepage then keep slash, otherwise remove trailing slashes
        const matchPath
          = pathnameToMatch === '/' ? '/' : p.trim().replace(/\/$/, '')
        const current = lp === '/' ? '/' : lp.replace(/\/$/, '')

        const queryOnly = !!matchPath.startsWith('?')
        const triggerPath = new URL(matchPath, location.href)

        // If search query only, then match params or fail
        if (queryOnly) {
          if (this.urlSearchMatch(location, triggerPath.search))
            trackEvents.push(this.getKaptionEvent(e))
        }
        else if (wildcardToRegExp(triggerPath.pathname).test(current)) {
          if (
            triggerPath.search
            && this.urlSearchMatch(location, triggerPath.search)
          )
            trackEvents.push(this.getKaptionEvent(e))
          else
            trackEvents.push(this.getKaptionEvent(e))
        }
      })
    })

    return trackEvents
  }

  handleElementEvents(args: {
    dom: Document
    customEvents: CustomTrackEvent[]
  }): KaptionEventUserDefined[] {
    const { dom, customEvents } = args
    const trackEvents: KaptionEventUserDefined[] = []
    customEvents.forEach((e) => {
      if (!e.selector)
        return

      const el = dom.querySelector(e.selector)

      if (el && !el.getAttribute('kaption-done')) {
        el.setAttribute('kaption-done', '1')
        trackEvents.push(this.getKaptionEvent(e))
      }
    })

    return trackEvents
  }

  handleCustomElementEvents(args: {
    dom: Document
  }): KaptionEventUserDefined[] {
    const { dom } = args

    const trackEls = dom.querySelectorAll('[kaption-track]')
    const trackEvents: KaptionEventUserDefined[] = []
    trackEls.forEach((el) => {
      const event = el.getAttribute('kaption-track')
      if (!event || el.getAttribute('kaption-done'))
        return

      el.setAttribute('kaption-done', '1')
      const properties = JSON.parse(
        el.getAttribute('kaption-properties') || '{}',
      ) as TrackingProperties
      const traits = JSON.parse(
        el.getAttribute('kaption-traits') || '{}',
      ) as IdentifyTraitsUser
      const userId = el.getAttribute('kaption-user-id') ?? undefined
      trackEvents.push({ event, userId, traits, properties })
    })

    return trackEvents
  }

  handleClickEvents(customEvents: CustomTrackEvent[]): void {
    customEvents.forEach((customEvent) => {
      if (!customEvent.selector)
        return

      const els = document.querySelectorAll(customEvent.selector)

      if (els && els.length > 0) {
        els.forEach((el) => {
          if (!el.getAttribute('kaption-done')) {
            el.setAttribute('kaption-done', '1')
            el.addEventListener(
              'click',
              () => {
                this.track(this.getKaptionEvent(customEvent))
              },
              { capture: true, passive: true, once: true },
            )
          }
        })
      }
    })
  }

  handleMetricEvents(
    customEvents: CustomTrackEvent[],
  ): KaptionEventUserDefined[] {
    const trackEvents: KaptionEventUserDefined[] = []

    customEvents.forEach((e) => {
      if (!e.threshold || !e.metric)
        return

      let metricValue: number | undefined
      if (e.metric === 'engageDuration')
        metricValue = this.kaptionPageStats.map.duration.totalActiveDuration()
      else if (e.metric === 'totalClicks')
        metricValue = this.kaptionPageStats.map.clicks.compiledTotalClicks()

      if (metricValue && metricValue > e.threshold)
        trackEvents.push(this.getKaptionEvent(e))
    })

    return trackEvents
  }
}

export const setup: TagEntryPoint<EventTagSettings> = async (tagSettings) => {
  return new EventTag(tagSettings)
}
