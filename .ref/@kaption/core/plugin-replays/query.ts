import type { EndpointMeta, EndpointResponse } from '@factor/api'
import type { KaptionQueryOptions } from '../utils'
import { KaptionQuery } from '../utils'
import type { QueryParamsRefined } from '../plugin-dashboards'
import type { KaptionClickHouse } from '../plugin-clickhouse'
import type { ReplaySessionEvent } from './types'
import { getReplayId } from './utils'
import type { KaptionReplay } from '.'

export type ReplayQueryOptions = {
  kaptionReplay: KaptionReplay
} & KaptionQueryOptions

export async function getSessionList(args: {
  params: QueryParamsRefined
  kaptionClickHouse: KaptionClickHouse
}) {
  const { params, kaptionClickHouse } = args
  const { projectId, limit = 20, page = 1 } = params

  const ch = kaptionClickHouse
  if (!ch)
    throw new Error('kaptionClickHouse missing')
  if (!projectId)
    throw new Error('projectId required')

  const offset = (page - 1) * limit

  const query = ch
    .clickhouseBaseQuerySession({
      projectId,
      selectors: [
        'anyIf(reason, event=\'replay\') as reason',
        'groupUniqArray(20)(event) as eventList',
        'sum(scrollTotal + keypressTotal + moveTotal + touchTotal + clickTotal) as interactionTotal',
      ],
    })
    .select('*')
    .orderBy('session_timestamp', 'desc')
    .where('session_hasReplay', '=', 1)
    .where('session_replayDuration', '>', 0)
    .offset(offset)
    .limit(limit)

  const { data } = await ch.clickHouseSelect<ReplaySessionEvent[]>(query)

  return data.map((d) => {
    return { ...d, replayId: getReplayId(d) }
  })
}

abstract class ReplayQuery extends KaptionQuery<ReplayQueryOptions> {
  kaptionReplay = this.settings.kaptionReplay
  constructor(settings: ReplayQueryOptions) {
    super(settings)
  }
}

export class QueryGetSessionById extends ReplayQuery {
  async run(
    params: {
      sessionId: string
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<ReplaySessionEvent>> {
    const { sessionId, projectId } = params

    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('kaptionClickHouse missing')

    if (!projectId)
      throw this.stop('projectId required')
    if (!sessionId)
      throw this.stop('sessionId required')

    const query = ch
      .clickhouseBaseQuerySession({
        base: ch.clickhouseBaseQuery({ projectId }).where({ sessionId }),
        projectId,
        selectors: [
          'groupUniqArray(20)(event) as eventList',
          'sum(scrollTotal + keypressTotal + moveTotal + touchTotal + clickTotal) as interactionTotal',
        ],
      })
      .select('*')

    const { data } = await ch.clickHouseSelect<ReplaySessionEvent[]>(query)

    return { status: 'success', data: data[0] }
  }
}

export class QueryCompileReplay extends ReplayQuery {
  async run(
    params: {
      replayId: string
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<ReplaySessionEvent>>> {
    const { projectId, replayId } = params

    if (!projectId)
      throw this.stop('projectId required')
    if (!replayId)
      throw this.stop('replayId required')

    const session = await this.kaptionReplay.downloadReplayS3({
      projectId,
      replayId,
    })

    if (!session)
      throw this.stop(`replayId not found`)

    return { status: 'success', data: session }
  }
}

export class QueryGetReplaySessionIndex extends ReplayQuery {
  async run(
    params: QueryParamsRefined,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<ReplaySessionEvent[]>> {
    if (!this.kaptionClickHouse)
      throw new Error('kaptionClickHouse missing')
    const data = await getSessionList({
      params,
      kaptionClickHouse: this.kaptionClickHouse,
    })

    return { status: 'success', data }
  }
}
