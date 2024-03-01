import { emitEvent } from '@kaption/utils/event'
import { activityTrigger } from '@kaption/browser-utils/behavior'
import type { BrowserEvent } from '@kaption/browser-utils/utils'
import { getLocal, removeLocal, setLocal } from '@kaption/browser-utils/local'

let __durationStartTime: number | false = false
let __lastInteraction: number = +Date.now()
let __lastInteractionEvent: BrowserEvent | undefined
let __compiledDuration = 0
let __clearActivityTimer: (() => void) | undefined
let __activeDurationInterval: NodeJS.Timeout | undefined
const __compiledTimesDebug: {
  now: number
  start: number | boolean
  timeActive: number
}[] = []
const COMPILED_KEY = '__kActiveDuration'

function getCompiled(): number {
  const existing = getLocal<string>({ key: COMPILED_KEY, raw: true }) ?? '0'
  return Number.parseInt(existing)
}

export function addStored(duration: number): void {
  const compiled = duration + getCompiled()

  setLocal<string>({
    key: COMPILED_KEY,
    value: compiled.toString(),
    raw: true,
    scope: 'session',
    type: 'session',
  })
}

/**
 * Trigger replay recordings if a trigger time duration is hit
 */
export function triggerOnDuration(): boolean {
  const activeTime = compiledActiveDuration() || 0
  const triggerTime
    = getScriptSetting<string>('trackingSettings.recordTriggerTime') || 60
  const standard = standardTriggers()

  if (standard.includes('duration') && activeTime > +triggerTime)
    return true
  else
    return false
}
export function currentPageDuration(action?: 'start' | 'exit' | 'reset' | 'stat'): number {
  if (action === 'start' || action === 'reset') {
    __durationStartTime = +Date.now()

    __lastInteraction = +Date.now()
    __compiledDuration = 0

    if (__clearActivityTimer)
      __clearActivityTimer()

    __clearActivityTimer = activityTrigger({
      onIdle: (timeActive) => {
        __compiledTimesDebug.push({
          start: __durationStartTime,
          now: +Date.now(),
          timeActive,
        })

        __compiledDuration += timeActive
        __durationStartTime = false
      },
      onActive: () => {
        __durationStartTime = +Date.now()
      },
      onEngage: (browserEvent: BrowserEvent) => {
        __lastInteraction = +Date.now()
        __lastInteractionEvent = browserEvent
      },
      idleSeconds: 30,
    })

    if (action === 'reset')
      removeLocal({ key: COMPILED_KEY })
  }

  let diff = 0
  if (__durationStartTime)
    diff = Math.round((__lastInteraction - __durationStartTime) / 1000)

  let total = Math.round(__compiledDuration + diff)

  if (action === 'exit') {
    addStored(total)
    __durationStartTime = false
  }

  if (total > 1500) {
    emitEvent('debugTracker', `page duration: ${total}`, {
      now: +Date.now(),
      __durationStartTime,
      __compiledDuration,
      __lastInteraction,
      __lastInteractionEvent,
      diff,
      compiled: getCompiled(),
      compiledTimes: __compiledTimesDebug,
    })
    total = 1500
  }

  return total >= 0 ? total : 0
}

export function compiledActiveDuration(): number {
  return getCompiled() + currentPageDuration()
}

export function onActiveDuration(args: {
  durationSeconds: number
  cb: (secondsActive: number) => void
}): void {
  const { durationSeconds, cb } = args
  const active = compiledActiveDuration() ?? 0
  if (active > durationSeconds) {
    cb(active)
  }
  else {
    __activeDurationInterval = setInterval(() => {
      const active = compiledActiveDuration() ?? 0

      if (active > durationSeconds) {
        if (__activeDurationInterval)
          clearTimeout(__activeDurationInterval)
        cb(active)
      }
    }, 1000)
  }
}
