import {
  compiledActiveDuration,
  compiledTotalClicks,
  getCustomEvents,
  getLocal,
  groupBy,
  passesTargetingRules,
  setLocal,
  wildcardToRegExp,
} from '@kaption/browser-utils'
import { logger } from '@factor/api/logger'
import type { CustomTrackEvent, TriggerType } from '@kaption/types'
import { EventCategory } from '@kaption/types'

import { client } from '@kaption/client-tag/client'

function getEventsTracked(): Record<string, any> {
  const trackedObject = getLocal<Record<string, any>>({ key: 'daCustEv' }) || {}

  return trackedObject
}

function isAlreadyCounted(eventName: string): boolean {
  const trackedObject = getEventsTracked()

  return !!trackedObject[eventName]
}

function storeEventTracked(customEvent: CustomTrackEvent): void {
  const trackedObject = getEventsTracked()
  trackedObject[customEvent.eventName] = customEvent

  setLocal({
    key: 'daCustEv',
    value: trackedObject,
    scope: 'functional',
    type: 'persistent',
  })
}

function trackCustomEvent(customEvent: CustomTrackEvent): void {
  if (isAlreadyCounted(customEvent.eventName))
    return
  const {
    eventName,
    value,
    weight,
    points,
    selector,
    category,
    label,
    action,
    eventTrigger,
    eventType,
  } = customEvent

  // trackEvent({
  //   eventName,
  //   category: category || EventCategory.Custom,
  //   action: action || eventTrigger,
  //   label,
  //   selector,
  //   value,
  //   weight,
  //   points,
  //   eventType,
  // })

  client()
    .track(eventName, {
      category: category || EventCategory.Custom,
      action: action || eventTrigger,
      label,
      selector,
      value,
      weight,
      points,
      eventType,
    })
    .catch(error =>
      logger.log({
        level: 'error',
        description: `${eventName} track event`,
        data: error,
      }),
    )

  storeEventTracked(customEvent)
}
function handleMetricEvents(customEvents: CustomTrackEvent[]): void {
  customEvents.forEach((e) => {
    if (!e.threshold || !e.metric)
      return

    let metricValue: number | undefined
    if (e.metric === 'engageDuration')
      metricValue = compiledActiveDuration()
    else if (e.metric === 'totalClicks')
      metricValue = compiledTotalClicks()

    if (metricValue && metricValue > e.threshold)
      trackCustomEvent(e)
  })
}
/**
 * Looks for elements with a given selector and attaches a click listener
 * Verify we attach the listener one time, by using an attribute
 */
function handleClickEvents(customEvents: CustomTrackEvent[]): void {
  customEvents.forEach((customEvent) => {
    if (!customEvent.selector)
      return

    const els = document.querySelectorAll(customEvent.selector)

    if (els && els.length > 0) {
      els.forEach((el) => {
        if (!el.getAttribute('da-event')) {
          el.setAttribute('da-event', '1')
          el.addEventListener(
            'click',
            () => {
              trackCustomEvent(customEvent)
            },
            { capture: true, passive: true, once: true },
          )
        }
      })
    }
  })
}
/**
 * Detects if an element is on the screen and throws an event if it is
 */
function handleElementEvents(customEvents: CustomTrackEvent[]): void {
  customEvents.forEach((e) => {
    if (!e.selector)
      return

    const el = document.querySelector(e.selector)

    if (el && !el.getAttribute('da-event')) {
      el.setAttribute('da-event', '1')
      trackCustomEvent(e)
    }
  })
}
/**
 * Detect if location path matches the goal/event path
 * Fuzzy match the search query params
 */
function urlSearchMatch(search: string): boolean {
  const locationParams = new URLSearchParams(window.location.search)
  const matchParams = new URLSearchParams(search)
  let matched = true
  matchParams.forEach((v, key) => {
    if (locationParams.get(key) !== v)
      matched = false
  })

  return matched
}
function handleUrlEvents(customEvents: CustomTrackEvent[]): void {
  customEvents.forEach((e) => {
    if (!e.path)
      return

    const paths = e.path.split(',')

    const locationParams = new URLSearchParams(window.location.search)

    // If the url has a value parameter
    const urlValue = +(locationParams.get('value') || '')

    const value = !Number.isNaN(urlValue) && urlValue ? urlValue : undefined

    if (value)
      e.value = value

    paths.forEach((p) => {
      const lp = window.location.pathname

      const matchPath = p === '/' ? '/' : p.trim().replace(/\/$/, '')

      const current = lp === '/' ? '/' : lp.replace(/\/$/, '')

      const queryOnly = !!matchPath.startsWith('?')
      const triggerPath = new URL(matchPath, location.href)

      // If search query only, then match params or fail
      if (queryOnly) {
        if (urlSearchMatch(triggerPath.search))
          trackCustomEvent(e)
      }
      else if (wildcardToRegExp(triggerPath.pathname).test(current)) {
        if (triggerPath.search && urlSearchMatch(triggerPath.search))
          trackCustomEvent(e)
        else
          trackCustomEvent(e)
      }
    })
  })
}
/**
 * Initialize custom event tracking
 */
export function initializeCustomEvents(): void {
  const eligibleEvents = getCustomEvents().filter((ev) => {
    return !ev.rules || passesTargetingRules(ev.rules)
  })

  const customEvents = groupBy<Record<TriggerType, CustomTrackEvent[]>>(
    eligibleEvents,
    'eventTrigger',
  )

  setInterval(() => {
    if (customEvents.url)
      handleUrlEvents(customEvents.url)
    if (customEvents.element)
      handleElementEvents(customEvents.element)
    if (customEvents.click)
      handleClickEvents(customEvents.click)
    if (customEvents.metric)
      handleMetricEvents(customEvents.metric)
  }, 2000)
}
