import { record } from 'rrweb'
import type { listenerHandler, recordOptions } from 'rrweb/typings/types'
import type { KaptionEvent, ReplayEvent, StoredReplay } from '@kaption/engine'
import { WriteBuffer } from '@factor/api/buffer'
import {
  compiledActiveDuration,
  emitEvent,
  getLocal,
  getRecordingOptions,
  getRecordingTriggerEvents,
  onActiveDuration,
  onEvent,
  onServerNotify,
  removeLocal,
  setLocal,
} from '@kaption/browser-utils'
import { logger } from '@factor/api/logger'
import { triggerOnDuration } from '../../../@core/client-tag/utils'
import { getActiveConfig } from '../../../@core/client-tag/.ref/config'
import { sendRecordingDelta } from '../../../@core/client-tag/transmit'
import { client } from '../../../@core/client-tag/.ref/client'

type BypassRRwebOptions = Omit<recordOptions<unknown>, 'emit'>

let __keyNumber = 1
const SHOULD_SEND_RECORDING_KEY = 'daRpSend'
const IN_SESSION_KEY = 'daRpId'
const PREVENT_RECORDING_KEY = 'daRpStop'
let __stopRecord: listenerHandler | undefined

function recordingStoreKey(key: number): string {
  return `drRecord-${key}`
}

function continueRecording(): string | undefined {
  return getLocal<string>({ key: IN_SESSION_KEY, raw: true })
}

function setReplayId(sessionId: string): void {
  setLocal({
    key: IN_SESSION_KEY,
    value: sessionId,
    raw: true,
    type: 'session',
    scope: 'session',
  })
}

function preventRecording(): void {
  setLocal({
    key: PREVENT_RECORDING_KEY,
    value: 1,
    type: 'session',
    scope: 'session',
  })
}
function canRecord(): boolean {
  return !getLocal<string>({ key: PREVENT_RECORDING_KEY })
}
/**
 * Is the flag for saving recordings flipped?
 */
function savingRecording(): 'readyToSave' | 'waitForSnapshot' | undefined {
  return getLocal({ key: SHOULD_SEND_RECORDING_KEY, raw: true })
}

function setSavingFlag(mode: 'readyToSave' | 'waitForSnapshot'): void {
  // Save full details of what triggered the saving for debugging purposes
  setLocal({
    key: SHOULD_SEND_RECORDING_KEY,
    value: mode,
    scope: 'session',
    type: 'session',
    raw: true,
  })
}
/**
 * Necessary to buffer up events in browser memory to prevent performance issues
 * e.g. storing large stuff into storage
 */
let __buff: WriteBuffer<ReplayEvent>
function eventBuffer(): WriteBuffer<ReplayEvent> {
  if (!__buff) {
    __buff = new WriteBuffer<ReplayEvent>({
      limitType: 'time',
      maxSeconds: 1,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      flush: (events): void => storeOrSendEvents(events),
    })
  }

  return __buff
}

/**
 * Gets the locally stored recording
 */
function getStoredReplay({
  full = true,
}: { full?: boolean } = {}): StoredReplay {
  let existing: StoredReplay = { events: [] }
  if (full) {
    for (let i = 1; i <= 4; i++) {
      const r = getLocal<StoredReplay>({ key: recordingStoreKey(i) })

      if (r)
        existing = { events: [...existing.events, ...r.events] }
      else
        i = 5
    }
  }
  else {
    const r = getLocal<StoredReplay>({ key: recordingStoreKey(__keyNumber) })
    if (r)
      existing = r
  }

  return existing
}

export function flushReplayBuffer(): void {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  eventBuffer().flushBuffer()
}
/**
 * Stop sending the recording of the session
 */
function clearLocalRecording(): void {
  logger.log({
    level: 'info',
    context: 'clearLocalRecording',
    description: 'clearing local recording',
  })
  eventBuffer().clearBuffer()
  if (__stopRecord) {
    __stopRecord()
    __stopRecord = undefined
  }

  removeLocal({ key: SHOULD_SEND_RECORDING_KEY })

  for (let i = 1; i <= 4; i++)
    removeLocal({ key: recordingStoreKey(i) })

  __keyNumber = 1
}
/**
 * Clear local and restart
 */
let __restarts = 0
export function restartRecording(reason: string): void {
  clearLocalRecording()
  const limit = 15
  if (__restarts < limit) {
    logger.log({
      level: 'info',
      context: 'restartRecording',
      description: `restarting recording: ${reason}`,
    })

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    startReplayRecorder({ context: 'begin' })
    record.takeFullSnapshot()

    __restarts++
  }
  else {
    emitEvent('debugTracker', `restarted over ${limit} times`, { reason })
  }
}
/**
 * Sets the locally stored recording
 */
function setStoredRecording(recording: StoredReplay): void {
  // const value = JSON.stringify(recording)
  // logger.log({level: "info", "local recording saved", { totalSize: value.length ?? 0 })
  try {
    setLocal<StoredReplay>({
      key: recordingStoreKey(__keyNumber),
      value: recording,
      type: 'session',
      scope: 'session',
    })
  }
  catch {
    if (__keyNumber <= 4) {
      __keyNumber++
      setStoredRecording(recording)
    }
    else {
      // emitEvent("debugTracker", `replay storage error`, error)
      restartRecording('session storage full')
    }
  }
}
/**
 * Store events locally until a recording save is triggered by settings
 * Recordings should start with a 4 event to ensure we have the page saved
 */
