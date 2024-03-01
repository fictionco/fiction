import type { EndpointMeta, EndpointResponse } from '@factor/api'
import type { Knex } from 'knex'
import type { AggregationRow, QueryParams } from '../plugin-dashboards'
import type { EventParams } from '../plugin-beacon'
import { KaptionQuery } from '../utils'
import { refineParams } from '../utils/params'

export class QueryGetClientSessions extends KaptionQuery {
  async run(
    params: {
      anonymousId: string
      projectId: string
      limit?: number
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<EventParams[]>> {
    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('kaptionClickHouse missing')

    const { anonymousId, projectId, limit = 10 } = params

    const query = ch
      .clickhouseBaseQuerySession({ projectId })
      .where({
        anonymousId,
      })
      .limit(limit)

    const { data } = await ch.clickHouseSelect<EventParams[]>(query)

    return { status: 'success', data }
  }
}

export class QueryGetTotalSessions extends KaptionQuery {
  async run(
    params: {
      anonymousId: string
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<number>> {
    const { anonymousId, projectId } = params
    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('kaptionClickHouse missing')

    const query = ch
      .clickhouseBaseQuery({ projectId })
      .select(ch.client().raw('count(sessionId) as total'))
      .where({ anonymousId })
      .groupBy('anonymousId')

    const { data } = await ch.clickHouseSelect<{ total: number }[]>(query)

    const total = data[0]?.total || 0

    return { status: 'success', data: total }
  }
}

export class QueryGetDimensionList extends KaptionQuery {
  async run(params: QueryParams): Promise<EndpointResponse<AggregationRow[]>> {
    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('kaptionClickHouse missing')
    const client = ch.client()
    const refined = refineParams(params)
    const { limit = 20, dimension, search } = refined

    if (!dimension)
      throw this.stop({ message: 'no dimension field provided' })
    const base: Knex.QueryBuilder = ch.clickhouseDateQuery({ params: refined })

    const select = [
      client.raw(`uniq(*) as count`),
      client.raw(`?? as name`, [dimension as string]),
    ]

    const dbQuery = base
      .select(select)
      .groupBy(dimension)
      .orderBy('count', 'desc')
      .whereNot({ [dimension]: '' })
      .limit(limit)

    if (search) {
      void dbQuery.whereRaw(
        client.raw(`?? like '%?%'`, [dimension as string, search]),
      )
    }

    const { data: r } = await ch.clickHouseSelect<AggregationRow[]>(dbQuery)

    return { status: 'success', data: r }
  }
}
