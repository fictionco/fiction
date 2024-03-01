import './register'
import type {
  EndpointServer,
  FactorAws,
  FactorPluginSettings,
  NodeSocketServer,
  vue,
} from '@factor/api'
import {
  FactorPlugin,
  createSocketServer,
} from '@factor/api'
import type { PutObjectCommandOutput } from '@aws-sdk/client-s3'
import type { KaptionBeacon, SessionEvent } from '../plugin-beacon'

import type { KaptionCache } from '../plugin-cache'
import type { KaptionTag } from '../plugin-tag'
import type { KaptionEventOps } from '../plugin-beacon/ops'
import type {
  ReplayDataObject,
  ReplayEvent,
  ReplayEventMap,
  WelcomeResponse,
} from './types'
import { replayFilePath } from './utils'

type KaptionReplayServerSettings = {
  replayPort: number
  sessionBucket: string
  kaptionTag?: KaptionTag
  kaptionBeacon: KaptionBeacon
  kaptionEventOps: KaptionEventOps
  kaptionCache: KaptionCache
  factorAws: FactorAws
  socketLiveUrl?: string
  isLive?: vue.Ref<boolean>
  dailyLimit?: number
  throttleMinutes?: number
} & FactorPluginSettings

type ReplaySession = SessionEvent & ReplayDataObject

