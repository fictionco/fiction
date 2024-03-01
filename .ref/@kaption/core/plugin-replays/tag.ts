import type {
  EndpointResponse,
} from '@factor/api'
import {
  ClientSocket,
  FactorIndexedDb,
  WriteBuffer,
  onEvent,
  vue,
} from '@factor/api'
import type { KaptionEvent } from '@kaption/client'
import { record } from 'rrweb'
import type { listenerHandler } from 'rrweb/typings/types'
import { ClientTag, KaptionPageStats } from '../tag-utils'
import type { TagEntryPoint, TagSettings } from '../plugin-tag/types'
import type { ProjectWithAnalytics } from '../plugin-analytics/types'
import type {
  ReplayDataObject,
  ReplayEvent,
  ReplayEventMap,
  SaveStatus,
  WelcomeResponse,
} from './types'

type ReplayTagSettings = {
  replaySocketUrl?: string
  bufferIntervalMs?: number
} & TagSettings &
Partial<ProjectWithAnalytics>

export class ReplayTag extends ClientTag<ReplayTagSettings> {
  clientSocket?: ClientSocket<ReplayEventMap>
  socketUrl = this.settings.replaySocketUrl || 'https://stream.kaption.co'
  localDb?: FactorIndexedDb
  objectStoreKey = 'KReplayData'
  replayDataKey = 'primary'
  recordingIsActive?: listenerHandler
  bufferIntervalMs = this.settings.bufferIntervalMs || 1000
  recordingTriggerEvents = this.settings.recordingTriggers ?? [
    'error',
    'rageClick',
  ]

  sessionId = this.localRef<string>('KSessionId', '')
  status = this.localRef<SaveStatus>('KReplayStatus', 'waiting')
  seenEvents = this.localRef<Record<string, string>>('KSeenEvents', {})

  kaptionPageStats = new KaptionPageStats({ key: 'replay' })
  constructor(tagSettings: ReplayTagSettings) {
    super({ gen: 'core', ...tagSettings })

    onEvent('kaptionEvent', (data: KaptionEvent) =>
      this.watchKaptionEvents(data))

    window.addEventListener('unload', () => {
      this.buffer.flushBuffer({ reason: 'unload' })
    })
  }

  async init(): Promise<void> {
    this.clientSocket = new ClientSocket<ReplayEventMap>({
      host: this.socketUrl,
      search: { anonymousId: this.anonymousId, projectId: this.projectId },
    })

    this.clientSocket.on('welcome', async (message) => {
      await this.handleWelcome(message)
    })

    // initialize
    this.clientSocket.getSocket().catch(console.error)

    if (sessionStorage.getItem('KReplayStatus'))
      this.status.value = sessionStorage.getItem('KReplayStatus') as SaveStatus
  }

  buffer: WriteBuffer<ReplayEvent> = new WriteBuffer<ReplayEvent>({
    limitType: 'time',
    flushIntervalMs: this.bufferIntervalMs,
    flush: async (events): Promise<void> => this.storeOrSendEvents(events),
  })

  seenTriggerEvents(): string[] {
    return this.recordingTriggerEvents.filter(e => this.seenEvents.value[e])
  }

  meetsSaveRequirements(): EndpointResponse<{
    minDuration: number
    activeDuration: number
    triggerEvents: string[]
    seenEvents: string[]
  }> {
    const activeDuration
      = this.kaptionPageStats.map.duration.totalSecondsActive.value
    const data = {
      minDuration: this.settings.recordingMinimumDuration ?? 20,
      activeDuration,
      triggerEvents: this.recordingTriggerEvents,
      seenEvents: Object.keys(this.seenEvents.value),
    }
    let status: 'success' | 'fail'
    if (
      data.activeDuration > data.minDuration
      && this.seenTriggerEvents().length > 0
    )
      status = 'success'
    else
      status = 'fail'

    return { status, data }
  }

  getDataObject(args: { replayData: ReplayEvent[] }): ReplayDataObject {
    const { replayData } = args
    return {
      sessionId: this.sessionId.value,
      projectId: this.projectId,
      anonymousId: this.anonymousId,
      replayData,
      status: this.status.value,
    }
  }

  async transmitReplayData(replayDataObject: ReplayDataObject): Promise<void> {
    this.log.info('transmit', { data: replayDataObject })
    await this.clientSocket?.sendMessage('replayDataObject', replayDataObject)
  }

