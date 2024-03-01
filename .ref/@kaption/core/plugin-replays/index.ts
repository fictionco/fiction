import type { EndpointResponse } from '@factor/api'

import type {
  KaptionEndpointMap,
  KaptionPluginSettings,
} from '../utils'
import {
  KaptionEndpoint,
  KaptionPlugin,
} from '../utils'

import { KaptionDbCol } from '../utils/db'
import { getRoutes } from './routes'
import { getDashboards } from './dashboards'
import { getWidgets } from './widgets'
import {
  QueryCompileReplay,
  QueryGetReplaySessionIndex,
  QueryGetSessionById,
} from './query'
import type { ReplaySessionEvent } from './types'
import type { KaptionReplayServer } from './replayServer'
import './register'
import { getReplayId, replayFilePath } from './utils'

type KaptionReplaySettings = {
  sessionBucket: string
  socketUrlProduction?: string
  replayPort: number
} & KaptionPluginSettings

export class KaptionReplay extends KaptionPlugin<KaptionReplaySettings> {
  factorUser = this.settings.factorUser
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorServer = this.settings.factorServer
  factorAdmin = this.settings.factorAdmin
  kaptionDashboard = this.settings.kaptionDashboard
  queries = this.createQueries()
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({ ...opts, factorAdmin: this.factorAdmin })
    },
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  replayServer?: KaptionReplayServer

  sessionBucket = this.settings.sessionBucket
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: KaptionReplaySettings) {
    super('replays', settings)

    this.factorRouter?.update(getRoutes())
    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`, `${this.root}/*.ts`])

    this.kaptionDashboard?.addDashboards(getDashboards())

    this.kaptionDashboard?.addWidgets(getWidgets(this.settings))

    // this.kaptionDashboard?.addToDashboard({
    //   layout: [{ widgetKey: "replaysOverview" }],
    //   dashboardId: "home",
    // })

    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`])

    // add analytics columns to kaption project table.
    this.factorDb.addColumns('kaption_usage', [
      new KaptionDbCol({
        key: 'replay',
        create: ({ schema, column }) => schema.integer(column.pgKey),
        default: () => 0,
      }),
    ])
  }

  setup() {}

  protected createQueries() {
    const deps = {
      ...this.settings,
      kaptionReplay: this,
    }
    return {
      GetSessionById: new QueryGetSessionById(deps),
      CompileReplay: new QueryCompileReplay(deps),
      GetReplaySessionIndex: new QueryGetReplaySessionIndex(deps),
    } as const
  }

  downloadReplayS3 = async (args: {
    projectId: string
    replayId: string
  }): Promise<ReplaySessionEvent | undefined> => {
    const bucket = this.sessionBucket

    if (!bucket)
      throw new Error('bucket missing')

    const filePath = replayFilePath(args)

    const exists = await this.factorAws.fileExistsS3({
      name: filePath,
      bucket,
    })

    if (!exists) {
      throw this.stop({
        message: `There was a problem retrieving this replay`,
        data: { filePath, bucket },
      })
    }

    const s3Result = await this.factorAws.downloadS3({
      key: filePath,
      bucket,
      returnString: true,
    })

    return s3Result.data
      ? (JSON.parse(s3Result.data) as ReplaySessionEvent)
      : undefined
  }

  async requestFullReplaySession(params: {
    replayId: string
  }): Promise<EndpointResponse<Partial<ReplaySessionEvent>>> {
    const { replayId } = params
    if (!this.factorAdmin)
      throw this.stop('factorAdmin required')
    const activeProjectId = this.factorAdmin.activeProjectId
    if (!params.replayId)
      throw this.stop('replayId required')
    if (!activeProjectId.value)
      throw this.stop('projectId required')

    const cacheKey = `replay:${replayId}`
    const cached = this.utils.stored<Partial<ReplaySessionEvent>>(cacheKey)

    if (cached) {
      return { status: 'success', data: cached }
    }
    else {
      const r = await this.requests.CompileReplay.request({
        ...params,
        projectId: activeProjectId.value,
      })

      if (r.status === 'success' && r?.data?.replayData)
        this.utils.storeItem(cacheKey, r.data)

      return r
    }
  }

  async toReplay(params: {
    session: Partial<ReplaySessionEvent> | undefined
  }): Promise<void> {
    const { session } = params
    let q = this.factorRouter?.router.currentRoute.value.query
    let replayId = ''
    if (session) {
      const sessionId = session.sessionId || ''
      const timestamp = session.timestamp || ''
      replayId = getReplayId({ sessionId, timestamp: timestamp as string })
    }

    q = { ...q, replay: replayId }

    await this.factorRouter?.goto('replay', {}, q)
  }

  playerDuration(duration: number | undefined): string {
    if (!duration)
      return '00'
    const hours = Math.floor(duration / 60 / 60)
    const minutes = Math.floor(duration / 60) % 60
    const seconds = Math.floor(duration - minutes * 60 - hours * 60 * 60)
    const out = []
    if (hours > 0) {
      const v = `${String(hours).padStart(2, '0')}:`
      out.push(v)
    }
    if (minutes >= 0) {
      const v = `${String(minutes).padStart(2, '0')}:`
      out.push(v)
    }
    if (seconds >= 0) {
      const v = `${String(seconds).padStart(2, '0')}`
      out.push(v)
    }

    return out.join('')
  }
}