export class KaptionReplayServer extends FactorPlugin<KaptionReplayServerSettings> {
  kaptionTag = this.settings.kaptionTag
  kaptionBeacon = this.settings.kaptionBeacon
  kaptionEventOps = this.settings.kaptionEventOps
  sessionManager = this.kaptionBeacon.sessionManager
  kaptionCache = this.settings.kaptionCache
  factorAws = this.settings.factorAws
  replayPort = this.settings.replayPort
  socket?: NodeSocketServer<ReplayEventMap>
  endpointServer?: EndpointServer
  sessionBucket = this.settings.sessionBucket
  socketLiveUrl = this.settings.socketLiveUrl
  socketLocalUrl = `http://localhost:${this.replayPort}`
  socketUrl = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value || false
    return isLive && this.socketLiveUrl
      ? this.socketLiveUrl
      : this.socketLocalUrl
  })

  dailyLimit = this.settings.dailyLimit ?? 36
  throttleMinutes = this.settings.throttleMinutes ?? 15
  lastRecordingStarted?: { sessionId: string, startedAt: number }
  constructor(settings: KaptionReplayServerSettings) {
    super('replayServer', settings)
    this.replayPort = settings.replayPort

    if (this.kaptionTag)
      this.kaptionTag.addTagSetting('replaySocketUrl', this.socketUrl.value)
  }

  setup() {}

  async recordingStatus(args: {
    _action: 'get' | 'startNew'
    data: { sessionId: string, projectId: string } & {
      [key: string]: unknown
    }
  }): Promise<WelcomeResponse> {
    const { _action, data } = args

    const cache = this.kaptionCache.getCache()

    if (!cache)
      throw new Error('cache not found')

    const statusKey = this.kaptionCache.redisKey(
      'project',
      data.projectId,
      'replayStatus',
    )

    const replayKey = this.kaptionCache.redisKey('replay', data.sessionId)

    const projectReplayStatus = JSON.parse(
      (await cache.get(statusKey)) || '{}',
    ) as { lastRecordingStarted?: string }

    if (_action === 'get') {
      const replayExists = await cache.exists(replayKey)

      if (replayExists) {
        return {
          status: 'success',
          message: 'continue',
          data,
        }
      }
      else {
        const disableReasons = []
        // throttle
        const last = projectReplayStatus?.lastRecordingStarted
        const diff = this.utils.dayjs().diff(last ?? 0, 'minute')
        const throttled = last && diff < this.throttleMinutes

        if (throttled)
          disableReasons.push(`throttled - its been ${diff} minutes`)

        const usageContext = await this.kaptionEventOps.getUsageContext(
          data.projectId,
        )
        const used = usageContext.usage.day?.replay ?? 0

        if (used >= this.dailyLimit) {
          disableReasons.push(
            `daily limit reached ${used} / ${this.dailyLimit}`,
          )
        }

        if (disableReasons.length === 0) {
          return {
            status: 'success',
            message: 'ready',
            data,
          }
        }
        else {
          return {
            status: 'error',
            message: disableReasons.join(', '),
            data,
          }
        }
      }
    }
    else if (_action === 'startNew') {
      await cache.set(
        statusKey,
        JSON.stringify({
          lastRecordingStarted: this.utils.dayjs().toISOString(),
        }),
      )
      return { status: 'success' }
    }
    else {
      return { status: 'success' }
    }
  }

  async createServer(): Promise<void> {
    await this.kaptionCache.subscribe(
      'expireSession',
      async (message): Promise<void> => {
        const session = message.data as SessionEvent

        await this.saveSessionReplay(session)
      },
    )

    const s = await createSocketServer<ReplayEventMap>({
      serverName: 'replayServer',
      port: this.replayPort,
      welcomeObject: async (obj, request): Promise<WelcomeResponse> => {
        const search = request.url?.split('?').pop() ?? ''
        const urlParams = new URLSearchParams(search)

        const anonymousId = urlParams.get('anonymousId')
        if (!anonymousId)
          return { status: 'error', message: 'anonymousId missing' }

        const projectId = urlParams.get('projectId')
        if (!projectId)
          return { status: 'error', message: 'projectId missing' }

        if (!this.sessionManager)
          return { status: 'error', message: 'internal err (session mgr)' }

        const { sessionId, isOpened }
          = await this.sessionManager.getOrStartSession(anonymousId)

        const recordingStatus = await this.recordingStatus({
          _action: 'get',
          data: { ...obj, sessionId, projectId, isOpened, anonymousId },
        })

        return recordingStatus
      },
    })

    this.socket = s.socketServer
    this.endpointServer = s.endpointServer

    this.socket?.on('replayDataObject', async (params) => {
      const { sessionId, projectId } = params
      if (!sessionId || !projectId)
        return

      const key = this.kaptionCache.redisKey('replay', sessionId)

      const cache = this.kaptionCache.getCache()

      const data = await cache?.get(key)

      let dataObject: ReplayDataObject
      if (data) {
        dataObject = JSON.parse(data) as ReplayDataObject
        dataObject.replayData.push(...params.replayData)
      }
      else {
        await this.recordingStatus({
          _action: 'startNew',
          data: { sessionId, projectId },
        })
        dataObject = params
      }

      this.log.info('cached replay data', {
        data: {
          sessionId: params.sessionId,
          replayDataEvents: params.replayData.length,
        },
      })

      await cache?.set(key, JSON.stringify(dataObject), 'EX', 60 * 60 * 4)
    })
  }

  replayId(args: { timestamp: number, sessionId: string }): string {
    const { timestamp, sessionId } = args
    return `${this.utils.dayjs(timestamp).format('YYYY-MM')}.${sessionId}`
  }

  async saveToS3(args: {
    filePath: string
    data: string
  }): Promise<{ url: string, result: PutObjectCommandOutput } | void> {
    const { filePath, data } = args
    const bucket = this.sessionBucket
    if (!bucket)
      throw new Error('sessionBucket missing')

    const exists = await this.factorAws.fileExistsS3({ name: filePath, bucket })

    if (exists)
      return

    const extension = filePath.split('.').pop() ?? 'json'

    const mime = extension === 'css' ? 'text/css' : 'application/json'

    this.log.info(`uploading file to s3: ${bucket}:${filePath}`)

    const r = await this.factorAws.uploadS3({
      filePath,
      data: Buffer.from(data, 'utf8'),
      bucket,
      mime,
      accessControl: 'private',
    })

    return r
  }

  getReplayMetaData(replay: ReplayEvent[]): {
    startTime: number
    endTime: number
    totalTime: number
  } {
    const firstEvent = replay[0]
    const lastEvent = replay[replay.length - 1]
    return {
      startTime: firstEvent.timestamp,
      endTime: lastEvent.timestamp,
      totalTime: lastEvent.timestamp - firstEvent.timestamp,
    }
  }

  getReplayDuration(replayData: ReplayEvent[]): number {
    const { totalTime } = this.getReplayMetaData(replayData)

    const duration = Math.round(totalTime / 1000)

    return duration > 0 ? duration : 0
  }

  async saveReplayEvent(
    session: SessionEvent,
    replayDataObject: ReplayDataObject,
  ) {
    const replayDuration = this.getReplayDuration(replayDataObject.replayData)

    const saveEvents = await this.sessionManager?.getSaveEvents({
      session,
      events: [
        {
          event: 'replay',
          gen: 'core',
          type: 'internal',
          properties: { replayDuration, reason: replayDataObject.reason },
          projectId: session.projectId,
          anonymousId: session.anonymousId,
          meta: replayDataObject.meta,
        },
      ],
    })

    this.log.warn('saveReplayEvent', { data: saveEvents })

    this.sessionManager?.saveBuffer.batch(saveEvents ?? [])
  }

  async saveSessionReplay(session: SessionEvent): Promise<void> {
    const cache = this.kaptionCache.getCache()
    const key = this.kaptionCache.redisKey('replay', session.sessionId)
    const memoryData = await cache?.get(key)

    this.log.warn('expire session in replay', {
      data: { sessionId: session.sessionId, mem: memoryData?.length },
    })

    if (!memoryData)
      return

    this.log.info('exp replay', {
      data: { sessionId: session.sessionId, mem: memoryData.length },
    })

    const replayDataObject = JSON.parse(memoryData) as ReplayDataObject

    await this.saveReplayEvent(session, replayDataObject)

    const s3Data = { ...session, ...replayDataObject } as ReplaySession

    const filePath = replayFilePath({ session })

    const data = JSON.stringify(s3Data)

    await this.saveToS3({ filePath, data })

    await cache?.del(key)

    this.log.info('saved replay to s3', {
      data: {
        sessionId: session.sessionId,
        size: data.length,
      },
    })
  }
}