function storeOrSendEvents(events: ReplayEvent[]): void {
  if (events.length === 0) {

  }
  // if qualified to save
  else if (savingRecording() === 'readyToSave') {
    sendRecordingDelta({ events })
  }
  // waiting for snapshot to save
  else if (
    savingRecording() === 'waitForSnapshot'
    && events.some(_ => _.type === 4)
  ) {
    setSavingFlag('readyToSave')
    sendRecordingDelta({ events })
  }
  // not flagged as saving yet
  else {
    const stored = getStoredReplay()

    if (
      __keyNumber === 1
      && stored.events.length === 0
      && !events.some(_ => _.type === 4)
    ) {
      const msg = 'no snapshot'
      logger.log({ level: 'error', description: msg, data: { stored, events } })

      record.takeFullSnapshot()

      return
    }
    setStoredRecording({
      events: [...stored.events, ...events],
    })
  }
}

/**
 * Start the rrweb recorder and return function to restart/stop
 */
export function startReplayRecorder({ context }: { context: string }): void {
  logger.log({
    level: 'info',
    context: 'startReplayRecorder',
    description: context,
  })

  const recordOptions = getRecordingOptions<BypassRRwebOptions>()

  if (__stopRecord) {
    __stopRecord()
    __stopRecord = undefined
  }

  if (!canRecord()) {
    logger.log({
      level: 'info',
      context: 'startReplayRecorder',
      description: `recording prevented`,
    })
    return
  }

  __stopRecord = record({
    slimDOMOptions: true,
    maskInputOptions: { text: true, email: true },
    blockClass: 'kaption-block',
    ignoreClass: 'kaption-ignore',
    emit: (event) => {
      eventBuffer().add(event)
    },
    ...recordOptions,
  })
}

/**
 * IF this function is triggered, than from this point on we should
 * send and record the session
 */
function startSavingReplay(args: {
  reason: string
  triggerEvents: string[]
  data: KaptionEvent
}): void {
  const { reason, triggerEvents, data } = args
  // if already saving, don't start again
  if (savingRecording())
    return

  const { replayEligible } = getActiveConfig()

  const durationSeconds = 5

  if (!replayEligible) {
    logger.log({
      level: 'error',
      description: `replay not-eligible for ${data.event ?? '(?)'}`,
      data: getActiveConfig(),
    })
    return
  }

  const timeActive = compiledActiveDuration()
  if (timeActive < durationSeconds) {
    logger.log({
      level: 'info',
      description: `${reason}: active ${timeActive}s waiting for ${durationSeconds}s`,
    })
  }

  onActiveDuration({
    durationSeconds,
    cb: (timeActive) => {
      // if not recording, don't do anything
      if (!__stopRecord)
        return

      record.addCustomEvent('saveReplay', {
        eventName: 'saveReplay',
        timeActive,
        label: reason,
        triggerEvents,
      })
      logger.log({
        level: 'info',
        description: `sending (${reason}:${timeActive})`,
        data: { timeActive, data },
      })

      const records = getStoredReplay({ full: true })
      const recordEvents = records?.events || []
      const flag
        = recordEvents.length > 0 && recordEvents[0].type === 4
          ? 'readyToSave'
          : 'waitForSnapshot'
      setSavingFlag(flag)
      sendRecordingDelta(records)
    },
  })
}
/**
 * This is triggered whenever and event that is interesting to recordings is emitted
 */
export function trackReplayEvent(data: KaptionEvent): void {
  const { event, properties = {} } = data

  const { eventType } = properties
  // Only handle events if recording is active
  if (__stopRecord) {
    if (event)
      record.addCustomEvent(event, data)

    const triggerEvents = getRecordingTriggerEvents()

    let reason = ''

    if (event && triggerEvents.includes(event))
      reason = event
    else if (eventType && triggerEvents.includes(eventType))
      reason = eventType
    else if (triggerOnDuration())
      reason = 'duration'

    if (reason)
      startSavingReplay({ reason, triggerEvents, data })
  }
}

/**
 * Record user behavior events
 * On idle, restart the recording
 */
export function initializeRecording(): void {
  onEvent('activity:idle', () => clearLocalRecording())

  client().on('event', (data: KaptionEvent) => {
    if (data.event === 'stat')
      return

    trackReplayEvent(data)
  })

  onEvent('sendBeacon', () => {
    flushReplayBuffer()
  })

  if (continueRecording())
    startReplayRecorder({ context: 'continue' })

  onServerNotify('beginConnection', ({ data }): void => {
    if (!data)
      return

    const { replayEligible, details } = data

    if (replayEligible && !continueRecording()) {
      clearLocalRecording()

      setReplayId(Date.now().toString())
      startReplayRecorder({ context: 'begin' })
    }

    if (!replayEligible) {
      clearLocalRecording()
      logger.log({
        level: 'info',
        context: 'beginConnection',
        description: `not eligible`,
        data: { details },
      })
    }
  })

  onServerNotify('expireSession', (): void => {
    // wait for exit events or otherwise to trigger before closing
    setTimeout(() => {
      clearLocalRecording()
      removeLocal({ key: IN_SESSION_KEY })
    }, 200)
  })
  onServerNotify('restartRecording', (): void => {
    restartRecording('server restart')
  })

  onServerNotify('stopRecording', (): void => {
    clearLocalRecording()
    preventRecording()
    removeLocal({ key: IN_SESSION_KEY })
  })

  logger.log({ level: 'info', description: `listening to recording events` })
}
