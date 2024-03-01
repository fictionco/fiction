import { AppTable } from '@kaption/engine/typesProject'
import type { SessionFields } from '@kaption/service'
import { KaptionEndpoint } from '@kaption/engine/endpointAdmin'
import type { EndpointResponse } from '@factor/api'
import type { EndpointMeta, EndpointMethodOptions } from '@factor/engine'
import { Query } from '@factor/engine'

export type SessionsIndex = EndpointResponse<Partial<SessionFields>[]> & {
  total: number
}

class QueryCompileReplay extends Query {
  async run(
    params: {
      replayId: string
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<SessionFields>>> {
    const { downloadReplayS3 } = await import('../.ref/replayeplay')
    const { projectId, replayId } = params

    if (!projectId)
      throw this.stop('projectId required')
    if (!replayId)
      throw this.stop('replayId required')

    const { session: sessionFull } = await downloadReplayS3({
      projectId,
      replayId,
    })

    if (!sessionFull.data)
      throw this.stop(`replayId not found`)

    const data = JSON.parse(sessionFull.data) as SessionFields

    return { status: 'success', data }
  }
}

class QueryGetReplaySessionIndex extends Query {
  async run(
    params: {
      filters?: string[]
      limit?: number
      page?: number
      exclude?: Record<string, string>
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<SessionsIndex> {
    const { projectId, limit = 20, page = 1, exclude } = params

    if (!projectId)
      throw this.stop('projectId required')

    const offset = (page - 1) * limit

    const db = await this.getDb()

    const model = db
      .table(AppTable.Sessions)
      .where({ projectId, hasRecording: 1 })

    if (exclude && Object.keys(exclude).length > 0)
      void model.whereNot(exclude)

    const count = await model.clone().count()

    const total = count[0].count as number

    const data = await model
      .select<SessionFields[]>('*')
      .orderBy('timestamp', 'desc')
      .offset(offset)
      .limit(limit)

    return { status: 'success', data, total }
  }
}

export const Queries = {
  GetSingleSessionById: new QueryGetSessionById(),
  GetReplaySessionIndex: new QueryGetReplaySessionIndex(),
  CompileReplay: new QueryCompileReplay(),
}

class ReplayEndpoint<T extends Query> extends KaptionEndpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ basePath: '/replays', ...options })
  }
}

type EndpointMap = {
  [P in keyof typeof Queries]: ReplayEndpoint<typeof Queries[P]>
}

export function getEndpointsMap(): EndpointMap {
  return Object.fromEntries(
    Object.entries(Queries).map(([key, query]) => {
      return [key, new ReplayEndpoint({ key, queryHandler: query })]
    }),
  ) as EndpointMap
}

export const endpointsMap = getEndpointsMap()