  async storeOrSendEvents(replayData: ReplayEvent[]): Promise<void> {
    await this.localData({ _action: 'insert', replayData })

    const shouldSave = this.meetsSaveRequirements()

    // this.log.info("store replayData", { data: { shouldSave } })

    if (shouldSave.status === 'success') {
      let replayDataObject: ReplayDataObject | undefined
      if (this.status.value === 'saving') {
        // just save the delta
        replayDataObject = this.getDataObject({ replayData })
      }
      else {
        this.status.value = 'saving'

        // save entire local recording
        replayDataObject = await this.localData({ _action: 'getAll' })
        // track reasons we started saving recording
        if (replayDataObject) {
          replayDataObject.reason = this.seenTriggerEvents().join(', ')
          replayDataObject.meta = shouldSave.data || {}
        }
      }

      if (replayDataObject)
        await this.transmitReplayData(replayDataObject)
    }
  }

  localRef<A>(key: string, def: A) {
    const rawLocalValue = sessionStorage.getItem(key)

    const localValue
      = typeof def === 'string'
        ? (rawLocalValue as typeof def)
        : (JSON.parse(rawLocalValue || '{}') as A)

    const init = localValue || def

    const refItem = vue.ref<A>(init)

    vue.watch(
      () => refItem.value,
      (v) => {
        if (v) {
          const val = typeof v === 'string' ? v : JSON.stringify(v)
          sessionStorage.setItem(key, val)
        }
        else {
          sessionStorage.removeItem(key)
        }
      },
      { immediate: true },
    )

    return refItem
  }

  async handleWelcome(welcome: WelcomeResponse) {
    await this.initialized

    this.kaptionPageStats.start()

    const { data, status } = welcome

    if (data?.sessionId) {
      if (this.sessionId.value !== data.sessionId) {
        await this.localData({ _action: 'clear' })
        this.seenEvents.value = {}
        this.status.value = 'local'
      }
      this.sessionId.value = data.sessionId

      if (status === 'success')
        this.startRecorder()
    }
  }

  startRecorder(): void {
    this.log.info(`starting recorder`)

    const recordOptions = this.getUserOptions()

    if (this.recordingIsActive) {
      this.recordingIsActive()
      this.recordingIsActive = undefined
    }

    if (!this.canRecord()) {
      this.log.info(`recording prevented`)
      return
    }

    this.recordingIsActive = record({
      slimDOMOptions: true,
      maskInputOptions: { text: true, email: true },
      blockClass: 'kaption-block',
      ignoreClass: 'kaption-ignore',
      emit: (event) => {
        this.buffer.add(event)
      },
      ...recordOptions,
    })
  }

  async restartRecording(reason: string): Promise<void> {
    await this.localData({ _action: 'clear' })

    this.log.info(`restarting recording: ${reason}`)

    this.startRecorder()
    record.takeFullSnapshot()
  }

  watchKaptionEvents(kaptionEvent: KaptionEvent) {
    const { event } = kaptionEvent

    if (event === 'stat')
      return

    const seenEvents = this.seenEvents.value
    if (!seenEvents[event])
      this.seenEvents.value = { ...seenEvents, [event]: event }

    // Only handle events if recording is active
    if (
      this.recordingIsActive // add to rrweb events log
        && event
    )
      record.addCustomEvent(event, kaptionEvent)
  }

  getUserOptions() {
    return {}
  }

  canRecord(): boolean {
    return true
  }

  async initLocalDb() {
    if (!this.localDb) {
      this.localDb = new FactorIndexedDb({
        dbName: this.objectStoreKey,
        tableName: 'replayData',
        indexes: [{ name: 'sessionId' }],
      })
    }

    await this.localDb.initialized

    return this.localDb
  }

  async localData(
    args:
      | {
        _action: 'insert'
        replayData: ReplayEvent[]
      }
      | { _action: 'getAll' }
      | { _action: 'clear' },
  ): Promise<ReplayDataObject | undefined> {
    const localDb = await this.initLocalDb()

    const { _action } = args

    if (!localDb)
      throw new Error('no localDb')

    if (_action === 'getAll') {
      if (!this.sessionId.value)
        throw new Error('no sessionId')
      const r = await localDb.retrieveByKey<ReplayDataObject>({
        key: 'sessionId',
        value: this.sessionId.value,
      })
      const replayData = r?.map(r => r.replayData)?.flat(1) || []
      return this.getDataObject({ ...args, replayData })
    }
    else if (_action === 'insert') {
      if (!this.sessionId.value)
        throw new Error('no sessionId')
      const dataObject = this.getDataObject(args)
      await localDb.insert<ReplayDataObject>(dataObject)
    }
    else if (_action === 'clear') {
      await localDb.clearAll()
    }
  }
}

export const setup: TagEntryPoint<ReplayTagSettings> = async (tagSettings) => {
  return new ReplayTag(tagSettings)
}
